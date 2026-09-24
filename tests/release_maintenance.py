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
RELEASE_VERSION = '3.1.17'


def write_if_changed(path: Path, content: str) -> bool:
    old = path.read_text(encoding='utf-8') if path.exists() else ''
    if old == content:
        return False
    path.write_text(content, encoding='utf-8')
    print(f'UPDATED - {path.relative_to(ROOT)}')
    return True


def find_variant(cert: dict, major: str, variant_id: str) -> dict:
    major_rule = cert.get('majors', {}).get(major, {})
    for variant in major_rule.get('variants', []):
        if variant.get('id') == variant_id:
            return variant
    raise RuntimeError(f'certificate variant not found: {major}/{variant_id}')


def find_group(variant: dict, no: int) -> dict:
    for group in variant.get('groups', []):
        if int(group.get('no', -1)) == no:
            return group
    raise RuntimeError(f'certificate group not found: {variant.get("id")}/{no}')


def keep_codes(group: dict, allowed_codes: set[str]) -> None:
    group['courses'] = [c for c in group.get('courses', []) if c.get('code') in allowed_codes]


def counselor2_groups() -> list[dict]:
    """2026-06-17 official Yonsei GSE basic-subject table, 상담교육 page."""
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


def normalize_data_domain() -> None:
    """Source-backed data corrections that must remain stable across releases."""
    path = ROOT / 'data-pack.json'
    pack = json.loads(path.read_text(encoding='utf-8'))
    data = pack.get('data', {})
    for bucket in ('offerings', 'globalOfferings', 'specialCourses'):
        for row in data.get(bucket, []):
            if row.get('courseCode') != 'SCE6572':
                continue
            aliases = list(dict.fromkeys(row.get('aliases') or []))
            aliases = [a for a in aliases if a != '이상심리학']
            if '가족상담' not in aliases:
                aliases.insert(0, '가족상담')
            row['aliases'] = aliases
    write_if_changed(path, json.dumps(pack, ensure_ascii=False, indent=2) + '\n')


def normalize_certificate_rules_domain() -> None:
    """Apply the consolidated official-rule corrections used by the public app."""
    path = ROOT / 'certificate-rules.json'
    cert = json.loads(path.read_text(encoding='utf-8'))

    korean = cert['majors']['국어교육']['variants'][0]
    keep_codes(find_group(korean, 8), {'SKE6594', 'SKE6595'})

    history = cert['majors']['역사교육']['variants'][0]
    keep_codes(find_group(history, 6), {'SHE6535', 'SHE6536', 'SHE6547'})

    science = cert['majors']['통합과학교육']['variants'][0]
    keep_codes(find_group(science, 13), {'SGS6833', 'SGS6803'})

    counselor1 = find_variant(cert, '상담교육', 'counselor1')
    counselor1['basicRule']['requiredGroups'] = [2, 3, 4, 5, 6, 7, 8, 18]
    counselor1['basicRule']['choiceGroups'] = [{'groups': [16, 17, 19, 20, 21], 'min': 2}]
    counselor1['basicRule']['minGroups'] = 10
    counselor1['basicRule']['sourceNote'] = (
        '연세대학교 교육대학원 전문상담교사 1급 안내: 필수 7과목 + '
        '상담실습및사례연구 1과목 + 선택 2과목 이상. 관리번호 18은 필수 실습으로 '
        '선택 2과목에 중복 산입하지 않음.'
    )

    counselor2 = find_variant(cert, '상담교육', 'counselor2')
    counselor2['groups'] = counselor2_groups()
    counselor2['conditionText'] = '5과목 14학점 이상 이수 / 2026학번부터 7과목 이상 (기본이수 6과목 이상, 13 상담실습 필수)'
    for rule in counselor2.setdefault('rulesByAdmission', []):
        if rule.get('from') == '2026-1':
            rule.setdefault('basicRule', {}).update({
                'type': 'groups',
                'minGroups': 7,
                'minCredits': 14,
                'requiredGroups': [13],
                'choiceGroups': [],
                'sourceNote': '2026학번부터 상담실습(관리번호 13) 필수 + 기본이수과목 6과목 이상, 총 7과목 이상',
            })

    write_if_changed(path, json.dumps(cert, ensure_ascii=False, indent=2) + '\n')


def sync_embedded_certificate_rules(text: str) -> str:
    cert = json.loads((ROOT / 'certificate-rules.json').read_text(encoding='utf-8'))
    embedded = json.dumps(cert, ensure_ascii=False, separators=(',', ':'))
    pattern = r"let CERT_RULES = .*?;\nconst EMBEDDED_CERT_RULES = JSON\.parse\(JSON\.stringify\(CERT_RULES\)\)"
    replacement = f"let CERT_RULES = {embedded};\nconst EMBEDDED_CERT_RULES = JSON.parse(JSON.stringify(CERT_RULES))"
    text, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError('embedded CERT_RULES block not found')
    return text


