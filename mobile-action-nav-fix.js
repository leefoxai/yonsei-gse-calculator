(() => {
  'use strict';

  function openAncestorDetails(element) {
    for (let node = element; node; node = node.parentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
    }
  }

  function flashTarget(target) {
    document.querySelectorAll('.action-target-flash').forEach(el => el.classList.remove('action-target-flash'));
    target.classList.add('action-target-flash');
    window.setTimeout(() => target.classList.remove('action-target-flash'), 1600);
  }

  function isHidden(target) {
    for (let node = target; node && node !== document.body; node = node.parentElement) {
      const style = window.getComputedStyle?.(node);
      if (style && (style.display === 'none' || style.visibility === 'hidden')) return true;
    }
    return false;
  }

  function firstUsable(...ids) {
    for (const id of ids) {
      const target = document.getElementById(id);
      if (target && !isHidden(target)) return target;
    }
    return null;
  }

  function resolveTarget(action) {
    const text = (action.textContent || '').replace(/\s+/g, ' ').trim();

    if (text.includes('종합시험')) {
      return firstUsable('comprehensiveExamCourseChecklist', 'graduationChecklistSection');
    }
    if (text.includes('전공영어')) {
      return firstUsable('graduationEnglishStatus', 'graduationChecklistSection');
    }

    if (action.classList.contains('teacher')) {
      if (text.includes('기본이수')) return firstUsable('teacherChecklistSection');
      if (text.includes('학교현장실습')) return firstUsable('teacherChecklistSection');

      const mappings = [
        ['전문상담교사 1급 기존자격', 'teacherCounselor1ExperienceYears'],
        ['관련전공·표시과목', 'teacherRelatedMajorConfirmed'],
        ['교원자격 전공학점', 'teacherRecognizedMajorCredits'],
        ['전문상담교사 교과목', 'teacherBasicCourseCount'],
        ['교과교육', 'teacherRecognizedPedagogyCredits'],
        ['교직이론', 'teacherRecognizedTheoryCount'],
        ['교직소양', 'teacherRecognizedLiteracyCount'],
        ['교육봉사', 'teacherVolunteerHours'],
        ['교직 평균성적', 'teacherTeachingAverage100'],
        ['전공 평균성적', 'teacherMajorAverage100'],
        ['교직과정 이수신청서', 'teacherApplicationSubmitted'],
        ['교직적성·인성검사', 'teacherAptitudeCount'],
        ['응급처치·심폐소생술', 'teacherCprCount'],
        ['성인지교육', 'teacherGenderCount'],
        ['교원자격무시험검정원서', 'teacherNoExamSubmitted'],
        ['약물중독', 'teacherDrugCertificateSubmitted']
      ];
      for (const [needle, id] of mappings) {
        if (text.includes(needle)) return firstUsable(id, 'teacherChecklistSection');
      }
      return firstUsable('teacherChecklistSection');
    }

    if (text.includes('평점')) return firstUsable('historySection');
    if (text.includes('졸업 인정학점')) return firstUsable('planAddSection', 'planSection');
    if (action.classList.contains('degree')) return firstUsable('planGapCandidates', 'planSection');

    return null;
  }

  function navigate(action) {
    const target = resolveTarget(action);
    if (!target) return false;
    openAncestorDetails(target);
    if (target.tagName === 'DETAILS') target.open = true;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      target.scrollIntoView({ behavior:'smooth', block:'center' });
      flashTarget(target);
      if (target.matches?.('input,select,textarea,button')) {
        window.setTimeout(() => {
          try { target.focus({ preventScroll:true }); }
          catch (e) { target.focus?.(); }
        }, 320);
      }
    }));
    return true;
  }

  function interceptAction(event) {
    const action = event.target.closest?.('.next-action.actionable');
    if (!action) return;
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
    if (!resolveTarget(action)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    navigate(action);
  }

  document.addEventListener('click', interceptAction, true);
  document.addEventListener('keydown', interceptAction, true);
})();
