(() => {
  'use strict';

  const PHONE_WIDTH = 760;
  const PHONE_LANDSCAPE_WIDTH = 960;
  const PHONE_SHORT_SIDE = 500;
  let renderQueued = false;

  function coarsePointer() {
    return (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || navigator.maxTouchPoints > 0;
  }

  function isPhoneMode() {
    const w = window.innerWidth || document.documentElement.clientWidth || 0;
    const h = window.innerHeight || document.documentElement.clientHeight || 0;
    if (w <= PHONE_WIDTH) return true;
    return coarsePointer() && Math.min(w, h) <= PHONE_SHORT_SIDE && Math.max(w, h) <= PHONE_LANDSCAPE_WIDTH;
  }

  function installPrintCleanup() {
    if (document.getElementById('printHistoryCleanup')) return;
    const style = document.createElement('style');
    style.id = 'printHistoryCleanup';
    style.media = 'print';
    style.textContent = '#historySection{display:none!important}';
    document.head.appendChild(style);
  }

  function installPublicNotices() {
    if (!document.getElementById('publicNoticesStyle')) {
      const style = document.createElement('style');
      style.id = 'publicNoticesStyle';
      style.textContent = `
        .public-caution-notice{margin:12px 0 14px;padding:14px 16px;border:1px solid #f2a7ae;border-left:5px solid #d92d20;border-radius:10px;background:#fff1f2;color:#7a271a;font-size:15px;line-height:1.6}
        .public-caution-title{font-size:16px;font-weight:800}.public-caution-detail{margin-top:5px;color:#912018;font-size:20px;font-weight:600}
        .data-privacy-notice{margin:12px 0;border:1px solid #c9d8ea;border-radius:10px;background:#f7fbff;overflow:hidden}
        .data-privacy-notice>summary{cursor:pointer;padding:11px 13px;font-weight:800;color:#123b64;list-style:none}
        .data-privacy-notice>summary::-webkit-details-marker{display:none}
        .data-privacy-notice>summary::after{content:'펼쳐보기';float:right;font-size:11px;font-weight:700;color:#667085}
        .data-privacy-notice[open]>summary::after{content:'접기'}
        .data-privacy-body{padding:0 13px 11px;color:#344054;font-size:12px;line-height:1.6}
        .data-privacy-body p{margin:7px 0}
        @media(max-width:760px){.public-caution-notice{margin:10px 0 12px;padding:12px 13px;font-size:14px}.public-caution-title{font-size:15px}.public-caution-detail{margin-top:5px;font-size:20px}.data-privacy-notice>summary{padding:10px 11px}.data-privacy-body{padding:0 11px 10px}}
        @media print{.public-caution-notice{margin:4mm 0 3mm;padding:2.5mm 3mm;border:1px solid #b8b8b8;border-left:3px solid #666;background:#fff;color:#222;font-size:8.5pt;line-height:1.35}.public-caution-title{font-size:9pt}.public-caution-detail{color:#444;font-size:8pt;font-weight:400}.data-privacy-notice{display:none!important}}
      `;
      document.head.appendChild(style);
    }

    const header = document.querySelector('.header');
    if (header && !document.getElementById('publicCautionNotice')) {
      const notice = document.createElement('div');
      notice.id = 'publicCautionNotice';
      notice.className = 'public-caution-notice';
      notice.setAttribute('role', 'note');
      notice.innerHTML = '<div class="public-caution-title"><b>참고용 자동 계산</b> · 최종 졸업 및 교원자격 취득 여부는 교육대학원의 공식 심사 결과를 따릅니다.</div><div class="public-caution-detail">입력한 수강이력과 공개된 학사 기준을 바탕으로 계산하며, 학점 인정·선수과목 인정·교원자격 관련 행정승인 등은 실제 심사 결과와 다를 수 있습니다.</div>';
      header.insertAdjacentElement('afterend', notice);
    }

    const history = document.getElementById('historySection');
    const historyCallout = history?.querySelector('.callout');
    if (historyCallout && !document.getElementById('dataPrivacyNotice')) {
      const privacy = document.createElement('details');
      privacy.id = 'dataPrivacyNotice';
      privacy.className = 'data-privacy-notice no-print';
      privacy.innerHTML = '<summary>🔒 입력 데이터 처리 안내</summary><div class="data-privacy-body"><p><b>입력한 성적정보와 선택한 PDF·캡처 파일은 별도 서버로 업로드하거나 저장하지 않습니다.</b> 파일 분석과 계산은 사용 중인 브라우저에서 처리됩니다.</p><p>등록한 수강이력과 수강계획은 해당 기기의 브라우저 저장공간에 저장됩니다. 브라우저 데이터 삭제·시크릿 모드 사용·기기 변경 시 저장 내용이 사라질 수 있습니다.</p><p>앱 실행에 필요한 라이브러리와 글꼴을 불러오기 위해 외부 CDN에 접속할 수 있으나, 선택한 성적표 내용·캡처 이미지·수강계획을 해당 CDN으로 전송하도록 구현되어 있지 않습니다.</p></div>';
      historyCallout.insertAdjacentElement('afterend', privacy);
    }
  }

  function syncMobileMode() {
    document.body.classList.toggle('mobile-mode', isPhoneMode());
    queueRenderAll();
  }

  function queueRenderAll() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      if (!document.body.classList.contains('mobile-mode')) return;
      decorateKpis();
      renderHistoryCards();
      renderPlanCards();
      renderImportCards('portalPdfResult', 'mobilePdfReviewCards', 'mobile-import-card-list');
      renderImportCards('ocrResult', 'mobileOcrReviewCards', 'mobile-import-card-list');
      renderSemesterGpaList();
      renderPlanCoursePicker();
    });
  }

  function ensureAfter(anchor, id, className) {
    if (!anchor) return null;
    let target = document.getElementById(id);
    if (!target) {
      target = document.createElement('div');
      target.id = id;
      target.className = className;
      anchor.insertAdjacentElement('afterend', target);
    }
    return target;
  }

  function neutralizeInteractive(el, original) {
    el.removeAttribute('id');
    el.removeAttribute('name');
    el.removeAttribute('data-i');
    el.removeAttribute('style');
    if (el.tagName === 'BUTTON') {
      const danger = original.classList.contains('danger');
      el.className = `btn small mobile-cloned-button${danger ? ' danger' : ''}`;
      el.type = 'button';
      el.addEventListener('click', event => {
        event.preventDefault();
        original.click();
      });
      return;
    }
    el.className = 'mobile-cloned-control';
    if (original.matches('input[type=checkbox],input[type=radio]')) el.checked = original.checked;
    else if ('value' in original) el.value = original.value;
    el.disabled = original.disabled;

    el.addEventListener('input', () => {
      if (original.matches('input[type=checkbox],input[type=radio]')) original.checked = el.checked;
      else original.value = el.value;
      original.dispatchEvent(new Event('input', { bubbles: true }));
    });
    el.addEventListener('change', () => {
      if (original.matches('input[type=checkbox],input[type=radio]')) original.checked = el.checked;
      else original.value = el.value;
      original.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function cloneCellContent(cell) {
    const clone = cell.cloneNode(true);
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    const originals = [...cell.querySelectorAll('input,select,textarea,button')];
    const clonedControls = [...clone.querySelectorAll('input,select,textarea,button')];
    clonedControls.forEach((control, index) => {
      const original = originals[index];
      if (original) neutralizeInteractive(control, original);
    });
    const fragment = document.createDocumentFragment();
    while (clone.firstChild) fragment.appendChild(clone.firstChild);
    return fragment;
  }

  function markOriginalTable(table) {
    const wrap = table?.closest('.table-wrap');
    if (wrap) wrap.classList.add('mobile-original-table');
  }

  function renderTableAsCards(table, target, kind) {
    if (!table || !target) return;
    markOriginalTable(table);
    const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
    const rows = [...table.querySelectorAll('tbody tr')];
    target.innerHTML = '';

    if (!rows.length) return;
    if (rows.length === 1 && rows[0].querySelector('.empty')) {
      const empty = document.createElement('div');
      empty.className = 'mobile-card-empty';
      empty.textContent = rows[0].textContent.trim();
      target.appendChild(empty);
      return;
    }

    rows.forEach(row => {
      const cells = [...row.children];
      if (!cells.length) return;
      const card = document.createElement('article');
      card.className = `mobile-table-card mobile-${kind}-card`;
      const courseIndex = headers.findIndex(label => /과목/.test(label));

      if (courseIndex >= 0 && cells[courseIndex]) {
        const heading = document.createElement('div');
        heading.className = 'mobile-card-course';
        heading.appendChild(cloneCellContent(cells[courseIndex]));
        card.appendChild(heading);
      }

      const fields = document.createElement('div');
      fields.className = 'mobile-card-fields';
      cells.forEach((cell, index) => {
        if (index === courseIndex) return;
        const label = headers[index] || '';
        const field = document.createElement('div');
        field.className = 'mobile-card-field';
        field.dataset.label = label;
        if (/상태/.test(label)) field.classList.add('mobile-card-status');
        if (!label && cell.querySelector('button')) field.classList.add('mobile-card-actions');
        if (label) {
          const fieldLabel = document.createElement('span');
          fieldLabel.className = 'mobile-card-label';
          fieldLabel.textContent = label;
          field.appendChild(fieldLabel);
        }
        const value = document.createElement('div');
        value.className = 'mobile-card-value';
        value.appendChild(cloneCellContent(cell));
        field.appendChild(value);
        fields.appendChild(field);
      });
      card.appendChild(fields);
      target.appendChild(card);
    });
  }

  function renderHistoryCards() {
    const body = document.getElementById('historyBody');
    const table = body?.closest('table');
    const wrap = table?.closest('.table-wrap');
    if (!table || !wrap) return;
    const target = ensureAfter(wrap, 'mobileHistoryCards', 'mobile-card-list mobile-history-card-list');
    renderTableAsCards(table, target, 'history');
  }

  function renderPlanCards() {
    const body = document.getElementById('planBody');
    const table = body?.closest('table');
    const wrap = table?.closest('.table-wrap');
    if (!table || !wrap) return;
    const target = ensureAfter(wrap, 'mobilePlanCards', 'mobile-card-list mobile-plan-card-list');
    renderTableAsCards(table, target, 'plan');
  }

  function renderImportCards(resultId, targetId, extraClass) {
    const result = document.getElementById(resultId);
    if (!result) return;
    const table = result.querySelector('table');
    let target = document.getElementById(targetId);
    if (!table) {
      if (target) target.innerHTML = '';
      return;
    }
    target = ensureAfter(result, targetId, `mobile-card-list ${extraClass}`);
    renderTableAsCards(table, target, 'import');
  }

  function decorateKpis() {
    document.querySelectorAll('#kpiGrid .card').forEach(card => {
      card.classList.remove('mobile-kpi-same', 'mobile-kpi-changed', 'mobile-kpi-single');
      const comparison = card.querySelector('.requirement-comparison');
      if (!comparison) {
        card.classList.add('mobile-kpi-single');
        return;
      }
      const values = [...comparison.querySelectorAll('b')].map(node => node.textContent.replace(/\s+/g, ' ').trim());
      const same = values.length >= 2 && values[0] === values[1];
      card.classList.add(same ? 'mobile-kpi-same' : 'mobile-kpi-changed');
      comparison.classList.toggle('mobile-comparison-same', same);
    });
  }

  function renderSemesterGpaList() {
    const grid = document.getElementById('semesterGpaGrid');
    if (!grid) return;
    const target = ensureAfter(grid, 'mobileSemesterGpaList', 'mobile-gpa-list');
    target.innerHTML = '';
    [...grid.querySelectorAll('.semester-gpa-card')].forEach(card => {
      const row = document.createElement('div');
      row.className = `mobile-gpa-row${card.classList.contains('cumulative-card') ? ' cumulative' : ''}`;
      const term = card.querySelector('.term')?.textContent.trim() || '';
      const badge = card.querySelector('.badge')?.cloneNode(true);
      const figures = [...card.querySelectorAll('.sg-fig')].map(fig => ({
        label: fig.querySelector('.muted')?.textContent.trim() || '',
        value: fig.querySelector('b')?.textContent.replace(/\s+/g, ' ').trim() || '-'
      }));

      const termEl = document.createElement('strong');
      termEl.className = 'mobile-gpa-term';
      termEl.textContent = term;
      row.appendChild(termEl);
      figures.slice(0, 2).forEach(item => {
        const fig = document.createElement('div');
        fig.className = 'mobile-gpa-figure';
        fig.innerHTML = `<span>${item.label}</span><b>${item.value}</b>`;
        row.appendChild(fig);
      });
      const status = document.createElement('div');
      status.className = 'mobile-gpa-status';
      if (badge) status.appendChild(badge);
      row.appendChild(status);
      target.appendChild(row);
    });
  }

  function renderPlanCoursePicker() {
    const select = document.getElementById('planCourse');
    if (!select) return;
    const parent = select.parentElement;
    if (!parent) return;
    let picker = document.getElementById('mobilePlanCoursePicker');
    if (!picker) {
      picker = document.createElement('div');
      picker.id = 'mobilePlanCoursePicker';
      picker.className = 'mobile-course-picker';
      select.insertAdjacentElement('afterend', picker);
    }
    const query = (document.getElementById('planCourseSearch')?.value || '').trim().toLowerCase();
    let options = [...select.options].filter(option => option.value !== '' && !option.disabled);
    if (query) options = options.filter(option => option.textContent.toLowerCase().includes(query));
    const selectedValue = select.value;
    options.sort((a, b) => Number(b.value === selectedValue) - Number(a.value === selectedValue));
    const visible = options.slice(0, 8);
    picker.innerHTML = '';

    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'mobile-picker-empty';
      empty.textContent = query ? '검색 조건에 맞는 개설 과목이 없습니다.' : '계획학기와 검색 조건을 먼저 선택하세요.';
      picker.appendChild(empty);
      return;
    }

    visible.forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mobile-course-option${option.value === selectedValue ? ' selected' : ''}`;
      button.textContent = option.textContent.trim();
      button.addEventListener('click', () => {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        renderPlanCoursePicker();
      });
      picker.appendChild(button);
    });
    if (options.length > visible.length) {
      const more = document.createElement('div');
      more.className = 'mobile-picker-more';
      more.textContent = `외 ${options.length - visible.length}개 · 과목명/학정번호를 입력하면 결과가 좁혀집니다.`;
      picker.appendChild(more);
    }
  }

  function activateImportPane(paneId) {
    const tab = document.querySelector(`#importTabs [data-pane="${paneId}"]`);
    if (tab) tab.click();
    const pane = document.getElementById(paneId);
    if (pane) setTimeout(() => pane.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  }

  function wireMobileGuide() {
    document.querySelectorAll('[data-mobile-import-pane]').forEach(button => {
      button.addEventListener('click', () => activateImportPane(button.dataset.mobileImportPane));
    });
  }

  function observe(target, options = { childList: true, subtree: true }) {
    if (!target) return;
    new MutationObserver(queueRenderAll).observe(target, options);
  }

  function initObservers() {
    observe(document.getElementById('historyBody'));
    observe(document.getElementById('planBody'));
    observe(document.getElementById('portalPdfResult'));
    observe(document.getElementById('ocrResult'));
    observe(document.getElementById('semesterGpaGrid'));
    observe(document.getElementById('kpiGrid'));
    observe(document.getElementById('planCourse'));
    ['planCourseSearch', 'planTerm', 'planFilterCategory', 'planScope', 'planProfessorSearch'].forEach(id => {
      const element = document.getElementById(id);
      if (!element) return;
      element.addEventListener('input', queueRenderAll);
      element.addEventListener('change', queueRenderAll);
    });
  }

  function init() {
    installPrintCleanup();
    installPublicNotices();
    syncMobileMode();
    wireMobileGuide();
    initObservers();
    queueRenderAll();
    window.addEventListener('resize', syncMobileMode, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(syncMobileMode, 80), { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
