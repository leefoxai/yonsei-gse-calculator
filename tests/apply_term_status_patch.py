from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
app_path = ROOT / 'app.js'
app = app_path.read_text(encoding='utf-8')

old = """function requirementState(currentOk,projectedOk){return currentOk?'ok':projectedOk?'plan':'bad';}\nfunction requirementStateLabel(status){return {ok:'충족',plan:'계획 시 충족',bad:'미충족',pending:'확인 필요',exempt:'해당 없음'}[status]||'확인 필요';}\nfunction requirementBadge(status){return `<span class=\"requirement-status ${status}\">${requirementStateLabel(status)}</span>`;}\n"""
new = """function requirementState(currentOk,projectedOk){return currentOk?'ok':projectedOk?'plan':'bad';}\nfunction projectionTermsInOrder(){return [...new Set(projectionPlannedRecords().map(r=>String(r.term||'')).filter(Boolean))].sort((a,b)=>termIndex(a)-termIndex(b));}\nfunction earliestProjectionTerm(test){\n  const history=state.history.filter(r=>r.passed!==false);\n  if(test(history))return '';\n  const planned=projectionPlannedRecords();let records=[...history];\n  for(const term of projectionTermsInOrder()){\n    records.push(...planned.filter(r=>String(r.term||'')===term).map(r=>({...r,passed:true})));\n    if(test(records))return term;\n  }\n  return '';\n}\nfunction requirementProgressValue(evaluation,key){if(key==='total')return Number(evaluation.totalCredits||0);return Number((evaluation.requirements||[]).find(r=>r.key===key)?.current||0);}\nfunction requirementSatisfactionTerm(key,min){return earliestProjectionTerm(records=>requirementProgressValue(evaluate(records),key)>=Number(min||0));}\nfunction overallSatisfactionTerm(){return earliestProjectionTerm(records=>{const result=evaluate(records);return result.complete&&result.unknowns.length===0;});}\nfunction requirementStateLabel(status,term=''){if(status==='plan')return term?`${term}학기 이수 후 충족`:'계획 이수 후 충족';return {ok:'충족',bad:'미충족',pending:'확인 필요',exempt:'해당 없음'}[status]||'확인 필요';}\nfunction requirementBadge(status,term=''){return `<span class=\"requirement-status ${status}\">${requirementStateLabel(status,term)}</span>`;}\n"""
if old not in app:
    raise RuntimeError('requirement state block not found')
app = app.replace(old, new, 1)

old = """  const card=(key,label,cur,proj,min,unit)=>{\n    const status=requirementState(cur>=min,proj>=min);\n    return `<div class=\"card ${status==='bad'?'kpi-card-unmet':''}\"><div class=\"kpi-top\"><span class=\"kpi-label\">${esc(label)}</span>${requirementBadge(status)}</div>\n"""
new = """  const card=(key,label,cur,proj,min,unit)=>{\n    const status=requirementState(cur>=min,proj>=min);\n    const satisfactionTerm=status==='plan'?requirementSatisfactionTerm(key,min):'';\n    return `<div class=\"card ${status==='bad'?'kpi-card-unmet':''}\"><div class=\"kpi-top\"><span class=\"kpi-label\">${esc(label)}</span>${requirementBadge(status,satisfactionTerm)}</div>\n"""
if old not in app:
    raise RuntimeError('KPI block not found')
app = app.replace(old, new, 1)

old = """  const reqs=projected.requirements.map(pr=>{\n    const cr=current.requirements.find(x=>x.key===pr.key)||{current:0};\n    const status=requirementState(cr.current>=pr.min,pr.current>=pr.min);\n    return [pr.label,`${fmtCredits(cr.current)} ${pr.unit}`,`${fmtCredits(pr.current)} ${pr.unit}`,`최소 ${fmtCredits(pr.min)}${pr.unit} 이상 · ${requirementBadge(status)}`];\n  });\n"""
new = """  const reqs=projected.requirements.map(pr=>{\n    const cr=current.requirements.find(x=>x.key===pr.key)||{current:0};\n    const status=requirementState(cr.current>=pr.min,pr.current>=pr.min);\n    const satisfactionTerm=status==='plan'?requirementSatisfactionTerm(pr.key,pr.min):'';\n    return [pr.label,`${fmtCredits(cr.current)} ${pr.unit}`,`${fmtCredits(pr.current)} ${pr.unit}`,`최소 ${fmtCredits(pr.min)}${pr.unit} 이상 · ${requirementBadge(status,satisfactionTerm)}`];\n  });\n"""
if old not in app:
    raise RuntimeError('requirements table block not found')
app = app.replace(old, new, 1)

