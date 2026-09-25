from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

# 1) Mobile-only import guide and presentation-layer script.
index_path=ROOT/'index.html'
html=index_path.read_text(encoding='utf-8')
anchor='''    <div class="tabs import-tabs no-print" id="importTabs">'''
mobile_guide='''    <details class="mobile-import-guide mobile-only no-print" id="mobileImportGuide" open>
      <summary>📱 모바일에서 성적 가져오기</summary>
      <div class="mobile-import-guide-body">
        <div class="mobile-import-method recommended">
          <b>PDF 파일이 있는 경우 · 권장</b>
          <p>모바일 학사포털에서는 성적표를 PDF로 직접 출력하기 어렵습니다. 카카오톡·메일 등으로 받은 <b>전체성적조회 PDF</b>를 휴대폰에 저장한 뒤 불러오세요.</p>
          <p class="ios-note"><b>iPhone:</b> PDF 열기 → 공유 → <b>파일에 저장</b> → 파일 앱의 다운로드·iCloud Drive·나의 iPhone에서 선택</p>
          <p><b>Android:</b> PDF 다운로드 → 다운로드/내 파일에 저장 → 저장된 PDF 선택</p>
          <button class="btn primary" type="button" data-mobile-import-pane="pdfImportPane">PDF 파일 불러오기</button>
        </div>
        <div class="mobile-import-method">
          <b>PDF 파일이 없는 경우</b>
          <p>연세포털의 <b>전체성적조회 화면을 여러 장 캡처</b>한 뒤 한 번에 선택하세요. 학정번호·과목명·학점·성적이 잘리지 않도록 캡처하고, OCR 결과의 수강학기와 성적을 반드시 확인하세요.</p>
          <button class="btn" type="button" data-mobile-import-pane="ocrImportPane">캡처 여러 장 OCR</button>
        </div>
      </div>
      <div class="mobile-import-tip">가능하면 PDF 불러오기를 우선 권장합니다. OCR은 화면 캡처 상태에 따라 인식 결과를 추가 확인해야 합니다.</div>
    </details>
'''
if 'id="mobileImportGuide"' not in html:
    if anchor not in html:
        raise RuntimeError('import tabs anchor not found')
    html=html.replace(anchor,mobile_guide+anchor,1)
if 'mobile.js?v=' not in html:
    html=html.replace('</body>','<script defer src="mobile.js?v=3.3.0"></script>\n</body>',1)
index_path.write_text(html,encoding='utf-8')

