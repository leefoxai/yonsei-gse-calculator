(() => {
  'use strict';
  const VERSION = '3.3.2-mobile-r5';
  function load(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${src}?v=${encodeURIComponent(VERSION)}`;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`스크립트 로드 실패: ${src}`));
      document.head.appendChild(script);
    });
  }
  load('mobile-base.js')
    .then(() => load('mobile-enhancements.js'))
    .then(() => load('mobile-hotfix.js'))
    .catch(error => console.error('[mobile] 초기화 실패', error));
})();
