(() => {
  'use strict';

  const CAPTURE_ID = 'mobilePngCaptureV3';
  let saving = false;
  let html2canvasPromise = null;

  function isMobile() {
    return document.body.classList.contains('mobile-mode');
  }

  function installStyles() {
    if (document.getElementById('mobilePngReportStylesV3')) return;
    const style = document.createElement('style');
    style.id = 'mobilePngReportStylesV3';
    style.textContent = `
      #${CAPTURE_ID}{position:absolute;left:-100000px;top:0;width:1040px;height:auto!important;min-height:0!important;overflow:visible!important;padding:24px;background:#fff;color:#172033;z-index:-1;font-family:"Wanted Sans Variable","Wanted Sans","Pretendard Variable",Pretendard,"Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif;font-size:13px;line-height:1.45}
      #${CAPTURE_ID},#${CAPTURE_ID} *{box-sizing:border-box}
      #${CAPTURE_ID} .report-header{margin:0 0 10px;padding:15px 18px;border-radius:10px;background:linear-gradient(135deg,#003876,#145ca8);color:#fff}
      #${CAPTURE_ID} .report-header h1{margin:0 0 5px;font-size:21px;line-height:1.25;color:#fff}
      #${CAPTURE_ID} .report-header p{margin:0;font-size:9px;line-height:1.35;color:#fff}
      #${CAPTURE_ID} .report-notice{margin:0 0 10px;padding:10px 12px;border:1px solid #f2a7ae;border-left:5px solid #d92d20;border-radius:8px;background:#fff1f2;color:#7a271a;font-size:10px;line-height:1.45}
      #${CAPTURE_ID} .report-notice>div+div{margin-top:3px}
      #${CAPTURE_ID} .report-profile{display:grid;grid-template-columns:1.2fr .8fr 1.25fr;margin:0 0 8px;border:1px solid #d8dee8;border-radius:7px;overflow:hidden;background:#fff}
      #${CAPTURE_ID} .report-profile-item{display:flex;align-items:center;gap:7px;min-width:0;padding:8px 10px;border-left:1px solid #e6eaf0}
      #${CAPTURE_ID} .report-profile-item:first-child{border-left:0}
      #${CAPTURE_ID} .report-profile-label{flex:0 0 auto;color:#667085;font-size:8px;font-weight:700}
      #${CAPTURE_ID} .report-profile-value{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#172033;font-size:10px;font-weight:900}
      #${CAPTURE_ID} .report-section{width:100%;height:auto!important;min-height:0!important;margin:0 0 8px;padding:8px;border:1px solid #d8dee8;border-radius:7px;background:#fff;box-shadow:none!important;overflow:visible!important}
      #${CAPTURE_ID} .report-section-title{margin:0 0 6px;font-size:13px;font-weight:900;color:#172033}
      #${CAPTURE_ID} .report-section h2{margin:0 0 6px!important;font-size:13px!important;line-height:1.25!important}
      #${CAPTURE_ID} .report-section h3{margin:0 0 5px!important;font-size:11px!important}
      #${CAPTURE_ID} .report-primary{display:grid;grid-template-columns:.8fr 1.4fr;gap:6px;margin:0 0 8px}
      #${CAPTURE_ID} .report-primary .result-headline-card,#${CAPTURE_ID} .report-primary .next-actions-card{padding:8px 9px!important;border:1px solid #d8dee8!important;border-radius:7px!important;box-shadow:none!important}
      #${CAPTURE_ID} .report-primary .result-headline-title{font-size:13px!important}
      #${CAPTURE_ID} .report-primary .result-headline-kicker,#${CAPTURE_ID} .report-primary .result-headline-sub,#${CAPTURE_ID} .report-primary .next-actions-head{font-size:8px!important;margin:0!important}
      #${CAPTURE_ID} .report-primary .next-action-list{gap:3px!important}
      #${CAPTURE_ID} .report-primary .next-action{font-size:8px!important;padding:3px 4px!important;grid-template-columns:17px 1fr!important;cursor:default!important;transform:none!important}
      #${CAPTURE_ID} .report-primary .next-action-num{width:16px!important;height:16px!important;font-size:7px!important}
      #${CAPTURE_ID} .report-primary .next-action-go{display:none!important}
      #${CAPTURE_ID} .report-requirements .req-grid{display:grid!important;grid-template-columns:1.15fr .72fr .95fr 1.45fr!important;min-width:0!important;width:100%!important;gap:0!important;border:1px solid #d8dee8!important;border-radius:5px!important;overflow:hidden!important;font-size:9px!important}
      #${CAPTURE_ID} .report-requirements .req-grid>div{padding:4px 5px!important}
      #${CAPTURE_ID} .report-requirements .callout,#${CAPTURE_ID} .report-requirements .result-summary,#${CAPTURE_ID} .report-requirements .qualification-note{margin-top:5px!important;padding:5px 6px!important;font-size:8px!important;line-height:1.35!important;border-radius:5px!important}
      #${CAPTURE_ID} .report-gpa{display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;font-size:8.5px;line-height:1.3}
      #${CAPTURE_ID} .report-gpa .print-gpa-title{font-weight:900;color:#172033}
      #${CAPTURE_ID} .report-gpa .print-gpa-item{white-space:nowrap;color:#475467}
      #${CAPTURE_ID} .report-gpa .print-gpa-item b{color:#172033}
      #${CAPTURE_ID} .report-gpa .print-gpa-total{margin-left:auto;white-space:nowrap;font-weight:900;color:#0b57a4}
      #${CAPTURE_ID} .report-gpa-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
      #${CAPTURE_ID} .report-gpa-grid .semester-gpa-card{padding:6px!important;border:1px solid #e1e7ef!important;border-radius:6px!important;box-shadow:none!important;font-size:8px!important}
      #${CAPTURE_ID} .report-plan{padding:0;border:0;background:#fff}
      #${CAPTURE_ID} .report-plan-block{margin:0 0 7px;padding:7px;border:1px solid #d8dee8;border-radius:7px;background:#fff;overflow:visible!important}
      #${CAPTURE_ID} .report-plan-block details{display:block!important;height:auto!important;min-height:0!important;overflow:visible!important}
      #${CAPTURE_ID} .report-plan-block details>summary{display:flex!important;font-size:9px!important;padding:4px!important}
      #${CAPTURE_ID} .report-plan-block details[open]>*:not(summary){display:block!important}
      #${CAPTURE_ID} .report-plan-block .schedule-compare{display:grid!important;grid-template-columns:1fr!important;gap:6px!important;margin:0!important}
      #${CAPTURE_ID} .report-plan-block .schedule-pane{padding:6px!important;border-radius:6px!important;box-shadow:none!important}
      #${CAPTURE_ID} .report-plan-block .weekly-schedule{overflow:visible!important}
      #${CAPTURE_ID} .report-plan-block .weekly-schedule table{min-width:0!important;width:100%!important;table-layout:fixed!important;font-size:8px!important}
      #${CAPTURE_ID} .report-plan-block .schedule-course{font-size:8px!important;padding:4px!important;margin:1px 0!important;border-radius:4px!important}
      #${CAPTURE_ID} .report-plan-block .timeline-wrap{width:100%!important;min-width:0!important}
      #${CAPTURE_ID} .report-plan-block .timeline-head{font-size:8px!important}
      #${CAPTURE_ID} .report-plan-block .timeline-course{left:4px!important;right:4px!important;padding:5px!important;font-size:8px!important;overflow:hidden!important}
      #${CAPTURE_ID} .report-plan-block .timeline-course b{font-size:9px!important}
      #${CAPTURE_ID} .report-plan-block .timeline-course span{font-size:7.5px!important}
      #${CAPTURE_ID} .report-plan-block .reference-viewer{display:block!important;width:100%!important;min-height:0!important;height:auto!important;overflow:visible!important;border:0!important}
      #${CAPTURE_ID} .report-plan-block .reference-viewer img{max-height:180px!important;width:auto!important;object-fit:contain!important}
      #${CAPTURE_ID} .report-plan-block .reference-feed,#${CAPTURE_ID} .report-plan-block .plan-settings,#${CAPTURE_ID} .report-plan-block button{display:none!important}
      #${CAPTURE_ID} table{width:100%;border-collapse:collapse}
      #${CAPTURE_ID} th,#${CAPTURE_ID} td{padding:4px;border-bottom:1px solid #e6eaf0;text-align:left;vertical-align:top;font-size:8px;position:static!important}
      #${CAPTURE_ID} .mobile-only,#${CAPTURE_ID} .no-print,#${CAPTURE_ID} .no-print-ui,#${CAPTURE_ID} button{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function selectedText(id) {
    const el = document.getElementById(id);
    if (!el) return '-';
    if (el.tagName === 'SELECT') return el.options?.[el.selectedIndex]?.textContent?.trim() || el.value || '-';
    return el.textContent?.trim() || el.value || '-';
  }

  function trackText() {
    const wrap = document.getElementById('trackButtons');
    if (!wrap) return '-';
    const selected = wrap.querySelector('button.active,button.selected,button[aria-pressed="true"]');
    if (selected) return selected.textContent.trim();
    try {
      const track = typeof state !== 'undefined' ? state?.profile?.track : '';
      if (track === 'thesis') return '논문';
      if (track === 'research') return '연구과정(비학위)';
      if (track === 'report') return '졸업연구보고서';
    } catch (e) {}
    return '-';
  }

  function cleanClone(source) {
    const clone = source.cloneNode(true);
    clone.querySelectorAll('.no-print,.no-print-ui,.mobile-only,button').forEach(el => el.remove());
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    clone.querySelectorAll('details').forEach(el => el.setAttribute('open',''));
    clone.querySelectorAll('select').forEach(select => {
      const span = document.createElement('span');
      span.textContent = select.options?.[select.selectedIndex]?.textContent || select.value || '';
      select.replaceWith(span);
    });
    clone.querySelectorAll('input').forEach(input => {
      const span = document.createElement('span');
      span.textContent = input.type === 'checkbox' ? (input.checked ? '✓' : '') : (input.value || '');
      input.replaceWith(span);
    });
    clone.querySelectorAll('textarea').forEach(area => {
      const span = document.createElement('span');
      span.textContent = area.value || '';
      area.replaceWith(span);
    });
    return clone;
  }

  function hasMeaningfulContent(element) {
    if (!element) return false;
    const text = (element.textContent || '').replace(/\s+/g,' ').trim();
    return text.length > 0 || !!element.querySelector('img,.schedule-course,.timeline-course,tbody tr');
  }

  function buildHeader() {
    const source = document.querySelector('.header');
    const header = document.createElement('div');
    header.className = 'report-header';
    const title = source?.querySelector('h1')?.textContent?.trim() || document.title;
    const meta = source?.querySelector('.creator-line')?.textContent?.replace(/\s+/g,' ')?.trim() || '';
    header.innerHTML = `<h1>${escapeHtml(title)}</h1>${meta ? `<p>${escapeHtml(meta)}</p>` : ''}`;
    return header;
  }

  function buildNotice() {
    const source = document.getElementById('publicCautionNotice');
    if (!source) return null;
    const notice = cleanClone(source);
    notice.className = 'report-notice';
    return notice;
  }

  function buildProfile() {
    const profile = document.createElement('div');
    profile.className = 'report-profile';
    const items = [
      ['전공', selectedText('majorSelect')],
      ['입학학기', selectedText('admissionSelect')],
      ['과정 / 졸업유형', trackText()]
    ];
    profile.innerHTML = items.map(([label,value]) => `<div class="report-profile-item"><span class="report-profile-label">${escapeHtml(label)}</span><span class="report-profile-value">${escapeHtml(value)}</span></div>`).join('');
    return profile;
  }

  function appendPrimary(capture) {
    const source = document.getElementById('resultPrimarySummary');
    if (!hasMeaningfulContent(source)) return;
    const clone = cleanClone(source);
    clone.className = 'report-primary';
    capture.appendChild(clone);
  }

  function appendRequirements(capture) {
    const source = document.getElementById('requirementsSection');
    if (!hasMeaningfulContent(source)) return;
    const section = document.createElement('section');
    section.className = 'report-section report-requirements';
    const clone = cleanClone(source);
    clone.querySelectorAll('.kpi-evidence,.teacher-evidence-wrap,.plan-forecast-notice').forEach(el => el.remove());
    while (clone.firstChild) section.appendChild(clone.firstChild);
    capture.appendChild(section);
  }

  function appendGpa(capture) {
    try { if (typeof renderSemesterGpa === 'function') renderSemesterGpa(); } catch (e) {}
    const printSummary = document.getElementById('printSemesterGpaSummary');
    const grid = document.getElementById('semesterGpaGrid');
    if (!hasMeaningfulContent(printSummary) && !hasMeaningfulContent(grid)) return;
    const section = document.createElement('section');
    section.className = 'report-section';
    const title = document.createElement('div');
    title.className = 'report-section-title';
    title.textContent = '학기별 성적 요약';
    section.appendChild(title);
    if (hasMeaningfulContent(printSummary)) {
      const clone = cleanClone(printSummary);
      clone.className = 'report-gpa';
      section.appendChild(clone);
    } else {
      const clone = cleanClone(grid);
      clone.className = 'report-gpa-grid';
      section.appendChild(clone);
    }
    capture.appendChild(section);
  }

  function appendPlan(capture) {
    try {
      if (typeof renderPlanTimetable === 'function') renderPlanTimetable();
      if (typeof renderScheduleReferences === 'function') renderScheduleReferences();
    } catch (e) {}
    const plan = document.getElementById('planSection');
    if (!plan) return;
    const candidates = [...plan.querySelectorAll('.plan-term-schedules,.schedule-compare,.reference-snapshot')];
    const unique = [...new Set(candidates)].filter(hasMeaningfulContent);
    if (!unique.length) return;
    const wrapper = document.createElement('section');
    wrapper.className = 'report-plan';
    const title = document.createElement('div');
    title.className = 'report-section-title';
    title.textContent = '계획 학기별 시간표';
    wrapper.appendChild(title);
    unique.forEach(source => {
      if (unique.some(other => other !== source && other.contains(source))) return;
      const block = document.createElement('div');
      block.className = 'report-plan-block';
      block.appendChild(cleanClone(source));
      wrapper.appendChild(block);
    });
    if (wrapper.children.length > 1) capture.appendChild(wrapper);
  }

  function buildReport() {
    const capture = document.createElement('div');
    capture.id = CAPTURE_ID;
    capture.appendChild(buildHeader());
    const notice = buildNotice();
    if (notice) capture.appendChild(notice);
    capture.appendChild(buildProfile());
    appendPrimary(capture);
    appendRequirements(capture);
    appendGpa(capture);
    appendPlan(capture);
    document.body.appendChild(capture);
    return capture;
  }

  function ensureHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (html2canvasPromise) return html2canvasPromise;
    html2canvasPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      script.async = true;
      script.onload = () => window.html2canvas ? resolve(window.html2canvas) : reject(new Error('이미지 생성 라이브러리를 찾지 못했습니다.'));
      script.onerror = () => reject(new Error('이미지 생성 라이브러리를 불러오지 못했습니다.'));
      document.head.appendChild(script);
    });
    return html2canvasPromise;
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG 변환에 실패했습니다.')), 'image/png', 0.96));
  }

  async function shareOrDownload(blob) {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    const filename = `yonsei-gse-degree-status-${stamp}.png`;
    const file = new File([blob], filename, { type:'image/png' });
    if (navigator.canShare && navigator.share && navigator.canShare({ files:[file] })) {
      try { await navigator.share({ files:[file], title:'졸업요건 이수현황' }); return; }
      catch (error) { if (error?.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function saveReportPng(button) {
    if (saving) return;
    saving = true;
    const originalText = button?.textContent || '이미지 저장';
    if (button) { button.disabled = true; button.textContent = '이미지 생성 중…'; }
    let capture = null;
    try {
      try { if (typeof applyPrintMode === 'function') applyPrintMode(true); } catch (e) {}
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await ensureHtml2Canvas();
      capture = buildReport();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const width = Math.max(1, Math.ceil(capture.getBoundingClientRect().width));
      const height = Math.max(1, Math.ceil(capture.scrollHeight));
      const maxPixels = 14000000;
      const scale = Math.min(1.6, Math.max(0.85, Math.sqrt(maxPixels / (width * height))));
      const canvas = await window.html2canvas(capture, { backgroundColor:'#fff', scale, useCORS:true, logging:false, width, height, windowWidth:1040, scrollX:0, scrollY:0 });
      await shareOrDownload(await canvasToBlob(canvas));
    } catch (error) {
      console.error('[mobile-png]', error);
      alert(`이미지 저장에 실패했습니다. Safari에서 다시 시도해 주세요.\n${error?.message || error}`);
    } finally {
      capture?.remove();
      try { if (typeof applyPrintMode === 'function') applyPrintMode(false); } catch (e) {}
      if (button) { button.disabled = false; button.textContent = originalText; }
      saving = false;
    }
  }

  function syncLabels() {
    if (!isMobile()) return;
    const top = document.getElementById('quickPrint');
    const bottom = document.getElementById('pdfSaveBottom');
    if (top) top.textContent = '이미지 저장';
    if (bottom) bottom.textContent = '결과 이미지 저장(PNG)';
  }

  function interceptSaveClick(event) {
    if (!isMobile()) return;
    const button = event.target.closest?.('#quickPrint,#pdfSaveBottom');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    saveReportPng(button);
  }

  function init() {
    installStyles();
    syncLabels();
    document.addEventListener('click', interceptSaveClick, true);
    window.addEventListener('resize', syncLabels, { passive:true });
    window.addEventListener('orientationchange', () => setTimeout(syncLabels,80), { passive:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
