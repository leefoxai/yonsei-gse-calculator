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
RELEASE_VERSION = '3.1.10'


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

    # Keep the 부족요건 학기 탭 vocabulary as 확정/예정.
    text = text.replace("function gapTermKind(term){return term===DATA.snapshot?'실제':'계획';}",
                        "function gapTermKind(term){return term===DATA.snapshot?'확정':'예정';}")
    text = text.replace("gapTermKind(t)==='실제'?'실제':'계획'", "gapTermKind(t)==='확정'?'확정':'예정'")
    text = text.replace("const note=selectedKind==='실제'", "const note=selectedKind==='확정'")

    # Timetable accordion titles show only semester + course count.
    target = "        <span class=\\\"plan-term-status ${confirmed?'confirmed':'scheduled'}\\\">${confirmed?'확정':'예정'}</span>\n"
    if target in text:
        text = text.replace(target, '', 1)
    elif 'plan-term-status' in text:
        text, removed = re.subn(r'^\s*<span class=\\"plan-term-status[^\n]+\n?', '', text, count=1, flags=re.M)
        if removed != 1:
            raise RuntimeError('plan-term-status markup found but could not be removed')

    write_if_changed(path, text)
    return RELEASE_VERSION


def normalize_index(app_version: str) -> None:
    path = ROOT / 'index.html'
    text = path.read_text(encoding='utf-8')
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    text = re.sub(r'styles\.css\?v=[0-9.]+', f'styles.css?v={app_version}', text, count=1)
    text = re.sub(r'app\.js\?v=[0-9.]+', f'app.js?v={app_version}', text, count=1)
    text = re.sub(r'<meta name="application-version" content="[^"]+">',
                  f'<meta name="application-version" content="{app_version}">', text, count=1)
    text = re.sub(r'<footer class="footer">\s*<b>v[0-9.]+:</b>',
                  f'<footer class="footer">\n    <b>v{app_version}:</b>', text, count=1)
    write_if_changed(path, text)


def normalize_validator(app_version: str) -> None:
    path = ROOT / 'tests' / 'validate_packs.py'
    text = path.read_text(encoding='utf-8')
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    text = re.sub(r"'styles\.css\?v=[0-9.]+'", f"'styles.css?v={app_version}'", text)
    text = re.sub(r"'app\.js\?v=[0-9.]+'", f"'app.js?v={app_version}'", text)

    if "check('timetable status badges removed'" not in text:
        anchor = "check('confirmed timetable default open','openPlanTimetableTerms.add(DATA.snapshot)' in app)"
        check_line = "check('timetable status badges removed','plan-term-status' not in app)"
        if anchor in text:
            text = text.replace(anchor, anchor + "\n" + check_line, 1)
        else:
            marker = "passed=sum(1 for _,ok,_ in checks if ok)"
            if marker not in text:
                raise RuntimeError('validator insertion marker not found')
            text = text.replace(marker, check_line + "\n\n" + marker, 1)

    write_if_changed(path, text)


def normalize_pack(path: Path, app_version: str) -> None:
    obj = json.loads(path.read_text(encoding='utf-8'))
    snapshot = str(obj.get('snapshot') or obj.get('data', {}).get('snapshot') or 'unknown')
    old_app_version = str(obj.get('appVersion') or '')
    old_pack_version = str(obj.get('packVersion') or '')
    old_compatibility = str(obj.get('compatibleAppVersion') or '')

    revision_match = re.search(r'\.(\d+)$', old_pack_version)
    revision = revision_match.group(1) if revision_match else '1'
    obj['appVersion'] = app_version
    obj['packVersion'] = f'{snapshot}.{revision}'
    obj['compatibleAppVersion'] = '>=3.0.0'

    if (
        old_app_version != obj['appVersion'] or
        old_pack_version != obj['packVersion'] or
        old_compatibility != obj['compatibleAppVersion'] or
        not obj.get('metadataUpdatedAt')
    ):
        obj['metadataUpdatedAt'] = datetime.now(ZoneInfo('Asia/Seoul')).date().isoformat()

    write_if_changed(path, json.dumps(obj, ensure_ascii=False, indent=2) + '\n')


def main() -> None:
    app_version = normalize_app()
    normalize_index(app_version)
    normalize_validator(app_version)
    for name in PACK_FILES:
        normalize_pack(ROOT / name, app_version)
    print(f'Release maintenance complete - app {app_version}')


if __name__ == '__main__':
    main()
