#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
CORRECT_TITLE = '[테스트]연세대학교 교육대학원 졸업요건 이수현황 계산기'
LEGACY_TYPO_TITLE = '[테스트]연세대학교 교육대학원 조럽요건 이수현황 계산기'
PACK_FILES = ('data-pack.json', 'rules-pack.json', 'certificate-rules.json')


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
    # The HTML title was already corrected, but APP_TITLE_DEFAULT still had the old typo.
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    write_if_changed(path, text)
    match = re.search(r"const APP_VERSION = '([^']+)';", text)
    if not match:
        raise RuntimeError('APP_VERSION not found in app.js')
    return match.group(1)


def normalize_validator() -> None:
    path = ROOT / 'tests' / 'validate_packs.py'
    text = path.read_text(encoding='utf-8')
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)

    marker = "check('snapshot一致',len(snapshots)==1 and None not in snapshots,str(snapshots))"
    metadata_checks = """\napp_version_match=re.search(r\"const APP_VERSION = '([^']+)';\",app)\napp_version=app_version_match.group(1) if app_version_match else ''\ncheck('app version detectable',bool(app_version),app_version)\ncheck('pack appVersion sync',all(p.get('appVersion')==app_version for p in (data,rules,cert)),str([p.get('appVersion') for p in (data,rules,cert)]))\ncheck('packVersion metadata',all(bool(p.get('packVersion')) for p in (data,rules,cert)),str([p.get('packVersion') for p in (data,rules,cert)]))\ncheck('pack compatibility metadata',all(bool(p.get('compatibleAppVersion')) for p in (data,rules,cert)),str([p.get('compatibleAppVersion') for p in (data,rules,cert)]))\n"""
    if "check('pack appVersion sync'" not in text:
        if marker not in text:
            raise RuntimeError('validate_packs.py metadata insertion marker not found')
        text = text.replace(marker, marker + metadata_checks, 1)
    write_if_changed(path, text)


def normalize_pack(path: Path, app_version: str) -> None:
    obj = json.loads(path.read_text(encoding='utf-8'))
    snapshot = str(obj.get('snapshot') or obj.get('data', {}).get('snapshot') or 'unknown')
    obj['appVersion'] = app_version
    obj.setdefault('packVersion', f'{snapshot}.1')
    obj.setdefault('compatibleAppVersion', '>=3.0.0')
    # `updatedAt` remains the content/data update date. This separate field records
    # only the metadata normalization, so we do not falsely imply a source-data update.
    obj.setdefault('metadataUpdatedAt', '2026-09-21')
    content = json.dumps(obj, ensure_ascii=False, indent=2) + '\n'
    write_if_changed(path, content)


def main() -> None:
    app_version = normalize_app()
    normalize_validator()
    for name in PACK_FILES:
        normalize_pack(ROOT / name, app_version)
    print(f'Release maintenance complete - app {app_version}')


if __name__ == '__main__':
    main()
