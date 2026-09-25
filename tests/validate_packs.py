#!/usr/bin/env python3
from pathlib import Path
import json, re, sys

ROOT=Path(__file__).resolve().parents[1]
errors=[]; checks=[]
def check(name, cond, detail=''):
    checks.append((name,bool(cond),detail))
    if not cond: errors.append(f'{name}: {detail}')

def load(name):
    try: return json.loads((ROOT/name).read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'{name} load failed: {e}'); return {}

html=(ROOT/'index.html').read_text(encoding='utf-8')
app=(ROOT/'app.js').read_text(encoding='utf-8')
css=(ROOT/'styles.css').read_text(encoding='utf-8')
data=load('data-pack.json'); rules=load('rules-pack.json'); cert=load('certificate-rules.json')
check('public admin UI removed','id="dataUpdateSection"' not in html)
check('public local override disabled','const ALLOW_LOCAL_PACK_OVERRIDES = false;' in app)
check('cache bypass enabled',"cache:'no-store'" in app and 'Date.now()' in app)
check('client regression suite present','function runDeterministicSelfTests()' in app and '동일 학정번호 중복 감지' in app)
check('data pack type',data.get('packType')=='yonsei-gse-data')
check('rules pack type',rules.get('packType')=='yonsei-gse-rules')
check('cert pack type',cert.get('packType')=='yonsei-gse-certificate-rules')
snapshots={data.get('snapshot'),rules.get('snapshot'),cert.get('snapshot')}
check('snapshot一致',len(snapshots)==1 and None not in snapshots,str(snapshots))
app_version_match=re.search(r"const APP_VERSION = '([^']+)';",app)
app_version=app_version_match.group(1) if app_version_match else ''
check('app version detectable',bool(app_version),app_version)
check('footer version sync',f'<b>v{app_version}:</b>' in html)
check('gap status vocabulary confirmed scheduled',"function gapTermKind(term){return term===DATA.snapshot?'확정':'예정';}" in app)
check('five-term timetable accordion','plan-term-schedule' in app and 'gapCandidateTerms()' in app and 'plan-term-schedules' in css)
check('timetable independent from plan dropdown',"const terms=gapCandidateTerms();" in app and "activePlanTimetableTerm||DATA.snapshot" in app)
check('confirmed timetable default open','openPlanTimetableTerms.add(DATA.snapshot)' in app)
check('timetable status badges removed','plan-term-status' not in app)

check('pack appVersion sync',all(p.get('appVersion')==app_version for p in (data,rules,cert)),str([p.get('appVersion') for p in (data,rules,cert)]))
check('packVersion metadata',all(bool(p.get('packVersion')) for p in (data,rules,cert)),str([p.get('packVersion') for p in (data,rules,cert)]))
check('packVersion snapshot prefix',all(str(p.get('packVersion','')).startswith(str(p.get('snapshot',''))+'.') for p in (data,rules,cert)),str([p.get('packVersion') for p in (data,rules,cert)]))
check('pack compatibility metadata',all(bool(p.get('compatibleAppVersion')) for p in (data,rules,cert)),str([p.get('compatibleAppVersion') for p in (data,rules,cert)]))

D=data.get('data',{})
rows=list(D.get('offerings',[]))+list(D.get('globalOfferings',[]))+list(D.get('specialCourses',[]))
check('course rows >=650',len(rows)>=650,str(len(rows)))
invalid=[]
for i,r in enumerate(rows):
    name=str(r.get('courseName','')).strip(); code=str(r.get('courseCode','')).strip()
    planned_placeholder=(r.get('availability')=='planned' and name.startswith('외 '))
    if not name or (not code and not planned_placeholder): invalid.append(i)
    try:
        c=float(r.get('credits',0))
        if c<0 or c>9: invalid.append(i)
    except: invalid.append(i)
check('course row core fields valid',not invalid,f'invalid={len(set(invalid))}')
# exact duplicate rows only (multiple sections remain legal)
seen=set(); dup=0
for r in rows:
    k=(str(r.get('major','')),str(r.get('term','')),str(r.get('courseCode','')),str(r.get('courseName','')),str(r.get('professor','')),str(r.get('day','')),str(r.get('timeRaw','')),str(r.get('room','')),str(r.get('sectionTitle','')),tuple(r.get('sectionCodes',[]) or []))
    if k in seen: dup+=1
    seen.add(k)
