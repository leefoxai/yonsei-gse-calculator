# Regression Test Report

- App version: **3.2.0**
- Generated: **2026-09-25 03:47 UTC**
- Data/markup validation: **98/98 checks passed**
- Application regression: **14/14 passed**
- JavaScript syntax (`node --check app.js`): **PASS**

## Data pack metadata

| File | Schema | Pack version | App version | Snapshot | Source data updated | Metadata updated |
| --- | ---: | --- | --- | --- | --- | --- |
| data-pack.json | 1 | 2026-2.1 | 3.2.0 | 2026-2 | 2026-09-18T13:44:00+09:00 | 2026-09-25 |
| rules-pack.json | 1 | 2026-2.1 | 3.2.0 | 2026-2 | 2026-09-18T13:44:00+09:00 | 2026-09-25 |
| certificate-rules.json | 1 | 2026-2.2 | 3.2.0 | 2026-2 | 2026-09-18T13:44:00+09:00 | 2026-09-25 |

## Data / markup validation

```text
Validation: 98/98 checks passed
PASS - public admin UI removed 
PASS - public local override disabled 
PASS - cache bypass enabled 
PASS - client regression suite present 
PASS - data pack type 
PASS - rules pack type 
PASS - cert pack type 
PASS - snapshot一致 ({'2026-2'})
PASS - app version detectable (3.2.0)
PASS - footer version sync 
PASS - gap status vocabulary confirmed scheduled 
PASS - five-term timetable accordion 
PASS - timetable independent from plan dropdown 
PASS - confirmed timetable default open 
PASS - timetable status badges removed 
PASS - pack appVersion sync (['3.2.0', '3.2.0', '3.2.0'])
PASS - packVersion metadata (['2026-2.1', '2026-2.1', '2026-2.2'])
PASS - packVersion snapshot prefix (['2026-2.1', '2026-2.1', '2026-2.2'])
PASS - pack compatibility metadata (['>=3.0.0', '>=3.0.0', '>=3.0.0'])
PASS - course rows >=650 (654)
PASS - course row core fields valid (invalid=0)
PASS - no exact duplicate course rows (0)
PASS - OLD/NEW cohorts 
PASS - NEW thesis 30 
PASS - NEW report 30 
PASS - NEW research 12 
PASS - common 3 courses 
PASS - 13 certificate majors (13)
PASS - education admin excluded 
PASS - English SEE6591 pedagogy 
PASS - English SEE6505 basic 
PASS - counselor 2026 min7 
PASS - counselor 2026 group13 required 
PASS - integrated science min9 
PASS - regular 2/6 
PASS - capstone 3/9 
PASS - prereq base 2 
PASS - prereq 2024+ 3-5 one-time max3 
PASS - common 1/4 
PASS - teacher common mandatory 2x 
PASS - teacher common includes existing license 
PASS - counselor1 pre-admission experience 3y 
PASS - PDF-first OCR helper present 
PASS - modular css linked 
PASS - modular js linked 
PASS - eager OCR/PDF/XLSX removed 
PASS - lazy loaders present 
PASS - result action summary present 
PASS - gap candidates present 
PASS - offering pattern present 
PASS - ocr canvas release present 
PASS - integrated analysis and optional catalog 
PASS - field confidence present 
PASS - gap term tabs present 
PASS - gap tabs distinguish confirmed/scheduled 
PASS - gap add carries selected term 
PASS - special courses separated 
PASS - gap candidate category priority 
PASS - category priority order 
PASS - mobile catalog plan add 
PASS - zero-term display preserved 
PASS - comparison program pre-admission migrates to zero term 
PASS - history accepts zero term 
PASS - test title applied 
PASS - category filter exact order 
PASS - audit label simplified 
PASS - unique element IDs ([])
PASS - resultDetailsPanel in analysis workspace 
PASS - resultDetailsPanel initially open 
PASS - planSection in analysis workspace 
PASS - planSection initially open 
PASS - teacher checklist initially open 
PASS - scenario controls belong to plan 
PASS - compact scenario controls 
PASS - current sheet delete control 
PASS - gap candidates precede plan builder 
PASS - backup outside optional catalog 
PASS - cohort helper removed 
PASS - quick guide descriptions removed 
PASS - history guidance wording 
PASS - planned list ordering helper 
PASS - plan status header renamed 
PASS - planned status wording 
PASS - 국어 기본이수 8번 교과교육 과대산입 방지 ({'SKE6594', 'SKE6595'})
PASS - 역사 기본이수 6번 교과교육 과대산입 방지 ({'SHE6547', 'SHE6536', 'SHE6535'})
PASS - 통합과학 기본이수 13번 교과교육 과대산입 방지 ({'SGS6803', 'SGS6833'})
PASS - 전문상담1급 10과목 구조 ({'type': 'groups', 'requiredGroups': [2, 3, 4, 5, 6, 7, 8, 18], 'choiceGroups': [{'groups': [16, 17, 19, 20, 21], 'min': 2}], 'minGroups': 10, 'minCredits': 0, 'sourceNote': '연세대학교 교육대학원 전문상담교사 1급 안내: 필수 7과목 + 상담실습및사례연구 1과목 + 선택 2과목 이상. 관리번호 18은 필수 실습으로 선택 2과목에 중복 산입하지 않음.'})
PASS - 전문상담1급 실습 중복선택 방지 ([{'groups': [16, 17, 19, 20, 21], 'min': 2}])
PASS - 전문상담2급 2026학번 7과목/13필수 ({'type': 'groups', 'minGroups': 7, 'minCredits': 14, 'requiredGroups': [13], 'choiceGroups': [], 'sourceNote': '2026학번부터 상담실습(관리번호 13) 필수 + 기본이수과목 6과목 이상, 총 7과목 이상'})
PASS - plan forecast uncertainty notice 
PASS - requirement evidence drilldown 
PASS - teacher evidence drilldown 
PASS - plan add toggle open by default 
PASS - all disclosure toggles aligned left 
PASS - plan weekday priority Mon Tue Thu 
PASS - action summary navigates to relevant inputs 
PASS - print controls scoped 
PASS - four-step footer wording
```

## Application regression

```text
PASS - All plans: 24 current credits, 30 projected credits, current GPA only
PASS - Selected mode starts with no implicit semester; checkbox changes recompute results
PASS - Selection survives save/reload and old backups default to all plans
PASS - Only the active scenario is projected; a stale selection adds no courses
PASS - Duplicate planned course does not double count; failed history can be planned again
PASS - Teacher current/projected values and summary use the same three states
PASS - Teacher score cards explain thresholds; failing scores remain in action items
PASS - Comprehensive and English exam edits refresh the action summary immediately
PASS - Teacher non-course checkbox edits refresh the action summary immediately
PASS - Planned credits never imply a passing future GPA
PASS - A planned teaching practicum is labelled planned, not already completed
PASS - Counselor certificate variant edits refresh eligibility actions
PASS - Steps open on entry, including saved sessions; edits preserve manual folding
PASS - Navigation opens the plan and its ancestor, never the unrelated catalog
Application regression: 14/14 passed
```

> This file is generated by GitHub Actions. Do not maintain pass counts manually.