# 2) Isolated mobile presentation CSS. Desktop markup and calculation engine remain unchanged.
css_path=ROOT/'styles.css'
css=css_path.read_text(encoding='utf-8')
marker='/* ===== v3.3 mobile presentation layer ===== */'
if marker not in css:
    css += r'''

/* ===== v3.3 mobile presentation layer ===== */
.mobile-only,.mobile-card-list,.mobile-gpa-list,.mobile-course-picker{display:none}
body.mobile-mode{
  overflow-x:hidden;
  padding-bottom:calc(68px + env(safe-area-inset-bottom));
  -webkit-text-size-adjust:100%;
}
body.mobile-mode .app{width:100%;max-width:100%;padding:8px 8px 16px}
body.mobile-mode .mobile-only{display:block}
body.mobile-mode .workflow-strip{overflow-x:auto;scrollbar-width:none;padding:8px 9px;gap:6px}
body.mobile-mode .workflow-strip::-webkit-scrollbar{display:none}
body.mobile-mode .workflow-step{font-size:11px}.mobile-mode .workflow-arrow{display:none}

/* mobile import instructions */
body.mobile-mode .mobile-import-guide{
  margin:10px 0 12px;border:1px solid #b9d3ee;border-radius:12px;background:#f5f9ff;overflow:hidden
}
body.mobile-mode .mobile-import-guide>summary{
  cursor:pointer;padding:12px 13px;font-weight:900;color:#123b69;background:#eaf3fd
}
body.mobile-mode .mobile-import-guide-body{display:grid;grid-template-columns:1fr;gap:8px;padding:10px}
body.mobile-mode .mobile-import-method{border:1px solid #d8e2ef;border-radius:10px;background:#fff;padding:11px}
body.mobile-mode .mobile-import-method.recommended{border-color:#8eb9e5;background:#fbfdff}
body.mobile-mode .mobile-import-method>b{display:block;font-size:14px;color:#172033;margin-bottom:5px}
body.mobile-mode .mobile-import-method p{margin:5px 0;font-size:12px;line-height:1.55;color:#475467}
body.mobile-mode .mobile-import-method .btn{width:100%;margin-top:7px;min-height:44px}
body.mobile-mode .mobile-import-tip{padding:0 11px 11px;font-size:11px;line-height:1.5;color:#667085}
body.mobile-mode .portal-guide{font-size:11px}

/* transformed mobile tables: original table stays canonical but is hidden only in phone mode */
body.mobile-mode .mobile-original-table{display:none!important}
body.mobile-mode .mobile-card-list{display:grid;gap:9px;margin:10px 0}
body.mobile-mode .mobile-table-card{
  border:1px solid #dbe3ef;border-radius:12px;background:#fff;padding:11px;box-shadow:0 1px 2px rgba(16,24,40,.04)
}
body.mobile-mode .mobile-card-course{padding-bottom:9px;margin-bottom:9px;border-bottom:1px solid #edf0f4;min-width:0}
body.mobile-mode .mobile-card-course .course-name{display:block;font-size:16px;line-height:1.35;color:#172033}
body.mobile-mode .mobile-card-course .muted{margin-top:2px}
body.mobile-mode .mobile-card-fields{display:grid;grid-template-columns:1fr 1fr;gap:8px}
body.mobile-mode .mobile-card-field{min-width:0}
body.mobile-mode .mobile-card-field[data-label="학기"],
body.mobile-mode .mobile-card-field[data-label="등록"],
body.mobile-mode .mobile-card-field[data-label="상태"],
body.mobile-mode .mobile-card-actions{grid-column:auto}
body.mobile-mode .mobile-card-label{display:block;margin-bottom:4px;font-size:11px;font-weight:800;color:#667085}
body.mobile-mode .mobile-card-value{min-width:0;font-size:13px;line-height:1.4;color:#172033}
body.mobile-mode .mobile-cloned-control{width:100%!important;min-width:0!important;max-width:none!important;font-size:16px!important;padding:8px 9px!important}
body.mobile-mode input.mobile-cloned-control{min-height:42px}
body.mobile-mode .mobile-cloned-button{width:100%;min-height:42px}
body.mobile-mode .mobile-card-status .statusline{align-items:flex-start}
body.mobile-mode .mobile-card-empty{border:1px dashed #cbd5e1;border-radius:10px;padding:18px;text-align:center;color:#667085}
body.mobile-mode .mobile-import-card-list .mobile-table-card{background:#fbfdff}
body.mobile-mode .mobile-import-card-list .mobile-card-fields{grid-template-columns:1fr 1fr}

/* KPI cards: no duplicate projected value when current/projected are identical */
body.mobile-mode .grid.kpi{grid-template-columns:1fr!important;gap:8px!important;margin-top:8px!important}
body.mobile-mode .grid.kpi .card{padding:12px!important;border-radius:12px}
body.mobile-mode .grid.kpi .kpi-top{gap:8px}
body.mobile-mode .grid.kpi .requirement-status{max-width:64%;white-space:normal;text-align:right;line-height:1.25}
body.mobile-mode .requirement-comparison{gap:8px}
body.mobile-mode .requirement-comparison>div{min-width:0;padding-right:8px}
body.mobile-mode .requirement-comparison b{font-size:22px!important;line-height:1.2;word-break:keep-all}
body.mobile-mode .mobile-comparison-same{grid-template-columns:1fr!important}
body.mobile-mode .mobile-comparison-same>div:nth-child(2){display:none!important}
body.mobile-mode .mobile-comparison-same>div:first-child span{display:none}
body.mobile-mode .grid.kpi .sub{font-size:12px;line-height:1.4}

/* semester GPA compact list */
body.mobile-mode #semesterGpaGrid{display:none!important}
body.mobile-mode .mobile-gpa-list{display:grid;border:1px solid #dbe3ef;border-radius:12px;overflow:hidden;background:#fff;margin-top:8px}
body.mobile-mode .mobile-gpa-row{display:grid;grid-template-columns:minmax(72px,.8fr) .75fr .75fr 1.35fr;gap:7px;align-items:center;padding:9px 10px;border-bottom:1px solid #edf0f4}
body.mobile-mode .mobile-gpa-row:last-child{border-bottom:0}
body.mobile-mode .mobile-gpa-row.cumulative{background:#f3f8ff}
body.mobile-mode .mobile-gpa-term{font-size:13px;white-space:nowrap}
body.mobile-mode .mobile-gpa-figure span{display:block;font-size:10px;color:#667085}
body.mobile-mode .mobile-gpa-figure b{font-size:14px}
body.mobile-mode .mobile-gpa-status{text-align:right}.mobile-mode .mobile-gpa-status .badge{white-space:normal;text-align:center}

/* plan course picker: keep #planCourse as the canonical hidden control */
body.mobile-mode #planCourse{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
body.mobile-mode .mobile-course-picker{display:grid;gap:6px;margin-top:5px}
body.mobile-mode .mobile-course-option{width:100%;border:1px solid #d5deea;border-radius:10px;background:#fff;color:#172033;text-align:left;padding:10px 11px;line-height:1.4;font-size:13px}
body.mobile-mode .mobile-course-option.selected{border-color:#0b57a4;background:#eef5ff;box-shadow:0 0 0 2px rgba(11,87,164,.10)}
body.mobile-mode .mobile-picker-empty,body.mobile-mode .mobile-picker-more{font-size:11px;color:#667085;padding:7px 3px}
body.mobile-mode #planSection .plan-course-row{grid-template-columns:1fr!important}

/* reduce browser chrome + app navigation competition */
body.mobile-mode .mobile-nav{left:8px;right:8px;bottom:calc(6px + env(safe-area-inset-bottom));padding:4px;border-radius:13px}
body.mobile-mode .mobile-nav button{min-height:40px;font-size:11px;padding:3px 2px}
body.mobile-mode #scrollTopBtn{display:none!important}
body.mobile-mode .footer{padding-bottom:10px}

@media (orientation:landscape){
  body.mobile-mode .app{padding-left:12px;padding-right:12px}
  body.mobile-mode .mobile-card-fields{grid-template-columns:repeat(4,minmax(0,1fr))}
  body.mobile-mode .grid.kpi{grid-template-columns:1fr 1fr!important}
  body.mobile-mode .mobile-import-guide-body{grid-template-columns:1fr 1fr}
}
'''
css_path.write_text(css,encoding='utf-8')

