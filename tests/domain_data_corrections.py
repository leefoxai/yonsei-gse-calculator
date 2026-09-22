#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]


def write_json(path: Path, obj) -> None:
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def counselor2_groups():
    # 2026-06-17 official Yonsei GSE basic-subject table, page 3.
    return [
        {'no': 1, 'basicSubject': '심리학개론', 'courses': []},
        {'no': 2, 'basicSubject': '심리검사', 'courses': [{'code': 'SCE6575', 'courseName': '심리검사'}]},
        {'no': 3, 'basicSubject': '성격심리학', 'courses': [{'code': 'SCE6557', 'courseName': '성격심리학'}]},
        {'no': 4, 'basicSubject': '특수아상담', 'courses': [{'code': 'SCE6594', 'courseName': '특수아상담'}]},
        {'no': 5, 'basicSubject': '집단상담', 'courses': [{'code': 'SCE6505', 'courseName': '집단상담'}]},
        {'no': 6, 'basicSubject': '가족상담', 'courses': [{'code': 'SCE6572', 'courseName': '가족상담'}]},
        {'no': 7, 'basicSubject': '진로상담', 'courses': [{'code': 'SCE6573', 'courseName': '진로상담'}]},
        {'no': 8, 'basicSubject': '상담이론과실제', 'courses': [{'code': 'SCE6506', 'courseName': '상담이론과실제'}]},
        {'no': 9, 'basicSubject': '심리치료', 'courses': [{'code': 'SCE6548', 'courseName': '상담과심리치료'}]},
        {'no': 10, 'basicSubject': '임상심리학', 'courses': []},
        {'no': 11, 'basicSubject': '아동심리학', 'courses': []},
        {'no': 12, 'basicSubject': '청소년심리', 'courses': []},
        {'no': 13, 'basicSubject': '상담실습', 'courses': [{'code': 'SCE6565', 'courseName': '상담기법및실습'}]},
        {'no': 14, 'basicSubject': '직업교육론', 'courses': []},
        {'no': 15, 'basicSubject': '직업정보', 'courses': []},
        {'no': 16, 'basicSubject': '진로지도', 'courses': []},
        {'no': 17, 'basicSubject': '학습심리학', 'courses': [
            {'code': 'SCE6592', 'courseName': '(구)학습심리학'},
            {'code': 'SCE6584', 'courseName': '학습심리학'},
        ]},
        {'no': 18, 'basicSubject': '이상심리학', 'courses': [{'code': 'SCE6550', 'courseName': '이상심리학'}]},
    ]


def patch_certificate_pack():
    path = ROOT / 'certificate-rules.json'
    cert = json.loads(path.read_text(encoding='utf-8'))
    variants = cert['majors']['상담교육']['variants']
    c2 = next(v for v in variants if v.get('id') == 'counselor2')
    c2['groups'] = counselor2_groups()
    c2['conditionText'] = '5과목 14학점 이상 이수 / 2026학번부터 7과목 이상 (기본이수 6과목 이상, 13 상담실습 필수)'
    for rule in c2.get('rulesByAdmission', []):
        if rule.get('from') == '2026-1':
            br = rule['basicRule']
            br['minGroups'] = 7
            br['requiredGroups'] = [13]
            br['sourceNote'] = '2026학번부터 상담실습(관리번호 13) 필수 + 기본이수과목 6과목 이상, 총 7과목 이상'
    write_json(path, cert)
    return cert


def patch_data_pack():
    path = ROOT / 'data-pack.json'
    pack = json.loads(path.read_text(encoding='utf-8'))
    data = pack.get('data', {})
    changed = 0
    for bucket in ('offerings', 'globalOfferings', 'specialCourses'):
        for row in data.get(bucket, []):
            if row.get('courseCode') == 'SCE6572':
                aliases = list(dict.fromkeys(row.get('aliases') or []))
                cleaned = [a for a in aliases if a != '이상심리학']
                if '가족상담' not in cleaned:
                    cleaned.insert(0, '가족상담')
                if cleaned != aliases:
                    row['aliases'] = cleaned
                    changed += 1
    write_json(path, pack)
    print(f'SCE6572 alias rows corrected: {changed}')
    return pack


def sync_app(cert, data_pack):
    path = ROOT / 'app.js'
    text = path.read_text(encoding='utf-8')

    # External certificate pack and embedded fallback must match exactly.
    embedded_cert = json.dumps(cert, ensure_ascii=False, separators=(',', ':'))
    cert_pattern = r"let CERT_RULES = .*?;\nconst EMBEDDED_CERT_RULES = JSON\.parse\(JSON\.stringify\(CERT_RULES\)\)"
    cert_repl = f"let CERT_RULES = {embedded_cert};\nconst EMBEDDED_CERT_RULES = JSON.parse(JSON.stringify(CERT_RULES))"
    text, n = re.subn(cert_pattern, cert_repl, text, count=1, flags=re.S)
    if n != 1:
        raise RuntimeError('embedded certificate rules block not found')

    # The public app normally loads data-pack.json, but remove the same bad alias
    # from the embedded fallback so offline/fetch-failure behavior is also correct.
    text = text.replace(
        '"courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담","이상심리학"]',
        '"courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담"]'
    )
    path.write_text(text, encoding='utf-8')


def main():
    cert = patch_certificate_pack()
    data = patch_data_pack()
    sync_app(cert, data)
    print('Domain data corrections applied.')


if __name__ == '__main__':
    main()
