#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import json
import re

ROOT = Path(__file__).resolve().parents[1]
CORRECT_TITLE = '[테스트]연세대학교 교육대학원 졸업요건 이수현황 계산기'
LEGACY_TYPO_TITLE = '[테스트]연세대학교 교육대학원 조럽요건 이수현황 계산기'
PACK_FILES = ('data-pack.json', 'rules-pack.json', 'certificate-rules.json')
RELEASE_VERSION = '3.1.8'


def write_if_changed(path: Path, content: str) -> bool:
    old = path.read_text(encoding='utf-8') if path.exists() else ''
    if old == content:
        return False
    path.write_text(content, encoding='utf-8')
    print(f'UPDATED - {path.relative_to(ROOT)}')
    return True


def normalize_app() -> str:
    path = ROOT / 'app.js'
    text = path.read_text(encoding='utf-8')
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    text, count = re.subn(r"const APP_VERSION = '[^']+';", f"const APP_VERSION = '{RELEASE_VERSION}';", text, count=1)
    if count != 1:
        raise RuntimeError('APP_VERSION not found in app.js')

    # User-facing status vocabulary: actual/planned -> confirmed/scheduled.
    text = text.replace("function gapTermKind(term){return term===DATA.snapshot?'실제':'계획';}",
                        "function gapTermKind(term){return term===DATA.snapshot?'확정':'예정';}")
    text = text.replace("gapTermKind(t)==='실제'?'실제':'계획'", "gapTermKind(t)==='확정'?'확정':'예정'")
    text = text.replace("const note=selectedKind==='실제'", "const note=selectedKind==='확정'")
    text = text.replace("${term}은 현재 데이터팩의 <b>실제 시간표</b> 기준입니다.",
                        "${term}은 현재 데이터팩의 <b>확정 시간표</b> 기준입니다.")
    text = text.replace("${term}은 <b>5학기 개설예정표의 계획 데이터</b>입니다. 실제 개설 시 변경될 수 있습니다.",
                        "${term}은 <b>5학기 개설예정표의 예정 데이터</b>입니다. 실제 개설 시 변경될 수 있습니다.")

    state_anchor = "let gapCandidateTerm='';"
    if 'let openPlanTimetableTerms=' not in text:
        if state_anchor not in text:
            raise RuntimeError('gapCandidateTerm state anchor not found')
        text = text.replace(
            state_anchor,
            state_anchor + "\nlet openPlanTimetableTerms=new Set();\nlet planTimetableOpenInitialized=false;\nlet activePlanTimetableTerm='';",
            1,
        )

    timetable_block = r'''function planTimetableExtraHtml(unplaced,outOfRange){
  let extra='';
  if(unplaced.length)extra+=`<h4>시간 미정 과목</h4><div class="table-wrap"><table><thead><tr><th>학정번호</th><th>과목명 / 강의정보</th><th>전공/구분</th><th>종별</th><th>상태</th></tr></thead><tbody>${unplaced.map(({r,o})=>{
    const badge=(r.availability||o.availability)==='actual'?'<span class="badge actual">확정</span>':(r.availability||o.availability)==='planned'?'<span class="badge planned">예정</span>':'<span class="badge manual">시간 미정</span>';
    const si=scheduleInfoWithSettings(o||r,state.scheduleSettings||defaultState().scheduleSettings);
    const sub=[o?.professor||r.professor||'',o?.day||r.day||'',si.time!=='시간 미정'?si.time:'',o?.room||r.room||''].filter(Boolean).join(' ');
    return `<tr><td class="mono">${esc(r.courseCode||'')}</td><td><div class="course-name">${esc(r.courseName)}</div><div class="muted">${esc(sub||'요일·시간 정보 없음')}</div></td><td>${esc(courseOriginLabel(o||r))}</td><td>${esc(CATEGORY_LABELS[r.category||o.category||'unknown'])}</td><td>${badge}</td></tr>`;
  }).join('')}</tbody></table></div>`;
  if(outOfRange.length)extra+=`<div class="callout warnbox" style="margin-top:10px"><b>표시 범위 밖 과목:</b> ${outOfRange.map(x=>`${esc(x.r.courseName)} (${esc(x.si.time)})`).join(' · ')}<br>⚙ 설정에서 시간표 시작/종료 범위를 넓히면 표시됩니다.</div>`;
  return extra;
}
function renderPlanTimetable(){
  const terms=gapCandidateTerms();
  const settings=state.scheduleSettings||defaultState().scheduleSettings;
  const title=document.getElementById('planTimetableTitle');
  if(title)title.textContent='학기별 계획 시간표';
  if(!planTimetableOpenInitialized){
    openPlanTimetableTerms.add(DATA.snapshot);
    activePlanTimetableTerm=DATA.snapshot;
    planTimetableOpenInitialized=true;
  }
  if(!terms.includes(activePlanTimetableTerm))activePlanTimetableTerm=DATA.snapshot;

  const grid=document.getElementById('planTimetableGrid');
  if(!grid)return;
  grid.innerHTML=terms.map(term=>{
    const confirmed=term===DATA.snapshot;
    const records=dedupePlannedRecords(currentScenario().planned.filter(r=>r.term===term));
    const built=buildWeeklyScheduleHtml(records,settings);
    const extra=planTimetableExtraHtml(built.model.unplaced,built.model.outOfRange||[]);
    const open=openPlanTimetableTerms.has(term);
    const scheduleHtml=built.model.placed.length?`<div class="weekly-schedule">${built.html}</div>`:'';
    const empty=!records.length?`<div class="empty plan-term-empty">이 학기에 계획한 과목이 없습니다.</div>`:'';
    return `<details class="plan-term-schedule ${confirmed?'confirmed':'scheduled'}" data-plan-timetable-term="${esc(term)}" ${open?'open':''}>
      <summary>
        <span class="plan-term-schedule-title">${esc(term)}학기 시간표</span>
        <span class="plan-term-status ${confirmed?'confirmed':'scheduled'}">${confirmed?'확정':'예정'}</span>
        <span class="plan-term-course-count">${records.length}과목</span>
      </summary>
      <div class="plan-term-schedule-body">${scheduleHtml}${empty}${extra}</div>
    </details>`;
  }).join('');

  document.getElementById('planTimetableUnplaced').innerHTML='';
  grid.querySelectorAll('[data-plan-timetable-term]').forEach(detail=>{
    detail.addEventListener('toggle',()=>{
      const term=detail.dataset.planTimetableTerm;
      if(detail.open){openPlanTimetableTerms.add(term);activePlanTimetableTerm=term;}
      else openPlanTimetableTerms.delete(term);
    });
    detail.querySelector('summary')?.addEventListener('click',()=>{activePlanTimetableTerm=detail.dataset.planTimetableTerm;});
  });
}
function saveCurrentPlanTimetableSnapshot(){'''
    pattern = r"function renderPlanTimetable\(\)\{.*?\n\}\nfunction saveCurrentPlanTimetableSnapshot\(\)\{"
    text, replaced = re.subn(pattern, timetable_block, text, count=1, flags=re.S)
    if replaced != 1:
        raise RuntimeError('renderPlanTimetable block not found')

    text = text.replace(
        "function saveCurrentPlanTimetableSnapshot(){\n  const term=document.getElementById('planTerm').value;",
        "function saveCurrentPlanTimetableSnapshot(){\n  const term=activePlanTimetableTerm||DATA.snapshot;",
        1,
    )

    write_if_changed(path, text)
    return RELEASE_VERSION


