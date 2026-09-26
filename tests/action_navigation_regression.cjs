const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'mobile-action-nav-fix.js'), 'utf8');

assert.match(source, /document\.addEventListener\('click',\s*interceptAction,\s*true\)/, 'click navigation interceptor missing');
assert.match(source, /document\.addEventListener\('keydown',\s*interceptAction,\s*true\)/, 'keyboard navigation interceptor missing');
assert.match(source, /comprehensiveExamCourseChecklist/, 'comprehensive exam must target visible checklist');
assert.match(source, /graduationEnglishStatus/, 'English exam target missing');
assert.match(source, /text\.includes\('기본이수'\).*teacherChecklistSection/s, 'basic-course action must use visible teacher checklist');
assert.match(source, /text\.includes\('학교현장실습'\).*teacherChecklistSection/s, 'teaching-practicum action must use visible teacher checklist');
assert.match(source, /teacherAptitudeCount/, 'teacher aptitude target missing');
assert.match(source, /teacherCprCount/, 'CPR target missing');
assert.match(source, /teacherGenderCount/, 'gender-education target missing');
assert.match(source, /planGapCandidates/, 'degree deficit target missing');
assert.match(source, /planAddSection/, 'total-credit action target missing');
assert.doesNotMatch(source, /if\s*\(\s*!isMobile\(\)\s*\)\s*return/, 'navigation must not be mobile-only');

console.log('Action navigation regression: passed');
