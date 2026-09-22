#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
VERSION = '3.1.14'


def write(path: Path, text: str):
    old = path.read_text(encoding='utf-8') if path.exists() else ''
    if old != text:
        path.write_text(text, encoding='utf-8')
        print('UPDATED -', path.relative_to(ROOT))


def patch_index():
    path = ROOT / 'index.html'
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'styles\.css\?v=[0-9.]+', f'styles.css?v={VERSION}', text, count=1)
    text = re.sub(r'app\.js\?v=[0-9.]+', f'app.js?v={VERSION}', text, count=1)
    text = re.sub(r'<meta name="application-version" content="[^"]+">', f'<meta name="application-version" content="{VERSION}">', text, count=1)
    text = re.sub(r'<footer class="footer">\s*<b>v[0-9.]+:</b>', f'<footer class="footer">\n    <b>v{VERSION}:</b>', text, count=1)

    if 'id="planForecastNotice"' not in text:
        anchor = '''    <div class="plan-sheet-utility no-print">\n      <button class="btn small" id="duplicateScenario" type="button">현재 시트 복제</button>\n      <button class="btn small danger" id="deleteScenario" type="button">현재 시트 삭제</button>\n    </div>\n'''
        notice = anchor + '''    <div class="plan-forecast-notice no-print" id="planForecastNotice">\n      <b>개설 예정 정보 안내</b> · 확정 학기 이후 과목은 현재 개설예정표를 기준으로 표시합니다. 실제 개설 과목·교수·요일·시간은 변경될 수 있으므로 <b>졸업계획 참고용</b>으로 활용하고, 수강신청 전 실제 시간표를 반드시 확인하세요.\n    </div>\n'''
        if anchor not in text:
            raise RuntimeError('plan sheet utility anchor not found')
        text = text.replace(anchor, notice, 1)

    if 'id="teacherEvidenceDetails"' not in text:
        anchor = '    <div id="teacherChecklistAuto" class="teacher-auto-grid teacher-auto-grid-v2"></div>\n'
        repl = anchor + '    <div id="teacherEvidenceDetails" class="teacher-evidence-wrap"></div>\n'
        if anchor not in text:
            raise RuntimeError('teacherChecklistAuto anchor not found')
        text = text.replace(anchor, repl, 1)

    write(path, text)


def patch_css():
    path = ROOT / 'styles.css'
    text = path.read_text(encoding='utf-8')
    if '/* v3.1.14 evidence drilldowns */' not in text:
        text += r'''

/* v3.1.14 evidence drilldowns */
.plan-forecast-notice{
  margin:8px 0 12px;padding:10px 12px;border:1px solid #bfd4ef;border-radius:10px;
  background:#f7fbff;color:#475467;font-size:12px;line-height:1.55
}
.plan-forecast-notice b:first-child{color:#0b57a4}
.kpi-evidence{margin-top:8px;border-top:1px solid #e6ebf2;padding-top:7px}
.kpi-evidence>summary{
  list-style:none;cursor:pointer;color:#49627c;font-size:11px;font-weight:800;
  display:flex;align-items:center;justify-content:space-between;gap:8px
}
.kpi-evidence>summary::-webkit-details-marker{display:none}
.kpi-evidence>summary::after{content:'›';font-size:16px;line-height:1;transition:transform .15s ease}
.kpi-evidence[open]>summary::after{transform:rotate(90deg)}
.kpi-evidence-body{margin-top:7px;padding-top:7px;border-top:1px dashed #d8e1ec}
.evidence-group+.evidence-group{margin-top:7px}
.evidence-group-title{font-size:10px;font-weight:850;color:#667085;margin-bottom:3px}
.evidence-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px;align-items:center;padding:3px 0;font-size:10px;color:#475467}
.evidence-row .name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#344054;font-weight:700}
.evidence-row .term{color:#667085}
.evidence-row .credit{white-space:nowrap;color:#475467}
.evidence-plan-chip{font-size:9px;border-radius:999px;padding:2px 5px;background:#fff4dd;color:#9a6700;font-weight:850}
.evidence-summary-line{margin-top:6px;padding-top:6px;border-top:1px solid #eef1f5;font-size:10px;color:#667085}
.teacher-evidence-wrap{margin:8px 0 2px}
.teacher-evidence-details{border:1px solid #dbe4ef;border-radius:10px;background:#fbfcfe}
.teacher-evidence-details>summary{cursor:pointer;list-style:none;padding:9px 11px;font-size:11px;font-weight:850;color:#475467;display:flex;justify-content:space-between;gap:8px}
.teacher-evidence-details>summary::-webkit-details-marker{display:none}
.teacher-evidence-details>summary::after{content:'›';font-size:16px;line-height:1}
.teacher-evidence-details[open]>summary::after{transform:rotate(90deg)}
.teacher-evidence-body{padding:0 11px 10px;border-top:1px solid #e6ebf2}
.teacher-evidence-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:7px;align-items:center;padding:6px 0;border-bottom:1px solid #f0f2f5;font-size:10px}
.teacher-evidence-row:last-child{border-bottom:0}
.teacher-evidence-group{color:#667085;font-weight:850;white-space:nowrap}
.teacher-evidence-course{min-width:0;color:#344054}
.teacher-evidence-course b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.teacher-evidence-course span{display:block;color:#98a2b3;margin-top:1px}
@media(max-width:620px){
  .plan-forecast-notice{font-size:11px;padding:9px 10px}
  .evidence-row{grid-template-columns:minmax(0,1fr) auto}
  .evidence-row .term{display:none}
}
@media print{.kpi-evidence,.teacher-evidence-wrap,.plan-forecast-notice{display:none!important}}
'''
    write(path, text)


