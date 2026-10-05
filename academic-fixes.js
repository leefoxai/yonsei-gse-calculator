(() => {
  'use strict';

  const MULTICULTURAL_MAJOR = '다문화국제이해교육';
  const LEGACY_MULTICULTURAL_COURSES = [
    { courseCode:'SMI6501', courseName:'다문화교육입문', aliases:['다문화교육 입문'], category:'major_required' },
    { courseCode:'SMI6502', courseName:'교육의비교문화적이해', aliases:['교육의 비교문화적 이해'], category:'major_required' },
    { courseCode:'SMI6503', courseName:'다문화사회의학교교육', aliases:['다문화사회의 학교교육'], category:'major_required' },
    { courseCode:'SMI6521', courseName:'다문화교육과정이론과실제', aliases:['다문화교육과정 이론과 실제'], category:'major_elective' },
    { courseCode:'SMI6522', courseName:'교육현장연구방법', aliases:['교육현장 연구방법'], category:'major_elective' },
    { courseCode:'SMI6523', courseName:'한국어와한국문화', aliases:['한국어와 한국문화'], category:'major_elective' },
    { courseCode:'SMI6524', courseName:'이중언어교육론', aliases:['이중언어 교육론'], category:'major_elective' },
    { courseCode:'SMI6525', courseName:'다문화사회시민교육', aliases:['다문화사회 시민교육'], category:'major_elective' },
    { courseCode:'SMI6526', courseName:'다문화교수학습방법론', aliases:['다문화 교수학습방법론'], category:'major_elective' },
    { courseCode:'SMI6527', courseName:'다문화교육정책론', aliases:['다문화교육 정책론'], category:'major_elective' },
    { courseCode:'SMI6528', courseName:'국제이해교육', aliases:['국제 이해교육'], category:'major_elective' },
    { courseCode:'SMI6529', courseName:'세계시민교육과지속가능발전', aliases:['세계시민교육과 지속가능발전'], category:'major_elective' },
    { courseCode:'SMI6591', courseName:'다문화교육교재연구', aliases:['다문화교육 교재 연구'], category:'teaching' },
    { courseCode:'SMI6592', courseName:'다문화교사교육론', aliases:['다문화 교사교육론'], category:'teaching' },
    { courseCode:'', courseName:'한국사회의다문화현상이해', aliases:['한국사회의 다문화현상이해','이민·다문화가족 복지론'], category:'major_elective' }
  ].map(course => ({
    ...course,
    major: MULTICULTURAL_MAJOR,
    credits: null,
    availability: 'historical',
    scope: 'historical',
    historicalCourse: true
  }));

  function compact(value) {
    return String(value || '').replace(/\s+/g, '').replace(/[()（）·ㆍ\-_,.]/g, '').toLowerCase();
  }

  function codeOf(value) {
    return String(value || '').toUpperCase().replace(/\s+/g, '').replace(/(?:-\d{2})+$/, '');
  }

  function legacyByCode(code) {
    const key = codeOf(code);
    if (!key) return null;
    return LEGACY_MULTICULTURAL_COURSES.find(course => codeOf(course.courseCode) === key) || null;
  }

  function legacyByName(name) {
    const key = compact(name);
    if (!key) return null;
    return LEGACY_MULTICULTURAL_COURSES.find(course =>
      compact(course.courseName) === key || (course.aliases || []).some(alias => compact(alias) === key)
    ) || null;
  }

  function multiculturalActive() {
    try { return state?.profile?.major === MULTICULTURAL_MAJOR; }
    catch { return false; }
  }

  function normalizeLifelongPrerequisiteRecord(record) {
    if (!record) return false;
    const code = codeOf(record.courseCode);
    const portalCategory = String(record.portalCategory || '').replace(/\s+/g, '');
    if (!/^SPL/.test(code) || !portalCategory.includes('선수')) return false;
    if (record.category === 'prerequisite') return false;
    record.category = 'prerequisite';
    return true;
  }

  function installMulticulturalHistoryMatching() {
    if (typeof preferredCatalogMatchByCode === 'function') {
      const originalByCode = preferredCatalogMatchByCode;
      preferredCatalogMatchByCode = function(courseCode) {
        const found = originalByCode(courseCode);
        if (found || !multiculturalActive()) return found;
        return legacyByCode(courseCode);
      };
    }

    if (typeof preferredCatalogMatchByName === 'function') {
      const originalByName = preferredCatalogMatchByName;
      preferredCatalogMatchByName = function(courseName) {
        const found = originalByName(courseName);
        if (found || !multiculturalActive()) return found;
        return legacyByName(courseName);
      };
    }

    if (typeof historyCatalogCourse === 'function') {
      const originalHistoryCatalogCourse = historyCatalogCourse;
      historyCatalogCourse = function(record) {
        const found = originalHistoryCatalogCourse(record);
        if (found || !multiculturalActive()) return found;
        return legacyByCode(record?.courseCode) || legacyByName(record?.courseName);
      };
    }
  }

  function installPrerequisiteRecognition() {
    if (typeof pdfKnownCategory === 'function') {
      const originalPdfKnownCategory = pdfKnownCategory;
      pdfKnownCategory = function(text) {
        const value = String(text || '').replace(/\s+/g, '');
        if (value === '선수' || value.endsWith('선수')) return '선수';
        return originalPdfKnownCategory(text);
      };
    }

    if (typeof renderPortalPdfCandidates === 'function') {
      const originalRenderPortal = renderPortalPdfCandidates;
      renderPortalPdfCandidates = function(...args) {
        try { portalPdfCandidates.forEach(normalizeLifelongPrerequisiteRecord); } catch {}
        return originalRenderPortal.apply(this, args);
      };
    }

    if (typeof renderOcrCandidates === 'function') {
      const originalRenderOcr = renderOcrCandidates;
      renderOcrCandidates = function(...args) {
        try { ocrCandidates.forEach(normalizeLifelongPrerequisiteRecord); } catch {}
        return originalRenderOcr.apply(this, args);
      };
    }

    let changed = false;
    try {
      for (const record of state?.history || []) changed = normalizeLifelongPrerequisiteRecord(record) || changed;
      if (changed && typeof save === 'function') save();
      if (changed && typeof render === 'function') render();
    } catch {}
  }

  function isThesisFifthSemester(term) {
    try {
      if (!state?.profileConfirmed || state.profile.track !== 'thesis') return false;
      if (!term || !state.profile.admissionTerm || typeof termIndex !== 'function') return false;
      return termIndex(term) - termIndex(state.profile.admissionTerm) + 1 === 5;
    } catch {
      return false;
    }
  }

  function renderThesisExtraCourseNotice() {
    const plan = document.getElementById('planSection');
    if (!plan) return;
    const selectedTerm = document.getElementById('planTerm')?.value || '';
    let notice = document.getElementById('thesisExtraCourseNotice');
    if (!isThesisFifthSemester(selectedTerm)) {
      notice?.remove();
      return;
    }
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'thesisExtraCourseNotice';
      notice.className = 'callout no-print thesis-extra-course-notice';
      const anchor = document.getElementById('planForecastNotice');
      if (anchor) anchor.insertAdjacentElement('afterend', notice);
      else plan.prepend(notice);
    }
    notice.innerHTML = '<b>논문학기 수강 안내</b> · 5학기에는 <b>논문 + 연구지도</b> 외에 <b>전공필수·전공선택·교직 1과목</b>을 추가로 수강신청할 수 있습니다. 따라서 일반 산입과목은 최대 <b>3과목 / 9학점</b>까지 계획할 수 있습니다.';
  }

  function installThesisNotice() {
    if (typeof renderPlanWarnings === 'function') {
      const originalRenderPlanWarnings = renderPlanWarnings;
      renderPlanWarnings = function(...args) {
        const result = originalRenderPlanWarnings.apply(this, args);
        renderThesisExtraCourseNotice();
        return result;
      };
    }
    document.addEventListener('change', event => {
      if (event.target?.id === 'planTerm') renderThesisExtraCourseNotice();
    });
    window.setTimeout(renderThesisExtraCourseNotice, 0);
  }

  installMulticulturalHistoryMatching();
  installPrerequisiteRecognition();
  installThesisNotice();

  window.__YONSEI_ACADEMIC_FIXES__ = {
    legacyMulticulturalCourses: LEGACY_MULTICULTURAL_COURSES,
    legacyByCode,
    legacyByName,
    normalizeLifelongPrerequisiteRecord,
    isThesisFifthSemester,
    renderThesisExtraCourseNotice
  };
})();
