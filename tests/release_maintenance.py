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
RELEASE_VERSION = '3.1.7'


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
    # Keep the JS fallback title in sync with the visible HTML title.
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    text, count = re.subn(r"const APP_VERSION = '[^']+';", f"const APP_VERSION = '{RELEASE_VERSION}';", text, count=1)
    if count != 1:
        raise RuntimeError('APP_VERSION not found in app.js')
    write_if_changed(path, text)
    return RELEASE_VERSION


def normalize_plan_ui() -> None:
    html_path = ROOT / 'index.html'
    html = html_path.read_text(encoding='utf-8')
    html = html.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    html = re.sub(r'styles\.css\?v=[0-9.]+', f'styles.css?v={RELEASE_VERSION}', html, count=1)
    html = re.sub(r'app\.js\?v=[0-9.]+', f'app.js?v={RELEASE_VERSION}', html, count=1)
    html = re.sub(r'<meta name="application-version" content="[^"]+">', f'<meta name="application-version" content="{RELEASE_VERSION}">', html, count=1)

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

    # Move the requirement-gap candidates above the manual course-add builder.
    later_gap = '    <div id="planGapCandidates" class="gap-candidates"></div>\n    <div id="planWarnings"></div>'
    if later_gap in html:
        html = html.replace(later_gap, '    <div id="planWarnings"></div>', 1)

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