check('no exact duplicate course rows',dup==0,str(dup))
R=rules.get('rules',{})
coh={c.get('id'):c for c in R.get('cohorts',[])}
check('OLD/NEW cohorts',{'OLD','NEW'} <= set(coh))
new=coh.get('NEW',{})
check('NEW thesis 30',new.get('tracks',{}).get('thesis',{}).get('totalCredits')==30)
check('NEW report 30',new.get('tracks',{}).get('report',{}).get('totalCredits')==30)
check('NEW research 12',new.get('tracks',{}).get('research',{}).get('totalCredits')==12)
check('common 3 courses',R.get('commonRequirement',{}).get('min')==3)
M=cert.get('majors',{})
check('13 certificate majors',len(M)==13,str(len(M)))
check('education admin excluded','교육행정' not in M)
eng=M.get('영어교육',{}).get('variants',[{}])[0]
check('English SEE6591 pedagogy',any(x.get('code')=='SEE6591' for x in eng.get('pedagogyCourses',[])))
check('English SEE6505 basic',any(any(c.get('code')=='SEE6505' for c in g.get('courses',[])) for g in eng.get('groups',[])))
cv=next((x for x in M.get('상담교육',{}).get('variants',[]) if x.get('id')=='counselor2'),{})
r26=next((x.get('basicRule',{}) for x in cv.get('rulesByAdmission',[]) if x.get('from')=='2026-1'),{})
check('counselor 2026 min7',r26.get('minGroups')==7)
check('counselor 2026 group13 required',13 in r26.get('requiredGroups',[]))
science=M.get('통합과학교육',{}).get('variants',[{}])[0].get('basicRule',{})
check('integrated science min9',science.get('minGroups')==9)
limits=cert.get('planLimits',{})
check('regular 2/6',limits.get('regular')=={'maxCourses':2,'maxCredits':6})
check('capstone 3/9',limits.get('capstoneSemester')=={'maxCourses':3,'maxCredits':9})
check('prereq base 2',limits.get('prerequisite',{}).get('maxCoursesPerTerm')==2)
pex=limits.get('prerequisite',{}).get('exception',{})
check('prereq 2024+ 3-5 one-time max3',pex.get('admissionFrom')=='2024-1' and pex.get('fromSemester')==3 and pex.get('toSemester')==5 and pex.get('maxCourses')==3 and pex.get('maxUses')==1)
check('common 1/4',limits.get('common',{}).get('maxCoursesPerTerm')==1 and limits.get('common',{}).get('maxCoursesTotal')==4)

common=cert.get('commonMandatory',{})
check('teacher common mandatory 2x',common.get('aptitudeCount')==2 and common.get('cprCount')==2 and common.get('genderCount')==2)
check('teacher common includes existing license',common.get('appliesToExistingLicenseHolders') is True)
c1=next((x for x in M.get('상담교육',{}).get('variants',[]) if x.get('id')=='counselor1'),{})
check('counselor1 pre-admission experience 3y',c1.get('eligibility',{}).get('minPreAdmissionTeachingYears')==3 and c1.get('eligibility',{}).get('experienceMustBeBeforeAdmission') is True)
check('PDF-first OCR helper present',"portalPdfPreferDirect('credit',r.pdfCredits,ocrCredit)" in app and 'pdfCredits:creditMatch?Number(creditMatch[0]):null' in app)

check('modular css linked','styles.css?v=3.3.1' in html)
check('modular js linked','app.js?v=3.3.1' in html)
check('eager OCR/PDF/XLSX removed','tesseract.min.js' not in html and 'pdf.min.js' not in html and 'xlsx.full.min.js' not in html)
check('lazy loaders present','ensurePdfJsLib' in app and 'ensureTesseractLib' in app and 'ensureXlsxLib' in app)
check('result action summary present','function renderActionSummary()' in app and 'id="resultPrimarySummary"' in html)
check('gap candidates present','function renderGapCandidates()' in app and 'id="planGapCandidates"' in html)
check('offering pattern present','function courseOfferingPattern(' in app and '개설계획 수록 학기' in app)
check('ocr canvas release present','releaseCanvas(prepared)' in app and 'pageCache.clear()' in app)
check('integrated analysis and optional catalog','id="analysisWorkspace"' in html and 'id="extraFeatures"' in html and '개설정보 더 보기' in html)
check('field confidence present','function fieldConfidenceHtml(' in app and '.field-confidence' in css)

