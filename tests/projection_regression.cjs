// Run with: node tests/projection_regression.cjs
// Executes the application against a minimal DOM; this is not a layout test.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const nodes = new Map(), storage = new Map();
function element(id = '') {
  return {id, value: '', innerHTML: '', textContent: '', style: {}, dataset: {},
    checked: false, open: true, options: [], files: [],
    classList: {add() {}, remove() {}, toggle() {}, contains() {return false;}},
    addEventListener() {}, querySelectorAll() {return [];}, querySelector() {return null;},
    setAttribute() {}, removeAttribute() {}, scrollIntoView() {}, focus() {}};
}
const document = {
  getElementById(id) {if (!nodes.has(id)) nodes.set(id, element(id)); return nodes.get(id);},
  querySelectorAll() {return [];}, querySelector() {return null;},
  addEventListener() {}, createElement: element, body: element('body')
};
const context = vm.createContext({document, console, setTimeout, clearTimeout,
  window: {addEventListener() {}, scrollTo() {}},
  localStorage: {getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k)},
  alert: message => {throw new Error(message);}, confirm: () => true,
  fetch: async () => {throw new Error('Unexpected network request in regression test');}
});
const run = code => vm.runInContext(code, context);
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
run(source.replace(/\nbootApplication\(\);\s*$/, '\n'));
context.packs = Object.fromEntries(['data-pack.json', 'rules-pack.json', 'certificate-rules.json'].map(file => [file, JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))]));
run("DATA=packs['data-pack.json'].data;RULES=packs['rules-pack.json'].rules;CERT_RULES=packs['certificate-rules.json'];");
function setup() {
  run(`state=defaultState();state.profile.major='영어교육';state.profile.admissionTerm='2025-1';state.profileConfirmed=true;
    state.graduationChecklist={comprehensivePassed:2,englishStatus:'passed'};
    state.history=[];
    for(const [category,count] of [['teaching',2],['major_required',2],['major_elective',3],['report',1],['common',3]]){
      for(let i=0;i<count;i++)state.history.push({id:category+i,courseCode:category+i,courseName:category+i,term:'2026-1',category,credits:category==='common'?0:3,grade:category==='common'?'P':'A0',passed:true});
    }
    currentScenario().planned=[{id:'p1',courseCode:'PLAN1001',courseName:'계획1',category:'major_elective',credits:3,term:'2026-2'},{id:'p2',courseCode:'PLAN1002',courseName:'계획2',category:'major_elective',credits:3,term:'2027-1'}];
    fillStaticControls();render();`);
}
function teacherSetup() {
  setup();
  run(`state.profile.wantsTeacherCertificate=true;state.profile.hasTeacherLicense=true;
    Object.assign(state.teacherChecklist,{relatedMajorConfirmed:true,applicationSubmitted:true,recognizedMajorCredits:29,recognizedPedagogyCredits:6,basicCourseCount:5,basicCredits:14,teachingAverage100:80,majorAverage100:75,aptitudeCount:2,cprCount:2,genderCount:2,noExamSubmitted:true,drugCertificateSubmitted:true});render();`);
}
const html = id => document.getElementById(id).innerHTML;
function change(id, value) {const el = document.getElementById(id);el.value=value;el.onchange({target:el});}
let passed=0;
function test(name, body) {body();passed++;console.log('PASS - '+name);}