def normalize_plan_ui() -> None:
    html_path = ROOT / 'index.html'
    html = html_path.read_text(encoding='utf-8')
    html = html.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    html = re.sub(r'styles\.css\?v=[0-9.]+', f'styles.css?v={RELEASE_VERSION}', html, count=1)
    html = re.sub(r'app\.js\?v=[0-9.]+', f'app.js?v={RELEASE_VERSION}', html, count=1)
    html = re.sub(r'<meta name="application-version" content="[^"]+">', f'<meta name="application-version" content="{RELEASE_VERSION}">', html, count=1)
    html = re.sub(r'<footer class="footer">\s*<b>v[0-9.]+:</b>', f'<footer class="footer">\n    <b>v{RELEASE_VERSION}:</b>', html, count=1)

    old_head = '''<details class="card section input-section step-details" id="planSection" open>
    <summary class="section-title-row"><h2 class="step-title"><span>향후 수강계획</span><span class="addon-badge">시뮬레이터</span></h2></summary>
    <div class="card sheet-card no-print">
      <label>시나리오 비교</label>
      <div class="sheet-row"><div id="scenarioTabs" class="tabs"></div><button class="btn small sheet-add" id="addScenario" type="button" title="새 시트">+</button></div>
      <div class="toolbar no-print"><button class="btn small" id="duplicateScenario">현재 시트 복제</button><button class="btn small" id="renameScenario">이름 변경</button><button class="btn small danger" id="deleteScenario">삭제</button></div>
    </div>

<div class="plan-builder">'''
    new_head = '''<details class="card section input-section step-details" id="planSection" open>
    <summary class="section-title-row plan-section-summary">
      <h2 class="step-title"><span>향후 수강계획</span><span class="addon-badge">시뮬레이터</span></h2>
      <div class="plan-scenario-inline no-print" onclick="event.stopPropagation()">
        <div id="scenarioTabs" class="tabs plan-title-tabs"></div>
        <button class="btn small plan-icon-btn" id="renameScenario" type="button" title="현재 시트 이름 수정" aria-label="현재 시트 이름 수정">✎</button>
        <button class="btn small plan-icon-btn sheet-add" id="addScenario" type="button" title="새 시트 추가" aria-label="새 시트 추가">+</button>
      </div>
    </summary>
    <div class="plan-sheet-utility no-print">
      <button class="btn small" id="duplicateScenario" type="button">현재 시트 복제</button>
      <button class="btn small danger" id="deleteScenario" type="button">현재 시트 삭제</button>
    </div>
    <div id="planGapCandidates" class="gap-candidates"></div>

<div class="plan-builder">'''
    if old_head in html:
        html = html.replace(old_head, new_head, 1)
    elif 'class="plan-scenario-inline no-print"' not in html:
        raise RuntimeError('plan scenario block not found in index.html')

    later_gap = '    <div id="planGapCandidates" class="gap-candidates"></div>\n    <div id="planWarnings"></div>'
    if later_gap in html:
        html = html.replace(later_gap, '    <div id="planWarnings"></div>', 1)

    html = html.replace('<h3 id="planTimetableTitle">학기 시간표</h3>', '<h3 id="planTimetableTitle">학기별 계획 시간표</h3>', 1)
    html = html.replace('<div id="planTimetableGrid" class="weekly-schedule"></div>', '<div id="planTimetableGrid" class="plan-term-schedules"></div>', 1)
    html = html.replace('[현재 시간표 저장]을 누르면 현재 학기 시간표가 스냅샷으로 저장됩니다.', '[선택 학기 저장]을 누르면 마지막으로 열어본 학기의 계획 시간표가 스냅샷으로 저장됩니다.', 1)
    html = html.replace('id="savePlanTimetableBtn" type="button">현재 시간표 저장</button>', 'id="savePlanTimetableBtn" type="button">선택 학기 저장</button>', 1)

    write_if_changed(html_path, html)

    css_path = ROOT / 'styles.css'
    css = css_path.read_text(encoding='utf-8')
    marker = '/* v3.1.7 compact scenario controls */'
    if marker not in css:
        css += '''\n\n/* v3.1.7 compact scenario controls */
#planSection>.plan-section-summary{display:flex;align-items:center;gap:10px;justify-content:space-between}
#planSection>.plan-section-summary .step-title{min-width:0;margin-right:auto}
.plan-scenario-inline{display:flex;align-items:center;justify-content:flex-end;gap:6px;min-width:0;max-width:58%}
.plan-title-tabs{display:flex;align-items:center;gap:5px;flex-wrap:wrap;justify-content:flex-end;min-width:0}
.plan-title-tabs .tab{padding:6px 10px;min-height:32px;font-size:12px;line-height:1;border-radius:999px}
.plan-icon-btn{width:32px;min-width:32px;height:32px;padding:0!important;display:inline-flex;align-items:center;justify-content:center;font-size:15px;line-height:1}
.plan-sheet-utility{display:flex;justify-content:flex-end;align-items:center;gap:6px;margin:7px 0 4px}
#planSection>.gap-candidates{margin:8px 0 14px}
@media(max-width:760px){
  #planSection>.plan-section-summary{align-items:flex-start;flex-wrap:wrap}
  .plan-scenario-inline{max-width:100%;width:100%;justify-content:flex-start;padding-left:24px}
  .plan-title-tabs{justify-content:flex-start;flex:1 1 auto}
  .plan-sheet-utility{justify-content:flex-start;padding-left:24px}
}
@media print{.plan-scenario-inline,.plan-sheet-utility{display:none!important}}
'''

    timetable_marker = '/* v3.1.8 five-term timetable accordions */'
    if timetable_marker not in css:
        css += '''\n\n/* v3.1.8 five-term timetable accordions */
.plan-term-schedules{display:grid;gap:10px;margin-top:8px}
.plan-term-schedule{border:1px solid var(--line);border-radius:11px;background:#fff;overflow:hidden}
.plan-term-schedule>summary{display:flex;align-items:center;gap:8px;min-height:46px;padding:10px 12px;cursor:pointer;list-style:none;font-weight:850}
.plan-term-schedule>summary::-webkit-details-marker{display:none}
.plan-term-schedule>summary::before{content:'›';font-size:20px;line-height:1;color:#667085;transform:rotate(0deg);transition:transform .15s ease}
.plan-term-schedule[open]>summary::before{transform:rotate(90deg)}
.plan-term-schedule.confirmed>summary{background:#f3f8ff}
.plan-term-schedule.scheduled>summary{background:#fafbfc}
.plan-term-schedule-title{font-size:14px;color:#1d2939}
.plan-term-status,.plan-term-course-count{display:inline-flex;align-items:center;border-radius:999px;padding:3px 7px;font-size:10px;font-weight:850}
.plan-term-status.confirmed{background:#e6f0ff;color:#0b57a4}
.plan-term-status.scheduled{background:#eef1f5;color:#667085}
.plan-term-course-count{margin-left:auto;background:#f2f4f7;color:#475467}
.plan-term-schedule-body{padding:12px;border-top:1px solid var(--line)}
.plan-term-empty{padding:16px!important;border:1px dashed #d0d9e5;border-radius:9px;background:#fafcff}
@media(max-width:620px){
  .plan-term-schedule>summary{padding:9px 10px;gap:6px}
  .plan-term-schedule-title{font-size:13px}
  .plan-term-schedule-body{padding:8px}
}
@media print{
  .plan-term-schedule{break-inside:avoid}
  .plan-term-schedule>summary::before{display:none}
  .plan-term-schedule-body{display:block!important}
}
'''
    write_if_changed(css_path, css)


