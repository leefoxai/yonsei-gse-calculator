(() => {
  'use strict';

  const CAPTURE_ID = 'mobilePngCaptureV2';
  let saving = false;
  let html2canvasPromise = null;

  function isMobile() {
    return document.body.classList.contains('mobile-mode');
  }

  function installCaptureStyles() {
    if (document.getElementById('mobilePngFixStyles')) return;
    const style = document.createElement('style');
    style.id = 'mobilePngFixStyles';
    style.textContent = `
      #${CAPTURE_ID}{position:fixed;left:-20000px;top:0;width:1024px;padding:24px;background:#fff;color:#172033;z-index:-1;font-family:"Wanted Sans Variable","Wanted Sans","Pretendard Variable",Pretendard,"Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif;font-size:13px;line-height:1.45}
      #${CAPTURE_ID} *{box-sizing:border-box}
      #${CAPTURE_ID} .app{width:100%;max-width:none;margin:0;padding:0;background:#fff}
      #${CAPTURE_ID} .header{margin:0 0 10px;padding:15px 18px;border-radius:10px;box-shadow:none}
      #${CAPTURE_ID} .header h1{font-size:21px!important;line-height:1.25;margin:0!important}
      #${CAPTURE_ID} .header p{font-size:9px!important;line-height:1.35!important}
      #${CAPTURE_ID} .title-edit-row{margin-bottom:5px!important}
      #${CAPTURE_ID} .public-caution-notice{margin:0 0 10px!important;padding:9px 11px!important;border-radius:7px!important;font-size:10px!important;line-height:1.4!important;box-shadow:none!important}
      #${CAPTURE_ID} .public-caution-title{font-size:10.5px!important}
      #${CAPTURE_ID} .public-caution-detail{margin-top:3px!important;font-size:9.5px!important;line-height:1.4!important}
      #${CAPTURE_ID} .input-zone,#${CAPTURE_ID} .analysis-zone{display:contents!important;margin:0!important;padding:0!important;border:0!important;background:none!important}
      #${CAPTURE_ID} .print-only{display:block!important}
      #${CAPTURE_ID} #profileSection{display:block!important;width:100%!important;margin:0 0 7px!important}
      #${CAPTURE_ID} #profileSection>.card{display:none!important}
      #${CAPTURE_ID} #printProfileSummary{display:grid!important;grid-template-columns:1.25fr .8fr 1.2fr!important;gap:0!important;border:1px solid #d8dee8!important;border-radius:7px!important;overflow:hidden!important;background:#fff!important}
      #${CAPTURE_ID} .print-profile-item{min-width:0!important;display:flex!important;align-items:center!important;gap:7px!important;padding:7px 9px!important;border-left:1px solid #e6eaf0!important;white-space:nowrap!important}
      #${CAPTURE_ID} .print-profile-item:first-child{border-left:0!important}
      #${CAPTURE_ID} .print-profile-label{font-size:8px!important;color:#667085!important;font-weight:700!important}
      #${CAPTURE_ID} .print-profile-value{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:10px!important;font-weight:900!important;color:#172033!important}
      #${CAPTURE_ID} #resultPrimarySummary{display:grid!important;grid-template-columns:.8fr 1.4fr!important;gap:6px!important;margin:0 0 7px!important}
      #${CAPTURE_ID} #resultPrimarySummary:empty{display:none!important}
      #${CAPTURE_ID} .result-headline-card,#${CAPTURE_ID} .next-actions-card{padding:8px 9px!important;border-radius:7px!important;box-shadow:none!important}
      #${CAPTURE_ID} .result-headline-title{font-size:13px!important}
      #${CAPTURE_ID} .result-headline-kicker,#${CAPTURE_ID} .result-headline-sub,#${CAPTURE_ID} .next-actions-head{font-size:8px!important;margin:0!important}
      #${CAPTURE_ID} .next-action-list{gap:3px!important}
      #${CAPTURE_ID} .next-action{font-size:8px!important;padding:3px 4px!important;grid-template-columns:17px 1fr!important}
      #${CAPTURE_ID} .next-action-num{width:16px!important;height:16px!important;font-size:7px!important}
      #${CAPTURE_ID} #resultDetailsPanel{display:contents!important}
      #${CAPTURE_ID} #requirementsSection{display:block!important;width:100%!important;margin:0 0 7px!important;padding:8px!important;border:1px solid #d8dee8!important;border-radius:7px!important;box-shadow:none!important;overflow:hidden!important}
      #${CAPTURE_ID} #requirementsSection h2{font-size:13px!important;line-height:1.2!important;margin:0 0 6px!important}
      #${CAPTURE_ID} #requirementsSection .req-grid{display:grid!important;grid-template-columns:1.15fr .72fr .95fr 1.45fr!important;min-width:0!important;width:100%!important;gap:0!important;font-size:9px!important;border-radius:5px!important;overflow:hidden!important}
      #${CAPTURE_ID} #requirementsSection .req-grid>div{padding:4px 5px!important}
      #${CAPTURE_ID} #historySection{display:block!important;width:100%!important;margin:0 0 7px!important;padding:7px 8px!important;border:1px solid #d8dee8!important;border-radius:7px!important;box-shadow:none!important;background:#fff!important}
      #${CAPTURE_ID} #historySection>*{display:none!important}
      #${CAPTURE_ID} #historySection>#printSemesterGpaSummary{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:4px 10px!important;font-size:8.5px!important;line-height:1.3!important}
      #${CAPTURE_ID} .print-gpa-title{font-weight:900!important;color:#172033!important}
      #${CAPTURE_ID} .print-gpa-item{white-space:nowrap!important;color:#475467!important}
      #${CAPTURE_ID} .print-gpa-item b{color:#172033!important}
      #${CAPTURE_ID} .print-gpa-total{white-space:nowrap!important;margin-left:auto!important;font-weight:900!important;color:#0b57a4!important}
      #${CAPTURE_ID} #planSection{display:block!important;width:100%!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:#fff!important}
      #${CAPTURE_ID} #planSection .schedule-compare{display:grid!important;grid-template-columns:1fr!important;gap:6px!important;margin-top:0!important}
      #${CAPTURE_ID} #planSection .schedule-pane{padding:6px!important;border-radius:7px!important;box-shadow:none!important}
      #${CAPTURE_ID} #planSection h3{font-size:11px!important;margin:0 0 4px!important}
      #${CAPTURE_ID} #planSection .plan-term-schedule{break-inside:avoid!important}
      #${CAPTURE_ID} #planSection .plan-term-schedule-body{display:block!important}
      #${CAPTURE_ID} #planSection .weekly-schedule{overflow:visible!important}
      #${CAPTURE_ID} #planSection .weekly-schedule table{min-width:0!important;width:100%!important;table-layout:fixed!important;font-size:8px!important}
      #${CAPTURE_ID} #planSection .schedule-course{font-size:8px!important;padding:4px!important;margin:1px 0!important;border-radius:4px!important}
      #${CAPTURE_ID} #planSection .timeline-wrap{width:100%!important;min-width:0!important}
      #${CAPTURE_ID} #planSection .timeline-head{font-size:8px!important}
      #${CAPTURE_ID} #planSection .timeline-head>div{padding:3px!important}
      #${CAPTURE_ID} #planSection .timeline-time-label{font-size:7px!important;width:48px!important;padding-right:4px!important}
      #${CAPTURE_ID} #planSection .timeline-course{left:4px!important;right:4px!important;padding:5px!important;font-size:8px!important;overflow:hidden!important}
      #${CAPTURE_ID} #planSection .timeline-course b{font-size:9px!important;line-height:1.25!important;margin-bottom:2px!important}
      #${CAPTURE_ID} #planSection .timeline-course span{font-size:7.5px!important;line-height:1.25!important}
      #${CAPTURE_ID} #planSection .reference-viewer{width:100%!important;min-height:0!important;display:block!important;overflow:visible!important;border:0!important;margin-top:0!important}
      #${CAPTURE_ID} #planSection .reference-snapshot{width:100%!important;min-width:0!important;padding:6px!important}
      #${CAPTURE_ID} #planSection .reference-viewer img{max-height:180px!important}
      #${CAPTURE_ID} .table-wrap{max-height:none!important;overflow:visible!important}
      #${CAPTURE_ID} .card{box-shadow:none!important}
    `;
    document.head.appendChild(style);
  }

  function removeAll(root, selector) {
    root.querySelectorAll(selector).forEach(el => el.remove());
  }

  function keepOnlyHistorySummary(clone) {
    const history = clone.querySelector('#historySection');
    if (!history) return;
    [...history.children].forEach(child => {
      if (child.id !== 'printSemesterGpaSummary') child.remove();
    });
    const summary = history.querySelector('#printSemesterGpaSummary');
    if (!summary || !summary.textContent.trim()) history.remove();
  }

  function prunePlan(clone) {
    const plan = clone.querySelector('#planSection');
    if (!plan) return;
    removeAll(plan, ':scope > summary,:scope > .plan-sheet-utility,:scope > .plan-forecast-notice,:scope > #planGapCandidates,:scope > #planAddSection,:scope > #planSelectionNote,:scope > .callout,:scope > #planWarnings,:scope > .table-wrap');
    removeAll(plan, '.plan-unplaced,.reference-pane>.section-title-row,.plan-settings,.reference-feed');
    plan.querySelectorAll('.reference-pane.print-empty').forEach(el => el.remove());
    plan.querySelectorAll('details').forEach(el => el.setAttribute('open',''));
    const meaningful = plan.querySelector('.schedule-course,.timeline-course,.reference-snapshot,.plan-term-schedule-body table tbody tr');
    if (!meaningful) plan.remove();
  }

  function buildReportClone() {
    const source = document.querySelector('.app');
    if (!source) throw new Error('보고서 영역을 찾지 못했습니다.');

    const capture = document.createElement('div');
    capture.id = CAPTURE_ID;
    const clone = source.cloneNode(true);

    removeAll(clone, '.quick-guide,.workflow-strip,#extraFeatures,.backup-section,.footer,#scrollTopBtn,.analysis-links,.no-print,.no-print-ui,.mobile-only,button');
    removeAll(clone, '#profileSection>.card,#projectionControls,#kpiSection,#resultDetailsPanel>summary,.analysis-empty');
    keepOnlyHistorySummary(clone);
    prunePlan(clone);

    const inputZone = clone.querySelector('#inputZone');
    if (inputZone) inputZone.setAttribute('open','');
    const analysisZone = clone.querySelector('#analysisZone');
    if (analysisZone) analysisZone.setAttribute('open','');
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

    const requirements = clone.querySelector('#requirementsSection');
    if (requirements && !requirements.textContent.trim()) requirements.remove();
    const primary = clone.querySelector('#resultPrimarySummary');
    if (primary && !primary.textContent.trim()) primary.remove();

    capture.appendChild(clone);
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
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG 변환에 실패했습니다.')), 'image/png', 0.96);
    });
  }

  async function shareOrDownload(blob) {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    const filename = `yonsei-gse-degree-status-${stamp}.png`;
    const file = new File([blob], filename, { type:'image/png' });

    if (navigator.canShare && navigator.share && navigator.canShare({ files:[file] })) {
      try {
        await navigator.share({ files:[file], title:'졸업요건 이수현황' });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
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
    if (button) {
      button.disabled = true;
      button.textContent = '이미지 생성 중…';
    }

    let capture = null;
    try {
      if (typeof window.applyPrintMode === 'function') window.applyPrintMode(true);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await ensureHtml2Canvas();
      capture = buildReportClone();
      await new Promise(resolve => requestAnimationFrame(resolve));

      const width = Math.max(1, capture.scrollWidth);
      const height = Math.max(1, capture.scrollHeight);
      const maxPixels = 12000000;
      const safeScale = Math.min(1.5, Math.max(0.8, Math.sqrt(maxPixels / (width * height))));
      const canvas = await window.html2canvas(capture, {
        backgroundColor:'#fff',
        scale:safeScale,
        useCORS:true,
        logging:false,
        width,
        height,
        windowWidth:1024,
        scrollX:0,
        scrollY:0
      });
      await shareOrDownload(await canvasToBlob(canvas));
    } catch (error) {
      console.error('[mobile-png]', error);
      alert(`이미지 저장에 실패했습니다. Safari에서 다시 시도해 주세요.\n${error?.message || error}`);
    } finally {
      capture?.remove();
      try { if (typeof window.applyPrintMode === 'function') window.applyPrintMode(false); } catch (e) {}
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
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
    installCaptureStyles();
    syncLabels();
    document.addEventListener('click', interceptSaveClick, true);
    window.addEventListener('resize', syncLabels, { passive:true });
    window.addEventListener('orientationchange', () => setTimeout(syncLabels,80), { passive:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