check('gap term tabs present','function gapCandidateTerms()' in app and 'data-gap-term' in app and '.gap-term-tabs' in css)
check('gap tabs distinguish confirmed/scheduled',"gapTermKind(term){return term===DATA.snapshot?'확정':'예정';}" in app)
check('gap add carries selected term','const [term,code,name,category]=raw.split' in app and 'gapCandidateTerm=targetTerm' in app)
check('special courses separated','학기별 개설표와 별도로 관리되는 요건 과목' in app)

check('gap candidate category priority',"gapPriority={major_required:0,major_elective:1,teaching:2,common:3}" in app)
check('category priority order',"const CATEGORY_OPTIONS = ['major_required','major_elective','teaching','common','prerequisite'" in app)
check('mobile catalog plan add','data-offering-plan' in app and 'catalog-plan-btn' in css and '<th>계획</th>' in html)

check('zero-term display preserved',"isZeroAcademicTerm(s)" in app and "return s;" in app)
check('comparison program pre-admission migrates to zero term',"normalizeComparisonProgramTerm" in app and "SPG6658" in app and "comparisonProgramZeroTerm" in app)
check('history accepts zero term',"validHistoryTermValue" in app and "[012]" in app)
check('test title applied',"연세대학교 교육대학원 졸업요건 이수현황 계산기" in html and "연세대학교 교육대학원 졸업요건 이수현황 계산기" in app)

check('category filter exact order',"const ordered=['major_required','major_elective','teaching','common','prerequisite','report','thesis','research_guidance']" in app and '<option value="lifelong">평생교육사</option>' in app)
check('audit label simplified',"audit:'청강'" in app)

from html.parser import HTMLParser
class WorkflowMarkup(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]; self.nodes={}; self.duplicates=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs); ident=attrs.get('id'); ancestors=[item[1] for item in self.stack if item[1]]
        if ident:
            if ident in self.nodes: self.duplicates.append(ident)
            self.nodes[ident]={'ancestors':ancestors, 'open':'open' in attrs}
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:
            self.stack.append((tag,ident))
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag:
                self.stack=self.stack[:i]; break
markup=WorkflowMarkup(); markup.feed(html)
check('unique element IDs',not markup.duplicates,str(markup.duplicates))
for ident in ['resultDetailsPanel','planSection']:
    check(ident+' in analysis workspace',markup.nodes[ident]['ancestors'][-2:]==['analysisZone','analysisWorkspace'])
    check(ident+' initially open',markup.nodes[ident]['open'])
check('teacher checklist initially open',markup.nodes['teacherChecklistSection']['open'])
check('scenario controls belong to plan','planSection' in markup.nodes['scenarioTabs']['ancestors'])
check('compact scenario controls', 'class="plan-scenario-inline no-print"' in html and 'id="renameScenario"' in html and 'id="addScenario"' in html)
check('current sheet delete control', 'id="deleteScenario"' in html and '>현재 시트 삭제<' in html)
check('gap candidates precede plan builder', html.find('id="planGapCandidates"') < html.find('class="plan-builder"'))
check('backup outside optional catalog','extraFeatures' not in markup.nodes['exportData']['ancestors'])

check('cohort helper removed','id="cohortText"' not in html and "getElementById('cohortText')" not in app)
check('quick guide descriptions removed','전공·입학학기·과정/졸업유형을 선택하고 기본정보를 확인합니다.' not in html and '성적조회 PDF를 불러오거나, 여러 장의 캡처 OCR' not in html)
check('history guidance wording','과거에 이수한 과목은 최신 개설표에서 사라져도 <b>계산에 반영</b>됩니다.' in html and '졸업요건 평점은 <b>누적평점 3.00 이상</b>입니다.' in html)
check('planned list ordering helper','function sortedPlannedRecords(records)' in app and 'sortedPlannedRecords(sc.planned)' in app and 'PLAN_LIST_CATEGORY_PRIORITY' in app)
check('plan status header renamed','<th>데이터 상태</th>' not in html and '<th>상태</th>' in html)
check('planned status wording','>개설예정<' not in app and '<span class=\"badge planned\">예정</span>' not in app and '>개설 예정<' in app)