def normalize_validator() -> None:
    path = ROOT / 'tests' / 'validate_packs.py'
    text = path.read_text(encoding='utf-8')
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    text = re.sub(r"'styles\.css\?v=[0-9.]+'", f"'styles.css?v={RELEASE_VERSION}'", text)
    text = re.sub(r"'app\.js\?v=[0-9.]+'", f"'app.js?v={RELEASE_VERSION}'", text)

    marker = "check('snapshot一致',len(snapshots)==1 and None not in snapshots,str(snapshots))"
    metadata_checks = """\napp_version_match=re.search(r\"const APP_VERSION = '([^']+)';\",app)\napp_version=app_version_match.group(1) if app_version_match else ''\ncheck('app version detectable',bool(app_version),app_version)\ncheck('pack appVersion sync',all(p.get('appVersion')==app_version for p in (data,rules,cert)),str([p.get('appVersion') for p in (data,rules,cert)]))\ncheck('packVersion metadata',all(bool(p.get('packVersion')) for p in (data,rules,cert)),str([p.get('packVersion') for p in (data,rules,cert)]))\ncheck('packVersion snapshot prefix',all(str(p.get('packVersion','')).startswith(str(p.get('snapshot',''))+'.') for p in (data,rules,cert)),str([p.get('packVersion') for p in (data,rules,cert)]))\ncheck('pack compatibility metadata',all(bool(p.get('compatibleAppVersion')) for p in (data,rules,cert)),str([p.get('compatibleAppVersion') for p in (data,rules,cert)]))\n"""
    if "check('pack appVersion sync'" not in text:
        if marker not in text:
            raise RuntimeError('validate_packs.py metadata insertion marker not found')
        text = text.replace(marker, marker + metadata_checks, 1)
    elif "check('packVersion snapshot prefix'" not in text:
        anchor = "check('packVersion metadata',all(bool(p.get('packVersion')) for p in (data,rules,cert)),str([p.get('packVersion') for p in (data,rules,cert)]))"
        if anchor not in text:
            raise RuntimeError('validate_packs.py packVersion check not found')
        text = text.replace(anchor, anchor + "\ncheck('packVersion snapshot prefix',all(str(p.get('packVersion','')).startswith(str(p.get('snapshot',''))+'.') for p in (data,rules,cert)),str([p.get('packVersion') for p in (data,rules,cert)]))", 1)

    ui_anchor = "check('scenario controls belong to plan','planSection' in markup.nodes['scenarioTabs']['ancestors'])"
    ui_checks = """\ncheck('compact scenario controls', 'class=\"plan-scenario-inline no-print\"' in html and 'id=\"renameScenario\"' in html and 'id=\"addScenario\"' in html)\ncheck('current sheet delete control', 'id=\"deleteScenario\"' in html and '>현재 시트 삭제<' in html)\ncheck('gap candidates precede plan builder', html.find('id=\"planGapCandidates\"') < html.find('class=\"plan-builder\"'))\n"""
    if "check('compact scenario controls'" not in text:
        if ui_anchor not in text:
            raise RuntimeError('validate_packs.py scenario anchor not found')
        text = text.replace(ui_anchor, ui_anchor + ui_checks, 1)

    footer_check = "check('footer version sync',f'<b>v{app_version}:</b>' in html)"
    if "check('footer version sync'" not in text:
        anchor = "check('app version detectable',bool(app_version),app_version)"
        text = text.replace(anchor, anchor + "\n" + footer_check, 1)

    timetable_checks = """\ncheck('gap status vocabulary confirmed scheduled',\"function gapTermKind(term){return term===DATA.snapshot?'확정':'예정';}\" in app)\ncheck('five-term timetable accordion','plan-term-schedule' in app and 'gapCandidateTerms()' in app and 'plan-term-schedules' in css)\ncheck('timetable independent from plan dropdown',\"const terms=gapCandidateTerms();\" in app and \"activePlanTimetableTerm||DATA.snapshot\" in app)\ncheck('confirmed timetable default open','openPlanTimetableTerms.add(DATA.snapshot)' in app)\n"""
    if "check('five-term timetable accordion'" not in text:
        text = text.replace(footer_check, footer_check + timetable_checks, 1)

    write_if_changed(path, text)


