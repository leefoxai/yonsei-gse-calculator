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
RELEASE_VERSION = '3.1.12'


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

    # Timetable accordion titles show only semester + course count.
    status_line = "        <span class=\\\"plan-term-status ${confirmed?'confirmed':'scheduled'}\\\">${confirmed?'확정':'예정'}</span>\n"
    text = text.replace(status_line, '', 1)
    status_line_plain = "        <span class=\"plan-term-status ${confirmed?'confirmed':'scheduled'}\">${confirmed?'확정':'예정'}</span>\n"
    text = text.replace(status_line_plain, '', 1)
    if 'plan-term-status' in text:
        raise RuntimeError('plan-term-status markup still remains in app.js')

    # Cohort/rule helper under 입학학기 is no longer displayed.
    text = re.sub(
        r"\s*document\.getElementById\('cohortText'\)\.textContent=`적용: \$\{cohort\.label\} · \$\{rule\.label\}`;",
        '',
        text,
        count=1,
    )

    # Plan-list sorting: semester -> weekday/time -> category priority -> course name.
    helper = r'''const PLAN_LIST_CATEGORY_PRIORITY={
  major_required:0,major_elective:1,teaching:2,common:3,prerequisite:4,
  report:5,thesis:6,research_guidance:7,lifelong:8,audit:9,unknown:99
};
function sortedPlannedRecords(records){
  const dayOrder={월:0,화:1,수:2,목:3,금:4,토:5,일:6};
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

    old_map = "body.innerHTML=sc.planned.map((r,i)=>{"
    new_map = "body.innerHTML=sortedPlannedRecords(sc.planned).map(({r,i})=>{"
    if old_map in text:
        text = text.replace(old_map, new_map, 1)
    elif new_map not in text:
        raise RuntimeError('planned course map not found')

    # Status wording in planned-course list and timetable unplaced list.
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

    # 입학학기 하단의 적용 범위 보조문구 제거.
    text = text.replace('<div class="card"><label>입학학기</label><select id="admissionSelect"></select><div class="muted" id="cohortText"></div></div>',
                        '<div class="card"><label>입학학기</label><select id="admissionSelect"></select></div>', 1)

    # 사용방법 3단계는 단계명만 남김.
    text = text.replace('<div><b>1. 기본정보 입력</b><span>전공·입학학기·과정/졸업유형을 선택하고 기본정보를 확인합니다.</span></div>',
                        '<div><b>1. 기본정보 입력</b></div>', 1)
    text = text.replace('<div><b>2. 수강이력 입력</b><span>성적조회 PDF를 불러오거나, 여러 장의 캡처 OCR·강의 찾기·직접 입력으로 등록합니다.</span></div>',
                        '<div><b>2. 수강이력 입력</b></div>', 1)
    text = text.replace('<div><b>3. 결과 확인</b><span>졸업 인정학점·평점·종별 요건과 교원자격 이수현황을 확인합니다.</span></div>',
                        '<div><b>3. 결과 확인</b></div>', 1)

    # 수강이력 안내문구 간결화.
    old_callout = '''    <div class="callout">\n      과거에 이수한 과목은 최신 개설표에서 사라져도 <b>기록과 계산에 그대로 유지</b>됩니다.<br>\n      전공에 개설된 <b>전공교직 과목</b>은 교직 ↔ 전공선택으로 인정종별을 바꿀 수 있습니다(과목명 옆 표시).<br>\n      성적은 4.3 만점 기준 <b>C−(1.7) 이상만 이수로 인정</b>하며, <b>누적평점 3.00 이상</b>이 별도 졸업요건입니다.\n    </div>'''
    new_callout = '''    <div class="callout">\n      과거에 이수한 과목은 최신 개설표에서 사라져도 <b>계산에 반영</b>됩니다.<br>\n      <b>전공교직 과목</b>은 교직 ↔ 전공선택으로 종별을 바꿀 수 있습니다.<br>\n      성적은 4.3 만점 기준 <b>C−(1.7) 이상만 이수로 인정</b>하며, 졸업요건 평점은 <b>누적평점 3.00 이상</b>입니다.\n    </div>'''
    if old_callout in text:
        text = text.replace(old_callout, new_callout, 1)
    elif '과거에 이수한 과목은 최신 개설표에서 사라져도 <b>계산에 반영</b>됩니다.' not in text:
        raise RuntimeError('history guidance callout not found')

    # Planned-course table column heading.
    text = text.replace('<th>데이터 상태</th>', '<th>상태</th>', 1)

    write_if_changed(path, text)


def normalize_validator(app_version: str) -> None:
    path = ROOT / 'tests' / 'validate_packs.py'
    text = path.read_text(encoding='utf-8')
    text = text.replace(LEGACY_TYPO_TITLE, CORRECT_TITLE)
    text = re.sub(r"'styles\.css\?v=[0-9.]+'", f"'styles.css?v={app_version}'", text)
    text = re.sub(r"'app\.js\?v=[0-9.]+'", f"'app.js?v={app_version}'", text)

    checks = """check('cohort helper removed','id=\"cohortText\"' not in html and "getElementById('cohortText')" not in app)
check('quick guide descriptions removed','전공·입학학기·과정/졸업유형을 선택하고 기본정보를 확인합니다.' not in html and '성적조회 PDF를 불러오거나, 여러 장의 캡처 OCR' not in html)
check('history guidance wording','과거에 이수한 과목은 최신 개설표에서 사라져도 <b>계산에 반영</b>됩니다.' in html and '졸업요건 평점은 <b>누적평점 3.00 이상</b>입니다.' in html)
check('planned list ordering helper','function sortedPlannedRecords(records)' in app and 'sortedPlannedRecords(sc.planned)' in app and 'PLAN_LIST_CATEGORY_PRIORITY' in app)
"""
    if "check('cohort helper removed'" not in text:
        marker = "passed=sum(1 for _,ok,_ in checks if ok)"
        if marker not in text:
            raise RuntimeError('validator insertion marker not found')
        text = text.replace(marker, checks + '\n' + marker, 1)

    status_checks = """check('plan status header renamed','<th>데이터 상태</th>' not in html and '<th>상태</th>' in html)
check('planned status wording','>개설예정<' not in app and '<span class=\\\"badge planned\\\">예정</span>' not in app and '>개설 예정<' in app)
"""
    if "check('plan status header renamed'" not in text:
        marker = "passed=sum(1 for _,ok,_ in checks if ok)"
        if marker not in text:
            raise RuntimeError('validator insertion marker not found')
        text = text.replace(marker, status_checks + '\n' + marker, 1)

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
