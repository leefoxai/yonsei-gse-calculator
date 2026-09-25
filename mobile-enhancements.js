(() => {
  'use strict';

  const EXAM_CHECK_STORAGE_KEY = 'yonsei-gse-comprehensive-exam-checks-v1';
  let queued = false;
  let examPackPromise = null;
  const originalPrintHandlers = new Map();

  function isPhoneMode() {
    return document.body.classList.contains('mobile-mode');
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, '').toLowerCase();
  }

  function installStyles() {
    if (document.getElementById('mobileEnhancementStyles')) return;
    const style = document.createElement('style');
    style.id = 'mobileEnhancementStyles';
    style.textContent = `
      .mobile-import-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding-bottom:10px;border-bottom:1px solid #e3eaf3}
      .mobile-import-card-head .mobile-card-course{padding:0!important;border:0!important;min-width:0;flex:1}
      .mobile-import-register{display:flex;align-items:center;justify-content:center;min-width:44px;padding-top:2px}
      .mobile-import-register input[type=checkbox]{width:30px!important;height:30px!important;accent-color:#0b6ff2}
      .mobile-import-pair-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 14px;padding-top:12px}
      .mobile-import-pair-grid .mobile-card-field{min-width:0}
      .mobile-import-pair-grid .mobile-card-status .mobile-card-value{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .mobile-import-register-bottom{width:100%;margin-top:12px;min-height:48px;font-weight:800}
      .mobile-duplicate-badge{display:inline-flex;vertical-align:middle;margin-left:7px;padding:2px 7px;border-radius:999px;background:#fff3e8;border:1px solid #f4b17a;color:#a63d12;font-size:11px;font-weight:800;white-space:nowrap}
      .mobile-evidence-switchable{margin-left:auto;padding:2px 7px;border-radius:999px;background:#edf4ff;color:#175cd3;font-size:10px;font-weight:800;white-space:nowrap}
      .evidence-row.mobile-evidence-total{display:grid!important;grid-template-columns:72px 82px minmax(0,1fr) auto;align-items:center;gap:8px}
      .evidence-row.mobile-evidence-category{display:grid!important;grid-template-columns:78px minmax(0,1fr) auto;align-items:center;gap:8px}
      .evidence-row .mobile-evidence-term{color:#667085;font-variant-numeric:tabular-nums}
      .evidence-row .mobile-evidence-category-label{color:#475467;font-size:12px}
      .evidence-row .mobile-evidence-name{min-width:0;font-weight:700}
      .comprehensive-exam-checklist{margin-top:8px;padding:12px 14px;border:1px solid #d7e1ee;border-radius:12px;background:#fbfdff}
      .comprehensive-exam-note{margin-bottom:10px;color:#667085;font-size:12px;line-height:1.55}
      .comprehensive-exam-list{display:grid;gap:8px}
      .comprehensive-exam-list label{display:flex;align-items:center;gap:9px;padding:9px 10px;border:1px solid #d9e2ec;border-radius:9px;background:#fff;font-weight:700}
      .comprehensive-exam-list input{width:22px;height:22px;accent-color:#0b6ff2;flex:0 0 auto}
      .comprehensive-exam-progress{margin-top:10px;font-size:13px;font-weight:800;color:#344054}
      .comprehensive-exam-progress.ok{color:#067647}
      .comprehensive-exam-source{margin-top:8px;color:#667085;font-size:11px;line-height:1.45}
      #mobilePngCapture{position:fixed;left:-20000px;top:0;width:1100px;padding:38px;background:#fff;color:#111827;z-index:-1;font-family:inherit}
      #mobilePngCapture .no-print,#mobilePngCapture .no-print-ui,#mobilePngCapture .mobile-only,#mobilePngCapture button{display:none!important}
      #mobilePngCapture .print-only{display:block!important}
      #mobilePngCapture details{display:block!important}
      #mobilePngCapture details>summary{display:none!important}
      #mobilePngCapture .card,#mobilePngCapture .analysis-zone,#mobilePngCapture #planSection{box-shadow:none!important}
      #mobilePngCapture .mobile-card-list,#mobilePngCapture .mobile-gpa-list{display:none!important}
      @media(max-width:960px){
        body.mobile-mode #planAddSection .plan-filter-row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px 12px!important}
        body.mobile-mode #planAddSection .plan-course-row{display:block!important}
        body.mobile-mode #planAddSection .plan-course-row>div{width:100%!important;margin-bottom:10px!important}
        body.mobile-mode #planCourse{position:static!important;display:block!important;width:100%!important;height:48px!important;min-height:48px!important;opacity:1!important;pointer-events:auto!important;clip:auto!important;clip-path:none!important;margin:0!important;padding:0 42px 0 12px!important}
        body.mobile-mode #mobilePlanCoursePicker{display:none!important}
        body.mobile-mode #portalPdfResult>.toolbar,body.mobile-mode #ocrResult>.toolbar{display:none!important}
        body.mobile-mode .mobile-import-card-list{margin-top:10px}
        body.mobile-mode .mobile-import-card-list .mobile-table-card{padding:14px}
        body.mobile-mode .graduation-check-grid{grid-template-columns:1fr!important}
      }
    `;
    document.head.appendChild(style);
  }

  function cloneInteractive(cell) {
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
      const sync = type => {
        if (original.matches('input[type=checkbox],input[type=radio]')) original.checked = copy.checked;
        else original.value = copy.value;
        original.dispatchEvent(new Event(type, { bubbles: true }));
      };
      copy.addEventListener('input', () => sync('input'));
      copy.addEventListener('change', () => sync('change'));
      if (copy.tagName === 'BUTTON') copy.addEventListener('click', event => { event.preventDefault(); original.click(); });
    });
    const fragment = document.createDocumentFragment();
    while (clone.firstChild) fragment.appendChild(clone.firstChild);
    return fragment;
  }

  function createField(label, cell) {
    const field = document.createElement('div');
    field.className = `mobile-card-field${label === '상태' ? ' mobile-card-status' : ''}`;
    const labelEl = document.createElement('span');
    labelEl.className = 'mobile-card-label';
    labelEl.textContent = label;
    const value = document.createElement('div');
    value.className = 'mobile-card-value';
    if (cell) value.appendChild(cloneInteractive(cell));
    field.append(labelEl, value);
    return field;
  }

  function normalizedImportStatus(text) {
    const raw = String(text || '').replace(/\s+/g, ' ').trim();
    const errors = [];
    if (/미등록|미매칭|미인식/.test(raw)) errors.push('수강편람 미등록 · 확인 필요');
    if (/성적 확인 필요/.test(raw)) errors.push('성적 확인 필요');
    if (/학정번호.*보정|1글자 보정/.test(raw)) errors.push('학정번호 확인 필요');
    if (/신뢰도 낮음|\b낮음\b/.test(raw)) errors.push('인식 결과 확인 필요');
    if (/확인 필요/.test(raw) && !errors.length) errors.push('확인 필요');
    if (/W\(미취득\)|미취득/.test(raw)) errors.push('미취득');
    if (/중복|이미 등록/.test(raw)) errors.push('중복 확인 필요');
    return [...new Set(errors)].join(' · ') || '수강편람 확인';
  }

  function renderImportCards(resultId, targetId) {
    if (!isPhoneMode()) return;
    const result = document.getElementById(resultId);
    const table = result?.querySelector('table');
    const existing = document.getElementById(targetId);
    if (!table) { if (existing) existing.innerHTML = ''; return; }
    table.closest('.table-wrap')?.classList.add('mobile-original-table');
    let target = existing;
    if (!target) {
      target = document.createElement('div');
      target.id = targetId;
      target.className = 'mobile-card-list mobile-import-card-list';
      result.insertAdjacentElement('afterend', target);
    }
    target.innerHTML = '';

    const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
    const rows = [...table.querySelectorAll('tbody tr')];
    const idx = (...labels) => headers.findIndex(h => labels.some(label => h.includes(label)));
    const registerIndex = idx('등록');
    const courseIndex = idx('과목');
    const termIndex = idx('학기');
    const portalIndex = idx('포털 종별', 'OCR 종별');
    const categoryIndex = idx('인정 종별', '계산 종별');
    const creditIndex = idx('학점');
    const gradeIndex = idx('성적');
    const statusIndex = idx('상태', '신뢰도');

    rows.forEach(row => {
      const cells = [...row.children];
      if (!cells.length || row.querySelector('.empty')) return;
      const card = document.createElement('article');
      card.className = 'mobile-table-card mobile-import-card';
      const head = document.createElement('div');
      head.className = 'mobile-import-card-head';
      const course = document.createElement('div');
      course.className = 'mobile-card-course';
      if (courseIndex >= 0 && cells[courseIndex]) course.appendChild(cloneInteractive(cells[courseIndex]));
      head.appendChild(course);
      if (registerIndex >= 0 && cells[registerIndex]) {
        const register = document.createElement('div');
        register.className = 'mobile-import-register';
        register.appendChild(cloneInteractive(cells[registerIndex]));
        head.appendChild(register);
      }
      card.appendChild(head);

      let derivedTerm = null;
      if (termIndex < 0) {
        const match = (cells[courseIndex]?.textContent || '').match(/(20\d{2}-[12])/);
        if (match) { derivedTerm = document.createElement('span'); derivedTerm.textContent = match[1]; }
      }
      const grid = document.createElement('div');
      grid.className = 'mobile-import-pair-grid';
      grid.appendChild(createField('학기', termIndex >= 0 ? cells[termIndex] : derivedTerm));
      grid.appendChild(createField('포털 종별', portalIndex >= 0 ? cells[portalIndex] : null));
      grid.appendChild(createField('학점', creditIndex >= 0 ? cells[creditIndex] : null));
      grid.appendChild(createField('인정 종별', categoryIndex >= 0 ? cells[categoryIndex] : null));
      const status = createField('상태', null);
      status.querySelector('.mobile-card-value').textContent = normalizedImportStatus(statusIndex >= 0 ? cells[statusIndex]?.textContent : row.textContent);
      grid.appendChild(status);
      grid.appendChild(createField('성적', gradeIndex >= 0 ? cells[gradeIndex] : null));
      card.appendChild(grid);
      target.appendChild(card);
    });

    if (rows.some(row => !row.querySelector('.empty'))) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn primary mobile-import-register-bottom';
      button.textContent = '선택 과목 등록하기';
      button.addEventListener('click', () => document.getElementById(resultId === 'portalPdfResult' ? 'importPortalPdf' : 'importOcrCandidates')?.click());
      target.appendChild(button);
    }
  }

  function decoratePlanDuplicates() {
    if (!isPhoneMode()) return;
    const warning = [...document.querySelectorAll('#planWarnings .plan-warning')]
      .find(el => /중복과목 가능성/.test(el.textContent || ''))?.textContent || '';
    const warningKey = normalizeText(warning);
    document.querySelectorAll('#mobilePlanCards .mobile-table-card').forEach(card => {
      card.querySelectorAll('.mobile-duplicate-badge').forEach(el => el.remove());
      if (!warningKey) return;
      const course = card.querySelector('.mobile-card-course .course-name') || card.querySelector('.mobile-card-course');
      const name = course?.textContent?.trim() || '';
      if (!name || !warningKey.includes(normalizeText(name))) return;
      const badge = document.createElement('span');
      badge.className = 'mobile-duplicate-badge';
      badge.textContent = '중복 가능';
      course.appendChild(badge);
    });
  }

  function categoryLabel(category) {
    const fallback = { common:'공통', teaching:'교직', prerequisite:'선수', major_required:'전공필수', major_elective:'전공선택', thesis:'논문', research_guidance:'연구지도', report:'졸업연구보고서', audit:'청강' };
    try { if (typeof CATEGORY_LABELS !== 'undefined' && CATEGORY_LABELS?.[category]) return CATEGORY_LABELS[category]; } catch (e) {}
    return fallback[category] || '기타';
  }

  function userRecords() {
    try {
      const history = typeof state !== 'undefined' && Array.isArray(state?.history) ? state.history : [];
      const planned = typeof currentScenario === 'function' && Array.isArray(currentScenario()?.planned) ? currentScenario().planned : [];
      return [...history, ...planned];
    } catch (e) { return []; }
  }

  function findRecord(name) {
    const key = normalizeText(name);
    return userRecords().find(r => normalizeText(r.courseName) === key) || null;
  }

  function switchableMajorTeaching(name) {
    const key = normalizeText(name);
    try {
      if (typeof DATA === 'undefined') return false;
      const pools = [...(DATA.offerings || []), ...(DATA.globalOfferings || []), ...(DATA.specialCourses || [])];
      return pools.some(c => normalizeText(c.courseName) === key && Array.isArray(c.categoryOptions) && c.categoryOptions.includes('teaching') && c.categoryOptions.includes('major_elective'));
    } catch (e) { return false; }
  }

  function arrangeEvidenceLists() {
    if (!isPhoneMode()) return;
    document.querySelectorAll('#kpiGrid .kpi-evidence .evidence-row').forEach(row => {
      if (row.dataset.mobileArranged === '1') return;
      const cardLabel = row.closest('.card')?.querySelector('.kpi-label')?.textContent?.trim() || '';
      const isTotal = /졸업 인정학점|총 인정학점/.test(cardLabel);
      const name = row.querySelector('.name')?.textContent?.trim() || '';
      const term = row.querySelector('.term')?.textContent?.trim() || '';
      const chip = row.querySelector('.evidence-plan-chip')?.cloneNode(true);
      const record = findRecord(name);
      row.innerHTML = '';
      row.classList.add(isTotal ? 'mobile-evidence-total' : 'mobile-evidence-category');
      const termEl = document.createElement('span');
      termEl.className = 'mobile-evidence-term';
      termEl.textContent = term;
      row.appendChild(termEl);
      if (isTotal) {
        const cat = document.createElement('span');
        cat.className = 'mobile-evidence-category-label';
        cat.textContent = categoryLabel(record?.category || '');
        row.appendChild(cat);
      }
      const nameEl = document.createElement('span');
      nameEl.className = 'mobile-evidence-name';
      nameEl.textContent = name;
      if (chip) nameEl.append(' ', chip);
      row.appendChild(nameEl);
      if (switchableMajorTeaching(name)) {
        const badge = document.createElement('span');
        badge.className = 'mobile-evidence-switchable';
        badge.textContent = '종별 변경 가능';
        row.appendChild(badge);
      }
      row.dataset.mobileArranged = '1';
    });
  }

  function makePlannedButtonsToggleable() {
    if (!isPhoneMode()) return;
    document.querySelectorAll('.catalog-plan-btn.is-added').forEach(button => {
      button.disabled = false;
      button.dataset.mobileTogglePlan = '1';
      button.title = '다시 누르면 수강계획에서 취소됩니다.';
    });
  }

  function inferredTerm(button) {
    if (button.closest('#timetableBody,.timetable')) return document.getElementById('timetableTerm')?.value || '';
    return document.getElementById('catalogTerm')?.value || document.getElementById('planTerm')?.value || '';
  }

  function findPlanDeleteButton(courseName, term) {
    const nameKey = normalizeText(courseName);
    const termKey = normalizeText(term);
    return [...document.querySelectorAll('#planBody tr')].map(row => ({ row, text: normalizeText(row.textContent) }))
      .find(x => x.text.includes(nameKey) && (!termKey || x.text.includes(termKey)))?.row
      .querySelector('.plan-del,button.danger,button[data-plan-delete]') || null;
  }

  function wirePlanToggle() {
    document.addEventListener('click', event => {
      const button = event.target.closest?.('.catalog-plan-btn.is-added[data-mobile-toggle-plan="1"]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const row = button.closest('tr,.course-card,.catalog-course-card');
      const name = row?.querySelector('.course-name')?.textContent?.trim() || '';
      const del = findPlanDeleteButton(name, inferredTerm(button));
      if (del) del.click();
      else alert('계획된 과목을 찾지 못했습니다. 수강계획 목록에서 직접 삭제해 주세요.');
    }, true);
  }

  function readExamChecks() {
    try { const x = JSON.parse(localStorage.getItem(EXAM_CHECK_STORAGE_KEY) || '{}'); return x && typeof x === 'object' ? x : {}; }
    catch (e) { return {}; }
  }

  function writeExamChecks(value) {
    try { localStorage.setItem(EXAM_CHECK_STORAGE_KEY, JSON.stringify(value)); } catch (e) {}
  }

  function loadExamPack() {
    if (!examPackPromise) {
      examPackPromise = fetch('comprehensive-exam-2026-1.json', { cache:'no-cache' })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .catch(error => ({ error:String(error?.message || error), coursesByMajor:{} }));
    }
    return examPackPromise;
  }

  function currentMajor() {
    try { if (typeof state !== 'undefined' && state?.profile?.major) return state.profile.major; } catch (e) {}
    return document.getElementById('majorSelect')?.value || '';
  }

  function updateLegacyExamCount(count) {
    const input = document.getElementById('graduationComprehensivePassed');
    if (!input) return;
    input.value = String(Math.max(0, Math.min(2, Number(count || 0))));
    input.dispatchEvent(new Event('change', { bubbles:true }));
  }

  async function renderExamChecklist() {
    const section = document.getElementById('graduationChecklistSection');
    const input = document.getElementById('graduationComprehensivePassed');
    if (!section || !input || section.style.display === 'none') return;
    const summary = section.querySelector('summary span');
    if (summary && summary.textContent.trim() !== '종합시험 통과 여부') summary.textContent = '종합시험 통과 여부';
    const callout = section.querySelector(':scope > .callout');
    const calloutHtml = '<b>2026-1학기 종합시험 과목표 기준</b> 보조 체크입니다. 종합시험은 3학기 이상 재학생이 이수한 과목 중 2과목을 응시해 각 70점 이상 합격해야 합니다. 실제 응시 과목과 세부 조건은 응시학기 공고를 다시 확인하세요.';
    if (callout && callout.innerHTML !== calloutHtml) callout.innerHTML = calloutHtml;
    const legacy = input.closest('label');
    if (legacy) legacy.style.display = 'none';
    let wrap = document.getElementById('comprehensiveExamCourseChecklist');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'comprehensiveExamCourseChecklist';
      wrap.className = 'comprehensive-exam-checklist';
      legacy?.insertAdjacentElement('afterend', wrap);
    }
    const major = currentMajor();
    const pack = await loadExamPack();
    const courses = Array.isArray(pack.coursesByMajor?.[major]) ? pack.coursesByMajor[major] : [];
    const signature = `${major}|${courses.join('|')}`;
    if (wrap.dataset.signature === signature) return;
    wrap.dataset.signature = signature;
    if (!courses.length) {
      wrap.innerHTML = '<div class="comprehensive-exam-note">2026-1학기 과목표에서 현재 전공의 시험과목을 찾지 못했습니다. 응시학기 공고를 직접 확인하세요.</div>';
      return;
    }
    const stored = readExamChecks();
    const checked = new Set(Array.isArray(stored[major]) ? stored[major] : []);
    const oldCount = Number(input.value || 0);
    wrap.innerHTML = `<div class="comprehensive-exam-note"><b>${major}</b> · 합격한 과목을 직접 체크하세요. 과목 목록은 <b>2026-1학기 기준</b>이며 이후 학기에는 변경될 수 있습니다.${!checked.size && oldCount > 0 ? `<br>기존 합격 과목수 ${oldCount}개 기록은 과목명이 없어 아래에서 다시 체크해야 합니다.` : ''}</div><div class="comprehensive-exam-list"></div><div class="comprehensive-exam-progress"></div><div class="comprehensive-exam-source">판정 기준: 2과목 합격 · 과목별 70점 이상. 학교 시험결과를 불러오는 기능이 아니라 사용자가 직접 입력하는 보조 기록입니다.</div>`;
    const list = wrap.querySelector('.comprehensive-exam-list');
    courses.forEach(course => {
      const label = document.createElement('label');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = checked.has(course);
      box.dataset.examCourse = course;
      const text = document.createElement('span');
      text.textContent = course;
      label.append(box, text);
      list.appendChild(label);
    });
    const update = persist => {
      const selected = [...wrap.querySelectorAll('[data-exam-course]:checked')].map(x => x.dataset.examCourse);
      const progress = wrap.querySelector('.comprehensive-exam-progress');
      const passed = selected.length >= 2;
      progress.textContent = `${selected.length} / 2과목 ${passed ? '· 통과' : '· 확인 필요'}`;
      progress.classList.toggle('ok', passed);
      if (persist) {
        const all = readExamChecks();
        all[major] = selected;
        writeExamChecks(all);
        updateLegacyExamCount(selected.length);
      }
    };
    wrap.querySelectorAll('[data-exam-course]').forEach(box => box.addEventListener('change', () => update(true)));
    update(false);
  }

  function loadScript(src, globalName) {
    if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(globalName ? window[globalName] : true);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function buildPngReport() {
    const source = document.querySelector('.app');
    if (!source) throw new Error('보고서 영역을 찾지 못했습니다.');
    const capture = document.createElement('div');
    capture.id = 'mobilePngCapture';
    const clone = source.cloneNode(true);
    clone.querySelector('#historySection')?.remove();
    clone.querySelectorAll('details').forEach(el => el.setAttribute('open',''));
    clone.querySelectorAll('select').forEach(select => { const span = document.createElement('span'); span.textContent = select.options?.[select.selectedIndex]?.textContent || select.value || ''; select.replaceWith(span); });
    clone.querySelectorAll('input').forEach(input => { const span = document.createElement('span'); span.textContent = input.type === 'checkbox' ? (input.checked ? '✓' : '') : (input.value || ''); input.replaceWith(span); });
    clone.querySelectorAll('textarea').forEach(area => { const span = document.createElement('span'); span.textContent = area.value || ''; area.replaceWith(span); });
    clone.querySelectorAll('.no-print,.no-print-ui,.mobile-only,button').forEach(el => el.remove());
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    capture.appendChild(clone);
    document.body.appendChild(capture);
    return capture;
  }

  function canvasBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG 변환에 실패했습니다.')), 'image/png', 0.96));
  }

  async function shareOrDownload(blob) {
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const name = `yonsei-gse-degree-status-${stamp}.png`;
    const file = new File([blob], name, { type:'image/png' });
    if (navigator.canShare && navigator.share && navigator.canShare({ files:[file] })) {
      try { await navigator.share({ files:[file], title:'졸업요건 이수현황' }); return; }
      catch (error) { if (error?.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function savePng(button) {
    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = '이미지 생성 중…';
    let capture = null;
    try {
      if (typeof applyPrintMode === 'function') applyPrintMode(true);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js','html2canvas');
      capture = buildPngReport();
      const canvas = await window.html2canvas(capture, { backgroundColor:'#fff', scale:Math.min(2, Math.max(1.25, window.devicePixelRatio || 1.5)), useCORS:true, logging:false, width:capture.scrollWidth, height:capture.scrollHeight, windowWidth:1100 });
      await shareOrDownload(await canvasBlob(canvas));
    } catch (error) {
      console.error(error);
      alert(`이미지 저장에 실패했습니다. Safari에서 다시 시도해 주세요.\n${error?.message || error}`);
    } finally {
      capture?.remove();
      try { if (typeof applyPrintMode === 'function') applyPrintMode(false); } catch (e) {}
      button.disabled = false;
      button.textContent = oldText;
    }
  }

  function syncExportButtons() {
    ['quickPrint','pdfSaveBottom'].forEach(id => {
      const button = document.getElementById(id);
      if (!button) return;
      if (!originalPrintHandlers.has(button)) originalPrintHandlers.set(button, { onclick:button.onclick, text:button.textContent });
      const original = originalPrintHandlers.get(button);
      if (isPhoneMode()) {
        button.textContent = id === 'quickPrint' ? '이미지 저장' : '결과 이미지 저장(PNG)';
        button.onclick = event => { event?.preventDefault?.(); savePng(button); };
      } else {
        button.textContent = original.text;
        button.onclick = original.onclick;
      }
    });
  }

  function renderAll() {
    queued = false;
    syncExportButtons();
    if (isPhoneMode()) {
      renderImportCards('portalPdfResult','mobilePdfReviewCards');
      renderImportCards('ocrResult','mobileOcrReviewCards');
      decoratePlanDuplicates();
      arrangeEvidenceLists();
      makePlannedButtonsToggleable();
    }
    renderExamChecklist();
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => requestAnimationFrame(renderAll));
  }

  function observe(id) {
    const el = document.getElementById(id);
    if (el) new MutationObserver(queue).observe(el, { childList:true, subtree:true });
  }

  function init() {
    installStyles();
    wirePlanToggle();
    ['portalPdfResult','ocrResult','mobilePlanCards','planWarnings','kpiGrid','graduationChecklistSection','catalogBody','timetableBody','planBody'].forEach(observe);
    ['majorSelect','catalogTerm','timetableTerm','planTerm','planCourse','planCourseSearch','planFilterCategory','planScope','planProfessorSearch'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', queue);
      el.addEventListener('input', queue);
    });
    window.addEventListener('resize', queue, { passive:true });
    window.addEventListener('orientationchange', () => setTimeout(queue, 80), { passive:true });
    queue();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