def normalize_pack(path: Path, app_version: str) -> None:
    obj = json.loads(path.read_text(encoding='utf-8'))
    snapshot = str(obj.get('snapshot') or obj.get('data', {}).get('snapshot') or 'unknown')

    old_app_version = str(obj.get('appVersion') or '')
    old_pack_version = str(obj.get('packVersion') or '')
    old_compatibility = str(obj.get('compatibleAppVersion') or '')

    revision_match = re.search(r'\.(\d+)$', old_pack_version)
    revision = revision_match.group(1) if revision_match else '1'
    normalized_pack_version = f'{snapshot}.{revision}'

    obj['appVersion'] = app_version
    obj['packVersion'] = normalized_pack_version
    obj['compatibleAppVersion'] = '>=3.0.0'

    metadata_changed = (
        old_app_version != obj['appVersion'] or
        old_pack_version != obj['packVersion'] or
        old_compatibility != obj['compatibleAppVersion'] or
        not obj.get('metadataUpdatedAt')
    )
    if metadata_changed:
        obj['metadataUpdatedAt'] = datetime.now(ZoneInfo('Asia/Seoul')).date().isoformat()

    content = json.dumps(obj, ensure_ascii=False, indent=2) + '\n'
    write_if_changed(path, content)


def main() -> None:
    app_version = normalize_app()
    normalize_plan_ui()
    normalize_validator()
    for name in PACK_FILES:
        normalize_pack(ROOT / name, app_version)
    print(f'Release maintenance complete - app {app_version}')


if __name__ == '__main__':
    main()