# 3) Release/cache-buster and normalization awareness of mobile.js.
release_path=ROOT/'tests/release_maintenance.py'
release=release_path.read_text(encoding='utf-8')
release=release.replace("RELEASE_VERSION = '3.2.1'","RELEASE_VERSION = '3.3.0'",1)
needle="    text = re.sub(r'app\\.js\\?v=[0-9.]+', f'app.js?v={app_version}', text, count=1)\n"
if "mobile\\.js\\?v" not in release:
    if needle not in release:
        raise RuntimeError('normalize_index app.js version line not found')
    release=release.replace(needle,needle+"    text = re.sub(r'mobile\\.js\\?v=[0-9.]+', f'mobile.js?v={app_version}', text, count=1)\n",1)
release_path.write_text(release,encoding='utf-8')

# 4) Validate the presentation layer without changing domain/calculation assertions.
validator_path=ROOT/'tests/validate_packs.py'
validator=validator_path.read_text(encoding='utf-8')
if "mobile presentation layer" not in validator:
    anchor="passed=sum(1 for _,ok,_ in checks if ok)"
    check="""mobile=(ROOT/'mobile.js').read_text(encoding='utf-8') if (ROOT/'mobile.js').exists() else ''\ncheck('mobile presentation layer','mobile.js?v=' in html and 'mobile-mode' in mobile and 'mobileImportGuide' in html and 'mobileHistoryCards' in mobile and 'mobilePlanCards' in mobile and 'mobilePlanCoursePicker' in mobile)\ncheck('mobile import guide routes','data-mobile-import-pane=\\\"pdfImportPane\\\"' in html and 'data-mobile-import-pane=\\\"ocrImportPane\\\"' in html)\n\n"""
    if anchor not in validator:
        raise RuntimeError('validator insertion marker not found')
    validator=validator.replace(anchor,check+anchor,1)
validator_path.write_text(validator,encoding='utf-8')

# 5) CI also syntax-checks the separate mobile layer.
workflow_path=ROOT/'.github/workflows/validate.yml'
workflow=workflow_path.read_text(encoding='utf-8')
workflow=workflow.replace('      - name: JavaScript syntax\n        run: node --check app.js\n','      - name: JavaScript syntax\n        run: |\n          node --check app.js\n          node --check mobile.js\n',1)
workflow_path.write_text(workflow,encoding='utf-8')