old = """  const creditComplete=projected.complete&&projected.unknowns.length===0;\n  const gpaText=g.state==='pass'?'현재 누적평점 기준 충족':g.state==='fail'?'현재 누적평점 기준 미충족':g.state==='incomplete'?'현재 누적평점 확인 필요 · 성적 일부 미입력':'현재 누적평점 확인 필요 · 평점자료 없음';\n  document.getElementById('evaluationNotes').innerHTML=`<div class=\"result-summary ${creditComplete&&g.state==='pass'?'ok':'bad'}\"><b>${projectionLabel()} 학점 요건 ${creditComplete?'충족':'미충족'} / ${gpaText}</b>${shortages.length?`<div>계획 반영 후 추가 확인: ${shortages.join(' · ')}</div>`:''}</div>\n"""
new = """  const creditComplete=projected.complete&&projected.unknowns.length===0;\n  const currentCreditComplete=current.complete&&current.unknowns.length===0;\n  const completionTerm=!currentCreditComplete&&creditComplete?overallSatisfactionTerm():'';\n  const completionLabel=currentCreditComplete?'현재':completionTerm?`${completionTerm}학기 이수 후`:projectionLabel();\n  const gpaText=g.state==='pass'?'현재 누적평점 기준 충족':g.state==='fail'?'현재 누적평점 기준 미충족':g.state==='incomplete'?'현재 누적평점 확인 필요 · 성적 일부 미입력':'현재 누적평점 확인 필요 · 평점자료 없음';\n  document.getElementById('evaluationNotes').innerHTML=`<div class=\"result-summary ${creditComplete&&g.state==='pass'?'ok':'bad'}\"><b>${completionLabel} 학점 요건 ${creditComplete?'충족':'미충족'} / ${gpaText}</b>${shortages.length?`<div>계획 반영 후 추가 확인: ${shortages.join(' · ')}</div>`:''}</div>\n"""
if old not in app:
    raise RuntimeError('evaluation summary block not found')
app = app.replace(old, new, 1)

old = """  }else if(projected.complete){\n    mode='plan';title=`${projectionLabel()} 학점 요건 충족 / ${g.state==='pass'?'현재 누적평점 기준 충족':g.state==='fail'?'현재 누적평점 기준 미충족':'현재 누적평점 확인 필요'}`;sub='계획 이수 후 누적평점은 성적 확정 후 확인합니다. 시험·교원자격·행정절차도 별도 확인이 필요합니다.';\n  }\n"""
new = """  }else if(projected.complete){\n    const completionTerm=overallSatisfactionTerm();\n    const completionLabel=completionTerm?`${completionTerm}학기 이수 후`:projectionLabel();\n    mode='plan';title=`${completionLabel} 학점 요건 충족 / ${g.state==='pass'?'현재 누적평점 기준 충족':g.state==='fail'?'현재 누적평점 기준 미충족':'현재 누적평점 확인 필요'}`;sub='계획 이수 후 누적평점은 성적 확정 후 확인합니다. 시험·교원자격·행정절차도 별도 확인이 필요합니다.';\n  }\n"""
if old not in app:
    raise RuntimeError('headline projected block not found')
app = app.replace(old, new, 1)

# Other projected-only areas should no longer say that merely planning itself satisfies a requirement.
app = app.replace("plan:'계획 시 충족'", "plan:'계획 이수 후 충족'")
if '계획 시 충족' in app:
    raise RuntimeError('legacy wording remains')

app_path.write_text(app, encoding='utf-8')

# Update regression expectations for the degree requirement timing.
test_path = ROOT / 'tests' / 'projection_regression.cjs'
test = test_path.read_text(encoding='utf-8')
test = test.replace("assert.match(html('kpiGrid'), /계획 시 충족/);", "assert.match(html('kpiGrid'), /2027-1학기 이수 후 충족/);", 1)
test = test.replace("assert.match(html('evaluationNotes'), /\\(전체\\) 계획 이수 후 학점 요건 충족 \\/ 현재 누적평점 기준 충족/);", "assert.match(html('evaluationNotes'), /2027-1학기 이수 후 학점 요건 충족 \\/ 현재 누적평점 기준 충족/);", 1)
test = test.replace("assert.match(html('teacherChecklistSummary'), /교과목·학점 요건 · 계획 시 충족/);", "assert.match(html('teacherChecklistSummary'), /교과목·학점 요건 · 계획 이수 후 충족/);", 1)
test = test.replace("assert.match(practice,/계획 시 충족/);", "assert.match(practice,/계획 이수 후 충족/);", 1)
test_path.write_text(test, encoding='utf-8')

print('term-specific satisfaction patch applied')
