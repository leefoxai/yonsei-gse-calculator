#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def replace_once(path, old, new):
    p = ROOT / path
    text = p.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'missing patch target in {path}: {old[:80]!r}')
    text = text.replace(old, new, 1)
    p.write_text(text, encoding='utf-8')

# index.html: 4-step information architecture without moving calculation DOM nodes.
replace_once('index.html',
'''  <details class="card quick-guide no-print" id="quickGuide" open>\n    <summary>사용방법 · 3단계</summary>\n    <div class="quick-guide-grid">\n      <div><b>1. 기본정보 입력</b></div>\n      <div><b>2. 수강이력 입력</b></div>\n      <div><b>3. 결과 확인</b></div>\n    </div>\n    <div class="quick-guide-extra">\n      <span class="quick-guide-extra-title">결과 확인과 수강계획</span>\n      <div class="quick-guide-extra-list">\n        <span class="quick-guide-extra-item">수강계획 · 필요한 과목을 학기별로 확인</span>\n        <span class="quick-guide-extra-item">시나리오 · 향후 수강계획에서 저장·비교</span>\n        <span class="quick-guide-extra-item">개설예정 · 학기별 개설 예정 과목 조회</span>\n      </div>\n    </div>\n  </details>''',
'''  <details class="card quick-guide no-print" id="quickGuide" open>\n    <summary>사용방법 · 4단계</summary>\n    <div class="quick-guide-grid">\n      <div><b>1. 기본정보 입력</b></div>\n      <div><b>2. 수강이력 입력</b></div>\n      <div><b>3. 이수현황 확인</b></div>\n      <div><b>4. 향후 수강계획</b></div>\n    </div>\n    <div class="quick-guide-extra">\n      <span class="quick-guide-extra-title">핵심 흐름</span>\n      <div class="quick-guide-extra-list">\n        <span class="quick-guide-extra-item">현재 충족 요건과 부족 요건 확인</span>\n        <span class="quick-guide-extra-item">계획 과목을 추가해 충족 예정 상태 확인</span>\n        <span class="quick-guide-extra-item">필요할 때 시간표·개설정보 확인</span>\n      </div>\n    </div>\n  </details>''')

replace_once('index.html',
'''    <div class="workflow-step" data-step="result"><span class="num">3</span><span>결과확인</span></div>\n  </div>''',
'''    <div class="workflow-step" data-step="result"><span class="num">3</span><span>이수현황</span></div>\n    <span class="workflow-arrow">→</span>\n    <div class="workflow-step" data-step="plan"><span class="num">4</span><span>수강계획</span></div>\n  </div>''')

replace_once('index.html',
'''      <div><h2 class="step-title"><span class="step-no">3</span><span>이수현황 분석 결과</span></h2><p>현재 요건과 향후 수강계획을 함께 확인합니다. 값을 수정하면 즉시 다시 계산됩니다.</p></div>''',
'''      <div><h2 class="step-title"><span class="step-no">3</span><span>이수현황</span></h2><p>현재 충족 상태와 부족한 요건을 먼저 확인합니다. 상세 계산 근거는 아래에서 펼쳐볼 수 있습니다.</p></div>''')

replace_once('index.html',
'''    <button type="button" class="btn small" data-analysis-target="resultDetailsPanel">요건·체크리스트</button>\n    <button type="button" class="btn small" data-analysis-target="planSection">향후 수강계획</button>''',
'''    <button type="button" class="btn small" data-analysis-target="resultDetailsPanel">상세 계산 근거</button>\n    <button type="button" class="btn small" data-analysis-target="planSection">4. 향후 수강계획</button>''')

replace_once('index.html',
'''    <summary>상세 계산 · 체크리스트</summary>''',
'''    <summary>상세 계산 근거 · 체크리스트</summary>''')

replace_once('index.html',
'''    <div id="teacherCertificateVariantWrap" class="teacher-cert-variant"></div>\n    <div id="teacherRuleNotice" class="callout warnbox" style="margin-top:10px"></div>\n    <div id="teacherChecklistAuto" class="teacher-auto-grid teacher-auto-grid-v2"></div>\n    <div id="teacherEvidenceDetails" class="teacher-evidence-wrap"></div>\n\n    <h3 class="teacher-subtitle">개인별 인정 결과</h3>''',
'''    <div id="teacherCertificateVariantWrap" class="teacher-cert-variant"></div>\n    <div id="teacherRuleNotice" class="callout warnbox" style="margin-top:10px"></div>\n    <h3 class="teacher-subtitle">자동 계산</h3>\n    <div id="teacherChecklistAuto" class="teacher-auto-grid teacher-auto-grid-v2"></div>\n    <div id="teacherEvidenceDetails" class="teacher-evidence-wrap"></div>\n\n    <h3 class="teacher-subtitle">본인 · 행정 확인 필요</h3>''')

