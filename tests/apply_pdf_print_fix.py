#!/usr/bin/env python3
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'styles.css'
css=p.read_text(encoding='utf-8')
marker='/* === v3.1.18 PDF report layout fix === */'
if marker not in css:
    css += r'''

/* === v3.1.18 PDF report layout fix === */
@media print{
  /* Print a report, not the interactive dashboard controls. */
  #projectionControls{display:none!important}

  /* The screen KPI cards each contain another 2-column current/projected grid.
     Printing four cards across created an effectively 8-column layout and severe wrapping.
     The dedicated print requirements table already contains the same information more clearly. */
  #kpiSection{display:none!important}

  #requirementsSection{
    display:block!important;
    width:100%!important;
    margin:4px 0 6px!important;
    padding:7px!important;
    border:1px solid #d8dee8!important;
    border-radius:6px!important;
    box-shadow:none!important;
    break-inside:avoid!important;
    page-break-inside:avoid!important;
  }
  #requirementsSection h2{
    font-size:11px!important;
    line-height:1.2!important;
    margin:0 0 5px!important;
  }
  #requirementsSection .req-grid{
    display:grid!important;
    grid-template-columns:1.15fr .72fr .95fr 1.45fr!important;
    width:100%!important;
    gap:0!important;
    border:1px solid #d8dee8!important;
    border-radius:5px!important;
    overflow:hidden!important;
    font-size:7.6px!important;
    line-height:1.3!important;
  }
  #requirementsSection .req-grid>div{
    min-width:0!important;
    padding:4px 5px!important;
    border-right:1px solid #e6eaf0!important;
    border-bottom:1px solid #e6eaf0!important;
    overflow-wrap:anywhere!important;
    word-break:keep-all!important;
  }
  #requirementsSection .req-grid>div:nth-child(4n){border-right:0!important}
  #requirementsSection .req-grid>div:nth-last-child(-n+4){border-bottom:0!important}
  #requirementsSection .req-grid>div:nth-child(-n+4){
    background:#f3f6fa!important;
    color:#475467!important;
    font-size:7px!important;
    font-weight:900!important;
    white-space:nowrap!important;
  }
  #requirementsSection .requirement-status{
    display:inline-block!important;
    font-size:6.5px!important;
    line-height:1.25!important;
    padding:1px 4px!important;
    margin-left:2px!important;
    vertical-align:1px!important;
  }

  /* Keep the top result summary compact and prevent its two cards from fragmenting. */
  #resultPrimarySummary{
    break-inside:avoid!important;
    page-break-inside:avoid!important;
  }
}
'''
    p.write_text(css,encoding='utf-8')
print('PDF print layout fix applied')