def patch_app():
    path = ROOT / 'app.js'
    text = path.read_text(encoding='utf-8')
    text, n = re.subn(r"const APP_VERSION = '[^']+';", f"const APP_VERSION = '{VERSION}';", text, count=1)
    if n != 1:
        raise RuntimeError('APP_VERSION not found')

    helpers = r'''
function evidenceRecordKey(r){
  return `${canonicalCode(r?.courseCode)}|${normName(r?.courseName)}|${r?.term||''}|${r?.category||''}`;
}
function requirementEvidenceRecords(key,records){
  const seen=new Set(),out=[];
  for(const r of records||[]){
    if(r?.passed===false)continue;
    if(key==='total'){
      if(Number(r?.credits||0)<=0)continue;
      if(['audit','prerequisite'].includes(r?.category))continue;
    }else if((r?.category||'')!==key)continue;
    const k=evidenceRecordKey(r);if(seen.has(k))continue;seen.add(k);out.push(r);
  }
  return out.sort((a,b)=>termIndex(a.term)-termIndex(b.term)||String(a.courseName||'').localeCompare(String(b.courseName||''),'ko'));
}
function evidenceRowsHtml(records,{planned=false,unit='학점'}={}){
  if(!records.length)return '';
  return records.map(r=>`<div class="evidence-row"><span class="name">${esc(r.courseName||r.courseCode||'과목')}</span><span class="term">${esc(displayAcademicTerm(r.term)||r.term||'')}</span><span class="credit">${unit==='과목'?'1과목':`${fmtCredits(Number(r.credits||0))}학점`}${planned?' <span class="evidence-plan-chip">계획</span>':''}</span></div>`).join('');
}
function requirementEvidenceHtml(key,cur,proj,min,unit){
  const current=requirementEvidenceRecords(key,state.history);
  const planned=requirementEvidenceRecords(key,projectionPlannedRecords());
  const count=current.length+planned.length;
  if(!count)return '';
  return `<details class="kpi-evidence no-print"><summary>${planned.length?'인정·계획 과목':'인정 과목'} ${count}개</summary><div class="kpi-evidence-body">
    ${current.length?`<div class="evidence-group"><div class="evidence-group-title">현재 이수</div>${evidenceRowsHtml(current,{unit})}</div>`:''}
    ${planned.length?`<div class="evidence-group"><div class="evidence-group-title">계획</div>${evidenceRowsHtml(planned,{planned:true,unit})}</div>`:''}
    <div class="evidence-summary-line">현재 ${fmtCredits(cur)} / ${fmtCredits(min)}${unit}${proj!==cur?` · 계획 반영 후 ${fmtCredits(proj)} / ${fmtCredits(min)}${unit}`:''}</div>
  </div></details>`;
}
function teacherEvidenceHtml(){
  const variant=certificateVariantRule();if(!variant)return '';
  const current=state.history.filter(r=>r.passed!==false),planned=projectionPlannedRecords();
  const currentByCode=new Map(current.map(r=>[canonicalCode(r.courseCode),r]));
  const plannedByCode=new Map(planned.map(r=>[canonicalCode(r.courseCode),r]));
  const rows=[];
  for(const g of variant.groups||[]){
    let hit=null,isPlanned=false;
    for(const c of g.courses||[]){
      const code=canonicalCode(c.code);
      if(currentByCode.has(code)){hit=currentByCode.get(code);break;}
      if(plannedByCode.has(code)){hit=plannedByCode.get(code);isPlanned=true;break;}
    }
    if(hit)rows.push({group:`기본 ${g.no}`,subject:g.basicSubject||'',record:hit,planned:isPlanned});
  }
  for(const c of variant.pedagogyCourses||[]){
    const code=canonicalCode(c.code);let hit=currentByCode.get(code),isPlanned=false;
    if(!hit&&plannedByCode.has(code)){hit=plannedByCode.get(code);isPlanned=true;}
    if(hit)rows.push({group:'교과교육',subject:c.courseName||'',record:hit,planned:isPlanned});
  }
  if(!rows.length)return '';
  return `<details class="teacher-evidence-details"><summary>기본이수·교과교육 인정 내역 ${rows.length}개</summary><div class="teacher-evidence-body">${rows.map(x=>`<div class="teacher-evidence-row"><span class="teacher-evidence-group">${esc(x.group)}</span><span class="teacher-evidence-course"><b>${esc(x.record.courseName||x.subject||x.record.courseCode)}</b><span>${esc(canonicalCode(x.record.courseCode))}${x.subject&&normName(x.subject)!==normName(x.record.courseName)?` · ${esc(x.subject)}`:''}</span></span>${x.planned?'<span class="evidence-plan-chip">계획</span>':'<span class="badge ok">인정</span>'}</div>`).join('')}</div></details>`;
}
'''
    if 'function requirementEvidenceHtml(' not in text:
        marker = 'function renderKpis(){'
        if marker not in text:
            raise RuntimeError('renderKpis marker not found')
        text = text.replace(marker, helpers + '\n' + marker, 1)

    old_card = '''  const card=(label,cur,proj,min,unit)=>{\n    const status=requirementState(cur>=min,proj>=min);\n    return `<div class="card ${status==='bad'?'kpi-card-unmet':''}"><div class="kpi-top"><span class="kpi-label">${esc(label)}</span>${requirementBadge(status)}</div>\n      ${comparisonValues(`${fmtCredits(cur)} / ${fmtCredits(min)}${unit}`,`${fmtCredits(proj)} / ${fmtCredits(min)}${unit}`)}\n      <div class="kpi-bar"><div style="width:${min>0?Math.min(100,Math.round(cur/min*100)):0}%"></div></div>\n      <div class="sub">기준 ${fmtCredits(min)}${unit} 이상${cur<min?` · 현재 부족 ${fmtCredits(min-cur)}${unit}`:''}</div></div>`;\n  };'''
    new_card = '''  const card=(key,label,cur,proj,min,unit)=>{\n    const status=requirementState(cur>=min,proj>=min);\n    return `<div class="card ${status==='bad'?'kpi-card-unmet':''}"><div class="kpi-top"><span class="kpi-label">${esc(label)}</span>${requirementBadge(status)}</div>\n      ${comparisonValues(`${fmtCredits(cur)} / ${fmtCredits(min)}${unit}`,`${fmtCredits(proj)} / ${fmtCredits(min)}${unit}`)}\n      <div class="kpi-bar"><div style="width:${min>0?Math.min(100,Math.round(cur/min*100)):0}%"></div></div>\n      <div class="sub">기준 ${fmtCredits(min)}${unit} 이상${cur<min?` · 현재 부족 ${fmtCredits(min-cur)}${unit}`:''}</div>\n      ${requirementEvidenceHtml(key,cur,proj,min,unit)}</div>`;\n  };'''
    if old_card in text:
        text = text.replace(old_card, new_card, 1)
    elif 'const card=(key,label,cur,proj,min,unit)=>' not in text:
        raise RuntimeError('KPI card helper not found')

    text = text.replace("const cards=[card('졸업 인정학점',current.totalCredits,projected.totalCredits,rule.totalCredits,'학점')];",
                        "const cards=[card('total','졸업 인정학점',current.totalCredits,projected.totalCredits,rule.totalCredits,'학점')];", 1)
    text = text.replace('cards.push(card(pr.label,cur,pr.current,pr.min,pr.unit));',
                        'cards.push(card(pr.key,pr.label,cur,pr.current,pr.min,pr.unit));', 1)

    teacher_anchor = "  document.getElementById('teacherChecklistAuto').innerHTML=cards.join('');"
    teacher_repl = teacher_anchor + "\n  const evidence=document.getElementById('teacherEvidenceDetails');if(evidence)evidence.innerHTML=teacherEvidenceHtml();"
    if teacher_repl not in text:
        if teacher_anchor not in text:
            raise RuntimeError('teacher checklist auto render anchor not found')
        text = text.replace(teacher_anchor, teacher_repl, 1)

    write(path, text)