def normalize_app() -> str:
    path = ROOT / 'app.js'
    text = path.read_text(encoding='utf-8')
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    text, count = re.subn(r"const APP_VERSION = '[^']+';", f"const APP_VERSION = '{RELEASE_VERSION}';", text, count=1)
    if count != 1:
        raise RuntimeError('APP_VERSION not found in app.js')

    text = sync_embedded_certificate_rules(text)

    # Keep the embedded DATA fallback consistent with the corrected external pack.
    text = text.replace(
        '"courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담","이상심리학"]',
        '"courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담"]'
    )

    # Timetable accordion titles show only semester + course count.
    status_line = "        <span class=\\\"plan-term-status ${confirmed?'confirmed':'scheduled'}\\\">${confirmed?'확정':'예정'}</span>\n"
    text = text.replace(status_line, '', 1)
    status_line_plain = "        <span class=\"plan-term-status ${confirmed?'confirmed':'scheduled'}\">${confirmed?'확정':'예정'}</span>\n"
    text = text.replace(status_line_plain, '', 1)
    if 'plan-term-status' in text:
        raise RuntimeError('plan-term-status markup still remains in app.js')

    text = re.sub(
        r"\s*document\.getElementById\('cohortText'\)\.textContent=`적용: \$\{cohort\.label\} · \$\{rule\.label\}`;",
        '',
        text,
        count=1,
    )

    # Plan-list sorting: semester -> weekday/time -> category priority -> course name.
    # Regular timetable priority is Mon -> Tue -> Thu; other weekdays follow.
    helper = r'''const PLAN_LIST_CATEGORY_PRIORITY={
  major_required:0,major_elective:1,teaching:2,common:3,prerequisite:4,
  report:5,thesis:6,research_guidance:7,lifelong:8,audit:9,unknown:99
};
function sortedPlannedRecords(records){
  const dayOrder={월:0,화:1,목:2,수:3,금:4,토:5,일:6};
  return records.map((r,i)=>({r,i})).sort((a,b)=>{
    const termDiff=termIndex(a.r.term)-termIndex(b.r.term);
    if(termDiff)return termDiff;
    const ao=offeringForPlanRecord(a.r)||a.r,bo=offeringForPlanRecord(b.r)||b.r;
    const at=timeRangeForPlanRecord(a.r),bt=timeRangeForPlanRecord(b.r);
    const ad=dayOrder[ao.day??a.r.day]??99,bd=dayOrder[bo.day??b.r.day]??99;
    if(ad!==bd)return ad-bd;
    const as=at?.start??99999,bs=bt?.start??99999;
    if(as!==bs)return as-bs;
    const ac=PLAN_LIST_CATEGORY_PRIORITY[a.r.category]??98,bc=PLAN_LIST_CATEGORY_PRIORITY[b.r.category]??98;
    if(ac!==bc)return ac-bc;
    return String(a.r.courseName||'').localeCompare(String(b.r.courseName||''),'ko');
  });
}
'''
    if 'function sortedPlannedRecords(records)' not in text:
        marker = 'function renderPlan(){'
        if marker not in text:
            raise RuntimeError('renderPlan marker not found')
        text = text.replace(marker, helper + '\n' + marker, 1)
    else:
        text = re.sub(
            r"const dayOrder=\{월:\d+,화:\d+,수:\d+,목:\d+,금:\d+,토:\d+,일:\d+\};",
            'const dayOrder={월:0,화:1,목:2,수:3,금:4,토:5,일:6};',
            text,
            count=1,
        )

    old_map = "body.innerHTML=sc.planned.map((r,i)=>{"
    new_map = "body.innerHTML=sortedPlannedRecords(sc.planned).map(({r,i})=>{"
    if old_map in text:
        text = text.replace(old_map, new_map, 1)
    elif new_map not in text:
        raise RuntimeError('planned course map not found')

    text = text.replace('<span class=\\"badge planned\\">개설예정</span>', '<span class=\\"badge planned\\">개설 예정</span>')
    text = text.replace('<span class="badge planned">개설예정</span>', '<span class="badge planned">개설 예정</span>')
    text = text.replace("<span class=\\\"badge planned\\\">예정</span>", "<span class=\\\"badge planned\\\">개설 예정</span>")
    text = text.replace("<span class=\"badge planned\">예정</span>", "<span class=\"badge planned\">개설 예정</span>")

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

    text = text.replace('<div class="card"><label>입학학기</label><select id="admissionSelect"></select><div class="muted" id="cohortText"></div></div>',
                        '<div class="card"><label>입학학기</label><select id="admissionSelect"></select></div>', 1)
    text = text.replace('<div><b>1. 기본정보 입력</b><span>전공·입학학기·과정/졸업유형을 선택하고 기본정보를 확인합니다.</span></div>', '<div><b>1. 기본정보 입력</b></div>', 1)
    text = text.replace('<div><b>2. 수강이력 입력</b><span>성적조회 PDF를 불러오거나, 여러 장의 캡처 OCR·강의 찾기·직접 입력으로 등록합니다.</span></div>', '<div><b>2. 수강이력 입력</b></div>', 1)
    text = text.replace('<div><b>3. 결과 확인</b><span>졸업 인정학점·평점·종별 요건과 교원자격 이수현황을 확인합니다.</span></div>', '<div><b>3. 결과 확인</b></div>', 1)

    old_callout = '''    <div class="callout">\n      과거에 이수한 과목은 최신 개설표에서 사라져도 <b>기록과 계산에 그대로 유지</b>됩니다.<br>\n      전공에 개설된 <b>전공교직 과목</b>은 교직 ↔ 전공선택으로 인정종별을 바꿀 수 있습니다(과목명 옆 표시).<br>\n      성적은 4.3 만점 기준 <b>C−(1.7) 이상만 이수로 인정</b>하며, <b>누적평점 3.00 이상</b>이 별도 졸업요건입니다.\n    </div>'''
    new_callout = '''    <div class="callout">\n      과거에 이수한 과목은 최신 개설표에서 사라져도 <b>계산에 반영</b>됩니다.<br>\n      <b>전공교직 과목</b>은 교직 ↔ 전공선택으로 종별을 바꿀 수 있습니다.<br>\n      성적은 4.3 만점 기준 <b>C−(1.7) 이상만 이수로 인정</b>하며, 졸업요건 평점은 <b>누적평점 3.00 이상</b>입니다.\n    </div>'''
    if old_callout in text:
        text = text.replace(old_callout, new_callout, 1)
    text = text.replace('<th>데이터 상태</th>', '<th>상태</th>', 1)
    write_if_changed(path, text)


