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

  function goToComprehensiveExam() {
    const section = document.getElementById('graduationChecklistSection');
    if (!section) return;
    openAncestorDetails(section);
    section.open = true;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = document.getElementById('comprehensiveExamCourseChecklist') || section;
      openAncestorDetails(target);
      target.scrollIntoView({ behavior:'smooth', block:'center' });
      flashTarget(target);
    }));
  }

  function interceptAction(event) {
    const action = event.target.closest?.('.next-action.actionable,.next-action');
    if (!action) return;
    const text = (action.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text.includes('종합시험')) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    goToComprehensiveExam();
  }

  document.addEventListener('click', interceptAction, true);
})();