def patch_packs():
    for name in ('data-pack.json','rules-pack.json','certificate-rules.json'):
        path = ROOT / name
        obj = json.loads(path.read_text(encoding='utf-8'))
        obj['appVersion'] = VERSION
        path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def patch_validator():
    path = ROOT / 'tests' / 'validate_packs.py'
    text = path.read_text(encoding='utf-8')
    text = re.sub(r"styles\.css\?v=[0-9.]+", f'styles.css?v={VERSION}', text)
    text = re.sub(r"app\.js\?v=[0-9.]+", f'app.js?v={VERSION}', text)
    checks = """check('plan forecast uncertainty notice','id=\"planForecastNotice\"' in html and '수강신청 전 실제 시간표를 반드시 확인' in html)
check('requirement evidence drilldown','function requirementEvidenceHtml(' in app and 'kpi-evidence' in css and '인정·계획 과목' in app)
check('teacher evidence drilldown','id=\"teacherEvidenceDetails\"' in html and 'function teacherEvidenceHtml(' in app and 'teacher-evidence-details' in css)
"""
    if "check('plan forecast uncertainty notice'" not in text:
        marker = "passed=sum(1 for _,ok,_ in checks if ok)"
        if marker not in text:
            raise RuntimeError('validator marker not found')
        text = text.replace(marker, checks + '\n' + marker, 1)
    write(path, text)


def main():
    patch_index()
    patch_css()
    patch_app()
    patch_packs()
    patch_validator()
    print('UX feedback patch applied -', VERSION)


if __name__ == '__main__':
    main()
