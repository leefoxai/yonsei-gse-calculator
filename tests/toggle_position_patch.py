#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
VERSION = '3.1.16'


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
    write(path, text)


def patch_css():
    path = ROOT / 'styles.css'
    text = path.read_text(encoding='utf-8')
    if '/* v3.1.16 unified left disclosure toggles */' not in text:
        text += r'''

/* v3.1.16 unified left disclosure toggles */
/* Every collapsible box uses one disclosure icon placed before its title. */
details > summary{
  list-style:none;
}
details > summary::-webkit-details-marker{
  display:none;
}
details > summary::before{
  content:'›';
  display:inline-block;
  flex:0 0 auto;
  width:14px;
  margin-right:7px;
  color:#667085;
  font-size:17px;
  font-weight:800;
  line-height:1;
  text-align:center;
  transform-origin:50% 50%;
  transition:transform .15s ease;
  vertical-align:-1px;
}
details[open] > summary::before{
  transform:rotate(90deg);
}
/* Previous component-specific right-side arrows are disabled. */
details > summary::after{
  content:none!important;
  display:none!important;
}
/* Keep title/action summaries aligned when they use flex/grid layouts. */
.plan-section-summary::before,
.analysis-heading::before,
.section-title-row::before{
  align-self:center;
}
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
    check_line = "check('all disclosure toggles aligned left',\"details > summary::before\" in css and \"details > summary::after\" in css and \"content:none!important\" in css)"
    if "check('all disclosure toggles aligned left'" not in text:
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
    print('Toggle position patch applied -', VERSION)


if __name__ == '__main__':
    main()