def normalize_validator(app_version: str) -> None:
    path = ROOT / 'tests' / 'validate_packs.py'
    text = path.read_text(encoding='utf-8')
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    text = re.sub(r"'styles\.css\?v=[0-9.]+'", f"'styles.css?v={app_version}'", text)
    text = re.sub(r"'app\.js\?v=[0-9.]+'", f"'app.js?v={app_version}'", text)

    teacher_checks = """\n# Official teacher-certificate audit (2026-06-17 table + current Yonsei GSE counselor guide)\ndef _variant(major, vid=None):\n    vs=cert.get('majors',{}).get(major,{}).get('variants',[])\n    return next((v for v in vs if vid is None or v.get('id')==vid),{})\ndef _group(v,no):\n    return next((g for g in v.get('groups',[]) if int(g.get('no',-1))==no),{})\ndef _codes(v,no):\n    return {c.get('code') for c in _group(v,no).get('courses',[])}\ncheck('국어 기본이수 8번 교과교육 과대산입 방지',_codes(_variant('국어교육'),8)=={'SKE6594','SKE6595'},str(_codes(_variant('국어교육'),8)))\ncheck('역사 기본이수 6번 교과교육 과대산입 방지',_codes(_variant('역사교육'),6)=={'SHE6535','SHE6536','SHE6547'},str(_codes(_variant('역사교육'),6)))\ncheck('통합과학 기본이수 13번 교과교육 과대산입 방지',_codes(_variant('통합과학교육'),13)=={'SGS6833','SGS6803'},str(_codes(_variant('통합과학교육'),13)))\nc1=_variant('상담교육','counselor1'); c1br=c1.get('basicRule',{})\ncheck('전문상담1급 10과목 구조',int(c1br.get('minGroups',0))==10 and set(c1br.get('requiredGroups',[]))=={2,3,4,5,6,7,8,18},str(c1br))\ncheck('전문상담1급 실습 중복선택 방지',c1br.get('choiceGroups',[{}])[0].get('groups')==[16,17,19,20,21] and int(c1br.get('choiceGroups',[{}])[0].get('min',0))==2,str(c1br.get('choiceGroups')))\nc2=_variant('상담교육','counselor2'); c2r=next((r.get('basicRule',{}) for r in c2.get('rulesByAdmission',[]) if r.get('from')=='2026-1'),{})\ncheck('전문상담2급 2026학번 7과목/13필수',int(c2r.get('minGroups',0))==7 and 13 in c2r.get('requiredGroups',[]),str(c2r))\n"""
    if "check('전문상담1급 10과목 구조'" not in text:
        marker = "passed=sum(1 for _,ok,_ in checks if ok)"
        if marker not in text:
            raise RuntimeError('validator insertion marker not found')
        text = text.replace(marker, teacher_checks + '\n' + marker, 1)

    weekday_check = "check('plan weekday priority Mon Tue Thu',\"const dayOrder={월:0,화:1,목:2,수:3,금:4,토:5,일:6};\" in app)"
    if "check('plan weekday priority Mon Tue Thu'" not in text:
        marker = "passed=sum(1 for _,ok,_ in checks if ok)"
        if marker not in text:
            raise RuntimeError('validator insertion marker not found')
        text = text.replace(marker, weekday_check + '\n\n' + marker, 1)

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
    # All previously separate patch scripts are consolidated here.
    normalize_data_domain()
    normalize_certificate_rules_domain()
    for name in PACK_FILES:
        normalize_pack(ROOT / name, RELEASE_VERSION)
    app_version = normalize_app()
    normalize_index(app_version)
    normalize_validator(app_version)
    print(f'Release maintenance complete - app {app_version}')


if __name__ == '__main__':
    main()
