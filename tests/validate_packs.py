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
data=load('data-pack.json'); rules=load('rules-pack.json'); cert=load('certificate-rules.json')
check('public admin UI removed','id="dataUpdateSection"' not in html)
check('public local override disabled','const ALLOW_LOCAL_PACK_OVERRIDES = false;' in html)
check('cache bypass enabled',"cache:'no-store'" in html and 'Date.now()' in html)
check('client regression suite present','function runDeterministicSelfTests()' in html and '동일 학정번호 중복 감지' in html)
check('data pack type',data.get('packType')=='yonsei-gse-data')
check('rules pack type',rules.get('packType')=='yonsei-gse-rules')
check('cert pack type',cert.get('packType')=='yonsei-gse-certificate-rules')
snapshots={data.get('snapshot'),rules.get('snapshot'),cert.get('snapshot')}
check('snapshot一致',len(snapshots)==1 and None not in snapshots,str(snapshots))
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
check('PDF-first OCR helper present',"portalPdfPreferDirect('credit',r.pdfCredits,ocrCredit)" in html and 'pdfCredits:creditMatch?Number(creditMatch[0]):null' in html)

passed=sum(1 for _,ok,_ in checks if ok)
print(f'Validation: {passed}/{len(checks)} checks passed')
for name,ok,detail in checks:
    print(('PASS' if ok else 'FAIL'),'-',name,(f'({detail})' if detail else ''))
if errors:
    print('\nFAILED:')
    for e in errors: print('-',e)
    sys.exit(1)
