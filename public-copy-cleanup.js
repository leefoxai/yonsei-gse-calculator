(() => {
  'use strict';

  function remove(selector, root = document) {
    root.querySelectorAll(selector).forEach(el => el.remove());
  }

  function trimStepDescriptions() {
    remove('#inputZone > summary p');
    remove('#historySection > summary p');
    remove('#analysisZone > summary p');
  }

  function trimMobileImportGuide() {
    const guide = document.getElementById('mobileImportGuide');
    if (!guide) return;

    remove('.mobile-import-tip', guide);

    const recommended = guide.querySelector('.mobile-import-method.recommended');
    if (recommended) {
      const paragraphs = [...recommended.querySelectorAll('p')];
      paragraphs.slice(1).forEach(p => p.remove());
    }
  }

  function trimPdfImport() {
    const panel = document.querySelector('#pdfImportPane .pdf-import-panel');
    if (!panel) return;
    remove('.pdf-import-head .muted', panel);
    remove('.pdf-recommended', panel);
    remove('.library-load-note', panel);
  }

  function trimOcrImport() {
    const panel = document.querySelector('#ocrImportPane .ocr-panel');
    if (!panel) return;
    remove('.pdf-import-head .muted', panel);
    remove('.ocr-alt-badge', panel);
    remove('.ocr-batch-note', panel);
    remove('.ocr-actions > .muted', panel);
  }

  function trimPlanCopy() {
    const plan = document.getElementById('planSection');
    if (!plan) return;
    remove('.plan-builder-help', plan);
    remove(':scope > .callout.warnbox', plan);
    remove(':scope > .muted.no-print:not([id])', plan);
  }

  function trimExtraFeatures() {
    const extras = document.getElementById('extraFeatures');
    if (!extras) return;
    const heading = extras.querySelector(':scope > summary .extras-summary-copy h2');
    if (heading) heading.textContent = '개설 예정 강의 확인하기';
    remove(':scope > summary .extras-summary-copy p', extras);
    remove(':scope > summary .addon-badge', extras);
  }

  function trimBackupCopy() {
    const backup = document.querySelector('.backup-section');
    if (!backup) return;
    remove('h2 .addon-badge', backup);
    remove(':scope > .muted:not([id])', backup);
    const meta = document.getElementById('packMetaSummary');
    if (meta) meta.style.display = 'none';
  }

  function simplifyFooter() {
    const footer = document.querySelector('.footer');
    if (!footer || footer.dataset.copyCleaned === '1') return;
    const links = [...footer.querySelectorAll('a')].map(a => a.cloneNode(true));
    footer.innerHTML = '';
    const label = document.createElement('b');
    label.textContent = '공식 참고:';
    footer.appendChild(label);
    if (links.length) footer.append(' ');
    links.forEach((link, index) => {
      if (index) footer.append(' · ');
      footer.appendChild(link);
    });
    footer.dataset.copyCleaned = '1';
  }

  function simplifyHealthBadge() {
    const badge = document.getElementById('dataHealthBadge');
    if (!badge || badge.dataset.copyCleaned === '1') return;
    badge.dataset.copyCleaned = '1';

    const sync = () => {
      const text = (badge.textContent || '').replace(/\s+/g, ' ').trim();
      const needsAttention = /오류|실패|경고|주의|불일치|누락|문제/.test(text);
      badge.hidden = !needsAttention;
    };
    new MutationObserver(sync).observe(badge, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['class'] });
    sync();
  }

  function applyCleanup() {
    remove('.header-eyebrow');
    remove('#quickGuide');
    trimStepDescriptions();
    trimMobileImportGuide();
    trimPdfImport();
    trimOcrImport();
    trimPlanCopy();
    trimExtraFeatures();
    trimBackupCopy();
    simplifyFooter();
    simplifyHealthBadge();
  }

  function init() {
    applyCleanup();
    const app = document.querySelector('.app');
    if (!app) return;
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        applyCleanup();
      });
    }).observe(app, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