replace_once('index.html',
'''      <h2 class="step-title"><span>향후 수강계획</span><span class="addon-badge">시뮬레이터</span></h2>''',
'''      <h2 class="step-title"><span class="step-no">4</span><span>향후 수강계획</span><span class="addon-badge">시뮬레이터</span></h2>''')

# app.js: extend workflow state to four steps and make the strip navigational.
replace_once('app.js',
'''  const steps=[...document.querySelectorAll('#workflowStrip .workflow-step')];\n  if(steps.length){\n    steps.forEach(x=>x.classList.remove('active','done'));\n    if(!profileConfirmed){\n      steps[0]?.classList.add('active');\n    }else if(historyCount===0){\n      steps[0]?.classList.add('done');\n      steps[1]?.classList.add('active');\n    }else{\n      steps[0]?.classList.add('done');\n      steps[1]?.classList.add('done');\n      steps[2]?.classList.add('active');\n    }\n  }''',
'''  const steps=[...document.querySelectorAll('#workflowStrip .workflow-step')];\n  if(steps.length){\n    steps.forEach(x=>x.classList.remove('active','done','available'));\n    if(!profileConfirmed){\n      steps[0]?.classList.add('active');\n    }else if(historyCount===0){\n      steps[0]?.classList.add('done');\n      steps[1]?.classList.add('active');\n    }else{\n      steps[0]?.classList.add('done');\n      steps[1]?.classList.add('done');\n      steps[2]?.classList.add('active');\n      steps[3]?.classList.add('available');\n    }\n  }''')

replace_once('app.js',
'''if(historySummary)historySummary.addEventListener('click',e=>{\n  if(!state.profileConfirmed){\n    e.preventDefault();\n    document.getElementById('profileSection')?.scrollIntoView({behavior:'smooth',block:'start'});\n  }\n});''',
'''if(historySummary)historySummary.addEventListener('click',e=>{\n  if(!state.profileConfirmed){\n    e.preventDefault();\n    document.getElementById('profileSection')?.scrollIntoView({behavior:'smooth',block:'start'});\n  }\n});\ndocument.querySelectorAll('#workflowStrip .workflow-step').forEach(step=>step.addEventListener('click',()=>{\n  const target={profile:'inputZone',history:'historySection',result:'analysisZone',plan:'planSection'}[step.dataset.step];\n  const el=document.getElementById(target);\n  if(!el)return;\n  if('open' in el)el.open=true;\n  if(step.dataset.step==='plan'){\n    const parent=document.getElementById('analysisZone');if(parent)parent.open=true;\n  }\n  el.scrollIntoView({behavior:'smooth',block:'start'});\n}));''')

# CSS: four columns, clearer 4th-step affordance, and mobile behavior.
p = ROOT / 'styles.css'
css = p.read_text(encoding='utf-8')
marker = '/* === v3.2 four-step information architecture === */'
if marker not in css:
    css += '''\n\n/* === v3.2 four-step information architecture === */\n.quick-guide-grid{grid-template-columns:repeat(4,minmax(0,1fr))}\n.workflow-step{cursor:pointer}\n.workflow-step.available{color:#0b57a4}\n.workflow-step.available .num{background:#eef4ff;color:#0b57a4;border:1px solid #9fc3e8}\n#planSection{border-left:4px solid #0b57a4}\n#planSection>.plan-section-summary .step-title{display:flex;align-items:center;gap:8px;flex-wrap:wrap}\n#planSection>.plan-section-summary .step-no{display:inline-flex;align-items:center;justify-content:center;width:25px;height:25px;border-radius:999px;background:#0b57a4;color:#fff;font-size:12px}\n@media(max-width:760px){.quick-guide-grid{grid-template-columns:1fr 1fr}.workflow-step{font-size:11px}}\n@media(max-width:480px){.quick-guide-grid{grid-template-columns:1fr}}\n'''
    p.write_text(css, encoding='utf-8')

print('UX reframe patch applied')
