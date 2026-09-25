from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
app_path=ROOT/'app.js'
app=app_path.read_text(encoding='utf-8')

# Remove the left-side status headline logic from the web summary.
app,count=re.subn(
    r"\n  let mode=.*?\n  const max=8,shown=actions\.slice\(0,max\),extra=Math\.max\(0,actions\.length-max\);",
    "\n  const max=8,shown=actions.slice(0,max),extra=Math.max(0,actions.length-max);",
    app,
    count=1,
    flags=re.S,
)
if count!=1:
    raise RuntimeError('result headline state block not found')

# Keep only the action card in renderResultPrimarySummary().
fn_start=app.find('function renderResultPrimarySummary()')
if fn_start<0:
    raise RuntimeError('renderResultPrimarySummary not found')
assign_start=app.find('wrap.innerHTML=`',fn_start)
if assign_start<0:
    raise RuntimeError('result summary assignment not found')
next_card=app.find('<div class="next-actions-card">',assign_start)
if next_card<0:
    raise RuntimeError('next actions card marker not found')
app=app[:assign_start]+'wrap.innerHTML=`'+app[next_card:]

fn_end=app.find('\n}\n',fn_start)
section=app[fn_start:fn_end+3] if fn_end>=0 else ''
if not section or 'result-headline-card' in section:
    raise RuntimeError('redundant headline still rendered')
app_path.write_text(app,encoding='utf-8')

# PDF should start from the structured requirements table, not the interactive action summary.
css_path=ROOT/'styles.css'
css=css_path.read_text(encoding='utf-8')
marker='/* v3.2.1 print result summary cleanup */'
if marker not in css:
    css += '\n\n'+marker+'\n@media print{\n  #resultPrimarySummary{display:none!important}\n}\n'
css_path.write_text(css,encoding='utf-8')

# Cache-bust changed JS/CSS.
release_path=ROOT/'tests/release_maintenance.py'
release=release_path.read_text(encoding='utf-8')
release=release.replace("RELEASE_VERSION = '3.2.0'","RELEASE_VERSION = '3.2.1'",1)
release_path.write_text(release,encoding='utf-8')

# Regression: web summary is action-only; PDF visibility has a static guard below.
test_path=ROOT/'tests/projection_regression.cjs'
test=test_path.read_text(encoding='utf-8')
test=test.replace(
    "assert.match(html('resultPrimarySummary'), /현재 누적평점 기준 미충족/);",
    "assert.match(html('resultPrimarySummary'), /누적평점 3.00 이상 필요/);",
    1,
)
needle="assert.match(html('kpiGrid'), /2027-1학기 이수 후 충족/);"
if needle in test and "doesNotMatch(html('resultPrimarySummary'), /result-headline-card/)" not in test:
    test=test.replace(
        needle,
        needle+"\n  assert.doesNotMatch(html('resultPrimarySummary'), /result-headline-card/);\n  assert.match(html('resultPrimarySummary'), /next-actions-card/);",
        1,
    )
test_path.write_text(test,encoding='utf-8')

validator_path=ROOT/'tests/validate_packs.py'
v=validator_path.read_text(encoding='utf-8')
if "result summary print cleanup" not in v:
    anchor="passed=sum(1 for _,ok,_ in checks if ok)"
    check="check('result summary print cleanup','#resultPrimarySummary{display:none!important}' in css and 'result-headline-card' not in re.search(r'function renderResultPrimarySummary\\(\\).*?\\n}',app,re.S).group(0))\n\n"
    if anchor not in v:
        raise RuntimeError('validator insertion marker not found')
    v=v.replace(anchor,check+anchor,1)
validator_path.write_text(v,encoding='utf-8')