# Official teacher-certificate audit (2026-06-17 table + current Yonsei GSE counselor guide)
def _variant(major, vid=None):
    vs=cert.get('majors',{}).get(major,{}).get('variants',[])
    return next((v for v in vs if vid is None or v.get('id')==vid),{})
def _group(v,no):
    return next((g for g in v.get('groups',[]) if int(g.get('no',-1))==no),{})
def _codes(v,no):
    return {c.get('code') for c in _group(v,no).get('courses',[])}
check('국어 기본이수 8번 교과교육 과대산입 방지',_codes(_variant('국어교육'),8)=={'SKE6594','SKE6595'},str(_codes(_variant('국어교육'),8)))
check('역사 기본이수 6번 교과교육 과대산입 방지',_codes(_variant('역사교육'),6)=={'SHE6535','SHE6536','SHE6547'},str(_codes(_variant('역사교육'),6)))
check('통합과학 기본이수 13번 교과교육 과대산입 방지',_codes(_variant('통합과학교육'),13)=={'SGS6833','SGS6803'},str(_codes(_variant('통합과학교육'),13)))
c1=_variant('상담교육','counselor1'); c1br=c1.get('basicRule',{})
check('전문상담1급 10과목 구조',int(c1br.get('minGroups',0))==10 and set(c1br.get('requiredGroups',[]))=={2,3,4,5,6,7,8,18},str(c1br))
check('전문상담1급 실습 중복선택 방지',c1br.get('choiceGroups',[{}])[0].get('groups')==[16,17,19,20,21] and int(c1br.get('choiceGroups',[{}])[0].get('min',0))==2,str(c1br.get('choiceGroups')))
c2=_variant('상담교육','counselor2'); c2r=next((r.get('basicRule',{}) for r in c2.get('rulesByAdmission',[]) if r.get('from')=='2026-1'),{})
check('전문상담2급 2026학번 7과목/13필수',int(c2r.get('minGroups',0))==7 and 13 in c2r.get('requiredGroups',[]),str(c2r))

check('plan forecast uncertainty notice','id="planForecastNotice"' in html and '수강신청 전 실제 시간표를 반드시 확인' in html)
check('requirement evidence drilldown','function requirementEvidenceHtml(' in app and 'kpi-evidence' in css and '인정·계획 과목' in app)
check('teacher evidence drilldown','id="teacherEvidenceDetails"' in html and 'function teacherEvidenceHtml(' in app and 'teacher-evidence-details' in css)

check('plan add toggle open by default','id="planAddSection" open' in html and 'plan-builder-toggle' in css)

check('all disclosure toggles aligned left',"details > summary::before" in css and "details > summary::after" in css and "content:none!important" in css)

check('plan weekday priority Mon Tue Thu',"const dayOrder={월:0,화:1,목:2,수:3,금:4,토:5,일:6};" in app)

check('action summary navigates to relevant inputs',"function actionNavigationTarget(action)" in app and "data-action-index" in app and "graduationComprehensivePassed" in app and "teacherAptitudeCount" in app and ".next-action.actionable" in css and "actionTargetFlash" in css)
check('print controls scoped','#planAddSection{display:none!important}' in css and '.no-print-ui{display:none!important}' not in css and 'class=\"input-zone no-print-ui' not in html)
check('four-step footer wording','4단계 사용흐름' in html and '3단계 사용흐름' not in html)

check('result summary print cleanup','#resultPrimarySummary{display:none!important}' in css and 'result-headline-card' not in re.search(r'function renderActionSummary\(\).*?\n}',app,re.S).group(0))

mobile=(ROOT/'mobile.js').read_text(encoding='utf-8') if (ROOT/'mobile.js').exists() else ''
check('mobile presentation layer','mobile.js?v=' in html and 'mobile-mode' in mobile and 'mobileImportGuide' in html and 'mobileHistoryCards' in mobile and 'mobilePlanCards' in mobile and 'mobilePlanCoursePicker' in mobile)
check('mobile import guide routes','data-mobile-import-pane=\"pdfImportPane\"' in html and 'data-mobile-import-pane=\"ocrImportPane\"' in html)

passed=sum(1 for _,ok,_ in checks if ok)
print(f'Validation: {passed}/{len(checks)} checks passed')
for name,ok,detail in checks:
    print(('PASS' if ok else 'FAIL'),'-',name,(f'({detail})' if detail else ''))
if errors:
    print('\nFAILED:')
    for e in errors: print('-',e)
    sys.exit(1)
