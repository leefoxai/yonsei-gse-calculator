const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'academic-fixes.js'), 'utf8');

const elements = new Map();
function element(id = '') {
  return {
    id,
    value: '',
    innerHTML: '',
    className: '',
    parentElement: null,
    remove() { elements.delete(id); },
    insertAdjacentElement(_where, child) { elements.set(child.id, child); child.parentElement = this; },
    prepend(child) { elements.set(child.id, child); child.parentElement = this; }
  };
}
const document = {
  getElementById(id) { return elements.get(id) || null; },
  createElement() { return element(); },
  addEventListener() {}
};
elements.set('planSection', element('planSection'));
elements.set('planForecastNotice', element('planForecastNotice'));
elements.set('planTerm', Object.assign(element('planTerm'), { value: '2027-1' }));

const state = {
  profileConfirmed: true,
  profile: { major: '다문화국제이해교육', track: 'thesis', admissionTerm: '2025-1' },
  history: []
};
const termIndex = term => {
  const m = String(term).match(/^(\d{4})-([12])$/);
  return m ? Number(m[1]) * 2 + (m[2] === '2' ? 1 : 0) : NaN;
};
const context = vm.createContext({
  console,
  state,
  termIndex,
  document,
  window: { setTimeout(fn) { fn(); } },
  preferredCatalogMatchByCode() { return null; },
  preferredCatalogMatchByName() { return null; },
  historyCatalogCourse() { return null; },
  pdfKnownCategory(text) {
    const value = String(text || '').replace(/\s+/g, '');
    return ['청강','공통','교직','전공','선택'].includes(value) ? value : '';
  },
  renderPlanWarnings() {},
  save() {},
  render() {},
  portalPdfCandidates: [],
  ocrCandidates: [],
  renderPortalPdfCandidates() {},
  renderOcrCandidates() {}
});
vm.runInContext(source, context);

const fixes = context.window.__YONSEI_ACADEMIC_FIXES__;
assert.ok(fixes, 'academic fixes API should be exposed');

assert.equal(context.preferredCatalogMatchByCode('SMI6524')?.courseName, '이중언어교육론');
assert.equal(context.preferredCatalogMatchByName('다문화사회 시민교육')?.courseCode, 'SMI6525');
assert.equal(context.preferredCatalogMatchByName('교육의 비교문화적 이해')?.category, 'major_required');
assert.equal(context.preferredCatalogMatchByName('이민·다문화가족 복지론')?.category, 'major_elective');

assert.equal(context.pdfKnownCategory('선수'), '선수');
const lifelong = { courseCode:'SPL6650', portalCategory:'선수', category:'teaching' };
assert.equal(fixes.normalizeLifelongPrerequisiteRecord(lifelong), true);
assert.equal(lifelong.category, 'prerequisite');
assert.equal(fixes.normalizeLifelongPrerequisiteRecord({ courseCode:'SPL6650', portalCategory:'교직', category:'teaching' }), false);

assert.equal(fixes.isThesisFifthSemester('2027-1'), true);
assert.equal(fixes.isThesisFifthSemester('2026-2'), false);
fixes.renderThesisExtraCourseNotice();
const notice = elements.get('thesisExtraCourseNotice');
assert.ok(notice, 'thesis fifth-semester notice should be rendered');
assert.match(notice.innerHTML, /논문 \+ 연구지도/);
assert.match(notice.innerHTML, /1과목/);
assert.match(notice.innerHTML, /3과목 \/ 9학점/);

state.profile.track = 'report';
fixes.renderThesisExtraCourseNotice();
assert.equal(elements.has('thesisExtraCourseNotice'), false, 'notice is thesis-track only');

console.log('Academic fixes regression: 13/13 passed');
