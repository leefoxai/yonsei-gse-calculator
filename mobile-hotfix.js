(() => {
  'use strict';

  let renderQueued = false;

  function isMobile() {
    return document.body.classList.contains('mobile-mode');
  }

  function installStyles() {
    if (document.getElementById('mobileImportHotfixStyles')) return;
    const style = document.createElement('style');
    style.id = 'mobileImportHotfixStyles';
    style.textContent = `
      body.mobile-mode #mobilePdfReviewCards,
      body.mobile-mode #mobileOcrReviewCards{display:none!important}
      body:not(.mobile-mode) #mobilePdfReviewCardsV2,
      body:not(.mobile-mode) #mobileOcrReviewCardsV2{display:none!important}
      body.mobile-mode .mobile-import-v2{display:grid;gap:12px;margin-top:10px}
      body.mobile-mode .mobile-import-v2 .mobile-table-card{padding:14px;border:1px solid #d7e1ee;border-radius:14px;background:#fff;box-shadow:0 1px 3px rgba(16,24,40,.06)}
      body.mobile-mode .mobile-import-v2-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding-bottom:10px;border-bottom:1px solid #e4eaf2}
      body.mobile-mode .mobile-import-v2-course{min-width:0;flex:1}
      body.mobile-mode .mobile-import-v2-course .course-name{font-size:17px;font-weight:800;color:#101828}
      body.mobile-mode .mobile-import-v2-register{display:flex;align-items:flex-start;justify-content:center;flex:0 0 auto;padding:0 4px}
      body.mobile-mode .mobile-import-v2-register input[type=checkbox]{width:34px!important;height:34px!important;margin:0!important;accent-color:#0b6ff2}
      body.mobile-mode .mobile-import-v2-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px 14px;padding-top:12px}
      body.mobile-mode .mobile-import-v2-field{min-width:0}
      body.mobile-mode .mobile-import-v2-label{display:block;margin-bottom:5px;color:#667085;font-size:12px;font-weight:800}
      body.mobile-mode .mobile-import-v2-value{min-width:0;color:#101828;font-size:15px}
      body.mobile-mode .mobile-import-v2-value select{width:100%;min-width:0}
      body.mobile-mode .mobile-import-v2-status{white-space:normal;line-height:1.35}
      body.mobile-mode .mobile-import-v2-bottom{width:100%;min-height:48px;font-weight:800;margin-top:2px}
    `;
    document.head.appendChild(style);
  }

  function cloneControlAware(cell) {
    if (!cell) return document.createDocumentFragment();
    const clone = cell.cloneNode(true);
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    const originals = [...cell.querySelectorAll('input,select,textarea,button')];
    const copies = [...clone.querySelectorAll('input,select,textarea,button')];
    copies.forEach((copy, index) => {
      const original = originals[index];
      if (!original) return;
      copy.removeAttribute('id');
      copy.removeAttribute('name');
      copy.removeAttribute('data-i');
      if (copy.matches('input[type=checkbox],input[type=radio]')) copy.checked = original.checked;
      else if ('value' in copy) copy.value = original.value;
      copy.disabled = original.disabled;
      const forward = type => {
        if (original.matches('input[type=checkbox],input[type=radio]')) original.checked = copy.checked;
        else if ('value' in original) original.value = copy.value;
        original.dispatchEvent(new Event(type, { bubbles:true }));
      };
      copy.addEventListener('input', () => forward('input'));
      copy.addEventListener('change', () => forward('change'));
      if (copy.tagName === 'BUTTON') {
        copy.type = 'button';
        copy.addEventListener('click', event => {
          event.preventDefault();
          original.click();
        });
      }
    });
    const fragment = document.createDocumentFragment();
    while (clone.firstChild) fragment.appendChild(clone.firstChild);
    return fragment;
  }

  function makeField(label, cell, textValue='') {
    const field = document.createElement('div');
    field.className = 'mobile-import-v2-field';
    const labelEl = document.createElement('span');
    labelEl.className = 'mobile-import-v2-label';
    labelEl.textContent = label;
    const value = document.createElement('div');
    value.className = `mobile-import-v2-value${label === '상태' ? ' mobile-import-v2-status' : ''}`;
    if (cell) value.appendChild(cloneControlAware(cell));
    else value.textContent = textValue;
    field.append(labelEl, value);
    return field;
  }

  function termRank(text) {
    const match = String(text || '').match(/(20\d{2})-([012])/);
    if (!match) return Number.MAX_SAFE_INTEGER;
    return Number(match[1]) * 10 + Number(match[2]);
  }

  function statusSummary(cell) {
    if (!cell) return '정보확인';
    const text = (cell.textContent || '').replace(/\s+/g, ' ').trim();
    if (/이미 등록됨/.test(text)) return '이미 등록됨';

    const issues = [...cell.querySelectorAll('.field-chip.review,.field-chip.low')]
      .map(chip => chip.textContent.trim())
      .filter(Boolean)
      .map(label => `${label} 확인 필요`);

    if (/미등록|미매칭/.test(text)) issues.unshift('수강편람 미등록');
    if (/성적 확인 필요/.test(text) && !issues.some(x => x.startsWith('성적 '))) issues.push('성적 확인 필요');
    if (/학정번호.*보정|1글자 보정/.test(text) && !issues.some(x => x.startsWith('학정번호 '))) issues.push('학정번호 확인 필요');

    const unique = [...new Set(issues)];
    return unique.length ? unique.join(' · ') : '정보확인';
  }

  function ensureTarget(result, targetId) {
    let target = document.getElementById(targetId);
    if (!target) {
      target = document.createElement('div');
      target.id = targetId;
      target.className = 'mobile-import-v2';
      result.insertAdjacentElement('afterend', target);
    }
    return target;
  }

  function renderImport(resultId, targetId, isPdf) {
    const result = document.getElementById(resultId);
    if (!result) return;
    const target = ensureTarget(result, targetId);
    if (!isMobile()) { target.innerHTML = ''; return; }

    const table = result.querySelector('table');
    if (!table) { target.innerHTML = ''; return; }
    table.closest('.table-wrap')?.classList.add('mobile-original-table');

    const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
    const findIndex = (...needles) => headers.findIndex(label => needles.some(needle => label.includes(needle)));
    const registerIndex = findIndex('등록');
    const termIndex = findIndex('학기');
    const courseIndex = findIndex('과목');
    const portalIndex = findIndex('포털 종별','OCR 종별');
    const categoryIndex = findIndex('인정 종별','계산 종별');
    const creditIndex = findIndex('학점');
    const gradeIndex = findIndex('성적');
    const statusIndex = findIndex('상태','신뢰도');

    const rows = [...table.querySelectorAll('tbody tr')]
      .filter(row => row.children.length && !row.querySelector('.empty'))
      .map((row, originalIndex) => ({ row, originalIndex }));

    if (isPdf) {
      rows.sort((a,b) => {
        const ac = [...a.row.children];
        const bc = [...b.row.children];
        const ar = termRank(termIndex >= 0 ? ac[termIndex]?.textContent : a.row.textContent);
        const br = termRank(termIndex >= 0 ? bc[termIndex]?.textContent : b.row.textContent);
        return ar - br || a.originalIndex - b.originalIndex;
      });
    }

    target.innerHTML = '';
    rows.forEach(({ row }) => {
      const cells = [...row.children];
      const card = document.createElement('article');
      card.className = 'mobile-table-card';

      const head = document.createElement('div');
      head.className = 'mobile-import-v2-head';
      const course = document.createElement('div');
      course.className = 'mobile-import-v2-course';
      if (courseIndex >= 0 && cells[courseIndex]) course.appendChild(cloneControlAware(cells[courseIndex]));
      head.appendChild(course);
      if (registerIndex >= 0 && cells[registerIndex]) {
        const register = document.createElement('div');
        register.className = 'mobile-import-v2-register';
        register.appendChild(cloneControlAware(cells[registerIndex]));
        head.appendChild(register);
      }
      card.appendChild(head);

      let termText = '';
      if (termIndex < 0) {
        const match = (cells[courseIndex]?.textContent || row.textContent || '').match(/20\d{2}-[012]/);
        termText = match?.[0] || '';
      }

      const grid = document.createElement('div');
      grid.className = 'mobile-import-v2-grid';
      grid.appendChild(makeField('상태', null, statusSummary(statusIndex >= 0 ? cells[statusIndex] : null)));
      grid.appendChild(makeField('포털 종별', portalIndex >= 0 ? cells[portalIndex] : null, ''));
      grid.appendChild(makeField('수강학기', termIndex >= 0 ? cells[termIndex] : null, termText));
      grid.appendChild(makeField('인정 종별', categoryIndex >= 0 ? cells[categoryIndex] : null, ''));
      grid.appendChild(makeField('학점', creditIndex >= 0 ? cells[creditIndex] : null, ''));
      grid.appendChild(makeField('성적', gradeIndex >= 0 ? cells[gradeIndex] : null, ''));
      card.appendChild(grid);
      target.appendChild(card);
    });

    if (rows.length) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn primary mobile-import-v2-bottom';
      button.textContent = '선택 과목 등록하기';
      button.addEventListener('click', () => {
        const candidates = isPdf
          ? ['importPortalPdfCandidates','importPortalPdf']
          : ['importOcrCandidates'];
        for (const id of candidates) {
          const original = document.getElementById(id);
          if (original) { original.click(); return; }
        }
      });
      target.appendChild(button);
    }
  }

  function renderAll() {
    renderQueued = false;
    renderImport('portalPdfResult','mobilePdfReviewCardsV2',true);
    renderImport('ocrResult','mobileOcrReviewCardsV2',false);
  }

  function queueRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => requestAnimationFrame(renderAll));
  }

  function observe(id) {
    const target = document.getElementById(id);
    if (!target) return;
    new MutationObserver(queueRender).observe(target,{ childList:true,subtree:true });
  }

  function init() {
    installStyles();
    observe('portalPdfResult');
    observe('ocrResult');
    window.addEventListener('resize', queueRender, { passive:true });
    window.addEventListener('orientationchange', () => setTimeout(queueRender,80), { passive:true });
    queueRender();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
