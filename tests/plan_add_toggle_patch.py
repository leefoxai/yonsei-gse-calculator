#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
VERSION = '3.1.15'


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

    if 'id="planAddSection"' not in text:
        old_start = '''<div class="plan-builder">\n      <div class="pdf-import-head">\n        <div>\n          <h3>계획 과목 추가</h3>\n          <div class="muted" style="margin-top:4px">학기·종별·검색으로 개설 과목을 찾아 수강계획에 추가하세요. 추가하면 이수현황과 시간표가 즉시 다시 계산됩니다.</div>\n        </div>\n      </div>\n'''
        new_start = '''<details class="plan-builder-toggle no-print-ui" id="planAddSection" open>\n      <summary><span>계획 과목 추가</span></summary>\n      <div class="plan-builder">\n        <div class="muted plan-builder-help">학기·종별·검색으로 개설 과목을 찾아 수강계획에 추가하세요. 추가하면 이수현황과 시간표가 즉시 다시 계산됩니다.</div>\n'''
        if old_start not in text:
            raise RuntimeError('plan builder start block not found')
        text = text.replace(old_start, new_start, 1)

        old_end = '''      </div>\n    </div>\n    <div id="planSelectionNote" class="selection-note"></div>'''
        new_end = '''      </div>\n      </div>\n    </details>\n    <div id="planSelectionNote" class="selection-note"></div>'''
        if old_end not in text:
            raise RuntimeError('plan builder end block not found')
        text = text.replace(old_end, new_end, 1)

    write(path, text)


def patch_css():
    path = ROOT / 'styles.css'
    text = path.read_text(encoding='utf-8')
    if '/* v3.1.15 plan add toggle */' not in text:
        text += r'''

/* v3.1.15 plan add toggle */
.plan-builder-toggle{
  margin:10px 0 8px;border:1px solid var(--line);border-radius:11px;background:#fff;overflow:hidden
}
.plan-builder-toggle>summary{
  list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;
  gap:10px;padding:11px 13px;font-size:13px;font-weight:900;color:#344054;background:#fbfcfe
}
.plan-builder-toggle>summary::-webkit-details-marker{display:none}
.plan-builder-toggle>summary::after{content:'›';font-size:18px;line-height:1;color:#667085;transition:transform .15s ease}
.plan-builder-toggle[open]>summary::after{transform:rotate(90deg)}
.plan-builder-toggle>.plan-builder{margin:0;border:0;border-top:1px solid var(--line);border-radius:0}
.plan-builder-help{margin:0 0 10px;font-size:11px;line-height:1.45}
@media(max-width:620px){
  .plan-builder-toggle>summary{padding:10px 11px;font-size:12px}
  .plan-builder-help{font-size:10px}
}
@media print{.plan-builder-toggle{border:0}.plan-builder-toggle>summary{display:none!important}}
'''
    write(path, text)


def patch_app():
    path = ROOT / 'app.js'
    text = path.read_text(encoding='utf-8')
    text, n = re.subn(r"const APP_VERSION = '[^']+';", f"const APP_VERSION = '{VERSION}';", text, count=1)
    if n != 1:
        raise RuntimeError('APP_VERSION not found')
    write(path, text)


def patch_packs():
    for name in ('data-pack.json', 'rules-pack.json', 'certificate-rules.json'):
        path = ROOT / name
        obj = json.loads(path.read_text(encoding='utf-8'))
        obj['appVersion'] = VERSION
        write(path, json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


def patch_validator():
    path = ROOT / 'tests' / 'validate_packs.py'
    text = path.read_text(encoding='utf-8')
    text = re.sub(r"styles\.css\?v=[0-9.]+", f'styles.css?v={VERSION}', text)
    text = re.sub(r"app\.js\?v=[0-9.]+", f'app.js?v={VERSION}', text)
    check_line = "check('plan add toggle open by default','id=\"planAddSection\" open' in html and 'plan-builder-toggle' in css)"
    if "check('plan add toggle open by default'" not in text:
        marker = "passed=sum(1 for _,ok,_ in checks if ok)"
        if marker not in text:
            raise RuntimeError('validator marker not found')
        text = text.replace(marker, check_line + '\n\n' + marker, 1)
    write(path, text)


def main():
    patch_index()
    patch_css()
    patch_app()
    patch_packs()
    patch_validator()
    print('Plan add toggle patch applied -', VERSION)


if __name__ == '__main__':
    main()