test('All plans: 24 current credits, 30 projected credits, current GPA only', () => {
  setup();
  assert.equal(run('evaluateBoth().current.totalCredits'),24);
  assert.equal(run('evaluateBoth().projected.totalCredits'),30);
  assert.equal(run('evaluateBoth().projected.complete'),true);
  assert.match(html('kpiGrid'), /2027-1학기 이수 후 충족/);
  assert.doesNotMatch(html('resultPrimarySummary'), /result-headline-card/);
  assert.match(html('resultPrimarySummary'), /next-actions-card/);
  assert.match(html('evaluationNotes'), /2027-1학기 이수 후 학점 요건 충족 \/ 현재 누적평점 기준 충족/);
  assert.doesNotMatch(html('evaluationNotes'), /이번 학기|학점·평점 이수요건 충족/);
  assert.match(html('requirementsGrid'), /성적 확정 후 확인/);
});
test('Selected mode starts with no implicit semester; checkbox changes recompute results', () => {
  document.getElementById('projectionControls').onchange({target:{name:'projectionMode',value:'selected'}});
  assert.equal(run('evaluateBoth().projected.totalCredits'),24);
  document.getElementById('projectionControls').onchange({target:{dataset:{projectionTerm:'2026-2'},checked:true}});
  assert.equal(run('evaluateBoth().projected.totalCredits'),27);
  assert.equal(run('evaluateBoth().projected.complete'),false);
  assert.match(html('evaluationNotes'), /\(선택\) 계획 이수 후 학점 요건 미충족/);
  document.getElementById('projectionControls').onchange({target:{dataset:{projectionTerm:'2027-1'},checked:true}});
  assert.equal(run('evaluateBoth().projected.totalCredits'),30);
  assert.match(html('evaluationNotes'), /학점 요건 충족/);
  document.getElementById('projectionControls').onchange({target:{dataset:{projectionTerm:'2026-2'},checked:false}});
  assert.equal(run('evaluateBoth().projected.totalCredits'),27);
});
test('Selection survives save/reload and old backups default to all plans', () => {
  run('save();state=load();');
  assert.equal(run('projectionSettings().mode'),'selected');
  assert.equal(run('projectionPlannedRecords().length'),1);
  run('delete state.projection;state=migrateImportedState(state);');
  assert.equal(run('projectionSettings().mode'),'all');
  assert.equal(run('projectionPlannedRecords().length'),2);
});
test('Only the active scenario is projected; a stale selection adds no courses', () => {
  setup();
  run("state.scenarios.push({id:'other',name:'다른 계획',planned:[]});state.activeScenarioId='other';state.projection={mode:'selected',terms:['2027-1']};render();");
  assert.equal(run('evaluateBoth().projected.totalCredits'),24);
  assert.match(html('projectionControls'), /반영할 계획이 없어/);
});
test('Duplicate planned course does not double count; failed history can be planned again', () => {
  setup();
  run('currentScenario().planned.push({...state.history[0],term:"2027-1"});');
  assert.equal(run('evaluateBoth().projected.totalCredits'),30);
  run('state.history[0].passed=false;');
  assert.equal(run('evaluateBoth().current.totalCredits'),21);
  assert.equal(run('evaluateBoth().projected.totalCredits'),30);
});
test('Teacher current/projected values and summary use the same three states', () => {
  teacherSetup();
  assert.match(html('teacherChecklistAuto'), /44 \/ 50학점/);
  assert.match(html('teacherChecklistAuto'), /50 \/ 50학점/);
  assert.match(html('teacherChecklistSummary'), /교과목·학점 요건 · 계획 이수 후 충족/);
  run("state.projection={mode:'selected',terms:['2026-2']};render();");
  assert.match(html('teacherChecklistAuto'), /47 \/ 50학점/);
  assert.match(html('teacherChecklistSummary'), /교과목·학점 요건 · 미충족/);
  change('teacherRecognizedMajorCredits',35);
  assert.match(html('teacherChecklistSummary'), /교과목·학점 요건 · 충족/);
  assert.doesNotMatch(html('resultPrimarySummary'), /교원자격 전공학점 .*추가/);
});
test('Teacher score cards explain thresholds; failing scores remain in action items', () => {
  teacherSetup();
  change('teacherTeachingAverage100',70);
  change('teacherMajorAverage100',70);
  assert.match(html('teacherChecklistAuto'), /100점 만점 80점 이상/);
  assert.match(html('teacherChecklistAuto'), /100점 만점 75점 이상/);
  assert.match(html('teacherChecklistAuto'), /기준보다 10.00점 부족/);
  assert.match(html('resultPrimarySummary'), /교직 평균성적 기준 미달/);
  assert.match(html('resultPrimarySummary'), /전공 평균성적 기준 미달/);
  change('teacherTeachingAverage100',80);change('teacherMajorAverage100',75);
  assert.doesNotMatch(html('resultPrimarySummary'), /평균성적 기준 미달/);
  change('teacherMajorAverage100','');
  assert.match(html('teacherChecklistAuto'), /미입력/);
  assert.match(html('resultPrimarySummary'), /전공 평균성적 입력·확인/);
});
test('Comprehensive and English exam edits refresh the action summary immediately', () => {
  setup();
  change('graduationComprehensivePassed',0);
  assert.match(html('resultPrimarySummary'), /종합시험 2과목 합격 확인/);
  change('graduationComprehensivePassed',2);
  assert.doesNotMatch(html('resultPrimarySummary'), /종합시험 2과목 합격 확인/);
  change('graduationEnglishStatus','pending');
  assert.match(html('resultPrimarySummary'), /전공영어시험 합격 또는/);
  change('graduationEnglishStatus','replaced');
  assert.doesNotMatch(html('resultPrimarySummary'), /전공영어시험 합격 또는/);
});
test('Teacher non-course checkbox edits refresh the action summary immediately', () => {
  teacherSetup();
  const el=document.getElementById('teacherNoExamSubmitted');
  el.checked=false;el.onchange();
  assert.match(html('resultPrimarySummary'), /교원자격무시험검정원서 제출 확인/);
  el.checked=true;el.onchange();
  assert.doesNotMatch(html('resultPrimarySummary'), /교원자격무시험검정원서 제출 확인/);
});
test('Planned credits never imply a passing future GPA', () => {
  setup();
  run("state.history.forEach(r=>{if(r.credits)r.grade='C0';});render();");
  assert.match(html('evaluationNotes'), /학점 요건 충족 \/ 현재 누적평점 기준 미충족/);
  assert.match(html('resultPrimarySummary'), /누적평점 3.00 이상 필요/);
  run("state.history.forEach(r=>{if(r.credits)r.grade='';});render();");
  assert.match(html('evaluationNotes'), /현재 누적평점 확인 필요/);
  assert.match(html('resultPrimarySummary'), /성적 미입력 과목 확인/);
});
test('A planned teaching practicum is labelled planned, not already completed', () => {
  teacherSetup();
  run(`state.profile.hasTeacherLicense=false;
    currentScenario().planned.push({id:'practice',courseCode:'SPT9001',courseName:'교육실습',category:'prerequisite',credits:2,term:'2027-1'});render();`);
  const cards=html('teacherChecklistAuto');
  const practice=cards.slice(cards.indexOf('학교현장실습'),cards.indexOf('교육봉사'));
  assert.match(practice,/계획 이수 후 충족/);
  assert.match(practice,/미이수/);
  assert.equal(run('teacherRequirementModel(state.history).practiceSatisfied'),false);
  assert.equal(run('teacherRequirementModel(planCombinedRecords()).practiceSatisfied'),true);
});
test('Counselor certificate variant edits refresh eligibility actions', () => {
  setup();
  run("state.profile.major='상담교육';state.profile.wantsTeacherCertificate=true;render();");
  const el=document.getElementById('teacherCertificateVariantSelect');
  el.onchange({target:{value:'counselor1'}});
  assert.ok(run("graduationActionItems().some(x=>x.text.includes('전문상담교사 1급 기존자격'))"));
  assert.match(html('resultPrimarySummary'),/전문상담교사 1급 기존자격/);
  document.getElementById('teacherCertificateVariantSelect').onchange({target:{value:'counselor2'}});
  assert.doesNotMatch(html('resultPrimarySummary'),/전문상담교사 1급 기존자격/);
});
test('Steps open on entry, including saved sessions; edits preserve manual folding', () => {
  run('state=defaultState();delete window.__prevProfileConfirmed;delete window.__prevAnalysisReady;renderUxState();');
  assert.equal(document.getElementById('inputZone').open,true);
  assert.equal(document.getElementById('historySection').open,false);
  run('state.profileConfirmed=true;renderUxState();');
  assert.equal(document.getElementById('historySection').open,true);
  run("state.history.push({courseName:'테스트',category:'common',credits:0,passed:true});renderUxState();");
  for(const id of ['analysisZone','resultDetailsPanel','planSection','teacherChecklistSection','graduationChecklistSection']) {
    assert.equal(document.getElementById(id).open,true,id);
    document.getElementById(id).open=false;
  }
  run('renderUxState();');
  for(const id of ['analysisZone','resultDetailsPanel','planSection'])assert.equal(document.getElementById(id).open,false,id);
  run('delete window.__prevProfileConfirmed;delete window.__prevAnalysisReady;renderUxState();');
  for(const id of ['historySection','analysisZone','resultDetailsPanel','planSection'])assert.equal(document.getElementById(id).open,true,id);
});
test('Navigation opens the plan and its ancestor, never the unrelated catalog', () => {
  const plan=document.getElementById('planSection'),analysis=document.getElementById('analysisZone'),extras=document.getElementById('extraFeatures');
  plan.tagName=analysis.tagName='DETAILS';plan.parentElement=analysis;
  plan.open=analysis.open=extras.open=false;
  run("openWorkflowTarget('planSection');");
  assert.equal(plan.open,true);assert.equal(analysis.open,true);assert.equal(extras.open,false);
  const input=document.getElementById('inputZone');input.tagName='DETAILS';input.open=false;plan.open=false;
  run("state.profileConfirmed=false;openWorkflowTarget('planSection');");
  assert.equal(input.open,true);assert.equal(plan.open,false);
});
console.log(`Application regression: ${passed}/${passed} passed`);
