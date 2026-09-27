(() => {
  'use strict';

  const SITE_ID = 'leefoxai-gse-degree-planner';
  const TRACK_URL = `https://icount.kr/c.js?id=${encodeURIComponent(SITE_ID)}`;
  const API_URL = `https://icount.kr/api.php?id=${encodeURIComponent(SITE_ID)}`;

  function isProductionPage() {
    return location.hostname === 'leefoxai.github.io' &&
      /^\/yonsei-gse-degree-planner(?:\/|$)/.test(location.pathname);
  }

  function ensureStyles() {
    if (document.getElementById('visitorStatsStyles')) return;
    const style = document.createElement('style');
    style.id = 'visitorStatsStyles';
    style.textContent = `
      .visitor-stats{display:flex;justify-content:center;align-items:center;gap:10px;margin:10px 0 18px;color:#667085;font-size:12px;line-height:1.4;font-variant-numeric:tabular-nums}
      .visitor-stats b{color:#344054;font-weight:700}
      .visitor-stats-sep{color:#98a2b3}
      .visitor-tracker-host{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important}
      @media(max-width:640px){.visitor-stats{margin:8px 0 84px;font-size:11px}}
      @media print{.visitor-stats,.visitor-tracker-host{display:none!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureCounter() {
    let wrap = document.getElementById('visitorStats');
    if (wrap) return wrap;
    ensureStyles();
    wrap = document.createElement('div');
    wrap.id = 'visitorStats';
    wrap.className = 'visitor-stats no-print';
    wrap.setAttribute('aria-label', '방문자 통계');
    wrap.innerHTML = '<span>Total <b id="visitorTotal">—</b></span><span class="visitor-stats-sep" aria-hidden="true">·</span><span>Daily <b id="visitorDaily">—</b></span>';
    const footer = document.querySelector('.footer');
    if (footer) footer.insertAdjacentElement('afterend', wrap);
    else (document.querySelector('.app') || document.body).appendChild(wrap);
    return wrap;
  }

  function loadTracker() {
    if (document.getElementById('visitorTrackerScript')) return;
    const host = document.createElement('span');
    host.className = 'visitor-tracker-host';
    host.setAttribute('aria-hidden', 'true');
    const script = document.createElement('script');
    script.id = 'visitorTrackerScript';
    script.src = TRACK_URL;
    script.async = true;
    host.appendChild(script);
    document.body.appendChild(host);
  }

  function formatCount(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number.toLocaleString('ko-KR') : '—';
  }

  async function refreshStats() {
    if (!isProductionPage()) return;
    try {
      const response = await fetch(`${API_URL}&_=${Date.now()}`, {
        cache: 'no-store',
        credentials: 'omit'
      });
      if (!response.ok) throw new Error(`visitor stats HTTP ${response.status}`);
      const data = await response.json();
      const total = data?.total?.uv ?? data?.total?.pv;
      const daily = data?.today?.uv ?? data?.today?.pv;
      const totalEl = document.getElementById('visitorTotal');
      const dailyEl = document.getElementById('visitorDaily');
      if (totalEl) totalEl.textContent = formatCount(total);
      if (dailyEl) dailyEl.textContent = formatCount(daily);
    } catch (error) {
      console.warn('[visitor-stats] 통계를 불러오지 못했습니다.', error);
    }
  }

  function init() {
    if (!isProductionPage()) return;
    ensureCounter();
    loadTracker();
    window.setTimeout(refreshStats, 1600);
    window.setTimeout(refreshStats, 5000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
