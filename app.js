const APP_TITLE_DEFAULT='[테스트]연세대학교 교육대학원 졸업요건 이수현황 계산기';
const APP_TITLE_KEY='yonsei-gse-calculator-custom-title';

// ===== v3.0 on-demand external libraries =====
const OPTIONAL_LIBS={
  pdf:'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
  ocr:'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  xlsx:'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
};
const optionalLibPromises={};
function loadExternalScriptOnce(key,url,globalName){
  if(globalName && window[globalName])return Promise.resolve(window[globalName]);
  if(optionalLibPromises[key])return optionalLibPromises[key];
  optionalLibPromises[key]=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=url;s.async=true;s.crossOrigin='anonymous';
    s.onload=()=>globalName&&!window[globalName]?reject(new Error(`${key} 라이브러리 전역객체를 찾지 못했습니다.`)):resolve(globalName?window[globalName]:true);
    s.onerror=()=>{delete optionalLibPromises[key];reject(new Error(`${key} 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인하십시오.`));};
    document.head.appendChild(s);
  });
  return optionalLibPromises[key];
}
async function ensurePdfJsLib(){return loadExternalScriptOnce('PDF.js',OPTIONAL_LIBS.pdf,'pdfjsLib');}
async function ensureTesseractLib(){return loadExternalScriptOnce('OCR',OPTIONAL_LIBS.ocr,'Tesseract');}
async function ensureXlsxLib(){return loadExternalScriptOnce('Excel',OPTIONAL_LIBS.xlsx,'XLSX');}
function releaseCanvas(canvas){
  if(!canvas)return;
  try{canvas.width=1;canvas.height=1;}catch(e){}
}


function applyCustomTitle(value){
  const title=(String(value||'').trim()||APP_TITLE_DEFAULT);
  const el=document.getElementById('appTitle');
  if(el)el.textContent=title;
  document.title=title;
}
function loadCustomTitle(){
  try{applyCustomTitle(localStorage.getItem(APP_TITLE_KEY)||APP_TITLE_DEFAULT);}
  catch(e){applyCustomTitle(APP_TITLE_DEFAULT);}
}
function editCustomTitle(){
  const current=document.getElementById('appTitle')?.textContent||APP_TITLE_DEFAULT;
  const next=prompt('PDF와 화면에 표시할 타이틀명을 입력하세요.',current);
  if(next===null)return;
  const title=String(next).trim()||APP_TITLE_DEFAULT;
  try{localStorage.setItem(APP_TITLE_KEY,title);}catch(e){}
  applyCustomTitle(title);
}

let DATA = {"snapshot":"2026-2","majors":["교육공학","교육행정","국어교육","다문화국제이해교육","사서교육","상담교육","수학교육","역사교육","영양교육","영어교육","외국어로서의 한국어교육","유아교육","음악교육","인적자원개발","일반사회교육","조기영어교육","종교교육","체육및여가교육","통합과학교육","평생교육경영","AI융합교육"],"offerings":[{"major":"AI융합교육","term":"2026-2","courseCode":"SAE6502","courseName":"인공지능과데이터과학입문","aliases":["인공지능과 데이터과학입문","인공지능과데이터과학입문"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"한수연","room":"교603","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"1~2학기","sectionCodes":["SAE6502"],"sourceActualRows":[731],"sourcePlanRows":[894],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2026-2","courseCode":"SAE6503","courseName":"인공지능시대와 교육","aliases":["인공지능시대와 교육"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"강근영","room":"교308","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"1~2학기","sectionCodes":["SAE6503"],"sourceActualRows":[718],"sourcePlanRows":[892],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2026-2","courseCode":"SAE6524","courseName":"자연어처리기초","aliases":["자연어처리기초"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"박헌우","room":"교604","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SAE6524"],"sourceActualRows":[731],"sourcePlanRows":[890],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2026-2","courseCode":"SAE6527","courseName":"생성형AI활용 융합 교육방법","aliases":["AI활용 융합 교육방법","생성형AI활용 융합 교육방법"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"오지선","room":"교306","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SAE6527"],"sourceActualRows":[718],"sourcePlanRows":[893],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2026-2","courseCode":"SAE6591","courseName":"AI융합수학과학교수설계","aliases":["AI융합수학과학교수설계"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"한수연","room":"교308","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SAE6591"],"sourceActualRows":[731],"sourcePlanRows":[891],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표","categoryOptions":["teaching","major_elective"]},{"major":"AI융합교육","term":"2027-1","courseCode":"SAE6521","courseName":"빅데이터와 교육","aliases":["빅데이터와 교육"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[904],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2027-1","courseCode":"SAE6525","courseName":"딥러닝 입문","aliases":["딥러닝 입문"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[905],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2027-1","courseCode":"SAE6526","courseName":"인공지능기술과 윤리","aliases":["인공지능기술과 윤리"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[903],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2027-1","courseCode":"SAE6527","courseName":"AI활용 융합 교육방법","aliases":["AI활용 융합 교육방법","생성형AI활용 융합 교육방법"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[906],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2027-2","courseCode":"SAE6501","courseName":"컴퓨팅사고와 코딩알고리즘","aliases":["컴퓨팅사고와 코딩알고리즘"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[903],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2027-2","courseCode":"SAE6502","courseName":"인공지능과 데이터과학입문","aliases":["인공지능과 데이터과학입문","인공지능과데이터과학입문"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[904],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2027-2","courseCode":"SAE6522","courseName":"머신러닝 입문","aliases":["머신러닝 입문"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[905],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2027-2","courseCode":"SAE6593","courseName":"AI기반 교육평가","aliases":["AI기반 교육평가"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[906],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표","categoryOptions":["teaching","major_elective"]},{"major":"AI융합교육","term":"2028-1","courseCode":"SAE6502","courseName":"인공지능과데이터과학입문","aliases":["인공지능과 데이터과학입문","인공지능과데이터과학입문"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[920],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2028-1","courseCode":"SAE6503","courseName":"인공지능시대와 교육","aliases":["인공지능시대와 교육"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[918],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2028-1","courseCode":"SAE6524","courseName":"자연어처리기초","aliases":["자연어처리기초"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[916],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2028-1","courseCode":"SAE6527","courseName":"생성형AI활용 융합 교육방법","aliases":["AI활용 융합 교육방법","생성형AI활용 융합 교육방법"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[919],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2028-1","courseCode":"SAE6591","courseName":"AI융합수학과학교수설계","aliases":["AI융합수학과학교수설계"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[917],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표","categoryOptions":["teaching","major_elective"]},{"major":"AI융합교육","term":"2028-2","courseCode":"SAE6521","courseName":"빅데이터와 교육","aliases":["빅데이터와 교육"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[917],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2028-2","courseCode":"SAE6525","courseName":"딥러닝 입문","aliases":["딥러닝 입문"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[918],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2028-2","courseCode":"SAE6526","courseName":"인공지능기술과 윤리","aliases":["인공지능기술과 윤리"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[916],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"AI융합교육","term":"2028-2","courseCode":"SAE6527","courseName":"AI활용 융합 교육방법","aliases":["AI활용 융합 교육방법","생성형AI활용 융합 교육방법"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[919],"categorySource":"Claude v2 과목마스터/2026-2 실제시간표"},{"major":"교육공학","term":"2026-2","courseCode":"SET6602","courseName":"교수학습이론","aliases":["교수학습이론"],"credits":3,"category":"major_required","categoryRaw":"필수","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이명근","room":"교606","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SET6602"],"sourceActualRows":[139],"sourcePlanRows":[8]},{"major":"교육공학","term":"2026-2","courseCode":"SET6608","courseName":"AI교육공학기초","aliases":["AI교육공학기초","AI교육공학활용"],"credits":3,"category":"major_required","categoryRaw":"필수","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김남주","room":"교606","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"2~4학기","sectionCodes":["SET6608"],"sourceActualRows":[139],"sourcePlanRows":[7]},{"major":"교육공학","term":"2026-2","courseCode":"SET6652","courseName":"원격교육론","aliases":["원격교육론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김형근","room":"교606","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SET6652"],"sourceActualRows":[152],"sourcePlanRows":[11]},{"major":"교육공학","term":"2026-2","courseCode":"SET6673","courseName":"기업교육공학연구","aliases":["기업교육공학연구"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이지영","room":"교606","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SET6673"],"sourceActualRows":[152],"sourcePlanRows":[9]},{"major":"교육공학","term":"2026-2","courseCode":"SET6678","courseName":"교육공학연구자료분석","aliases":["교육공학연구자료분석"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"윤솔","room":"교606","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SET6678"],"sourceActualRows":[152],"sourcePlanRows":[10]},{"major":"교육공학","term":"2027-1","courseCode":"SET6604","courseName":"교수학습설계","aliases":["교수학습설계"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[20],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2027-1","courseCode":"SET6606","courseName":"교육훈련프로그램개발","aliases":["교육훈련프로그램개발"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[24],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2027-1","courseCode":"SET6608","courseName":"AI교육공학기초","aliases":["AI교육공학기초","AI교육공학활용"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[21]},{"major":"교육공학","term":"2027-1","courseCode":"SET6676","courseName":"교육공학연구방법론","aliases":["교육공학연구방법론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[23],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2027-1","courseCode":"SET6679","courseName":"교육공학연구방법응용","aliases":["교육공학연구방법응용"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[22],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2027-2","courseCode":"SET6602","courseName":"교수학습이론","aliases":["교수학습이론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[21]},{"major":"교육공학","term":"2027-2","courseCode":"SET6608","courseName":"AI교육공학활용","aliases":["AI교육공학기초","AI교육공학활용"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[20]},{"major":"교육공학","term":"2027-2","courseCode":"SET6652","courseName":"원격교육론","aliases":["원격교육론"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[24]},{"major":"교육공학","term":"2027-2","courseCode":"SET6673","courseName":"기업교육공학연구","aliases":["기업교육공학연구"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[22]},{"major":"교육공학","term":"2027-2","courseCode":"SET6678","courseName":"교육공학연구자료분석","aliases":["교육공학연구자료분석"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[23]},{"major":"교육공학","term":"2028-1","courseCode":"SET6604","courseName":"교수학습설계","aliases":["교수학습설계"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[33],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2028-1","courseCode":"SET6606","courseName":"교육훈련프로그램개발","aliases":["교육훈련프로그램개발"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[37],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2028-1","courseCode":"SET6675","courseName":"교육공학세미나","aliases":["교육공학세미나"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[34],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2028-1","courseCode":"SET6676","courseName":"교육공학연구방법론","aliases":["교육공학연구방법론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[36],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2028-1","courseCode":"SET6679","courseName":"교육공학연구방법응용","aliases":["교육공학연구방법응용"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[35],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2028-2","courseCode":"SET6604","courseName":"교수학습설계","aliases":["교수학습설계"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[33],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2028-2","courseCode":"SET6606","courseName":"교육훈련프로그램개발","aliases":["교육훈련프로그램개발"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[37],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2028-2","courseCode":"SET6608","courseName":"AI교육공학기초","aliases":["AI교육공학기초","AI교육공학활용"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[34]},{"major":"교육공학","term":"2028-2","courseCode":"SET6676","courseName":"교육공학연구방법론","aliases":["교육공학연구방법론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[36],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육공학","term":"2028-2","courseCode":"SET6679","courseName":"교육공학연구방법응용","aliases":["교육공학연구방법응용"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[35],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육행정","term":"2026-2","courseCode":"SEM6593","courseName":"교육개혁의논리와실제","aliases":["교육개혁의논리와실제"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이무성","room":"교605","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SEM6593"],"sourceActualRows":[168],"sourcePlanRows":[53],"categoryOptions":["teaching","major_elective"]},{"major":"교육행정","term":"2026-2","courseCode":"SEM7504","courseName":"다문화교육현장사례연구\n(구: 교육현장연구방법)","aliases":["다문화교육현장사례연구\n(구: 교육현장연구방법)"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned_missing_actual","wasPlanned":true,"plannedButNotActual":true,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[54],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육행정","term":"2026-2","courseCode":"SEM7787","courseName":"대학행정론","aliases":["대학행정론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이인서","room":"백S206","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SEM7787-01"],"sourceActualRows":[181],"sourcePlanRows":[55]},{"major":"교육행정","term":"2026-2","courseCode":"SMI6522","courseName":"다문화교육현장사례연구*\n(구:교육현장연구방법)","aliases":["교육현장연구방법","다문화교육현장사례연구*\n(구:교육현장연구방법)"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":false,"plannedButNotActual":false,"actualNotPlanned":true,"professor":"박순용","room":"교304","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SMI6522-01"],"sourceActualRows":[168],"sourcePlanRows":[]},{"major":"교육행정","term":"2026-2","courseCode":"SMI6523","courseName":"한국어교육론","aliases":["한국어교육론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":false,"plannedButNotActual":false,"actualNotPlanned":true,"professor":"이복자","room":"교308","day":"월","timeRaw":"","targetSemester":"전학기","sectionCodes":["SMI6523"],"sourceActualRows":[174],"sourcePlanRows":[]},{"major":"교육행정","term":"2027-1","courseCode":"SEM7505","courseName":"교육행정입문","aliases":["교육행정입문"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[66],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육행정","term":"2027-1","courseCode":"SEM7790","courseName":"고등교육론","aliases":["고등교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[68],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"교육행정","term":"2027-1","courseCode":"SEM7814","courseName":"교육정치학","aliases":["교육정치학"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[67]},{"major":"교육행정","term":"2027-2","courseCode":"SEM6502","courseName":"교육통계방법","aliases":["교육통계방법"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[68],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육행정","term":"2027-2","courseCode":"SMI6522","courseName":"교육현장연구방법","aliases":["교육현장연구방법","다문화교육현장사례연구*\n(구:교육현장연구방법)"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[67]},{"major":"교육행정","term":"2027-2","courseCode":"과목명변경","courseName":"교육정책연구","aliases":["교육정책연구"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[66]},{"major":"교육행정","term":"2028-1","courseCode":"SEM7505","courseName":"교육행정입문","aliases":["교육행정입문"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[79],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"교육행정","term":"2028-1","courseCode":"SEM7787","courseName":"대학행정론","aliases":["대학행정론"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[81]},{"major":"교육행정","term":"2028-1","courseCode":"SEM7812","courseName":"학교변화와리더십","aliases":["학교변화와리더십"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[80]},{"major":"교육행정","term":"2028-2","courseCode":"SEM6593","courseName":"교육개혁의논리와실제","aliases":["교육개혁의논리와실제"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[79],"categoryOptions":["teaching","major_elective"]},{"major":"교육행정","term":"2028-2","courseCode":"SEM7790","courseName":"고등교육론","aliases":["고등교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[81],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"교육행정","term":"2028-2","courseCode":"SMI6522","courseName":"교육현장연구방법","aliases":["교육현장연구방법","다문화교육현장사례연구*\n(구:교육현장연구방법)"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[80]},{"major":"국어교육","term":"2026-2","courseCode":"SKE6501","courseName":"문학이론","aliases":["문학이론"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"조강석","room":"백S608","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SKE6501"],"sourceActualRows":[197],"sourcePlanRows":[97]},{"major":"국어교육","term":"2026-2","courseCode":"SKE6505","courseName":"국어학개론","aliases":["국어학개론"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"조운성","room":"백S604","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SKE6505"],"sourceActualRows":[210],"sourcePlanRows":[102]},{"major":"국어교육","term":"2026-2","courseCode":"SKE6546","courseName":"한국고전산문읽기","aliases":["한국고전산문읽기"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이미라","room":"백S604","day":"화","timeRaw":"","targetSemester":"전학기","sectionCodes":["SKE6546"],"sourceActualRows":[203],"sourcePlanRows":[99]},{"major":"국어교육","term":"2026-2","courseCode":"SKE6584","courseName":"국어표기법연구","aliases":["국어표기법연구"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"조태린","room":"백S608","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SKE6584"],"sourceActualRows":[210],"sourcePlanRows":[100]},{"major":"국어교육","term":"2026-2","courseCode":"SKE6591","courseName":"국어교육론","aliases":["국어교육론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"곽수범","room":"교405","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SKE6591"],"sourceActualRows":[197],"sourcePlanRows":[98],"categoryOptions":["teaching","major_elective"]},{"major":"국어교육","term":"2026-2","courseCode":"SKE6595","courseName":"표현과소통교육","aliases":["표현과소통교육"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"곽수범","room":"교405","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SKE6595"],"sourceActualRows":[210],"sourcePlanRows":[103],"categoryOptions":["teaching","major_elective"]},{"major":"국어교육","term":"2026-2","courseCode":"SKE6641","courseName":"현대기록문학텍스트읽기","aliases":["현대기록문학텍스트읽기"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김현주","room":"백S604","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SKE6641"],"sourceActualRows":[197],"sourcePlanRows":[101]},{"major":"국어교육","term":"2027-1","courseCode":"SKE6504","courseName":"한국고전문학사연구","aliases":["한국고전문학사연구"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[109],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-1","courseCode":"SKE6549","courseName":"고전문학현장교육","aliases":["고전문학현장교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[110],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-1","courseCode":"SKE6554","courseName":"현대비평문학교육론","aliases":["현대비평문학교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[111],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-1","courseCode":"SKE6562","courseName":"국어사연구","aliases":["국어사연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[112],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-1","courseCode":"SKE6570","courseName":"현대문학작가연구","aliases":["현대문학작가연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[113],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-1","courseCode":"SKE6591","courseName":"국어교육론","aliases":["국어교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[114],"categoryOptions":["teaching","major_elective"]},{"major":"국어교육","term":"2027-1","courseCode":"SKE6602","courseName":"국어문법연구","aliases":["국어문법연구"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[108],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-2","courseCode":"SKE6507","courseName":"고전기초강독","aliases":["고전기초강독"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[108],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-2","courseCode":"SKE6508","courseName":"한국현대문학사연구","aliases":["한국현대문학사연구"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[109],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-2","courseCode":"SKE6541","courseName":"언어학이론","aliases":["언어학이론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[110],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-2","courseCode":"SKE6547","courseName":"한국고전소설텍스트읽기","aliases":["한국고전소설텍스트읽기"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[111],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-2","courseCode":"SKE6550","courseName":"현대시문학연구","aliases":["현대시문학연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[112],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2027-2","courseCode":"SKE6594","courseName":"국어이해교육론","aliases":["국어이해교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[113],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"국어교육","term":"2027-2","courseCode":"SKE6599","courseName":"국어창의논술교육연구","aliases":["국어창의논술교육연구"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[114],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"국어교육","term":"2028-1","courseCode":"SKE6506","courseName":"한국문학사교육연구","aliases":["한국문학사교육연구"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[120],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2028-1","courseCode":"SKE6542","courseName":"국어음운연구","aliases":["국어음운연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[121],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2028-1","courseCode":"SKE6551","courseName":"현대소설텍스트읽기","aliases":["현대소설텍스트읽기"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[122],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2028-1","courseCode":"SKE6565","courseName":"한국고전텍스트의문화적맥락","aliases":["한국고전텍스트의문화적맥락"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[123],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2028-1","courseCode":"SKE6587","courseName":"글쓰기교육연구","aliases":["글쓰기교육연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[125],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2028-1","courseCode":"SKE6592","courseName":"국어교재연구및지도법","aliases":["국어교재연구및지도법"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[126],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"국어교육","term":"2028-1","courseCode":"SKE6611","courseName":"국어정보학연구","aliases":["국어정보학연구"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[124]},{"major":"국어교육","term":"2028-2","courseCode":"SKE6501","courseName":"문학이론","aliases":["문학이론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[120]},{"major":"국어교육","term":"2028-2","courseCode":"SKE6505","courseName":"국어학개론","aliases":["국어학개론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[121]},{"major":"국어교육","term":"2028-2","courseCode":"SKE6546","courseName":"한국고전산문읽기","aliases":["한국고전산문읽기"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[122]},{"major":"국어교육","term":"2028-2","courseCode":"SKE6553","courseName":"고전소설교육연구","aliases":["고전소설교육연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[123],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"국어교육","term":"2028-2","courseCode":"SKE6584","courseName":"국어표기법연구","aliases":["국어표기법연구"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[124]},{"major":"국어교육","term":"2028-2","courseCode":"SKE6593","courseName":"국어교육특강","aliases":["국어교육특강"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[125],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"국어교육","term":"2028-2","courseCode":"SKE6595","courseName":"표현과소통교육","aliases":["표현과소통교육"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[126],"categoryOptions":["teaching","major_elective"]},{"major":"다문화국제이해교육","term":"2026-2","courseCode":"SMI6522","courseName":"다문화교육현장사례연구*","aliases":["다문화교육현장사례연구","다문화교육현장사례연구*"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"박순용","room":"교304","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"2~4학기","sectionCodes":["SMI6522"],"sourceActualRows":[226],"sourcePlanRows":[140]},{"major":"다문화국제이해교육","term":"2026-2","courseCode":"SMI6523","courseName":"한국어교육론","aliases":["한국어교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned_missing_actual","wasPlanned":true,"plannedButNotActual":true,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[143],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2026-2","courseCode":"SMI6525","courseName":"지역사회와 사회통합","aliases":["지역사회와 사회통합"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"오덕열","room":"교304","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SMI6525"],"sourceActualRows":[239],"sourcePlanRows":[142]},{"major":"다문화국제이해교육","term":"2026-2","courseCode":"SMI6528","courseName":"국제이해교육","aliases":["국제이해교육"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이무성","room":"교601","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SMI6528"],"sourceActualRows":[226],"sourcePlanRows":[141]},{"major":"다문화국제이해교육","term":"2027-1","courseCode":"SMI6523","courseName":"한국어교육론","aliases":["한국어교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[152],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2027-1","courseCode":"SMI6526","courseName":"다문화사회교수방법론","aliases":["다문화사회교수방법론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[154],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2027-1","courseCode":"SMI6527","courseName":"이민정책론","aliases":["이민정책론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[153],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2027-1","courseCode":"전공선택","courseName":"이민·다문화가족 복지론","aliases":["이민·다문화가족 복지론","한국사회의 다문화현상이해"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[155]},{"major":"다문화국제이해교육","term":"2027-2","courseCode":"SMI6522","courseName":"다문화교육현장사례연구","aliases":["다문화교육현장사례연구","다문화교육현장사례연구*"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[152]},{"major":"다문화국제이해교육","term":"2027-2","courseCode":"SMI6525","courseName":"지역사회와 사회통합","aliases":["지역사회와 사회통합"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[154]},{"major":"다문화국제이해교육","term":"2027-2","courseCode":"SMI6529","courseName":"세계시민교육과 지속가능발전","aliases":["세계시민교육과 지속가능발전"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[155],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2027-2","courseCode":"전공선택","courseName":"한국사회의 다문화현상이해","aliases":["이민·다문화가족 복지론","한국사회의 다문화현상이해"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[153]},{"major":"다문화국제이해교육","term":"2028-1","courseCode":"SMI6501","courseName":"다문화교육론","aliases":["다문화교육론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[166],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2028-1","courseCode":"SMI6523","courseName":"한국어교육론","aliases":["한국어교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[165],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2028-1","courseCode":"SMI6526","courseName":"다문화사회교수방법론","aliases":["다문화사회교수방법론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[163],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2028-1","courseCode":"SMI6527","courseName":"이민정책론","aliases":["이민정책론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[164],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"다문화국제이해교육","term":"2028-2","courseCode":"SMI6522","courseName":"다문화교육현장사례연구","aliases":["다문화교육현장사례연구","다문화교육현장사례연구*"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[163]},{"major":"다문화국제이해교육","term":"2028-2","courseCode":"SMI6525","courseName":"지역사회와 사회통합","aliases":["지역사회와 사회통합"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[164]},{"major":"다문화국제이해교육","term":"2028-2","courseCode":"전공선택","courseName":"한국사회의 다문화현상이해","aliases":["이민·다문화가족 복지론","한국사회의 다문화현상이해"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[165]},{"major":"사서교육","term":"2026-2","courseCode":"SLI6501","courseName":"교육정보검색론","aliases":["교육정보검색론"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"안다인","room":"위당관416","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SLI6501"],"sourceActualRows":[268],"sourcePlanRows":[182]},{"major":"사서교육","term":"2026-2","courseCode":"SLI6504","courseName":"목록학","aliases":["목록학"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"조성원","room":"위당관416","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SLI6504"],"sourceActualRows":[255],"sourcePlanRows":[183]},{"major":"사서교육","term":"2026-2","courseCode":"SLI6560","courseName":"독서지도론","aliases":["독서지도론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이은정","room":"위당관416","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SLI6560"],"sourceActualRows":[255],"sourcePlanRows":[184]},{"major":"사서교육","term":"2026-2","courseCode":"SLI6568","courseName":"학교도서관정책","aliases":["학교도서관정책"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김승희","room":"위당관416","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SLI6568"],"sourceActualRows":[268],"sourcePlanRows":[185]},{"major":"사서교육","term":"2026-2","courseCode":"SLI6580","courseName":"데이터사이언스개론","aliases":["데이터사이언스개론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"주영준","room":"위당관416","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SLI6580"],"sourceActualRows":[255],"sourcePlanRows":[186]},{"major":"사서교육","term":"2027-1","courseCode":"SLI6503","courseName":"학교도서관운영론","aliases":["학교도서관운영론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[195],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-1","courseCode":"SLI6505","courseName":"정보봉사론","aliases":["정보봉사론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[196],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-1","courseCode":"SLI6550","courseName":"분류학","aliases":["분류학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[197],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-1","courseCode":"SLI6562","courseName":"정보활용교육연구","aliases":["정보활용교육연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[198],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-1","courseCode":"SLI6578","courseName":"정보이용자연구","aliases":["정보이용자연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[199],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-2","courseCode":"SLI6504","courseName":"목록학","aliases":["목록학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[196]},{"major":"사서교육","term":"2027-2","courseCode":"SLI6544","courseName":"교육정보데이터베이스론","aliases":["교육정보데이터베이스론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[200],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-2","courseCode":"SLI6545","courseName":"학술커뮤니케이션론","aliases":["학술커뮤니케이션론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[198],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-2","courseCode":"SLI6567","courseName":"장서구성론","aliases":["장서구성론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[197],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-2","courseCode":"SLI6579","courseName":"학교도서관의최근동향","aliases":["학교도서관의최근동향"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[195],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2027-2","courseCode":"SLI6581","courseName":"인공지능의이해","aliases":["인공지능의이해"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[199],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2028-1","courseCode":"SLI6503","courseName":"학교도서관운영론","aliases":["학교도서관운영론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[207],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2028-1","courseCode":"SLI6505","courseName":"정보봉사론","aliases":["정보봉사론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[208],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2028-1","courseCode":"SLI6506","courseName":"문헌정보학연구방법론","aliases":["문헌정보학연구방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[209],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2028-1","courseCode":"SLI6509","courseName":"정보매체론","aliases":["정보매체론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[210],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2028-1","courseCode":"SLI6570","courseName":"도서관전산화","aliases":["도서관전산화"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[211],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2028-2","courseCode":"SLI6501","courseName":"교육정보검색론","aliases":["교육정보검색론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[207]},{"major":"사서교육","term":"2028-2","courseCode":"SLI6504","courseName":"목록학","aliases":["목록학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[208]},{"major":"사서교육","term":"2028-2","courseCode":"SLI6560","courseName":"독서지도론","aliases":["독서지도론"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[209]},{"major":"사서교육","term":"2028-2","courseCode":"SLI6568","courseName":"학교도서관정책","aliases":["학교도서관정책"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[211]},{"major":"사서교육","term":"2028-2","courseCode":"SLI6574","courseName":"문헌정보학교육론연구","aliases":["문헌정보학교육론연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[210],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"사서교육","term":"2028-2","courseCode":"SLI6580","courseName":"데이터사이언스개론","aliases":["데이터사이언스개론"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[212]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6504","courseName":"상담교육연구방법","aliases":["상담교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이규민","room":"교603","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n\n오후\n6:20\n~\n8:00","targetSemester":"3,4,5학기","sectionCodes":["SCE6504"],"sourceActualRows":[284],"sourcePlanRows":[227]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6505","courseName":"집단상담","aliases":["집단상담"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"고성숙","room":"백S108","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SCE6505"],"sourceActualRows":[284],"sourcePlanRows":[228]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6506","courseName":"상담이론과 실제","aliases":["상담이론과 실제","상담이론과실제"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"서영석","room":"교603","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n\n오후\n6:20\n~\n8:00","targetSemester":"1학기","sectionCodes":["SCE6506"],"sourceActualRows":[284],"sourcePlanRows":[229]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6565","courseName":"상담기법 및 실습","aliases":["상담기법 및 실습"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"안하얀","room":"백S111","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SCE6565"],"sourceActualRows":[297],"sourcePlanRows":[235]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"박남숙","room":"백S111","day":"목","timeRaw":"","targetSemester":"전학기","sectionCodes":["SCE6572"],"sourceActualRows":[290],"sourcePlanRows":[231]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6573","courseName":"진로상담","aliases":["진로상담"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"양현정","room":"백S108","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SCE6573"],"sourceActualRows":[297],"sourcePlanRows":[234]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6577","courseName":"상담실습 및 사례연구","aliases":["상담실습 및 사례연구"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이승아","room":"백S206","day":"월","timeRaw":"","targetSemester":"전학기","sectionCodes":["SCE6577"],"sourceActualRows":[303],"sourcePlanRows":[232]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6593","courseName":"행동수정","aliases":["행동수정"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이승아","room":"백S111","day":"화","timeRaw":"","targetSemester":"전학기","sectionCodes":["SCE6593"],"sourceActualRows":[290],"sourcePlanRows":[230],"categoryOptions":["teaching","major_elective"]},{"major":"상담교육","term":"2026-2","courseCode":"SCE6594","courseName":"특수아상담","aliases":["특수아상담"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이아영","room":"백S111","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SCE6594"],"sourceActualRows":[297],"sourcePlanRows":[233],"categoryOptions":["teaching","major_elective"]},{"major":"상담교육","term":"2027-1","courseCode":"SCE6504","courseName":"상담교육연구방법","aliases":["상담교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[241]},{"major":"상담교육","term":"2027-1","courseCode":"SCE6505","courseName":"집단상담","aliases":["집단상담"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[244]},{"major":"상담교육","term":"2027-1","courseCode":"SCE6506","courseName":"상담이론과 실제","aliases":["상담이론과 실제","상담이론과실제"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[240]},{"major":"상담교육","term":"2027-1","courseCode":"SCE6541","courseName":"생활지도연구","aliases":["생활지도연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[247],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"상담교육","term":"2027-1","courseCode":"SCE6557","courseName":"성격심리학","aliases":["성격심리학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[245],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"상담교육","term":"2027-1","courseCode":"SCE6565","courseName":"상담기법 및 실습","aliases":["상담기법 및 실습"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[242]},{"major":"상담교육","term":"2027-1","courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[248,249]},{"major":"상담교육","term":"2027-1","courseCode":"SCE6575","courseName":"심리검사","aliases":["심리검사"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[246],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"상담교육","term":"2027-1","courseCode":"SCE6585","courseName":"청소년상담의 이론과 실제","aliases":["청소년상담의 이론과 실제"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[243],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"상담교육","term":"2027-2","courseCode":"SCE6504","courseName":"상담교육연구방법","aliases":["상담교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[240]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6505","courseName":"집단상담","aliases":["집단상담"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[241]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6506","courseName":"상담이론과실제","aliases":["상담이론과 실제","상담이론과실제"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[242]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6565","courseName":"상담기법 및 실습","aliases":["상담기법 및 실습"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[249]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[245]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6573","courseName":"진로상담","aliases":["진로상담"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[248]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6577","courseName":"상담실습 및 사례연구","aliases":["상담실습 및 사례연구"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[246]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6591","courseName":"아동발달","aliases":["아동발달"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[244],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6593","courseName":"행동수정","aliases":["행동수정"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[243],"categoryOptions":["teaching","major_elective"]},{"major":"상담교육","term":"2027-2","courseCode":"SCE6594","courseName":"특수아상담","aliases":["특수아상담"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[247],"categoryOptions":["teaching","major_elective"]},{"major":"상담교육","term":"2028-1","courseCode":"SCE6504","courseName":"상담교육연구방법","aliases":["상담교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[254]},{"major":"상담교육","term":"2028-1","courseCode":"SCE6505","courseName":"집단상담","aliases":["집단상담"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[257]},{"major":"상담교육","term":"2028-1","courseCode":"SCE6506","courseName":"상담이론과 실제","aliases":["상담이론과 실제","상담이론과실제"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[253]},{"major":"상담교육","term":"2028-1","courseCode":"SCE6541","courseName":"생활지도연구","aliases":["생활지도연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[260],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"상담교육","term":"2028-1","courseCode":"SCE6557","courseName":"성격심리학","aliases":["성격심리학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[258],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"상담교육","term":"2028-1","courseCode":"SCE6565","courseName":"상담기법 및 실습","aliases":["상담기법 및 실습"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[255]},{"major":"상담교육","term":"2028-1","courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[261,262]},{"major":"상담교육","term":"2028-1","courseCode":"SCE6575","courseName":"심리검사","aliases":["심리검사"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[259],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"상담교육","term":"2028-1","courseCode":"SCE6585","courseName":"청소년상담의 이론과 실제","aliases":["청소년상담의 이론과 실제"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[256],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"상담교육","term":"2028-2","courseCode":"SCE6504","courseName":"상담교육연구방법","aliases":["상담교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[253]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6505","courseName":"집단상담","aliases":["집단상담"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[254]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6506","courseName":"상담이론과실제","aliases":["상담이론과 실제","상담이론과실제"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[255]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6565","courseName":"상담기법 및 실습","aliases":["상담기법 및 실습"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[262]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6572","courseName":"가족상담","aliases":["가족상담"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[258]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6573","courseName":"진로상담","aliases":["진로상담"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[261]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6577","courseName":"상담실습 및 사례연구","aliases":["상담실습 및 사례연구"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[259]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6591","courseName":"아동발달","aliases":["아동발달"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[257],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6593","courseName":"행동수정","aliases":["행동수정"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[256],"categoryOptions":["teaching","major_elective"]},{"major":"상담교육","term":"2028-2","courseCode":"SCE6594","courseName":"특수아상담","aliases":["특수아상담"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[260],"categoryOptions":["teaching","major_elective"]},{"major":"수학교육","term":"2026-2","courseCode":"SME6505","courseName":"위상수학","aliases":["위상수학"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"양민석","room":"과225","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SME6505"],"sourceActualRows":[313],"sourcePlanRows":[274]},{"major":"수학교육","term":"2026-2","courseCode":"SME6549","courseName":"정수론","aliases":["정수론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned_missing_actual","wasPlanned":true,"plannedButNotActual":true,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[275],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2026-2","courseCode":"SME6553","courseName":"정수론","aliases":["정수론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":false,"plannedButNotActual":false,"actualNotPlanned":true,"professor":"박동훈","room":"과학관227","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SME6553"],"sourceActualRows":[326],"sourcePlanRows":[]},{"major":"수학교육","term":"2026-2","courseCode":"SME6593","courseName":"수학교수법","aliases":["수학교수법"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"한수연","room":"교303","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SME6593"],"sourceActualRows":[313],"sourcePlanRows":[273],"categoryOptions":["teaching","major_elective"]},{"major":"수학교육","term":"2027-1","courseCode":"SME6503","courseName":"실해석","aliases":["실해석"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[288],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2027-1","courseCode":"SME6547","courseName":"확률과통계","aliases":["확률과통계"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[289],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2027-1","courseCode":"SME6562","courseName":"수학교육과테크놀로지","aliases":["수학교육과테크놀로지"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[287],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2027-1","courseCode":"SME6599","courseName":"수리논리논술","aliases":["수리논리논술"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[286],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"수학교육","term":"2027-2","courseCode":"SME6502","courseName":"미분기하","aliases":["미분기하"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[288],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2027-2","courseCode":"SME6545","courseName":"선형대수","aliases":["선형대수"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[289],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2027-2","courseCode":"SME6561","courseName":"수학교육연구방법론","aliases":["수학교육연구방법론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[287],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2027-2","courseCode":"SME6592","courseName":"수학교재연구및지도법","aliases":["수학교재연구및지도법"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[286],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"수학교육","term":"2028-1","courseCode":"SME6501","courseName":"현대대수학","aliases":["현대대수학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[300],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2028-1","courseCode":"SME6533","courseName":"복소해석학","aliases":["복소해석학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[301],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2028-1","courseCode":"SME6563","courseName":"인공지능수학교육","aliases":["인공지능수학교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[299],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2028-1","courseCode":"SME6590","courseName":"수학교육론","aliases":["수학교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[298],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"수학교육","term":"2028-2","courseCode":"SME6505","courseName":"위상수학","aliases":["위상수학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[300]},{"major":"수학교육","term":"2028-2","courseCode":"SME6549","courseName":"정수론","aliases":["정수론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[301],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2028-2","courseCode":"SME6561","courseName":"수학교육연구방법론","aliases":["수학교육연구방법론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[299],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"수학교육","term":"2028-2","courseCode":"SME6593","courseName":"수학교수법","aliases":["수학교수법"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[298],"categoryOptions":["teaching","major_elective"]},{"major":"역사교육","term":"2026-2","courseCode":"SHE6502","courseName":"한국사연구의최근동향","aliases":["한국사연구의 최근동향","한국사연구의최근동향"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이기훈","room":"백S503","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SHE6502"],"sourceActualRows":[342],"sourcePlanRows":[319]},{"major":"역사교육","term":"2026-2","courseCode":"SHE6525","courseName":"한국중세사의전개","aliases":["한국중세사의전개"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"도현철","room":"백S503","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SHE6525"],"sourceActualRows":[342],"sourcePlanRows":[320]},{"major":"역사교육","term":"2026-2","courseCode":"SHE6553","courseName":"서양근현대사상사","aliases":["서양근현대사상사"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"고광열","room":"백S503","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SHE6553"],"sourceActualRows":[355],"sourcePlanRows":[321]},{"major":"역사교육","term":"2026-2","courseCode":"SHE6592","courseName":"역사교재연구및교수론","aliases":["역사교재및교수론","역사교재연구및교수론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"지연정","room":"백S503","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SHE6592"],"sourceActualRows":[342],"sourcePlanRows":[318],"categoryOptions":["teaching","major_elective"]},{"major":"역사교육","term":"2027-1","courseCode":"SHE6507","courseName":"동양사연구의최근동향","aliases":["동양사연구의최근동향"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[326],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2027-1","courseCode":"SHE6530","courseName":"한국사자료연습","aliases":["한국사자료연습"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[327],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2027-1","courseCode":"SHE6552","courseName":"근현대한국의인간과사상","aliases":["근현대한국의인간과사상"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[328],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2027-1","courseCode":"SHE6593","courseName":"역사학과논술교육","aliases":["역사학과논술교육"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[325],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"역사교육","term":"2027-2","courseCode":"SHE6524","courseName":"고대한국과동아시아","aliases":["고대한국과동아시아"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[326],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2027-2","courseCode":"SHE6528","courseName":"한국중세지성사","aliases":["한국중세지성사"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[328],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2027-2","courseCode":"SHE6535","courseName":"중국근현대사","aliases":["중국근현대사"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[327],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2027-2","courseCode":"SHE6591","courseName":"역사교육론","aliases":["역사교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[325],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"역사교육","term":"2028-1","courseCode":"SHE6509","courseName":"서양사연구의최근동향","aliases":["서양사연구의최근동향"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[336],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2028-1","courseCode":"SHE6547","courseName":"한국현대사와분단체계","aliases":["한국현대사와분단체계"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[337],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2028-1","courseCode":"SHE6592","courseName":"역사교재및교수론","aliases":["역사교재및교수론","역사교재연구및교수론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[335],"categoryOptions":["teaching","major_elective"]},{"major":"역사교육","term":"2028-1","courseCode":"SHE6601","courseName":"한국사와문화유산","aliases":["한국사와문화유산"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[338],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2028-2","courseCode":"SHE6502","courseName":"한국사연구의 최근동향","aliases":["한국사연구의 최근동향","한국사연구의최근동향"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[336]},{"major":"역사교육","term":"2028-2","courseCode":"SHE6534","courseName":"중국고중세사탐구","aliases":["중국고중세사탐구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[337],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2028-2","courseCode":"SHE6541","courseName":"유럽세계의형성","aliases":["유럽세계의형성"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[338],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"역사교육","term":"2028-2","courseCode":"SHE6593","courseName":"역사학과논술교육","aliases":["역사학과논술교육"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[335],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"영양교육","term":"2026-2","courseCode":"SNT6601","courseName":"영양교육및상담실습","aliases":["영양교육및상담실습"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"석용희","room":"백S402","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SNT6601"],"sourceActualRows":[371],"sourcePlanRows":[355]},{"major":"영양교육","term":"2026-2","courseCode":"SNT6602","courseName":"식품학특론","aliases":["식품학특론"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김우기","room":"백S402","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SNT6602"],"sourceActualRows":[384],"sourcePlanRows":[359]},{"major":"영양교육","term":"2026-2","courseCode":"SNT6652","courseName":"생애주기영양학특론","aliases":["생애주기영양특론","생애주기영양학특론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"배민경","room":"백S402","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SNT6652"],"sourceActualRows":[371],"sourcePlanRows":[356]},{"major":"영양교육","term":"2026-2","courseCode":"SNT6653","courseName":"조리원리특론및실습","aliases":["조리원리특론및실습"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"채선희","room":"백S402","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SNT6653"],"sourceActualRows":[384],"sourcePlanRows":[360]},{"major":"영양교육","term":"2026-2","courseCode":"SNT6663","courseName":"급식경영학특론","aliases":["급식경영학특론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"백선영","room":"백S402","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SNT6663"],"sourceActualRows":[384],"sourcePlanRows":[357]},{"major":"영양교육","term":"2026-2","courseCode":"SNT6667","courseName":"영양소대사특론","aliases":["영양소대사특론"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이승민","room":"백S402","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SNT6667"],"sourceActualRows":[371],"sourcePlanRows":[358]},{"major":"영양교육","term":"2027-1","courseCode":"SNT6656","courseName":"식품위생학특론","aliases":["식품위생학특론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[368],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-1","courseCode":"SNT6657","courseName":"영양판정특론및실습","aliases":["영양판정특론및실습"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[372],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-1","courseCode":"SNT6665","courseName":"영양생리학특론","aliases":["영양생리학특론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[369],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-1","courseCode":"SNT6670","courseName":"통계분석및실습","aliases":["통계분석및실습"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[370],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-1","courseCode":"SNT6675","courseName":"영양과 면역","aliases":["영양과 면역"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[371],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-2","courseCode":"SNT6603","courseName":"단체급식및실습","aliases":["단체급식및실습"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[368],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-2","courseCode":"SNT6651","courseName":"건강기능식품의이해","aliases":["건강기능식품의이해"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[369],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-2","courseCode":"SNT6654","courseName":"아동및청소년영양관리","aliases":["아동및청소년영양관리"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[370],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-2","courseCode":"SNT6659","courseName":"고급영양학특론","aliases":["고급영양학특론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[371],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-2","courseCode":"SNT6671","courseName":"식사요법특론및실습","aliases":["식사요법특론및실습"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[372],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2027-2","courseCode":"SNT6676","courseName":"영양생화학특론","aliases":["영양생화학특론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[373],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2028-1","courseCode":"SNT6601","courseName":"영양교육및상담실습","aliases":["영양교육및상담실습"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[380]},{"major":"영양교육","term":"2028-1","courseCode":"SNT6602","courseName":"식품학특론","aliases":["식품학특론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[384]},{"major":"영양교육","term":"2028-1","courseCode":"SNT6652","courseName":"생애주기영양특론","aliases":["생애주기영양특론","생애주기영양학특론"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[381]},{"major":"영양교육","term":"2028-1","courseCode":"SNT6653","courseName":"조리원리특론및실습","aliases":["조리원리특론및실습"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[385]},{"major":"영양교육","term":"2028-1","courseCode":"SNT6663","courseName":"급식경영학특론","aliases":["급식경영학특론"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[382]},{"major":"영양교육","term":"2028-1","courseCode":"SNT6667","courseName":"영양소대사특론","aliases":["영양소대사특론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[383]},{"major":"영양교육","term":"2028-2","courseCode":"SNT6656","courseName":"식품위생학특론","aliases":["식품위생학특론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[380],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2028-2","courseCode":"SNT6657","courseName":"영양판정특론및실습","aliases":["영양판정특론및실습"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[384],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2028-2","courseCode":"SNT6665","courseName":"영양생리학특론","aliases":["영양생리학특론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[381],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2028-2","courseCode":"SNT6670","courseName":"통계분석및실습","aliases":["통계분석및실습"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[382],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2028-2","courseCode":"SNT6673","courseName":"비타민&무기질대사","aliases":["비타민&무기질대사"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[385],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영양교육","term":"2028-2","courseCode":"SNT6675","courseName":"영양과 면역","aliases":["영양과 면역"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[383],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2026-2","courseCode":"SEC6606","courseName":"영어학개론","aliases":["영어학개론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned_missing_actual","wasPlanned":true,"plannedButNotActual":true,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[404],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2026-2","courseCode":"SEE6504","courseName":"영국문학개관","aliases":["영국문학개관"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김재철","room":"백S408","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"1,2,3학기","sectionCodes":["SEE6504"],"sourceActualRows":[400],"sourcePlanRows":[401]},{"major":"영어교육","term":"2026-2","courseCode":"SEE6505","courseName":"영어학개론*","aliases":["영어학개론","영어학개론*"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":false,"plannedButNotActual":false,"actualNotPlanned":true,"professor":"김현우","room":"백S408","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SEE6505"],"sourceActualRows":[400],"sourcePlanRows":[]},{"major":"영어교육","term":"2026-2","courseCode":"SEE6579","courseName":"영어교육평가","aliases":["영어교육평가"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이희경","room":"교517","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SEE6579"],"sourceActualRows":[413],"sourcePlanRows":[402]},{"major":"영어교육","term":"2026-2","courseCode":"SEE6585","courseName":"영어어휘및문법지도법","aliases":["영어어휘및문법지도법"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"최현규","room":"백S408","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SEE6585"],"sourceActualRows":[413],"sourcePlanRows":[405]},{"major":"영어교육","term":"2026-2","courseCode":"SEE6591","courseName":"영어교육론","aliases":["영어교육론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이희경","room":"교306","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"1,2,3학기","sectionCodes":["SEE6591"],"sourceActualRows":[413],"sourcePlanRows":[400],"categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2026-2","courseCode":"SEE6592","courseName":"영어교재연구및지도법","aliases":["영어교재연구및지도법"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이민진","room":"백S408","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"1,2,3,4학기","sectionCodes":["SEE6592"],"sourceActualRows":[400],"sourcePlanRows":[403],"categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2027-1","courseCode":"SEE6505","courseName":"영어학개론","aliases":["영어학개론","영어학개론*"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[415]},{"major":"영어교육","term":"2027-1","courseCode":"SEE6583","courseName":"영어음성음운론","aliases":["영어음성음운론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[417],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2027-1","courseCode":"SEE6584","courseName":"영어리터러시교수법","aliases":["영어리터러시교수법"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[419],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2027-1","courseCode":"SEE6591","courseName":"영어교육론","aliases":["영어교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[413],"categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2027-1","courseCode":"SEE6602","courseName":"논문작성및연구방법론","aliases":["논문작성및연구방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[416],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2027-1","courseCode":"SEE6692","courseName":"현장기반영어교수의실제","aliases":["현장기반영어교수의실제"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[418],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2027-1","courseCode":"SEE7112","courseName":"코퍼스를이용한영어교육","aliases":["코퍼스를이용한영어교육"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[414]},{"major":"영어교육","term":"2027-2","courseCode":"SEE6504","courseName":"영국문학개관","aliases":["영국문학개관"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[414]},{"major":"영어교육","term":"2027-2","courseCode":"SEE6561","courseName":"디지털·AI기반영어교육","aliases":["디지털·AI기반영어교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[418],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2027-2","courseCode":"SEE6564","courseName":"영어구조론","aliases":["영어구조론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[417],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2027-2","courseCode":"SEE6579","courseName":"영어교육평가","aliases":["영어교육평가"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[415]},{"major":"영어교육","term":"2027-2","courseCode":"SEE6585","courseName":"영어어휘및문법지도법","aliases":["영어어휘및문법지도법"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[419]},{"major":"영어교육","term":"2027-2","courseCode":"SEE6591","courseName":"영어교육론","aliases":["영어교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[413],"categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2027-2","courseCode":"SEE6592","courseName":"영어교재연구및지도법","aliases":["영어교재연구및지도법"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[416],"categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2028-1","courseCode":"SEE6505","courseName":"영어학개론","aliases":["영어학개론","영어학개론*"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[426]},{"major":"영어교육","term":"2028-1","courseCode":"SEE6583","courseName":"영어음성음운론","aliases":["영어음성음운론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[428],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2028-1","courseCode":"SEE6591","courseName":"영어교육론","aliases":["영어교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[431],"categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2028-1","courseCode":"SEE6602","courseName":"논문작성및연구방법론","aliases":["논문작성및연구방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[427],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2028-1","courseCode":"SEE6692","courseName":"현장기반영어교수의실제","aliases":["현장기반영어교수의실제"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[430],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2028-1","courseCode":"SEE7112","courseName":"코퍼스를이용한영어교육","aliases":["코퍼스를이용한영어교육"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[425]},{"major":"영어교육","term":"2028-1","courseCode":"선택","courseName":"영어구어능력교수법","aliases":["영어구어능력교수법"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[429]},{"major":"영어교육","term":"2028-2","courseCode":"SEE6504","courseName":"영국문학개관","aliases":["영국문학개관"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[425]},{"major":"영어교육","term":"2028-2","courseCode":"SEE6564","courseName":"영어구조론","aliases":["영어구조론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[430],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2028-2","courseCode":"SEE6579","courseName":"영어교육평가","aliases":["영어교육평가"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[427]},{"major":"영어교육","term":"2028-2","courseCode":"SEE6584","courseName":"영어리터러시교수법","aliases":["영어리터러시교수법"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[428],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"영어교육","term":"2028-2","courseCode":"SEE6585","courseName":"영어어휘및문법지도법","aliases":["영어어휘및문법지도법"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[429]},{"major":"영어교육","term":"2028-2","courseCode":"SEE6591","courseName":"영어교육론","aliases":["영어교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[431],"categoryOptions":["teaching","major_elective"]},{"major":"영어교육","term":"2028-2","courseCode":"SEE6592","courseName":"영어교재연구및지도법","aliases":["영어교재연구및지도법"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[426],"categoryOptions":["teaching","major_elective"]},{"major":"외국어로서의 한국어교육","term":"2026-2","courseCode":"STK6546","courseName":"한국문화의 이해","aliases":["한국문화의 이해","한국문화의이해"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김찬호","room":"백S106","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["STK6546"],"sourceActualRows":[442],"sourcePlanRows":[448]},{"major":"외국어로서의 한국어교육","term":"2026-2","courseCode":"STK6554","courseName":"대조언어학","aliases":["대조언어학"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"원미진","room":"백S108","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["STK6554"],"sourceActualRows":[429],"sourcePlanRows":[447]},{"major":"외국어로서의 한국어교육","term":"2026-2","courseCode":"STK6576","courseName":"한국어와정보화","aliases":["한국어와정보화"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"남길임","room":"위301","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["STK6576"],"sourceActualRows":[429],"sourcePlanRows":[446]},{"major":"외국어로서의 한국어교육","term":"2026-2","courseCode":"STK6594","courseName":"한국어교수방법론","aliases":["한국어교수방법론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이복자","room":"백S106","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["STK6594"],"sourceActualRows":[442],"sourcePlanRows":[449]},{"major":"외국어로서의 한국어교육","term":"2026-2","courseCode":"STK6595","courseName":"한국어교육실습","aliases":["한국어교육실습"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이복자","room":"백S106","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"3.4학기","sectionCodes":["STK6595"],"sourceActualRows":[442],"sourcePlanRows":[450]},{"major":"외국어로서의 한국어교육","term":"2026-2","courseCode":"STK6602","courseName":"한국어의이해","aliases":["한국어의이해"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"강현화","room":"백S106","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["STK6602"],"sourceActualRows":[429],"sourcePlanRows":[445]},{"major":"외국어로서의 한국어교육","term":"2027-1","courseCode":"STK6505","courseName":"외국어로서의한국어교육","aliases":["외국어로서의한국어교육"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[457],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2027-1","courseCode":"STK6509","courseName":"한국어교육연구방법론","aliases":["한국어교육연구방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[458],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2027-1","courseCode":"STK6539","courseName":"한국어어휘교육론","aliases":["한국어어휘교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[459],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2027-1","courseCode":"STK6540","courseName":"한국어표현교육론","aliases":["한국어표현교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[460],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2027-1","courseCode":"STK6575","courseName":"한국문학의이해","aliases":["한국문학의이해"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[461],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2027-1","courseCode":"STK6595","courseName":"한국어교육실습","aliases":["한국어교육실습"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[462]},{"major":"외국어로서의 한국어교육","term":"2027-2","courseCode":"STK6546","courseName":"한국문화의이해","aliases":["한국문화의 이해","한국문화의이해"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[462]},{"major":"외국어로서의 한국어교육","term":"2027-2","courseCode":"STK6554","courseName":"대조언어학","aliases":["대조언어학"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[458]},{"major":"외국어로서의 한국어교육","term":"2027-2","courseCode":"STK6576","courseName":"한국어와정보화","aliases":["한국어와정보화"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[459]},{"major":"외국어로서의 한국어교육","term":"2027-2","courseCode":"STK6577","courseName":"멀티미디어한국어교육","aliases":["멀티미디어한국어교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[460],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2027-2","courseCode":"STK6596","courseName":"한국어교육과정설계","aliases":["한국어교육과정설계"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[461],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"외국어로서의 한국어교육","term":"2027-2","courseCode":"STK6602","courseName":"한국어의이해","aliases":["한국어의이해"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[457]},{"major":"외국어로서의 한국어교육","term":"2028-1","courseCode":"STK6505","courseName":"외국어로서의한국어교육","aliases":["외국어로서의한국어교육"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[468],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2028-1","courseCode":"STK6537","courseName":"한국어문법교육론","aliases":["한국어문법교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[470],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2028-1","courseCode":"STK6540","courseName":"한국어표현교육론","aliases":["한국어표현교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[471],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2028-1","courseCode":"STK6560","courseName":"사회언어학","aliases":["사회언어학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[469],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2028-1","courseCode":"STK6575","courseName":"한국문학의이해","aliases":["한국문학의이해"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[472],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2028-1","courseCode":"STK6595","courseName":"한국어교육실습","aliases":["한국어교육실습"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[473]},{"major":"외국어로서의 한국어교육","term":"2028-2","courseCode":"STK6509","courseName":"한국어교육연구방법론","aliases":["한국어교육연구방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[469],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"외국어로서의 한국어교육","term":"2028-2","courseCode":"STK6546","courseName":"한국문화의이해","aliases":["한국문화의 이해","한국문화의이해"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[473]},{"major":"외국어로서의 한국어교육","term":"2028-2","courseCode":"STK6576","courseName":"한국어와정보화","aliases":["한국어와정보화"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[470]},{"major":"외국어로서의 한국어교육","term":"2028-2","courseCode":"STK6595","courseName":"한국어교육실습","aliases":["한국어교육실습"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[471]},{"major":"외국어로서의 한국어교육","term":"2028-2","courseCode":"STK6596","courseName":"한국어교육과정설계","aliases":["한국어교육과정설계"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[472],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"외국어로서의 한국어교육","term":"2028-2","courseCode":"STK6602","courseName":"한국어의이해","aliases":["한국어의이해"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[468]},{"major":"유아교육","term":"2026-2","courseCode":"SCH6602","courseName":"영유아발달및교육","aliases":["영유아발달및교육"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김재희","room":"삼206","day":"목","timeRaw":"","targetSemester":"전학기","sectionCodes":["SCH6602"],"sourceActualRows":[464],"sourcePlanRows":[488]},{"major":"유아교육","term":"2026-2","courseCode":"SCH6603","courseName":"유아교육과정연구","aliases":["유아교육과정연구"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이하연","room":"삼B110","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SCH6603"],"sourceActualRows":[471],"sourcePlanRows":[489]},{"major":"유아교육","term":"2026-2","courseCode":"SCH6604","courseName":"유아교육연구방법","aliases":["유아교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이지혜","room":"삼206","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SCH6604"],"sourceActualRows":[471],"sourcePlanRows":[490]},{"major":"유아교육","term":"2026-2","courseCode":"SCH6652","courseName":"부모교육","aliases":["부모교육"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"조항린","room":"삼B105","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SCH6652"],"sourceActualRows":[458],"sourcePlanRows":[493]},{"major":"유아교육","term":"2026-2","courseCode":"SCH6665","courseName":"유아수학교육","aliases":["유아수학교육"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이혜경","room":"삼206","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SCH6665"],"sourceActualRows":[471],"sourcePlanRows":[494]},{"major":"유아교육","term":"2026-2","courseCode":"SCH6670","courseName":"비교유아교육세미나","aliases":["비교유아교육세미나"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned_missing_actual","wasPlanned":true,"plannedButNotActual":true,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[495],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2026-2","courseCode":"SCH6671","courseName":"비교유아교육세미나","aliases":["비교유아교육세미나"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":false,"plannedButNotActual":false,"actualNotPlanned":true,"professor":"김재희","room":"삼206","day":"목","timeRaw":"","targetSemester":"전학기","sectionCodes":["SCH6671"],"sourceActualRows":[477],"sourcePlanRows":[]},{"major":"유아교육","term":"2026-2","courseCode":"SCH6694","courseName":"유아교사교육론","aliases":["유아교사교육론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"변수연","room":"삼206","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SCH6694"],"sourceActualRows":[458],"sourcePlanRows":[491],"categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2026-2","courseCode":"SCH6698","courseName":"유아교육및보육프로그램연구","aliases":["유아교육및보육프로그램연구"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"우현경","room":"삼206","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SCH6698"],"sourceActualRows":[458],"sourcePlanRows":[492],"categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2027-1","courseCode":"SCH6602","courseName":"영유아발달및교육","aliases":["영유아발달및교육"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[500]},{"major":"유아교육","term":"2027-1","courseCode":"SCH6604","courseName":"유아교육연구방법","aliases":["유아교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[501]},{"major":"유아교육","term":"2027-1","courseCode":"SCH6644","courseName":"유아놀이이론및교육","aliases":["유아놀이이론및교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[504],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2027-1","courseCode":"SCH6653","courseName":"유아사회정서교육","aliases":["유아사회정서교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[505],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2027-1","courseCode":"SCH6672","courseName":"아동창의융합교육","aliases":["아동창의융합교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[506],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2027-1","courseCode":"SCH6673","courseName":"유아교육통계분석","aliases":["유아교육통계분석"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[507],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2027-1","courseCode":"SCH6690","courseName":"유아교육론","aliases":["유아교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[502],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2027-1","courseCode":"SCH6696","courseName":"유아스마트교수매체","aliases":["유아스마트교수매체"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[503],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2027-2","courseCode":"SCH6602","courseName":"영유아발달및교육","aliases":["영유아발달및교육"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[500]},{"major":"유아교육","term":"2027-2","courseCode":"SCH6603","courseName":"유아교육과정연구","aliases":["유아교육과정연구"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[501]},{"major":"유아교육","term":"2027-2","courseCode":"SCH6604","courseName":"유아교육연구방법","aliases":["유아교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[502]},{"major":"유아교육","term":"2027-2","courseCode":"SCH6641","courseName":"유아언어교육연구","aliases":["유아언어교육연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[505],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2027-2","courseCode":"SCH6657","courseName":"유아문제행동지도법","aliases":["유아문제행동지도법"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[506],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2027-2","courseCode":"SCH6670","courseName":"비교유아교육세미나","aliases":["비교유아교육세미나"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[507],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2027-2","courseCode":"SCH6694","courseName":"유아교사교육론","aliases":["유아교사교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[503],"categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2027-2","courseCode":"SCH6698","courseName":"유아교육및보육프로그램연구","aliases":["유아교육및보육프로그램연구"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[504],"categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2028-1","courseCode":"SCH6602","courseName":"영유아발달및교육","aliases":["영유아발달및교육"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[512]},{"major":"유아교육","term":"2028-1","courseCode":"SCH6604","courseName":"유아교육연구방법","aliases":["유아교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[513]},{"major":"유아교육","term":"2028-1","courseCode":"SCH6649","courseName":"유아교육기관운영관리세미나","aliases":["유아교육기관운영관리세미나"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[516],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2028-1","courseCode":"SCH6652","courseName":"부모교육","aliases":["부모교육"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[517]},{"major":"유아교육","term":"2028-1","courseCode":"SCH6662","courseName":"영재교육론","aliases":["영재교육론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[518],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2028-1","courseCode":"SCH6673","courseName":"유아교육통계분석","aliases":["유아교육통계분석"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[519],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2028-1","courseCode":"SCH6690","courseName":"유아교육론","aliases":["유아교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[514],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2028-1","courseCode":"SCH6696","courseName":"유아스마트교수매체","aliases":["유아스마트교수매체"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[515],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2028-2","courseCode":"SCH6602","courseName":"영유아발달및교육","aliases":["영유아발달및교육"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[512]},{"major":"유아교육","term":"2028-2","courseCode":"SCH6603","courseName":"유아교육과정연구","aliases":["유아교육과정연구"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[513]},{"major":"유아교육","term":"2028-2","courseCode":"SCH6604","courseName":"유아교육연구방법","aliases":["유아교육연구방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[514]},{"major":"유아교육","term":"2028-2","courseCode":"SCH6658","courseName":"유아교육및보육정책세미나","aliases":["유아교육및보육정책세미나"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[517],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2028-2","courseCode":"SCH6666","courseName":"유아과학교육연구","aliases":["유아과학교육연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[518],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2028-2","courseCode":"SCH6670","courseName":"비교유아교육세미나","aliases":["비교유아교육세미나"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[519],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"유아교육","term":"2028-2","courseCode":"SCH6694","courseName":"유아교사교육론","aliases":["유아교사교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[515],"categoryOptions":["teaching","major_elective"]},{"major":"유아교육","term":"2028-2","courseCode":"SCH6698","courseName":"유아교육및보육프로그램연구","aliases":["유아교육및보육프로그램연구"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[516],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2026-2","courseCode":"SMU6501","courseName":"화성법","aliases":["화성법"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"송무경","room":"음426","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SMU6501"],"sourceActualRows":[487],"sourcePlanRows":[533]},{"major":"음악교육","term":"2026-2","courseCode":"SMU6559","courseName":"음악분석및형식론","aliases":["음악분석및형식론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이홍석","room":"음102","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SMU6559"],"sourceActualRows":[487],"sourcePlanRows":[538]},{"major":"음악교육","term":"2026-2","courseCode":"SMU6567","courseName":"피아노반주법","aliases":["피아노반주법","피아노반주법음"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김지은","room":"음413","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SMU6567"],"sourceActualRows":[500],"sourcePlanRows":[539]},{"major":"음악교육","term":"2026-2","courseCode":"SMU6591","courseName":"음악교재연구및지도법","aliases":["음악교재연구및지도법"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"장지원","room":"음413","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SMU6591"],"sourceActualRows":[487],"sourcePlanRows":[537],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2026-2","courseCode":"SMU6593","courseName":"음악교육평가","aliases":["음악교육평가"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김지은","room":"음404","day":"목","timeRaw":"","targetSemester":"전학기","sectionCodes":["SMU6593"],"sourceActualRows":[506],"sourcePlanRows":[536],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2026-2","courseCode":"SMU6595","courseName":"음악적사고와논리논술","aliases":["음악적사고와논리논술"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"최원선","room":"음404","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"2,3,4학기","sectionCodes":["SMU6595"],"sourceActualRows":[500],"sourcePlanRows":[540],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2026-2","courseCode":"SMU6602","courseName":"국악개론","aliases":["국악개론"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"최선아","room":"음413","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SMU6602-01"],"sourceActualRows":[500],"sourcePlanRows":[534]},{"major":"음악교육","term":"2026-2","courseCode":"SMU6651","courseName":"음악감상","aliases":["음악감상"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"정종열","room":"음413","day":"화","timeRaw":"","targetSemester":"전학기","sectionCodes":["SMU6651"],"sourceActualRows":[493],"sourcePlanRows":[535]},{"major":"음악교육","term":"2027-1","courseCode":"SMU6506","courseName":"서양음악사(II)","aliases":["서양음악사(II)"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[545],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2027-1","courseCode":"SMU6557","courseName":"국악실기(판소리,민요)","aliases":["국악실기(판소리,민요)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[551],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2027-1","courseCode":"SMU6567","courseName":"피아노반주법","aliases":["피아노반주법","피아노반주법음"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[546]},{"major":"음악교육","term":"2027-1","courseCode":"SMU6571","courseName":"합창지도법","aliases":["합창지도법"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[552],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2027-1","courseCode":"SMU6587","courseName":"실용음악","aliases":["실용음악"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[549],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2027-1","courseCode":"SMU6590","courseName":"음악교육론","aliases":["음악교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[548],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2027-1","courseCode":"SMU6595","courseName":"음악적사고와논리논술","aliases":["음악적사고와논리논술"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[547],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2027-1","courseCode":"SMU6602","courseName":"국악개론","aliases":["국악개론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[550]},{"major":"음악교육","term":"2027-1","courseCode":"SMU6651","courseName":"음악감상","aliases":["음악감상"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[553]},{"major":"음악교육","term":"2027-2","courseCode":"SMU6501","courseName":"화성법","aliases":["화성법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[545]},{"major":"음악교육","term":"2027-2","courseCode":"SMU6505","courseName":"서양음악사(I)","aliases":["서양음악사(I)"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[550],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2027-2","courseCode":"SMU6545","courseName":"장구반주법","aliases":["장구반주법"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[546],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2027-2","courseCode":"SMU6559","courseName":"음악분석및형식론","aliases":["음악분석및형식론"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[547]},{"major":"음악교육","term":"2027-2","courseCode":"SMU6588","courseName":"음악연구방법론","aliases":["음악연구방법론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[548],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2027-2","courseCode":"SMU6591","courseName":"음악교재연구및지도법","aliases":["음악교재연구및지도법"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[552],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2027-2","courseCode":"SMU6593","courseName":"음악교육평가","aliases":["음악교육평가"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[551],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2027-2","courseCode":"SMU6651","courseName":"음악감상","aliases":["음악감상"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[549]},{"major":"음악교육","term":"2028-1","courseCode":"SMU6501","courseName":"화성법","aliases":["화성법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[558]},{"major":"음악교육","term":"2028-1","courseCode":"SMU6506","courseName":"서양음악사(II)","aliases":["서양음악사(II)"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[559],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2028-1","courseCode":"SMU6557","courseName":"국악실기(판소리,민요)","aliases":["국악실기(판소리,민요)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[560],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2028-1","courseCode":"SMU6567","courseName":"피아노반주법","aliases":["피아노반주법","피아노반주법음"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[565]},{"major":"음악교육","term":"2028-1","courseCode":"SMU6587","courseName":"실용음악","aliases":["실용음악"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[564],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"음악교육","term":"2028-1","courseCode":"SMU6590","courseName":"음악교육론","aliases":["음악교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[561],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2028-1","courseCode":"SMU6595","courseName":"음악적사고와논리논술","aliases":["음악적사고와논리논술"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[562],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2028-1","courseCode":"SMU6651","courseName":"음악감상","aliases":["음악감상"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[563]},{"major":"음악교육","term":"2028-2","courseCode":"SMU6501","courseName":"화성법","aliases":["화성법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[558]},{"major":"음악교육","term":"2028-2","courseCode":"SMU6559","courseName":"음악분석및형식론","aliases":["음악분석및형식론"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[562]},{"major":"음악교육","term":"2028-2","courseCode":"SMU6567","courseName":"피아노반주법","aliases":["피아노반주법","피아노반주법음"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[563]},{"major":"음악교육","term":"2028-2","courseCode":"SMU6591","courseName":"음악교재연구및지도법","aliases":["음악교재연구및지도법"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[561],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2028-2","courseCode":"SMU6595","courseName":"음악적사고와논리논술","aliases":["음악적사고와논리논술"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[564],"categoryOptions":["teaching","major_elective"]},{"major":"음악교육","term":"2028-2","courseCode":"SMU6602","courseName":"국악개론","aliases":["국악개론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[559]},{"major":"음악교육","term":"2028-2","courseCode":"SMU6651","courseName":"음악감상","aliases":["음악감상"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[560]},{"major":"인적자원개발","term":"2026-2","courseCode":"SHR6506","courseName":"조직학습과 학습조직","aliases":["조직학습과 학습조직","조직학습과학습조직"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"오석영","room":"교601","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SHR6506"],"sourceActualRows":[516],"sourcePlanRows":[579]},{"major":"인적자원개발","term":"2026-2","courseCode":"SHR6574","courseName":"리더십의 이론과 실제","aliases":["리더십의 이론과 실제"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"백평구","room":"백S504","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SHR6574"],"sourceActualRows":[529],"sourcePlanRows":[582]},{"major":"인적자원개발","term":"2026-2","courseCode":"SHR6591","courseName":"인적자원개발연구자료분석","aliases":["인적자원개발연구자료분석"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"장지현","room":"교307","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SHR 6591"],"sourceActualRows":[529],"sourcePlanRows":[581],"categoryOptions":["teaching","major_elective"]},{"major":"인적자원개발","term":"2026-2","courseCode":"SHR7516","courseName":"교육훈련프로그램개발","aliases":["교육훈련프로그램개발"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"양숙형","room":"백S504","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SHR7516"],"sourceActualRows":[516],"sourcePlanRows":[580]},{"major":"인적자원개발","term":"2026-2","courseCode":"SHR7518","courseName":"일의 교육학","aliases":["일의 교육학","일의교육학"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"장원섭","room":"백S608","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SHR7518"],"sourceActualRows":[516],"sourcePlanRows":[578]},{"major":"인적자원개발","term":"2026-2","courseCode":"SHR7519","courseName":"인적자원개발과 인공지능","aliases":["인적자원개발과 인공지능"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이호진","room":"백S504","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SHR7519"],"sourceActualRows":[529],"sourcePlanRows":[583]},{"major":"인적자원개발","term":"2027-1","courseCode":"","courseName":"외 2~3과목","aliases":["외 2~3과목"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[593]},{"major":"인적자원개발","term":"2027-1","courseCode":"SHR6501","courseName":"인적자원개발론","aliases":["인적자원개발론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[590],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"인적자원개발","term":"2027-1","courseCode":"SHR6505","courseName":"성인학습이론","aliases":["성인학습이론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[591],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"인적자원개발","term":"2027-1","courseCode":"SHR7112","courseName":"경력개발의이론과실제","aliases":["경력개발의이론과실제"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[592]},{"major":"인적자원개발","term":"2027-2","courseCode":"","courseName":"외 2~3과목","aliases":["외 2~3과목"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[593]},{"major":"인적자원개발","term":"2027-2","courseCode":"SHR6504","courseName":"인적자원개발연구방법론","aliases":["인적자원개발연구방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[592],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"인적자원개발","term":"2027-2","courseCode":"SHR6586","courseName":"일터학습세미나","aliases":["일터학습세미나"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[590],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"인적자원개발","term":"2027-2","courseCode":"SHR6591","courseName":"인적자원개발연구자료분석","aliases":["인적자원개발연구자료분석"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[591],"categoryOptions":["teaching","major_elective"]},{"major":"인적자원개발","term":"2028-1","courseCode":"","courseName":"외 2~3과목","aliases":["외 2~3과목"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[605]},{"major":"인적자원개발","term":"2028-1","courseCode":"SHR6501","courseName":"인적자원개발론","aliases":["인적자원개발론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[602],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"인적자원개발","term":"2028-1","courseCode":"SHR7113","courseName":"조직개발의이론과실제","aliases":["조직개발의이론과실제"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[603]},{"major":"인적자원개발","term":"2028-1","courseCode":"SHR7517","courseName":"기업교육통계분석","aliases":["기업교육통계분석"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[604]},{"major":"인적자원개발","term":"2028-2","courseCode":"","courseName":"외 2~3과목","aliases":["외 2~3과목"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[605]},{"major":"인적자원개발","term":"2028-2","courseCode":"SHR6506","courseName":"조직학습과학습조직","aliases":["조직학습과 학습조직","조직학습과학습조직"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[603]},{"major":"인적자원개발","term":"2028-2","courseCode":"SHR6591","courseName":"인적자원개발연구자료분석","aliases":["인적자원개발연구자료분석"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[604],"categoryOptions":["teaching","major_elective"]},{"major":"인적자원개발","term":"2028-2","courseCode":"SHR7518","courseName":"일의교육학","aliases":["일의 교육학","일의교육학"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[602]},{"major":"일반사회교육","term":"2026-2","courseCode":"SSE6504","courseName":"문화와 사회","aliases":["문화와 사회"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"하홍규","room":"백S206","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SSE6504"],"sourceActualRows":[545],"sourcePlanRows":[622]},{"major":"일반사회교육","term":"2026-2","courseCode":"SSE6506","courseName":"사회조사방법","aliases":["사회조사방법"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김종우","room":"위319","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SSE6506"],"sourceActualRows":[545],"sourcePlanRows":[625]},{"major":"일반사회교육","term":"2026-2","courseCode":"SSE6521","courseName":"사회학특강","aliases":["사회학특강"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"장상철","room":"백S509","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SSE6521"],"sourceActualRows":[545],"sourcePlanRows":[624]},{"major":"일반사회교육","term":"2026-2","courseCode":"SSE6594","courseName":"일반사회교육론","aliases":["일반사회교육론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"윤민희","room":"백S509","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SSE6594-01-00"],"sourceActualRows":[558],"sourcePlanRows":[623],"categoryOptions":["teaching","major_elective"]},{"major":"일반사회교육","term":"2027-1","courseCode":"SSE6501","courseName":"사회학의 이해","aliases":["사회학의 이해"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[634],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2027-1","courseCode":"SSE6502","courseName":"정치와 사회","aliases":["정치와 사회"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[635],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2027-1","courseCode":"SSE6526","courseName":"일반사회논리논술","aliases":["일반사회논리논술"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[638],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2027-1","courseCode":"SSE6529","courseName":"사회변동론","aliases":["사회변동론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[636],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2027-1","courseCode":"SSE6539","courseName":"교육과 사회","aliases":["교육과 사회"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[637],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2027-2","courseCode":"SSE6503","courseName":"경제와 사회","aliases":["경제와 사회"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[634],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2027-2","courseCode":"SSE6504","courseName":"문화와 사회","aliases":["문화와 사회"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[635]},{"major":"일반사회교육","term":"2027-2","courseCode":"SSE6506","courseName":"사회조사방법","aliases":["사회조사방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[638]},{"major":"일반사회교육","term":"2027-2","courseCode":"SSE6521","courseName":"사회학특강","aliases":["사회학특강"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[637]},{"major":"일반사회교육","term":"2027-2","courseCode":"SSE6594","courseName":"일반사회교육론","aliases":["일반사회교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[636],"categoryOptions":["teaching","major_elective"]},{"major":"일반사회교육","term":"2028-1","courseCode":"SSE6501","courseName":"사회학의 이해","aliases":["사회학의 이해"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[646],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2028-1","courseCode":"SSE6502","courseName":"정치와 사회","aliases":["정치와 사회"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[647],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2028-1","courseCode":"SSE6526","courseName":"일반사회논리논술","aliases":["일반사회논리논술"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[650],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2028-1","courseCode":"SSE6529","courseName":"사회변동론","aliases":["사회변동론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[648],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2028-1","courseCode":"SSE6539","courseName":"교육과 사회","aliases":["교육과 사회"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[649],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2028-2","courseCode":"SSE6503","courseName":"경제와 사회","aliases":["경제와 사회"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[646],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"일반사회교육","term":"2028-2","courseCode":"SSE6504","courseName":"문화와 사회","aliases":["문화와 사회"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[647]},{"major":"일반사회교육","term":"2028-2","courseCode":"SSE6506","courseName":"사회조사방법","aliases":["사회조사방법"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[650]},{"major":"일반사회교육","term":"2028-2","courseCode":"SSE6521","courseName":"사회학특강","aliases":["사회학특강"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[649]},{"major":"일반사회교육","term":"2028-2","courseCode":"SSE6594","courseName":"일반사회교육론","aliases":["일반사회교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[648],"categoryOptions":["teaching","major_elective"]},{"major":"조기영어교육","term":"2026-2","courseCode":"SEC6602","courseName":"음성음운론과영어발음교육","aliases":["음성음운론과영어발음교육"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이석재","room":"외326-1","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"46054.0","sectionCodes":["SEC6602"],"sourceActualRows":[587],"sourcePlanRows":[668]},{"major":"조기영어교육","term":"2026-2","courseCode":"SEC6606","courseName":"영어학개론","aliases":["영어학개론"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"김현우","room":"백S408","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SEC6606"],"sourceActualRows":[574],"sourcePlanRows":[667]},{"major":"조기영어교육","term":"2026-2","courseCode":"SEC6608","courseName":"조기영어교육론","aliases":["조기영어교육론"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이희경","room":"교402","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SEC6608"],"sourceActualRows":[574],"sourcePlanRows":[666]},{"major":"조기영어교육","term":"2026-2","courseCode":"SEC6694","courseName":"영어교육학특강","aliases":["영어교육학특강"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이명신","room":"백S404","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"46054.0","sectionCodes":["SEC6694"],"sourceActualRows":[587],"sourcePlanRows":[669],"categoryOptions":["teaching","major_elective"]},{"major":"조기영어교육","term":"2026-2","courseCode":"SEC6711","courseName":"조기영어교육과통계학","aliases":["조기영어교육과통계학"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이민진","room":"백S404","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SEC6711"],"sourceActualRows":[574],"sourcePlanRows":[670]},{"major":"조기영어교육","term":"2027-1","courseCode":"SEC6608","courseName":"조기영어교육론","aliases":["조기영어교육론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[679]},{"major":"조기영어교육","term":"2027-1","courseCode":"SEC6673","courseName":"영어스토리텔링이론과실제","aliases":["영어스토리텔링이론과실제"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[680],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"조기영어교육","term":"2027-1","courseCode":"SEC6693","courseName":"아동영어듣기와말하기교육","aliases":["아동영어듣기와말하기교육"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[681],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"조기영어교육","term":"2027-1","courseCode":"SEC6713","courseName":"영국문학개관","aliases":["영국문학개관"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[682]},{"major":"조기영어교육","term":"2027-2","courseCode":"SEC6602","courseName":"음성음운론과영어발음교육","aliases":["음성음운론과영어발음교육"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[681]},{"major":"조기영어교육","term":"2027-2","courseCode":"SEC6606","courseName":"영어학개론","aliases":["영어학개론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[680]},{"major":"조기영어교육","term":"2027-2","courseCode":"SEC6694","courseName":"영어교육학특강","aliases":["영어교육학특강"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[682],"categoryOptions":["teaching","major_elective"]},{"major":"조기영어교육","term":"2027-2","courseCode":"SEC6701","courseName":"조기영어교육연구방법론","aliases":["조기영어교육연구방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[679],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"조기영어교육","term":"2028-1","courseCode":"SEC6608","courseName":"조기영어교육론","aliases":["조기영어교육론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[692]},{"major":"조기영어교육","term":"2028-1","courseCode":"SEC6673","courseName":"영어스토리텔링이론과실제","aliases":["영어스토리텔링이론과실제"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[693],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"조기영어교육","term":"2028-1","courseCode":"SEC6693","courseName":"아동영어듣기와말하기교육","aliases":["아동영어듣기와말하기교육"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[694],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"조기영어교육","term":"2028-1","courseCode":"SEC6713","courseName":"영국문학개관","aliases":["영국문학개관"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[695]},{"major":"조기영어교육","term":"2028-2","courseCode":"SEC6602","courseName":"음성음운론과영어발음교육","aliases":["음성음운론과영어발음교육"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[694]},{"major":"조기영어교육","term":"2028-2","courseCode":"SEC6606","courseName":"영어학개론","aliases":["영어학개론"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[693]},{"major":"조기영어교육","term":"2028-2","courseCode":"SEC6694","courseName":"영어교육학특강","aliases":["영어교육학특강"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[695],"categoryOptions":["teaching","major_elective"]},{"major":"조기영어교육","term":"2028-2","courseCode":"SEC6701","courseName":"조기영어교육연구방법론","aliases":["조기영어교육연구방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[692],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2026-2","courseCode":"SRE6506","courseName":"종교학개론","aliases":["종교학개론","종교학개론(전공필수)"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"최은택","room":"백S204","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SRE 6506"],"sourceActualRows":[616],"sourcePlanRows":[712]},{"major":"종교교육","term":"2026-2","courseCode":"SRE6552","courseName":"종교와문화","aliases":["종교와문화","종교와문화(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":false,"plannedButNotActual":false,"actualNotPlanned":true,"professor":"김형희","room":"백S204","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SRE6552"],"sourceActualRows":[603],"sourcePlanRows":[]},{"major":"종교교육","term":"2026-2","courseCode":"SRE6554","courseName":"최근의종교교육연구(전공선택)","aliases":["최근의종교교육연구(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned_missing_actual","wasPlanned":true,"plannedButNotActual":true,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[714],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2026-2","courseCode":"SRE6578","courseName":"현대사회와성서교육(전공선택)","aliases":["현대사회와성서교육(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned_missing_actual","wasPlanned":true,"plannedButNotActual":true,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[715],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2026-2","courseCode":"SRE6599","courseName":"종교교육과커뮤니케이션","aliases":["종교교육과커뮤니케이션","종교교육과커뮤니케이션(교과교직)"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"손문","room":"백S204","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SRE 6599"],"sourceActualRows":[616],"sourcePlanRows":[713],"categoryOptions":["teaching","major_elective"]},{"major":"종교교육","term":"2027-1","courseCode":"SRE6509","courseName":"종교교육과정(전공필수)","aliases":["종교교육과정(전공필수)"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[722],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2027-1","courseCode":"SRE6544","courseName":"종교윤리와교육(전공선택)","aliases":["종교윤리와교육(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[725],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2027-1","courseCode":"SRE6579","courseName":"종교와영성(전공선택)","aliases":["종교와영성(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[724],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2027-1","courseCode":"SRE6593","courseName":"논리논술과종교교육(교과교직)","aliases":["논리논술과종교교육(교과교직)"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[723],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"종교교육","term":"2027-2","courseCode":"SRE6552","courseName":"종교와문화(전공선택)","aliases":["종교와문화","종교와문화(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[725]},{"major":"종교교육","term":"2027-2","courseCode":"SRE6557","courseName":"종교교육사(전공선택)","aliases":["종교교육사(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[724],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2027-2","courseCode":"SRE6597","courseName":"기독교교수-학습과정론(교과교직)","aliases":["기독교교수-학습과정론(교과교직)"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[723],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"종교교육","term":"2027-2","courseCode":"SRE6602","courseName":"종교교육론(전공필수)","aliases":["종교교육론(전공필수)"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[722],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2028-1","courseCode":"SRE6508","courseName":"종교교육방법론","aliases":["종교교육방법론"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[735],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2028-1","courseCode":"SRE6574","courseName":"성년기종교교육론(전공선택)","aliases":["성년기종교교육론(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[737],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2028-1","courseCode":"SRE6585","courseName":"종교철학(전공선택)","aliases":["종교철학(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[738],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2028-1","courseCode":"SRE6598","courseName":"종교교재연구","aliases":["종교교재연구"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[736],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"종교교육","term":"2028-2","courseCode":"SRE6506","courseName":"종교학개론(전공필수)","aliases":["종교학개론","종교학개론(전공필수)"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[735]},{"major":"종교교육","term":"2028-2","courseCode":"SRE6554","courseName":"최근의종교교육연구(전공선택)","aliases":["최근의종교교육연구(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[737],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2028-2","courseCode":"SRE6578","courseName":"현대사회와성서교육(전공선택)","aliases":["현대사회와성서교육(전공선택)"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[738],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"종교교육","term":"2028-2","courseCode":"SRE6599","courseName":"종교교육과커뮤니케이션(교과교직)","aliases":["종교교육과커뮤니케이션","종교교육과커뮤니케이션(교과교직)"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[736],"categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2026-2","courseCode":"SPE6501","courseName":"운동생리학","aliases":["운동생리학"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"서상훈","room":"스포츠109","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SPE6501"],"sourceActualRows":[632],"sourcePlanRows":[755]},{"major":"체육및여가교육","term":"2026-2","courseCode":"SPE6554","courseName":"스포츠의역학적연구","aliases":["스포츠의역학적연구"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이해동","room":"스포츠109","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SPE6554"],"sourceActualRows":[632],"sourcePlanRows":[762]},{"major":"체육및여가교육","term":"2026-2","courseCode":"SPE6570","courseName":"특수체육특론","aliases":["특수체육특론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"전용관","room":"스포츠108","day":"월","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPE6570"],"sourceActualRows":[651],"sourcePlanRows":[756]},{"major":"체육및여가교육","term":"2026-2","courseCode":"SPE6576","courseName":"운동상해재활","aliases":["운동상해재활"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이세용","room":"스포츠315","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SPE6576"],"sourceActualRows":[645],"sourcePlanRows":[757]},{"major":"체육및여가교육","term":"2026-2","courseCode":"SPE6578","courseName":"뉴스포츠현장조사연구","aliases":["뉴스포츠현장조사연구"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"허진무","room":"스포츠109","day":"화","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPE6578"],"sourceActualRows":[651],"sourcePlanRows":[758]},{"major":"체육및여가교육","term":"2026-2","courseCode":"SPE6596","courseName":"체육교재연구 및 지도법","aliases":["체육교재연구 및 지도법"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"구소현","room":"스포츠109","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SPE6596"],"sourceActualRows":[645],"sourcePlanRows":[759],"categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2026-2","courseCode":"SPE6597","courseName":"체육교육론","aliases":["체육교육론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이한주","room":"교306","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SPE6597"],"sourceActualRows":[632],"sourcePlanRows":[760],"categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2026-2","courseCode":"SPE6612","courseName":"여가학의질적연구방법론","aliases":["여가학의질적연구방법론"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이철원","room":"스포츠108","day":"월","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPE6612"],"sourceActualRows":[638],"sourcePlanRows":[761]},{"major":"체육및여가교육","term":"2027-1","courseCode":"6503","courseName":"스포츠심리학","aliases":["스포츠심리학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[768],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-1","courseCode":"6555","courseName":"학교보건특강","aliases":["학교보건특강"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[769],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-1","courseCode":"6573","courseName":"스포츠카운셀링","aliases":["스포츠카운셀링"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[770],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-1","courseCode":"6574","courseName":"스포츠사회학","aliases":["스포츠사회학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[771],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-1","courseCode":"6596","courseName":"체육교재연구 및 지도법","aliases":["체육교재연구 및 지도법"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[772],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2027-1","courseCode":"6597","courseName":"체육교육론","aliases":["체육교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[773],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2027-1","courseCode":"6613","courseName":"근골격해부학으로이해하는 스포츠상해","aliases":["근골격해부학으로이해하는 스포츠상해"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[774]},{"major":"체육및여가교육","term":"2027-1","courseCode":"6614","courseName":"운동영양학특론","aliases":["운동영양학특론"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[775]},{"major":"체육및여가교육","term":"2027-1","courseCode":"6615","courseName":"디지털건강교육","aliases":["디지털건강교육"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[776]},{"major":"체육및여가교육","term":"2027-2","courseCode":"6501","courseName":"운동생리학","aliases":["운동생리학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[768],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-2","courseCode":"6554","courseName":"스포츠의역학적연구","aliases":["스포츠의역학적연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[769],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-2","courseCode":"6570","courseName":"특수체육특론","aliases":["특수체육특론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[770],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-2","courseCode":"6576","courseName":"운동상해재활","aliases":["운동상해재활"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[771],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-2","courseCode":"6577","courseName":"스포츠마케팅","aliases":["스포츠마케팅"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[776],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-2","courseCode":"6578","courseName":"뉴스포츠현장조사연구","aliases":["뉴스포츠현장조사연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[772],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2027-2","courseCode":"6596","courseName":"체육교재연구 및 지도법","aliases":["체육교재연구 및 지도법"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[773],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2027-2","courseCode":"6597","courseName":"체육교육론","aliases":["체육교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[774],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2027-2","courseCode":"6612","courseName":"여가학의질적연구방법론","aliases":["여가학의질적연구방법론"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[775]},{"major":"체육및여가교육","term":"2028-1","courseCode":"6503","courseName":"스포츠심리학","aliases":["스포츠심리학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[778],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-1","courseCode":"6555","courseName":"학교보건특강","aliases":["학교보건특강"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[779],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-1","courseCode":"6573","courseName":"스포츠카운셀링","aliases":["스포츠카운셀링"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[780],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-1","courseCode":"6574","courseName":"스포츠사회학","aliases":["스포츠사회학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[781],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-1","courseCode":"6596","courseName":"체육교재연구 및 지도법","aliases":["체육교재연구 및 지도법"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[782],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2028-1","courseCode":"6597","courseName":"체육교육론","aliases":["체육교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[783],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2028-1","courseCode":"6613","courseName":"근골격해부학으로이해하는 스포츠상해","aliases":["근골격해부학으로이해하는 스포츠상해"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[784]},{"major":"체육및여가교육","term":"2028-1","courseCode":"6614","courseName":"운동영양학특론","aliases":["운동영양학특론"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[785]},{"major":"체육및여가교육","term":"2028-1","courseCode":"6615","courseName":"디지털건강교육","aliases":["디지털건강교육"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[786]},{"major":"체육및여가교육","term":"2028-2","courseCode":"6501","courseName":"운동생리학","aliases":["운동생리학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[778],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-2","courseCode":"6554","courseName":"스포츠의역학적연구","aliases":["스포츠의역학적연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[779],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-2","courseCode":"6570","courseName":"특수체육특론","aliases":["특수체육특론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[780],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-2","courseCode":"6576","courseName":"운동상해재활","aliases":["운동상해재활"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[781],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-2","courseCode":"6577","courseName":"스포츠마케팅","aliases":["스포츠마케팅"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[786],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-2","courseCode":"6578","courseName":"뉴스포츠현장조사연구","aliases":["뉴스포츠현장조사연구"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[782],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"체육및여가교육","term":"2028-2","courseCode":"6596","courseName":"체육교재연구 및 지도법","aliases":["체육교재연구 및 지도법"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[783],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2028-2","courseCode":"6597","courseName":"체육교육론","aliases":["체육교육론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[784],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"체육및여가교육","term":"2028-2","courseCode":"6612","courseName":"여가학의질적연구방법론","aliases":["여가학의질적연구방법론"],"credits":3,"category":"unknown","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[785]},{"major":"통합과학교육","term":"2026-2","courseCode":"SGS6693","courseName":"통합과학교육논리및논술","aliases":["통합과학교육 논리 및 논술","통합과학교육논리및논술"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"박태윤, 장수철","room":"교311","day":"화","timeRaw":"","targetSemester":"전학기","sectionCodes":["SGS6693-01"],"sourceActualRows":[680],"sourcePlanRows":[798],"categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2026-2","courseCode":"SGS6695","courseName":"통합과학교육론","aliases":["통합과학교육론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"박태윤, 장수철","room":"교311","day":"월","timeRaw":"","targetSemester":"전학기","sectionCodes":["SGS6695-01"],"sourceActualRows":[680],"sourcePlanRows":[799],"categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2026-2","courseCode":"SGS6703","courseName":"일반생물학 및 실험","aliases":["일반생물학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"신동혁","room":"과S118A","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SGS6703-01"],"sourceActualRows":[674],"sourcePlanRows":[800]},{"major":"통합과학교육","term":"2026-2","courseCode":"SGS6704","courseName":"일반지구과학 및 실험","aliases":["일반지구과학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"한원식,유영희","room":"과S222","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SGS6704-01"],"sourceActualRows":[661],"sourcePlanRows":[801]},{"major":"통합과학교육","term":"2026-2","courseCode":"SGS6705","courseName":"전자기학","aliases":["전자기학"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이난영","room":"과323","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SGS6705-01"],"sourceActualRows":[674],"sourcePlanRows":[802]},{"major":"통합과학교육","term":"2026-2","courseCode":"SGS6707","courseName":"무기화학","aliases":["무기화학"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"안현서","room":"과523","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SGS6707-01"],"sourceActualRows":[674],"sourcePlanRows":[803]},{"major":"통합과학교육","term":"2026-2","courseCode":"SGS6831","courseName":"분자생물학","aliases":["분자생물학"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"최광민","room":"과S118A","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SGS6831-01"],"sourceActualRows":[661],"sourcePlanRows":[804]},{"major":"통합과학교육","term":"2026-2","courseCode":"SGS6832","courseName":"지질학","aliases":["지질학"],"credits":3,"category":"major_required","categoryRaw":"전공","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"이용재","room":"과S118B","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SGS6832-01"],"sourceActualRows":[661],"sourcePlanRows":[805]},{"major":"통합과학교육","term":"2027-1","courseCode":"SGS6692","courseName":"통합과학교재연구 및 지도법","aliases":["통합과학교재연구 및 지도법"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[812],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2027-1","courseCode":"SGS6695","courseName":"통합과학교육론","aliases":["통합과학교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[813],"categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2027-1","courseCode":"SGS6701","courseName":"일반물리학 및 실험","aliases":["일반물리학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[814],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2027-1","courseCode":"SGS6702","courseName":"일반화학 및 실험","aliases":["일반화학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[815],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2027-1","courseCode":"SGS6706","courseName":"현대물리학","aliases":["현대물리학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[816],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2027-1","courseCode":"SGS6708","courseName":"유기화학","aliases":["유기화학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[817],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2027-1","courseCode":"SGS6709","courseName":"세포학","aliases":["세포학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[818],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2027-1","courseCode":"SGS6833","courseName":"대기과학","aliases":["대기과학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[819],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2027-2","courseCode":"SGS6693","courseName":"통합과학교육 논리 및 논술","aliases":["통합과학교육 논리 및 논술","통합과학교육논리및논술"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[812],"categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2027-2","courseCode":"SGS6695","courseName":"통합과학교육론","aliases":["통합과학교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[813],"categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2027-2","courseCode":"SGS6703","courseName":"일반생물학 및 실험","aliases":["일반생물학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[814]},{"major":"통합과학교육","term":"2027-2","courseCode":"SGS6704","courseName":"일반지구과학 및 실험","aliases":["일반지구과학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[815]},{"major":"통합과학교육","term":"2027-2","courseCode":"SGS6705","courseName":"전자기학","aliases":["전자기학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[816]},{"major":"통합과학교육","term":"2027-2","courseCode":"SGS6707","courseName":"무기화학","aliases":["무기화학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[817]},{"major":"통합과학교육","term":"2027-2","courseCode":"SGS6831","courseName":"분자생물학","aliases":["분자생물학"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[818]},{"major":"통합과학교육","term":"2027-2","courseCode":"SGS6832","courseName":"지질학","aliases":["지질학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[819]},{"major":"통합과학교육","term":"2028-1","courseCode":"SGS6692","courseName":"통합과학교재연구 및 지도법","aliases":["통합과학교재연구 및 지도법"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[826],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2028-1","courseCode":"SGS6695","courseName":"통합과학교육론","aliases":["통합과학교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[827],"categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2028-1","courseCode":"SGS6701","courseName":"일반물리학 및 실험","aliases":["일반물리학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[828],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2028-1","courseCode":"SGS6702","courseName":"일반화학 및 실험","aliases":["일반화학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[829],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2028-1","courseCode":"SGS6706","courseName":"현대물리학","aliases":["현대물리학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[830],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2028-1","courseCode":"SGS6708","courseName":"유기화학","aliases":["유기화학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[831],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2028-1","courseCode":"SGS6709","courseName":"세포학","aliases":["세포학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[832],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2028-1","courseCode":"SGS6833","courseName":"대기과학","aliases":["대기과학"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[833],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"통합과학교육","term":"2028-2","courseCode":"SGS6693","courseName":"통합과학교육 논리 및 논술","aliases":["통합과학교육 논리 및 논술","통합과학교육논리및논술"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[826],"categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2028-2","courseCode":"SGS6695","courseName":"통합과학교육론","aliases":["통합과학교육론"],"credits":3,"category":"teaching","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[827],"categoryOptions":["teaching","major_elective"]},{"major":"통합과학교육","term":"2028-2","courseCode":"SGS6703","courseName":"일반생물학 및 실험","aliases":["일반생물학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[828]},{"major":"통합과학교육","term":"2028-2","courseCode":"SGS6704","courseName":"일반지구과학 및 실험","aliases":["일반지구과학 및 실험"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[829]},{"major":"통합과학교육","term":"2028-2","courseCode":"SGS6705","courseName":"전자기학","aliases":["전자기학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[830]},{"major":"통합과학교육","term":"2028-2","courseCode":"SGS6707","courseName":"무기화학","aliases":["무기화학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[831]},{"major":"통합과학교육","term":"2028-2","courseCode":"SGS6831","courseName":"분자생물학","aliases":["분자생물학"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[832]},{"major":"통합과학교육","term":"2028-2","courseCode":"SGS6832","courseName":"지질학","aliases":["지질학"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[833]},{"major":"평생교육경영","term":"2026-2","courseCode":"SLE7506","courseName":"평생교육경영연구방법론(영강)","aliases":["평생교육경영연구방법론","평생교육경영연구방법론(영강)"],"credits":3,"category":"major_required","categoryRaw":"필수","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"한수정","room":"교405","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SLE7506"],"sourceActualRows":[703],"sourcePlanRows":[844]},{"major":"평생교육경영","term":"2026-2","courseCode":"SLE7544","courseName":"평생교육연구의 기초통계","aliases":["평생교육연구의 기초통계","평생교육연구의기초통계"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"임수원","room":"교604","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SLE7544"],"sourceActualRows":[703],"sourcePlanRows":[846]},{"major":"평생교육경영","term":"2026-2","courseCode":"SLE7568","courseName":"평생교육조직역량개발","aliases":["평생교육조직역량개발"],"credits":3,"category":"major_elective","categoryRaw":"선택","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"최유연","room":"교614","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SLE7568"],"sourceActualRows":[690],"sourcePlanRows":[845]},{"major":"평생교육경영","term":"2026-2","courseCode":"SLE7593","courseName":"평생교육을위한학교교육의이해","aliases":["평생교육을위한학교교육의이해","평생교육을위한한국교육의이해"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"정은진","room":"교404","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SLE7593"],"sourceActualRows":[703],"sourcePlanRows":[847],"categoryOptions":["teaching","major_elective"]},{"major":"평생교육경영","term":"2027-1","courseCode":"SLE7502","courseName":"평생교육과조직경영","aliases":["평생교육과조직경영"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[861],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2027-1","courseCode":"SLE7545","courseName":"평생교육의질적연구방법","aliases":["평생교육의질적연구방법"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[857],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2027-1","courseCode":"SLE7555","courseName":"평생교육의학습조직론","aliases":["평생교육의학습조직론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[859],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2027-1","courseCode":"SLE7558","courseName":"디지털평생교육","aliases":["디지털평생교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[858],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2027-1","courseCode":"SLE7595","courseName":"성인학습및상담론","aliases":["성인학습및상담론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[860],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]},{"major":"평생교육경영","term":"2027-2","courseCode":"SLE7506","courseName":"평생교육경영연구방법론","aliases":["평생교육경영연구방법론","평생교육경영연구방법론(영강)"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[857]},{"major":"평생교육경영","term":"2027-2","courseCode":"SLE7508","courseName":"평생교육경영학","aliases":["평생교육경영학"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[861],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2027-2","courseCode":"SLE7545","courseName":"평생교육의질적연구방법","aliases":["평생교육의질적연구방법"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[860],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2027-2","courseCode":"SLE7559","courseName":"취약계층의평생교육","aliases":["취약계층의평생교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[859],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2027-2","courseCode":"SLE7566","courseName":"평생교육경영마케팅","aliases":["평생교육경영마케팅"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[858],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2028-1","courseCode":"SLE7502","courseName":"평생교육과조직경영","aliases":["평생교육과조직경영"],"credits":3,"category":"major_required","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[870],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2028-1","courseCode":"SLE7544","courseName":"평생교육연구의 기초통계","aliases":["평생교육연구의 기초통계","평생교육연구의기초통계"],"credits":3,"category":"major_elective","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[872]},{"major":"평생교육경영","term":"2028-1","courseCode":"SLE7561","courseName":"평생교육시장분석","aliases":["평생교육시장분석"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[871],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2028-1","courseCode":"SLE8541","courseName":"평생교육과 교육과정","aliases":["평생교육과 교육과정"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[873,874],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2028-2","courseCode":"SLE7506","courseName":"평생교육경영연구방법론","aliases":["평생교육경영연구방법론","평생교육경영연구방법론(영강)"],"credits":3,"category":"major_required","categoryRaw":"","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[870]},{"major":"평생교육경영","term":"2028-2","courseCode":"SLE7555","courseName":"평생교육의학습조직론","aliases":["평생교육의학습조직론"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[872],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2028-2","courseCode":"SLE7558","courseName":"디지털평생교육","aliases":["디지털평생교육"],"credits":3,"category":"major_elective","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[871],"categorySource":"교육대학원 공식 학정번호 종별 규칙"},{"major":"평생교육경영","term":"2028-2","courseCode":"SLE7595","courseName":"성인학습및상담론","aliases":["성인학습및상담론"],"credits":3,"category":"teaching","categoryRaw":"학정번호 규칙","availability":"planned","wasPlanned":true,"plannedButNotActual":false,"actualNotPlanned":false,"professor":"","room":"","day":"","timeRaw":"","targetSemester":"","sectionCodes":[],"sourceActualRows":[],"sourcePlanRows":[873,874],"categorySource":"교육대학원 공식 학정번호 종별 규칙","categoryOptions":["teaching","major_elective"]}],"globalOfferings":[{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6824","courseName":"한국교육의 역사","aliases":["한국교육의 역사"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"이원재","room":"교302","day":"월","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SPG6824-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6853","courseName":"학습동기","aliases":["학습동기"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"김은주","room":"교405","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SPG6853-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6867","courseName":"교육자를위한인공지능입문","aliases":["교육자를위한인공지능입문"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"강근영","room":"교302","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SPG6867-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6860","courseName":"연세와교사의사명","aliases":["연세와교사의사명"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"정용한","room":"백S111","day":"월","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPG6860-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6862","courseName":"학습과학","aliases":["학습과학"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"이희승","room":"교310","day":"화","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPG6862-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6868","courseName":"교육자를위한인공지능과코딩기초\n(영어)","aliases":["교육자를위한인공지능과코딩기초\n(영어)"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"한수연","room":"교304","day":"목","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPG6868-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6831","courseName":"영재교육의이론과실제","aliases":["영재교육의이론과실제"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"윤성로","room":"교302","day":"월","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SPG6831-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6864","courseName":"박물관교육","aliases":["박물관교육"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"국성하","room":"교405","day":"화","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SPG6864-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6863","courseName":"교사론","aliases":["교사론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"국성하","room":"교404","day":"목","timeRaw":"0교시\n동영상\n\n3,4교시\n오후\n8:10\n~\n9:50","targetSemester":"전학기","sectionCodes":["SPG6863-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPG6869","courseName":"교육현장을 위한 문학 읽기\n(영어)","aliases":["교육현장을 위한 문학 읽기\n(영어)"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"general","sectionTitle":"교직일반, 논문","professor":"곽수범","room":"교601","day":"월","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPG6869-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6662","courseName":"교육철학및교육사","aliases":["교육철학및교육사"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"서나래","room":"교304","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6662-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6643","courseName":"교육심리학","aliases":["교육심리학"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"원영실","room":"교410","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6643-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6667","courseName":"특수교육학개론","aliases":["특수교육학개론"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"김지영","room":"교303","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6667-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6644","courseName":"교육사회학","aliases":["교육사회학"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"김영미","room":"교404","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6644-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6659","courseName":"교육학개론","aliases":["교육학개론"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"이원재","room":"교303","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6659-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6665","courseName":"교육평가","aliases":["교육평가"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"김주아","room":"교402","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6665-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6668","courseName":"교직실무","aliases":["교직실무"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"심연식","room":"교3101","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6668-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6666","courseName":"생활지도및상담","aliases":["생활지도및상담"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"양승민","room":"교404","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6666-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6672","courseName":"디지털교육","aliases":["디지털교육"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"장은실","room":"교410","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6672-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6643","courseName":"교육심리학","aliases":["교육심리학"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"김정민","room":"교410","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6643-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6668","courseName":"교직실무","aliases":["교직실무"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"신명미","room":"교101","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6668-03"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6664","courseName":"교육과정","aliases":["교육과정"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"조성희","room":"교102","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6664-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6667","courseName":"특수교육학개론","aliases":["특수교육학개론"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"윤성로","room":"교306","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6667-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6662","courseName":"교육철학및교육사","aliases":["교육철학및교육사"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"국성하","room":"교302","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6662-03"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6663","courseName":"교육방법및교육공학","aliases":["교육방법및교육공학"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"신소영","room":"교402","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6663-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6659","courseName":"교육학개론","aliases":["교육학개론"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"한수정","room":"교405","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6659-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6658","courseName":"교육실습","aliases":["교육실습"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-1,2","professor":"곽수범","room":"교102","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6658-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6662","courseName":"교육철학및교육사","aliases":["교육철학및교육사"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"국성하","room":"교302","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6662-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6643","courseName":"교육심리학","aliases":["교육심리학"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"원영실","room":"교410","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6643-03"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6667","courseName":"특수교육학개론","aliases":["특수교육학개론"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"김지영","room":"교303","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6667-03"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6645","courseName":"학교폭력예방및학생의이해","aliases":["학교폭력예방및학생의이해"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"서정기","room":"교102","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6645-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6645","courseName":"학교폭력예방및학생의이해","aliases":["학교폭력예방및학생의이해"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"서정기","room":"교102","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6645-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6668","courseName":"교직실무","aliases":["교직실무"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"심연식","room":"교101","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6668-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6659","courseName":"교육학개론","aliases":["교육학개론"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"이원재","room":"교303","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6659-03"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6672","courseName":"디지털교육","aliases":["디지털교육"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"장은실","room":"교410","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6672-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6661","courseName":"교육행정및교육경영","aliases":["교육행정및교육경영"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"유동훈","room":"교410","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6661-01"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6666","courseName":"생활지도및상담","aliases":["생활지도및상담"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"양승민","room":"교402","day":"화","timeRaw":"","targetSemester":"","sectionCodes":["SPT6666-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6668","courseName":"교직실무","aliases":["교직실무"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"심연식","room":"교101","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6668-04"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6663","courseName":"교육방법및교육공학","aliases":["교육방법및교육공학"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"신소영","room":"교402","day":"월","timeRaw":"","targetSemester":"","sectionCodes":["SPT6663-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6644","courseName":"교육사회학","aliases":["교육사회학"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"김영미","room":"교306","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6644-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6664","courseName":"교육과정","aliases":["교육과정"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"조성희","room":"교102","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6664-02"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPT6645","courseName":"학교폭력예방및학생의이해","aliases":["학교폭력예방및학생의이해"],"credits":2,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"류부열","room":"교302","day":"목","timeRaw":"","targetSemester":"","sectionCodes":["SPT6645-03"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPL6691","courseName":"평생교육프로그램개발론","aliases":["평생교육프로그램개발론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"최유연","room":"교402","day":"화","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SPL6691"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPL6692","courseName":"평생교육실습","aliases":["평생교육실습"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"한수정","room":"교404","day":"목","timeRaw":"-1교시\n동영상\n\n1,2교시\n오후\n6:20\n~\n8:00","targetSemester":"전학기","sectionCodes":["SPL6692"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPL6650","courseName":"평생교육론","aliases":["평생교육론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"안현용","room":"교404","day":"화","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPL6650"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPL6690","courseName":"평생교육방법론","aliases":["평생교육방법론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"임현민","room":"교402","day":"목","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPL6690"]},{"major":"__GLOBAL__","term":"2026-2","courseCode":"SPL6684","courseName":"평생교육경영론","aliases":["평생교육경영론"],"credits":3,"category":"teaching","categoryRaw":"교직","availability":"actual","scope":"certificate","sectionTitle":"교직이론및교직소양(교원자격증)-3,4","professor":"신경석","room":"교405","day":"화","timeRaw":"","targetSemester":"전학기","sectionCodes":["SPL6684"]}],"specialCourses":[{"major":"__GLOBAL__","term":"relative","courseCode":"SEG6590","courseName":"개별논문지도","aliases":["개별논문지도"],"credits":0,"category":"common","availability":"special","scope":"common","targetSemester":"4학기"},{"major":"__GLOBAL__","term":"relative","courseCode":"SEG6556","courseName":"연구윤리(온라인)","aliases":["연구윤리","연구윤리(온라인)"],"credits":0,"category":"audit","availability":"special","scope":"audit","targetSemester":"4~5학기","categoryRaw":"청강"},{"major":"__GLOBAL__","term":"relative","courseCode":"SPG6658","courseName":"비교과프로그램(Ⅰ)","aliases":["비교과프로그램(Ⅰ)","비교과프로그램(I)"],"credits":0,"category":"common","availability":"special","scope":"common","targetSemester":""},{"major":"__GLOBAL__","term":"relative","courseCode":"SEG6501","courseName":"논문","aliases":["논문"],"credits":3,"category":"thesis","availability":"special","scope":"capstone","targetSemester":"5학기"},{"major":"__GLOBAL__","term":"relative","courseCode":"SEG6555","courseName":"연구지도","aliases":["연구지도"],"credits":3,"category":"research_guidance","availability":"special","scope":"capstone","targetSemester":"5학기"},{"major":"__GLOBAL__","term":"relative","courseCode":"SEG6502","courseName":"졸업연구보고서","aliases":["졸업연구보고서"],"credits":3,"category":"report","availability":"special","scope":"capstone","targetSemester":"5학기"}],"audit":{"plannedOfferingCount":600,"actualOfferingCount":165,"actualMajorOfferingCount":117,"actualGlobalOfferingCount":48,"currentVsPlanDiff":{"교육공학":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":5,"plannedCount":5,"actualCount":5},"교육행정":{"plannedNotActual":["SEM7504"],"actualNotPlanned":["SMI6522","SMI6523"],"matchedCount":2,"plannedCount":3,"actualCount":4},"국어교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":7,"plannedCount":7,"actualCount":7},"다문화국제이해교육":{"plannedNotActual":["SMI6523"],"actualNotPlanned":[],"matchedCount":3,"plannedCount":4,"actualCount":3},"사서교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":5,"plannedCount":5,"actualCount":5},"상담교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":9,"plannedCount":9,"actualCount":9},"수학교육":{"plannedNotActual":["SME6549"],"actualNotPlanned":["SME6553"],"matchedCount":2,"plannedCount":3,"actualCount":3},"역사교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":4,"plannedCount":4,"actualCount":4},"영양교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":6,"plannedCount":6,"actualCount":6},"영어교육":{"plannedNotActual":["SEC6606"],"actualNotPlanned":["SEE6505"],"matchedCount":5,"plannedCount":6,"actualCount":6},"외국어로서의 한국어교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":6,"plannedCount":6,"actualCount":6},"유아교육":{"plannedNotActual":["SCH6670"],"actualNotPlanned":["SCH6671"],"matchedCount":7,"plannedCount":8,"actualCount":8},"음악교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":8,"plannedCount":8,"actualCount":8},"인적자원개발":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":6,"plannedCount":6,"actualCount":6},"일반사회교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":4,"plannedCount":4,"actualCount":4},"조기영어교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":5,"plannedCount":5,"actualCount":5},"종교교육":{"plannedNotActual":["SRE6554","SRE6578"],"actualNotPlanned":["SRE6552"],"matchedCount":2,"plannedCount":4,"actualCount":3},"체육및여가교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":8,"plannedCount":8,"actualCount":8},"통합과학교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":8,"plannedCount":8,"actualCount":8},"평생교육경영":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":4,"plannedCount":4,"actualCount":4},"AI융합교육":{"plannedNotActual":[],"actualNotPlanned":[],"matchedCount":5,"plannedCount":5,"actualCount":5}},"parserCorrections":{"codeNameSwaps":[{"major":"국어교육","row":197,"courseCode":"SKE6641","courseName":"현대기록문학텍스트읽기"},{"major":"국어교육","row":197,"courseCode":"SKE6501","courseName":"문학이론"},{"major":"국어교육","row":197,"courseCode":"SKE6591","courseName":"국어교육론"}]},"notes":["국어교육 2026-2 실제 시간표 일부 셀에서 학정번호/과목명 위치가 뒤바뀐 3건을 코드 패턴으로 보정함","교육행정 실제 시간표에는 다문화국제이해교육과 강의공유 과목이 포함되어 예정표 외 실제개설로 유지함","현재학기(2026-2)는 실제 시간표를 truth source로 우선함","과거 수강이력은 카탈로그 삭제/폐강 여부와 무관하게 사용자 스냅샷으로 보존해야 함"]},"sourceFiles":{"fiveTermPlan":"subject_5(2026-2).xlsx","actualTimetable":"time_table1(2026-2).xls"}};
const EMBEDDED_DATA = JSON.parse(JSON.stringify(DATA))
let RULES = {"snapshot":"2026-2","sourcePolicy":"학칙/과정소개 기반 개발문서 v3.1 규칙 스냅샷","commonRequirement":{"metric":"course_count","min":3,"credits":0},"cohorts":[{"id":"OLD","label":"2024-2학기까지 입학","admissionBefore":"2025-1","tracks":{"thesis":{"label":"학위논문","requirements":{"teaching":{"min":4,"max":6},"major_required":{"min":5,"max":7},"major_elective":{"min":10,"max":15},"thesis":{"min":3},"research_guidance":{"min":3}},"totalCredits":30,"commonMin":3},"report":{"label":"졸업연구보고서","requirements":{"teaching":{"min":4,"max":6},"major_required":{"min":5,"max":7},"major_elective":{"min":13,"max":18},"report":{"min":3}},"totalCredits":30,"commonMin":3},"research":{"label":"연구과정","requirements":{"teaching":{"min":2,"max":5},"major_required":{"min":4,"max":6},"major_elective":{"min":4,"max":6}},"totalCredits":12,"commonMin":1}}},{"id":"NEW","label":"2025-1학기 이후 입학","admissionFrom":"2025-1","tracks":{"thesis":{"label":"학위논문","requirements":{"teaching":{"min":6},"major_required":{"min":6},"major_elective":{"min":12},"thesis":{"min":3},"research_guidance":{"min":3}},"totalCredits":30,"commonMin":3},"report":{"label":"졸업연구보고서","requirements":{"teaching":{"min":6},"major_required":{"min":6},"major_elective":{"min":15},"report":{"min":3}},"totalCredits":30,"commonMin":3},"research":{"label":"연구과정","requirements":{"teaching":{"min":3},"major_required":{"min":6},"major_elective":{"min":3}},"totalCredits":12,"commonMin":1}}}]};
const EMBEDDED_RULES = JSON.parse(JSON.stringify(RULES))
let CERT_RULES = {"packType":"yonsei-gse-certificate-rules","schemaVersion":1,"appVersion":"3.1.13","snapshot":"2026-2","updatedAt":"2026-09-18T13:44:00+09:00","source":{"title":"연세대학교 교육대학원 전공별 기본이수과목 및 교과교육과목","file":"[붙임2]기본이수과목_교육대학원개설_260617_.pdf","date":"2026-06-17","pages":13},"majors":{"국어교육":{"page":1,"variants":[{"label":"국어","conditionText":"1번 필수 2번~4번 중 1개 5번~6번 중 1개 7번 필수 8번 필수 이수하여야 함","groups":[{"no":1,"basicSubject":"국어교육론","courses":[{"code":"SKE6591","courseName":"국어교육론"}]},{"no":2,"basicSubject":"국어학개론","courses":[{"code":"SKE6505","courseName":"국어학개론"}]},{"no":3,"basicSubject":"국어문법론","courses":[{"code":"SKE6542","courseName":"국어음운연구"},{"code":"SKE6543","courseName":"국어문법연구"}]},{"no":4,"basicSubject":"국어사","courses":[{"code":"SKE6601","courseName":"국어학연구사"}]},{"no":5,"basicSubject":"국문학개론","courses":[{"code":"SKE6582","courseName":"국문학개론"}]},{"no":6,"basicSubject":"국문학사","courses":[{"code":"SKE6506","courseName":"한국문학사교육연구"}]},{"no":7,"basicSubject":"문학교육론(소설교육론, 시가교육론, 희곡교육론, 수필교육론)","courses":[{"code":"SKE6545","courseName":"고전시가교육론"},{"code":"SKE6546","courseName":"한국고전산문읽기"},{"code":"SKE6547","courseName":"한국고전소설텍스트읽기"},{"code":"SKE6549","courseName":"고전문학현장교육"},{"code":"SKE6550","courseName":"현대시문학연구"},{"code":"SKE6551","courseName":"현대소설연구(현대소설텍스트읽기)"},{"code":"SKE6552","courseName":"고전희곡교육론"},{"code":"SKE6553","courseName":"고전소설교육연구"},{"code":"SKE6554","courseName":"현대비평문학론"},{"code":"SKE6561","courseName":"한국구전동화읽기"},{"code":"SKE6571","courseName":"현대소설이론 교육연구"}]},{"no":8,"basicSubject":"의사소통교육론(표현교육론, 이해교 육론)","courses":[{"code":"SKE6594","courseName":"국어이해교육론"},{"code":"SKE6595","courseName":"표현과소통교육"}]}],"pedagogyCourses":[{"code":"SKE6591","courseName":"국어교육론"},{"code":"SKE6594","courseName":"국어이해교육론"},{"code":"SKE6595","courseName":"표현과소통교육"},{"code":"SKE6592","courseName":"국어교재연구및지도법"},{"code":"SKE6593","courseName":"국어교육특강"},{"code":"SKE6599","courseName":"국어창의논술교육연구"}],"basicRule":{"type":"groups","minCredits":14,"requiredGroups":[1,7,8],"choiceGroups":[{"groups":[2,3,4],"min":1},{"groups":[5,6],"min":1}],"minGroups":5},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"사서교육":{"page":2,"variants":[{"label":"사서교사(2급)","conditionText":"5과목 14학점 이상 이수","groups":[{"no":1,"basicSubject":"분류학","courses":[{"code":"SLI6550","courseName":"분류학"}]},{"no":2,"basicSubject":"목록학","courses":[{"code":"SLI6504","courseName":"목록학"}]},{"no":3,"basicSubject":"도서관전산화","courses":[{"code":"SLI6570","courseName":"도서관전산화"}]},{"no":4,"basicSubject":"독서지도론","courses":[{"code":"SLI6560","courseName":"독서지도론"}]},{"no":5,"basicSubject":"정보검색","courses":[{"code":"SLI6501","courseName":"교육정보검색론"}]},{"no":6,"basicSubject":"정보봉사론","courses":[{"code":"SLI6505","courseName":"정보봉사론"}]},{"no":7,"basicSubject":"학교도서관운영","courses":[{"code":"SLI6503","courseName":"학교도서관운영론"}]},{"no":8,"basicSubject":"정보매체론","courses":[{"code":"SLI6569","courseName":"정보매체론"}]}],"pedagogyCourses":[],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"default1","pedagogyRequired":false}],"defaultVariant":"default1"},"상담교육":{"page":3,"variants":[{"label":"전문상담교사 2급","conditionText":"5과목 14학점 이상 이수 / 2026학번부터 7과목 이상 (1~18 중 6과목 이상, 13 필수)","groups":[{"no":1,"basicSubject":"심리학개론","courses":[]},{"no":2,"basicSubject":"심리검사","courses":[{"code":"SCE6575","courseName":"심리검사"}]},{"no":3,"basicSubject":"성격심리학","courses":[{"code":"SCE6557","courseName":"성격심리학"}]},{"no":4,"basicSubject":"특수아상담","courses":[{"code":"SCE6594","courseName":"특수아상담"}]},{"no":5,"basicSubject":"집단상담","courses":[{"code":"SCE6505","courseName":"집단상담"}]},{"no":6,"basicSubject":"가족상담","courses":[{"code":"SCE6572","courseName":"가족상담"}]},{"no":7,"basicSubject":"진로상담","courses":[{"code":"SCE6573","courseName":"진로상담"}]},{"no":8,"basicSubject":"상담이론과실제","courses":[{"code":"SCE6506","courseName":"상담이론과실제"}]},{"no":9,"basicSubject":"심리치료","courses":[{"code":"SCE6548","courseName":"상담과심리치료"}]},{"no":10,"basicSubject":"임상심리학","courses":[]},{"no":11,"basicSubject":"아동심리학","courses":[]},{"no":12,"basicSubject":"청소년심리","courses":[]},{"no":13,"basicSubject":"상담실습","courses":[{"code":"SCE6565","courseName":"상담기법및실습"}]},{"no":14,"basicSubject":"직업교육론","courses":[]},{"no":15,"basicSubject":"직업정보","courses":[]},{"no":16,"basicSubject":"진로지도","courses":[]},{"no":17,"basicSubject":"학습심리학","courses":[{"code":"SCE6592","courseName":"(구)학습심리학"},{"code":"SCE6584","courseName":"학습심리학"}]},{"no":18,"basicSubject":"이상심리학","courses":[{"code":"SCE6550","courseName":"이상심리학"}]}],"pedagogyCourses":[],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"counselor2","rulesByAdmission":[{"to":"2025-2","basicRule":{"type":"threshold","minGroups":5,"minCredits":14}},{"from":"2026-1","basicRule":{"type":"groups","minGroups":7,"minCredits":14,"requiredGroups":[13],"choiceGroups":[],"sourceNote":"2026학번부터 7과목 이상, 1~18 중 6과목 이상, 관리번호 13 필수"}}],"pedagogyRequired":false,"eligibility":{"type":"professional_counselor_2","genericSecondaryCourseFramework":true}},{"label":"전문상담교사 1급","conditionText":"2~8 및 18 필수 / 16~21 중 2개 이상 이수하여야 함","groups":[{"no":2,"basicSubject":"심리검사","courses":[{"code":"SCE6575","courseName":"심리검사"}]},{"no":3,"basicSubject":"성격심리","courses":[{"code":"SCE6557","courseName":"성격심리학"}]},{"no":4,"basicSubject":"특수아상담","courses":[{"code":"SCE6594","courseName":"특수아상담"}]},{"no":5,"basicSubject":"집단상담","courses":[{"code":"SCE6505","courseName":"집단상담"}]},{"no":6,"basicSubject":"가족상담","courses":[{"code":"SCE6572","courseName":"가족상담"}]},{"no":7,"basicSubject":"진로상담","courses":[{"code":"SCE6573","courseName":"진로상담"}]},{"no":8,"basicSubject":"상담이론과실제","courses":[{"code":"SCE6506","courseName":"상담이론과실제"}]},{"no":16,"basicSubject":"학습심리학","courses":[{"code":"SCE6592","courseName":"(구)학습심리학"},{"code":"SCE6584","courseName":"학습심리학"}]},{"no":17,"basicSubject":"이상심리","courses":[{"code":"SCE6550","courseName":"이상심리학"}]},{"no":18,"basicSubject":"상담실습 및 사례연구","courses":[{"code":"SCE6577","courseName":"상담실습및사례연구"}]},{"no":19,"basicSubject":"아동발달","courses":[{"code":"SCE6591","courseName":"아동발달"}]},{"no":20,"basicSubject":"행동수정","courses":[{"code":"SCE6593","courseName":"(구)행동수정"},{"code":"SCE6583","courseName":"행동수정"}]},{"no":21,"basicSubject":"생활지도연구","courses":[{"code":"SCE6541","courseName":"생활지도연구"}]}],"pedagogyCourses":[],"basicRule":{"type":"groups","requiredGroups":[2,3,4,5,6,7,8,18],"choiceGroups":[{"groups":[16,17,19,20,21],"min":2}],"minGroups":10,"minCredits":0,"sourceNote":"연세대학교 교육대학원 전문상담교사 1급 안내: 필수 7과목 + 상담실습및사례연구 1과목 + 선택 2과목 이상. 관리번호 18은 필수 실습으로 선택 2과목에 중복 산입하지 않음."},"id":"counselor1","pedagogyRequired":false,"eligibility":{"type":"professional_counselor_1","requiresExistingTeacherLicense":true,"minPreAdmissionTeachingYears":3,"experienceMustBeBeforeAdmission":true,"genericSecondaryCourseFramework":false,"sourceNote":"유치원·초등·중등학교 정교사(2급) 이상 자격증 소지 및 입학 전 3년 이상 교육경력 필요. 보건·사서·영양교사 등도 취득 가능."}}],"defaultVariant":"counselor2"},"수학교육":{"page":4,"variants":[{"label":"수학","conditionText":"5과목 14학점 이상 이수","groups":[{"no":1,"basicSubject":"수학교육론","courses":[{"code":"SME6590","courseName":"수학교육론"}]},{"no":2,"basicSubject":"정수론","courses":[{"code":"SME6553","courseName":"정수론"}]},{"no":3,"basicSubject":"복소해석학","courses":[{"code":"SME6533","courseName":"복소해석학"}]},{"no":4,"basicSubject":"해석학","courses":[{"code":"SME6503","courseName":"실해석"},{"code":"SME6542","courseName":"(구)실해석학"}]},{"no":5,"basicSubject":"선형대수","courses":[{"code":"SME6545","courseName":"선형대수"}]},{"no":6,"basicSubject":"현대대수학","courses":[{"code":"SME6501","courseName":"대수학I"},{"code":"SME6541","courseName":"대수학II"}]},{"no":7,"basicSubject":"미분기하학","courses":[{"code":"SME6502","courseName":"미분기하"}]},{"no":8,"basicSubject":"기하학일반","courses":[{"code":"SME6557","courseName":"기하학"}]},{"no":9,"basicSubject":"위상수학","courses":[{"code":"SME6505","courseName":"위상수학"}]},{"no":10,"basicSubject":"확률및통계","courses":[{"code":"SME6547","courseName":"확률론"},{"code":"SME6554","courseName":"통계학"}]},{"no":11,"basicSubject":"조합및그래프이론","courses":[{"code":"SME6556","courseName":"조합및그래프이론"}]}],"pedagogyCourses":[{"code":"SME6590","courseName":"수학교육론"},{"code":"SME6592","courseName":"수학교재연구및지도법"},{"code":"SME6593","courseName":"수학교수지도법"},{"code":"SME6594","courseName":"수학교육과정"},{"code":"SME6599","courseName":"수리논리및논술"}],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"역사교육":{"page":5,"variants":[{"label":"역사","conditionText":"(1)영역~(6)영역별 1과목씩 필수 이수 하여야 함","groups":[{"no":1,"basicSubject":"역사교육론(또는 사회교육론)","courses":[{"code":"SHE6591","courseName":"역사교육론"}]},{"no":2,"basicSubject":"역사학방법론(사학개론, 사료강독)","courses":[{"code":"SHE6530","courseName":"한국사자료연습"},{"code":"SHE6672","courseName":"대중문화와역사방법론"}]},{"no":3,"basicSubject":"분야사(한국근현대사, 한국사회경제 사, 한국사상문화사, 한국대외교류 사, 동서교류사, 사학사)","courses":[{"code":"SHE6505","courseName":"한국문화사"},{"code":"SHE6601","courseName":"한국사와문화유산"},{"code":"SHE6526","courseName":"한국사회경제사"},{"code":"SHE6527","courseName":"한국국제관계사"},{"code":"SHE6528","courseName":"한국중세지성사"},{"code":"SHE6552","courseName":"근현대한국의인간과사상"}]},{"no":4,"basicSubject":"한국사(한국고대사, 한국중세사, 한 국근세사, 한국근대사)","courses":[{"code":"SHE6524","courseName":"(구)한국고대사연구"},{"code":"SHE6525","courseName":"한국중세사의전개"},{"code":"SHE6546","courseName":"(구)한국근대사연구"}]},{"no":5,"basicSubject":"세계사(동아시아고대사,동아시아중 세사,동아시아근세사,동아시아근대 사,서양중세사,서양고대사,서양근대 사,인도·동남아시아사,서남아시아·아 프리카사,아메리카사)","courses":[{"code":"SHE6532","courseName":"인도문화권역사의제문제"},{"code":"SHE6533","courseName":"서아시아사의제문제"},{"code":"SHE6534","courseName":"(구)동양고중세사"},{"code":"SHE6539","courseName":"(구)서양고중세사"},{"code":"SHE6540","courseName":"서양근현대사"},{"code":"SHE6541","courseName":"유럽세계의형성"},{"code":"SHE6542","courseName":"미국사연구"},{"code":"SHE6544","courseName":"서양문화와 현대사회"}]},{"no":6,"basicSubject":"현대사(한국현대사,동아시아현대사, 서양현대사,20세기현대사,현대세계 와한국)","courses":[{"code":"SHE6535","courseName":"중국근현대사탐구"},{"code":"SHE6536","courseName":"근현대동아시아세계의변동"},{"code":"SHE6547","courseName":"(구)한국현대사연구"}]}],"pedagogyCourses":[{"code":"SHE6591","courseName":"역사교육론"},{"code":"SHE6592","courseName":"역사교재연구및교수론"},{"code":"SHE6593","courseName":"역사학과논술교육"},{"code":"SHE6594","courseName":"영상매체와역사교육"},{"code":"SHE6595","courseName":"역사교과서 비교연구"}],"basicRule":{"type":"groups","minCredits":14,"requiredGroups":[1,2,3,4,5,6],"choiceGroups":[],"minGroups":6},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"영양교육":{"page":6,"variants":[{"label":"영양교사(2급)","conditionText":"1번~5번 필수 6번~7번 중 1개 8번~9번 중 1개 이수하여야 함","groups":[{"no":1,"basicSubject":"영양교육및상담실습","courses":[{"code":"SNT6601","courseName":"영양교육및상담실습(구:영양교육및상담특론)"}]},{"no":2,"basicSubject":"영양학","courses":[{"code":"SNT6659","courseName":"고급영양학특론"}]},{"no":3,"basicSubject":"생애주기영양학","courses":[{"code":"SNT6652","courseName":"생애주기영양특론"}]},{"no":4,"basicSubject":"단체급식및실습","courses":[{"code":"SNT6603","courseName":"단체급식특론및실습(구:단체급식특론)"}]},{"no":5,"basicSubject":"식품위생학","courses":[{"code":"SNT6656","courseName":"식품위생학특론"}]},{"no":6,"basicSubject":"영양판정및실습","courses":[{"code":"SNT6657","courseName":"영양판정특론및실습(구:영양판정특론)"}]},{"no":7,"basicSubject":"식사요법및실습","courses":[{"code":"SNT6655","courseName":"식사요법특론및실습(구:식사요법특론)"}]},{"no":8,"basicSubject":"식품학","courses":[{"code":"SNT6602","courseName":"식품학 특론"}]},{"no":9,"basicSubject":"조리원리및실습","courses":[{"code":"SNT6653","courseName":"조리원리특론및실습(구:조리원리특론)"}]}],"pedagogyCourses":[],"basicRule":{"type":"groups","minCredits":14,"requiredGroups":[1,2,3,4,5],"choiceGroups":[{"groups":[6,7],"min":1},{"groups":[8,9],"min":1}],"minGroups":7},"id":"default1","pedagogyRequired":false}],"defaultVariant":"default1"},"영어교육":{"page":7,"variants":[{"label":"영어","conditionText":"5과목 14학점 이상 이수","groups":[{"no":1,"basicSubject":"영어교육론(또는 멀티미디어영어교 육론, 또는 외국어교육론)","courses":[{"code":"SEE6507","courseName":"(구) 영어교육론"},{"code":"SEE6591","courseName":"영어교육론"}]},{"no":2,"basicSubject":"영어학개론","courses":[{"code":"SEE6505","courseName":"영어학개론"}]},{"no":3,"basicSubject":"영문학개론","courses":[{"code":"SEE6504","courseName":"영국문학개관"},{"code":"SEE6601","courseName":"미국문학개관"}]},{"no":4,"basicSubject":"영어문법(또는 영어문법지도법)","courses":[{"code":"SEE6541","courseName":"영문법교육"}]},{"no":5,"basicSubject":"영어회화(또는 실용영어, 또는 영어 말하기지도법))","courses":[{"code":"SEE6558","courseName":"영어말하기교육"},{"code":"SEE6565","courseName":"영어듣기교육"}]},{"no":6,"basicSubject":"영어작문(또는 영어쓰기지도법)","courses":[{"code":"SEE6542","courseName":"영어쓰기교육"}]},{"no":7,"basicSubject":"영어독해(또는 영어읽기지도법)","courses":[{"code":"SEE6555","courseName":"영어읽기교육"}]},{"no":8,"basicSubject":"영어음성음운론","courses":[{"code":"SEE6509","courseName":"영어음성음운론"}]},{"no":9,"basicSubject":"영미문화","courses":[{"code":"SEE6562","courseName":"영미문화연구"}]}],"pedagogyCourses":[{"code":"SEE6591","courseName":"영어교육론"},{"code":"SEE6592","courseName":"(구)영어교재연구"},{"code":"SEE6593","courseName":"(구)영어교육세미나"},{"code":"SEE6594","courseName":"영어교육세미나"},{"code":"SEE6599","courseName":"영어논리및논술교육"},{"code":"SEE6691","courseName":"제2언어습득론"},{"code":"SEE6692","courseName":"영어교과교수법"},{"code":"SEE6693","courseName":"영어교육연구동향"}],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"유아교육":{"page":8,"variants":[{"label":"유치원정교사(2급)","conditionText":"5과목 14학점 이상 이수","groups":[{"no":1,"basicSubject":"유아교육론","courses":[{"code":"SCH6690","courseName":"유아교육론"}]},{"no":2,"basicSubject":"유아교육과정","courses":[{"code":"SCH6603","courseName":"유아교육과정연구"},{"code":"SCH6650","courseName":"유아교육및보육프로그램연구"}]},{"no":3,"basicSubject":"영유아발달과교육","courses":[{"code":"SCH6602","courseName":"영유아발달및교육"},{"code":"SCH6647","courseName":"아동발달 및 교육"}]},{"no":4,"basicSubject":"유아언어교육","courses":[{"code":"SCH6641","courseName":"유아언어교육연구"}]},{"no":5,"basicSubject":"유아사회교육","courses":[{"code":"SCH6646","courseName":"유아사회.정서교육"}]},{"no":6,"basicSubject":"유아과학교육","courses":[{"code":"SCH6666","courseName":"유아과학교육"}]},{"no":7,"basicSubject":"유아수학교육","courses":[{"code":"SCH6665","courseName":"유아수학교육"}]},{"no":8,"basicSubject":"유아미술교육","courses":[{"code":"SCH6667","courseName":"유아미술교육"}]},{"no":9,"basicSubject":"유아음악교육","courses":[{"code":"SCH6663","courseName":"유아음악교육"}]},{"no":10,"basicSubject":"유아교사론","courses":[{"code":"SCH6694","courseName":"유아교사교육론"}]},{"no":11,"basicSubject":"유아동작교육","courses":[{"code":"SCH6664","courseName":"유아동작교육"}]},{"no":12,"basicSubject":"유아놀이지도","courses":[{"code":"SCH6644","courseName":"유아놀이이론및교육"}]},{"no":13,"basicSubject":"유아교육기관운영관리","courses":[{"code":"SCH6649","courseName":"유아교육기관운영관리세미나"}]},{"no":14,"basicSubject":"아동복지","courses":[{"code":"SCH6651","courseName":"아동복지"}]},{"no":15,"basicSubject":"유아건강교육","courses":[{"code":"SCH6655","courseName":"(구)유아보건및영양교육"}]},{"no":16,"basicSubject":"유아관찰및실습","courses":[{"code":"SCH6660","courseName":"유아관찰및실습"},{"code":"SCH6695","courseName":"유아교육현장실습"}]},{"no":17,"basicSubject":"부모교육","courses":[{"code":"SCH6652","courseName":"부모교육"}]}],"pedagogyCourses":[{"code":"SCH6690","courseName":"유아교육론"},{"code":"SCH6694","courseName":"유아교사교육론"},{"code":"SCH6695","courseName":"유아교육현장실습"},{"code":"SCH6691","courseName":"유아교육평가론"},{"code":"SCH6692","courseName":"유아논리및인지교육"},{"code":"SCH6696","courseName":"유아교육사조"},{"code":"SCH6697","courseName":"(구)유아교수매체"},{"code":"SCH6698","courseName":"유아교육및보육프로그램연구"}],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"음악교육":{"page":9,"variants":[{"label":"음악","conditionText":"5과목 14학점 이상 이수","groups":[{"no":1,"basicSubject":"음악교육론","courses":[{"code":"SMU6590","courseName":"음악교육론"}]},{"no":2,"basicSubject":"음악(국악)교수법","courses":[{"code":"SMU6578","courseName":"코다이교수법"},{"code":"SMU6579","courseName":"피아노교수법"},{"code":"SMU6580","courseName":"성악실기교수법"}]},{"no":3,"basicSubject":"전공실기","courses":[{"code":"SMU6582","courseName":"피아노실기"},{"code":"SMU6583","courseName":"피아노실기(II)"}]},{"no":4,"basicSubject":"국악실기","courses":[{"code":"SMU6557","courseName":"국악실기"},{"code":"SMU6558","courseName":"국악실기(II)"}]},{"no":5,"basicSubject":"시창∙청음","courses":[{"code":"SMU6568","courseName":"시창·청음"}]},{"no":6,"basicSubject":"국악가창지도법","courses":[{"code":"SMU6544","courseName":"국악가창지도법"}]},{"no":7,"basicSubject":"합창∙합주지도법","courses":[{"code":"SMU6507","courseName":"(구)합창지도법"},{"code":"SMU6509","courseName":"합창실기지도법(II)/어린이합창지도법"},{"code":"SMU6571","courseName":"(구)합창지휘교수법"},{"code":"SMU6511","courseName":"기악합주지도법"}]},{"no":8,"basicSubject":"국악개론","courses":[{"code":"SMU6602","courseName":"국악개론"}]},{"no":9,"basicSubject":"국악사","courses":[{"code":"SMU6601","courseName":"(구)국악사"},{"code":"SMU6654","courseName":"국악사"}]},{"no":10,"basicSubject":"서양음악사","courses":[{"code":"SMU6505","courseName":"서양음악사(I)"},{"code":"SMU6506","courseName":"서양음악사(II)"}]},{"no":11,"basicSubject":"화성법","courses":[{"code":"SMU6501","courseName":"화성법"},{"code":"SMU6521","courseName":"고급화성법"}]},{"no":12,"basicSubject":"음악분석및형식론","courses":[{"code":"SMU6559","courseName":"음악분석 및 형식론"}]},{"no":13,"basicSubject":"장구반주법","courses":[{"code":"SMU6545","courseName":"장구반주법"}]},{"no":14,"basicSubject":"피아노반주법","courses":[{"code":"SMU6567","courseName":"피아노반주법"}]}],"pedagogyCourses":[{"code":"SMU6590","courseName":"음악교육론"},{"code":"SMU6591","courseName":"음악교재연구및지도법"},{"code":"SMU6592","courseName":"국악교육론"},{"code":"SMU6593","courseName":"음악교육평가"},{"code":"SMU6595","courseName":"음악적사고와논리논술"}],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"일반사회교육":{"page":10,"variants":[{"label":"일반사회","conditionText":"5과목 14학점 이상 이수","groups":[{"no":1,"basicSubject":"일반사회교육론(또는 사회교육론)","courses":[{"code":"SSE6594","courseName":"일반사회교육론"}]},{"no":2,"basicSubject":"정치와사회(또는 정치학)","courses":[{"code":"SSE6502","courseName":"정치와사회"}]},{"no":3,"basicSubject":"경제와사회(또는 경제학)","courses":[{"code":"SSE6503","courseName":"경제와사회"}]},{"no":4,"basicSubject":"문화와사회(또는 문화인류학)","courses":[{"code":"SSE6504","courseName":"문화와사회"}]},{"no":5,"basicSubject":"법과사회(또는 법학)","courses":[{"code":"SSE6533","courseName":"법과사회"}]},{"no":6,"basicSubject":"사회과학방법론","courses":[{"code":"SSE6591","courseName":"(구)사회조사방법"},{"code":"SSE6506","courseName":"사회조사방법"}]},{"no":7,"basicSubject":"인간과사회(또는 사회학)","courses":[{"code":"SSE6539","courseName":"사회학특강"},{"code":"SSE6501","courseName":"사회학의이해"}]},{"no":8,"basicSubject":"인간과행정(또는 행정학)","courses":[{"code":"SSE6536","courseName":"사회정책론"}]},{"no":9,"basicSubject":"시민교육과사회윤리","courses":[{"code":"SSE6551","courseName":"교육과사회"}]}],"pedagogyCourses":[{"code":"SSE6594","courseName":"일반사회교육론"},{"code":"SSE6591","courseName":"(구)사회조사방법"},{"code":"SSE6592","courseName":"일반사회교육특강"},{"code":"SSE6593","courseName":"일반사회교재연구"},{"code":"SSE6595","courseName":"일반사회논리논술"}],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"종교교육":{"page":11,"variants":[{"label":"종교","conditionText":"5과목 14학점 이상 이수","groups":[{"no":1,"basicSubject":"종교교육론","courses":[{"code":"SRE6591","courseName":"종교교육론"}]},{"no":2,"basicSubject":"종교학개론","courses":[{"code":"SRE6506","courseName":"종교학개론"}]},{"no":3,"basicSubject":"종교현상학","courses":[{"code":"SRE6604","courseName":"(구)종교현상학"},{"code":"SRE6586","courseName":"종교현상학"}]},{"no":4,"basicSubject":"종교철학","courses":[{"code":"SRE6585","courseName":"종교철학"},{"code":"SRE6542","courseName":"(구)종교철학"}]},{"no":5,"basicSubject":"한국종교","courses":[{"code":"SRE6545","courseName":"한국종교"}]},{"no":6,"basicSubject":"종교사회학(또는 종교인류학)","courses":[{"code":"SRE6541","courseName":"종교사회학"},{"code":"SRE6701","courseName":"(구)종교사회학"},{"code":"SRE6563","courseName":"인간과 종교"}]},{"no":7,"basicSubject":"종교심리학","courses":[{"code":"SRE6587","courseName":"종교심리학"},{"code":"SRE6702","courseName":"(구)종교심리학"}]},{"no":8,"basicSubject":"세계종교(또는 종교사, 또는 비교종 교학)","courses":[{"code":"SRE6503","courseName":"(구)종교사"},{"code":"SRE6581","courseName":"종교사"},{"code":"SRE6548","courseName":"비교종교학"}]},{"no":9,"basicSubject":"현대종교","courses":[{"code":"SRE6553","courseName":"현대사회와종교"},{"code":"SRE6576","courseName":"현대종교와교육"}]},{"no":10,"basicSubject":"종교와과학","courses":[{"code":"SRE6571","courseName":"종교와과학"}]},{"no":11,"basicSubject":"종교학사","courses":[{"code":"SRE6557","courseName":"(구)종교교육사"},{"code":"SRE6589","courseName":"종교교육사"}]},{"no":12,"basicSubject":"종교와문화","courses":[{"code":"SRE6552","courseName":"종교와문화"}]}],"pedagogyCourses":[{"code":"SRE6591","courseName":"종교교육론"},{"code":"SRE6592","courseName":"종교교육방법론"},{"code":"SRE6593","courseName":"논리논술과종교교육"},{"code":"SRE6595","courseName":"기독교교육실습"},{"code":"SRE6596","courseName":"평신도신학과기독교교육"},{"code":"SRE6597","courseName":"기독교교수-학습과정론"},{"code":"SRE6598","courseName":"종교교재연구"},{"code":"SRE6599","courseName":"종교교육과커뮤니케이션"}],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"체육및여가교육":{"page":12,"variants":[{"label":"체육","conditionText":"5과목 14학점 이상 이수","groups":[{"no":1,"basicSubject":"체육교육론","courses":[{"code":"SPE6597","courseName":"체육교육론"}]},{"no":2,"basicSubject":"체육사∙철학","courses":[{"code":"SPE6567","courseName":"체육철학및원리"}]},{"no":3,"basicSubject":"스포츠사회학","courses":[{"code":"SPE6508","courseName":"스포츠사회학"},{"code":"SPE6566","courseName":"(구)스포츠사회학"}]},{"no":4,"basicSubject":"운동생리학","courses":[{"code":"SPE6501","courseName":"운동생리학"}]},{"no":5,"basicSubject":"운동역학","courses":[{"code":"SPE6554","courseName":"스포츠의역학적연구"}]},{"no":6,"basicSubject":"체육측정∙평가","courses":[{"code":"SPE6542","courseName":"체육측정평가"}]},{"no":7,"basicSubject":"건강교육","courses":[{"code":"SPE6555","courseName":"학교보건특강"}]},{"no":8,"basicSubject":"무용교육","courses":[{"code":"SPE6611","courseName":"무용교육"}]},{"no":9,"basicSubject":"운동실기","courses":[]},{"no":10,"basicSubject":"특수체육","courses":[{"code":"SPE6570","courseName":"특수체육특론"}]},{"no":11,"basicSubject":"운동학습및심리(또는 스포츠심리 및 운동학습)","courses":[{"code":"SPE6503","courseName":"스포츠심리학"},{"code":"SPE6568","courseName":"운동제어및학습"}]},{"no":12,"basicSubject":"여가레크리에이션","courses":[{"code":"SPE6509","courseName":"여가및레크리에이션연구"},{"code":"SPE6565","courseName":"여가및스포츠문화사"}]}],"pedagogyCourses":[{"code":"SPE6597","courseName":"체육교육론"},{"code":"SPE6596","courseName":"체육교재연구및지도법"},{"code":"SPE6598","courseName":"체육교육세미나"},{"code":"SPE6691","courseName":"체육교과교수법"}],"basicRule":{"type":"threshold","minGroups":5,"minCredits":14},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"},"통합과학교육":{"page":13,"variants":[{"label":"통합과학","conditionText":"1번 필수 2번~4번 중 2개 5번~7번 중 2개 8번~10번 중 2개 11번~13번 중 2개 이상 이수하여야 함","groups":[{"no":1,"basicSubject":"통합과학교육론(또는 과학교육론)","courses":[{"code":"SGS6695","courseName":"통합과학교육론"}]},{"no":2,"basicSubject":"일반물리학및실험","courses":[{"code":"SGS6701","courseName":"일반물리학 및 실험"}]},{"no":3,"basicSubject":"전자기학","courses":[{"code":"SGS6705","courseName":"전자기학"}]},{"no":4,"basicSubject":"현대물리학","courses":[{"code":"SGS6706","courseName":"현대물리학"}]},{"no":5,"basicSubject":"일반화학및실험","courses":[{"code":"SGS6702","courseName":"일반화학 및 실험"}]},{"no":6,"basicSubject":"무기화학","courses":[{"code":"SGS6707","courseName":"무기화학"}]},{"no":7,"basicSubject":"유기화학","courses":[{"code":"SGS6708","courseName":"유기화학"}]},{"no":8,"basicSubject":"일반생물학및실험","courses":[{"code":"SGS6703","courseName":"일반생물학 및 실험"}]},{"no":9,"basicSubject":"세포학","courses":[{"code":"SGS6709","courseName":"세포학"}]},{"no":10,"basicSubject":"분자생물학","courses":[{"code":"SGS6831","courseName":"분자생물학"},{"code":"SGS6801","courseName":"(구)분자생물학"}]},{"no":11,"basicSubject":"일반지구과학및실험","courses":[{"code":"SGS6704","courseName":"일반지구과학 및 실험"}]},{"no":12,"basicSubject":"지질학","courses":[{"code":"SGS6832","courseName":"지질학"},{"code":"SGS6802","courseName":"(구)지질학"}]},{"no":13,"basicSubject":"대기과학","courses":[{"code":"SGS6833","courseName":"대기과학"},{"code":"SGS6803","courseName":"(구)대기과학"}]}],"pedagogyCourses":[{"code":"SGS6695","courseName":"통합과학교육론"},{"code":"SGS6692","courseName":"통합과학교재연구 및 지도법"},{"code":"SGS6693","courseName":"통합과학교육 논리및논술"},{"code":"SGS6694","courseName":"통합과학교육실습"},{"code":"SGS6796","courseName":"통합과학체험교육"}],"basicRule":{"type":"groups","minCredits":14,"requiredGroups":[1],"choiceGroups":[{"groups":[2,3,4],"min":2},{"groups":[5,6,7],"min":2},{"groups":[8,9,10],"min":2},{"groups":[11,12,13],"min":2}],"minGroups":9},"id":"default1","pedagogyRequired":true}],"defaultVariant":"default1"}},"graduationExam":{"comprehensive":{"eligibleFromSemester":3,"requiredPassedCourses":2,"passScore":70},"englishRequiredMajors":["영어교육","조기영어교육","외국어로서의 한국어교육"],"englishDeadlineSemester":4},"planLimits":{"regular":{"maxCourses":2,"maxCredits":6},"capstoneSemester":{"maxCourses":3,"maxCredits":9},"prerequisite":{"maxCoursesPerTerm":2,"exception":{"admissionFrom":"2024-1","fromSemester":3,"toSemester":5,"maxCourses":3,"maxUses":1,"sourceNote":"2024학년도 이후 입학생은 3~5학기 중 한 학기에 선수과목 3과목까지 수강 가능"}},"common":{"maxCoursesPerTerm":1,"maxCoursesTotal":4}},"packVersion":"2026-2.2","sources":[{"file":"[붙임2]기본이수과목_교육대학원개설_260617_.pdf","date":"2026-06-17","role":"전공별 기본이수·교과교육 공식 매핑"},{"file":"2026-2_신입생_오리엔테이션_260820_업로드.pdf","date":"2026-08-20","role":"교원자격 공통 필수사항·수강한도·시험 규칙 검증"},{"title":"중등학교(2급) 정교사 - 2024학년도 입학자부터","url":"https://gse.yonsei.ac.kr/gse/license/t_secondary_2013.do","accessed":"2026-09-18","role":"교원자격 소지자 면제범위·2024+ 교직기준"},{"title":"교직 이수자 수강신청 안내","url":"https://gse.yonsei.ac.kr/gse/select05.do","accessed":"2026-09-18","role":"선수과목 수강한도 및 3~5학기 1회 3과목 특례"},{"title":"전문상담교사(1급/2급)","url":"https://gse.yonsei.ac.kr/gse/license/t_counselor.do","accessed":"2026-09-18","role":"전문상담교사 1급 자격·교육경력·교과목 요건"},{"title":"2026-1 교직과정 이수신청서 검토결과 안내","url":"https://gse.yonsei.ac.kr/gse/board/notice.do?articleNo=473476&mode=view","accessed":"2026-09-18","role":"공통필수 3영역 각 2회·기존 자격증/현직교원 포함"}],"commonMandatory":{"aptitudeCount":2,"cprCount":2,"genderCount":2,"appliesToExistingLicenseHolders":true,"appliesToIncumbentTeachers":true,"sourceNote":"교직적성·인성검사, 응급처치·심폐소생술, 성인지교육은 각 2회. 기존 교원자격증 소지자 및 현직교원 포함."},"existingTeacherLicenseExemptions":{"minimumLicenseLevel":"2급 이상","theory":true,"literacy":true,"practice":true,"volunteer":true,"sourceNote":"중등학교(2급) 정교사 2013~2023 및 2024학년도 이후 공식 안내의 면제범위 기준."},"compatibleAppVersion":">=3.0.0","metadataUpdatedAt":"2026-09-22"};
const EMBEDDED_CERT_RULES = JSON.parse(JSON.stringify(CERT_RULES))
const STORAGE_KEY = 'yonsei-gse-degree-calculator-v1';
const SCHEMA_VERSION = 3;
const APP_VERSION = '3.1.16';
const ALLOW_LOCAL_PACK_OVERRIDES = false;
const DATA_PACK_SCHEMA_VERSION = 1;
const RULES_PACK_SCHEMA_VERSION = 1;
const CERT_RULES_PACK_SCHEMA_VERSION = 1;
const DATA_PACK_LOCAL_KEY = 'yonsei-gse-data-pack-v1';
const RULES_PACK_LOCAL_KEY = 'yonsei-gse-rules-pack-v1';
const CERT_RULES_PACK_LOCAL_KEY = 'yonsei-gse-certificate-rules-pack-v1';
const AUTO_BACKUP_KEY = 'yonsei-gse-auto-backups-v1';
let runtimePackMeta = {dataSource:'embedded fallback',rulesSource:'embedded fallback',certSource:'embedded fallback',dataEnvelope:null,rulesEnvelope:null,certEnvelope:null,dataValidation:null,rulesValidation:null,certValidation:null,selfTests:null};
let gapCandidateTerm='';
let openPlanTimetableTerms=new Set();
let planTimetableOpenInitialized=false;
let activePlanTimetableTerm='';
const CATEGORY_LABELS = {
  common:'공통', teaching:'교직', prerequisite:'선수', major_required:'전공필수', major_elective:'전공선택',
  thesis:'논문', research_guidance:'연구지도', report:'졸업연구보고서', audit:'청강', unknown:'종별 확인 필요'
};

const GRADE_POINTS={
  'A+':4.3,'A0':4.0,'A-':3.7,
  'B+':3.3,'B0':3.0,'B-':2.7,
  'C+':2.3,'C0':2.0,'C-':1.7,
  'D+':1.3,'D0':1.0,'D-':0.7,
  'F':0
};
const LETTER_GRADES=Object.keys(GRADE_POINTS);
const PASS_GRADE_MIN=1.7;
const CUMULATIVE_GPA_MIN=3.0;

function teacherCertMajors(){return new Set(Object.keys(CERT_RULES?.majors||{}));}
const TEACHING_THEORY_NAMES=['교육학개론','교육철학및교육사','교육철학및교육사','교육과정','교육평가','교육과정및교육평가','교육방법및교육공학','교육심리','교육심리학','교육사회','교육사회학','교육행정및교육경영','생활지도및상담'];
const TEACHING_LITERACY_NAMES=['특수교육학개론','교직실무','학교폭력예방및학생의이해','학교폭력의예방및학생의이해','디지털교육'];
const TEACHING_PRACTICE_NAMES=['교육실습'];
const LIFELONG_REQUIRED_NAMES=['평생교육론','평생교육방법론','평생교육경영론','평생교육프로그램개발','평생교육프로그램개발론','평생교육실습'];
const DAY_ORDER={월:1,화:2,수:3,목:4,금:5,토:6,일:7};


function normalizeGrade(raw){
  let s=String(raw||'').toUpperCase()
    .replace(/[−–—‐]/g,'-')
    .replace(/[ＯO○]/g,'0')
    .replace(/\s+/g,'')
    .replace(/[|!]/g,'I');
  if(!s)return '';
  if(s==='W' || /(^|[^A-Z])W([^A-Z]|$)/.test(s))return 'W';
  if(s.includes('NP'))return 'NP';
  if(/(^|[^A-Z])P([^A-Z]|$)/.test(s) || s==='P')return 'P';
  if(/(^|[^A-Z])F([^A-Z]|$)/.test(s) || s==='F')return 'F';
  const m=s.match(/([ABCD])([+\-0]?)/);
  if(!m)return '';
  const letter=m[1], mod=m[2]||'0';
  const g=letter+mod;
  return Object.prototype.hasOwnProperty.call(GRADE_POINTS,g)?g:'';
}
function gradePoint(grade){
  const g=normalizeGrade(grade);
  return Object.prototype.hasOwnProperty.call(GRADE_POINTS,g)?GRADE_POINTS[g]:null;
}
function gradePasses(grade){
  const g=normalizeGrade(grade);
  if(!g)return null;
  if(g==='P')return true;
  if(g==='NP' || g==='W')return false;
  const p=gradePoint(g);
  return p==null?null:p>=PASS_GRADE_MIN;
}
function gradeOptionsHtml(selected='',allowBlank=true){
  const g=normalizeGrade(selected);
  const list=['A+','A0','A-','B+','B0','B-','C+','C0','C-','D+','D0','D-','F','P','NP','W'];
  return (allowBlank?`<option value="" ${!g?'selected':''}>미입력</option>`:'')+
    list.map(x=>`<option value="${x}" ${x===g?'selected':''}>${x}${GRADE_POINTS[x]!=null?` (${GRADE_POINTS[x].toFixed(1)})`:''}</option>`).join('');
}
function creditOptionsHtml(selected){
  const n=Number(selected||0);
  const vals=[0,1,2,3,4,5,6];
  if(!vals.includes(n))vals.push(n);
  vals.sort((a,b)=>a-b);
  return vals.map(v=>`<option value="${v}" ${v===n?'selected':''}>${v}학점</option>`).join('');
}
function gpaStats(records){
  let qualityPoints=0, gpaCredits=0, earnedCredits=0, missingGradeCount=0;
  for(const r of records||[]){
    const cr=Number(r.credits||0);
    const gp=gradePoint(r.grade);
    const norm=normalizeGrade(r.grade);
    if(gp!=null && cr>0){
      qualityPoints += gp*cr;
      gpaCredits += cr;
    }else if(cr>0 && r.category!=='common' && !['P','NP'].includes(norm)){
      if(norm!=='W')missingGradeCount++;
    }
    if(r.passed!==false) earnedCredits += (['common','audit'].includes(r.category)?0:cr);
  }
  const rawGpa=gpaCredits>0?qualityPoints/gpaCredits:null;
  const gpa=roundGpa(rawGpa);
  return {qualityPoints,gpaCredits,gpa,rawGpa,earnedCredits,missingGradeCount};
}
function semesterGpaStats(records){
  const by={};
  for(const r of records||[]){
    if(!r.term)continue;
    (by[r.term]||(by[r.term]=[])).push(r);
  }
  return Object.keys(by).sort((a,b)=>termIndex(a)-termIndex(b)).map(term=>({term,...gpaStats(by[term])}));
}
function gpaRequirementStatus(records){
  const s=gpaStats(records);
  if(s.gpa==null)return {state:'unknown',...s};
  if(s.missingGradeCount>0)return {state:'incomplete',...s};
  return {state:s.gpa>=CUMULATIVE_GPA_MIN?'pass':'fail',...s};
}

const CATEGORY_OPTIONS = ['major_required','major_elective','teaching','common','prerequisite','report','thesis','research_guidance','audit','unknown'];

function termIndex(t){
  const m=String(t||'').match(/^(\d{4})-(0|1|2)$/); if(!m) return -999999;
  const sem=m[2];
  // YYYY-0은 같은 해 1학기 직전의 특수학기로 정렬하되,
  // 정규학기(1·2학기) 간 간격 계산은 기존 값을 유지한다.
  return Number(m[1])*2 + (sem==='0'?-0.5:sem==='2'?1:0);
}
function canonicalCode(s){return String(s||'').toUpperCase().replace(/\s+/g,'').replace(/(?:-\d{2})+$/,'');}
function normName(s){return String(s||'').replace(/\s+/g,'').replace(/[()（）·ㆍ\-_,.]/g,'').toLowerCase();}
function uid(prefix='id'){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function fmtCredits(v){return Number(v||0).toFixed(Number(v||0)%1?1:0);}
function roundGpa(v){
  if(v==null)return null;
  const n=Number(v);
  if(!Number.isFinite(n))return null;
  return Math.floor((n+1e-10)*100)/100;
}
function fmtGpa(v){const x=roundGpa(v);return x==null?'-':x.toFixed(2);}
function currentScenario(){return state.scenarios.find(s=>s.id===state.activeScenarioId)||state.scenarios[0];}
function getCohort(){return termIndex(state.profile.admissionTerm)>=termIndex('2025-1') ? RULES.cohorts.find(c=>c.id==='NEW') : RULES.cohorts.find(c=>c.id==='OLD');}
function getRule(){return getCohort().tracks[state.profile.track];}
function defaultCredit(term, category, code){
  const cc=canonicalCode(code);
  const special=DATA.specialCourses.find(c=>canonicalCode(c.courseCode)===cc);
  if(special) return special.credits;
  if(category==='common'||category==='audit') return 0;
  if(/^SPT/.test(cc)) return 2;
  return termIndex(term)>=termIndex('2025-1') ? 3 : 2;
}
function categoryOptionsHtml(selected){
  return CATEGORY_OPTIONS.map(c=>`<option value="${c}" ${c===selected?'selected':''}>${CATEGORY_LABELS[c]}</option>`).join('');
}
const PRE_ADMISSION_TERM='__PRE_ADMISSION__';
function isZeroAcademicTerm(term){return /^\d{4}-0$/.test(String(term||''));}
function comparisonProgramZeroTerm(admissionTerm=state.profile.admissionTerm){
  const m=String(admissionTerm||'').match(/^(\d{4})-1$/);
  return m?`${m[1]}-0`:'';
}
function shouldUseComparisonProgramZeroTerm(record,admissionTerm=state.profile.admissionTerm){
  if(!record)return false;
  const isComparison=canonicalCode(record.courseCode)==='SPG6658'||/비교과프로그램/.test(String(record.courseName||''));
  return isComparison && !!comparisonProgramZeroTerm(admissionTerm);
}
function normalizeComparisonProgramTerm(record,admissionTerm=state.profile.admissionTerm){
  if(!record)return record;
  if(record.term===PRE_ADMISSION_TERM && shouldUseComparisonProgramZeroTerm(record,admissionTerm)){
    record.term=comparisonProgramZeroTerm(admissionTerm);
  }
  return record;
}
function isPreAdmissionTerm(term){
  const admission=state.profile.admissionTerm;
  const s=String(term||'');
  if(isZeroAcademicTerm(s))return false; // YYYY-0은 '입학학기 이전'으로 축약하지 않고 그대로 표시
  if(s===PRE_ADMISSION_TERM || /\s*이전$/.test(s)) return true;

  const t=termIndex(s), a=termIndex(admission);
  // 입학학기 자체는 '이전'이 아니다. 오직 엄격히 앞선 정규학기만 이전으로 묶는다.
  return t>-999999 && a>-999999 && t<a;
}
function displayAcademicTerm(term){
  const s=String(term||'');
  if(isZeroAcademicTerm(s))return s;
  return isPreAdmissionTerm(s) ? `${state.profile.admissionTerm} 이전` : s;
}
function nextAcademicTerm(term){
  const m=String(term||'').match(/^(\d{4})-(1|2)$/);
  if(!m)return term;
  const y=Number(m[1]), sem=Number(m[2]);
  return sem===1 ? `${y}-2` : `${y+1}-1`;
}
function academicTermOptionsHtml(selected){
  const admission=state.profile.admissionTerm;
  const endTerm=RULES.snapshot;
  const terms=[];
  let t=admission;
  const maxIndex=Math.max(termIndex(endTerm),termIndex(admission));
  while(termIndex(t)<=maxIndex){
    terms.push(t);
    t=nextAcademicTerm(t);
  }
  const zeroTerm=comparisonProgramZeroTerm(admission);
  if(selected && validHistoryTermValue(selected) && !terms.includes(selected) && !isZeroAcademicTerm(selected) && termIndex(selected)>maxIndex){
    terms.push(selected);
  }
  const preSelected=isPreAdmissionTerm(selected);
  return `<option value="${PRE_ADMISSION_TERM}" ${preSelected?'selected':''}>${esc(admission)} 이전</option>`+
    (zeroTerm?`<option value="${zeroTerm}" ${zeroTerm===selected?'selected':''}>${zeroTerm}</option>`:'')+
    terms.map(t=>`<option value="${t}" ${t===selected?'selected':''}>${t}</option>`).join('');
}
function recordKey(r){return canonicalCode(r.courseCode)||normName(r.courseName);}

// 현재 5개 학기 카탈로그에는 없지만 전공교직으로 별도 확인된 과목만 여기에 추가한다.
// 일반 교직과목은 이 목록에 넣지 않는다.
const LEGACY_MAJOR_TEACHING_COURSES=[];

function historyCatalogCourse(r){
  const code=canonicalCode(r?.courseCode), name=normName(r?.courseName);
  const all=[...DATA.offerings,...DATA.globalOfferings,...DATA.specialCourses,...LEGACY_MAJOR_TEACHING_COURSES];
  return all.find(c=>
    (code && canonicalCode(c.courseCode)===code) ||
    (!code && normName(c.courseName)===name) ||
    (c.aliases||[]).some(a=>normName(a)===name)
  )||null;
}
function isSwitchableMajorTeachingHistory(r){
  const c=historyCatalogCourse(r);
  if(!c)return false;
  const opts=Array.isArray(c.categoryOptions)?c.categoryOptions:[];
  return (opts.includes('teaching') && opts.includes('major_elective')) ||
         (c.major===state.profile.major && c.category==='teaching' && opts.includes('major_elective'));
}
function switchableMajorTeachingBadge(r){
  return isSwitchableMajorTeachingHistory(r)
    ? `<span class="switchable-major-teaching">교직 / 전공선택 변경 가능</span>`
    : '';
}

function courseStatusForHistory(r){
  const matched=historyCatalogCourse(r);
  if(matched?.legacyMajorTeaching)return 'major_teaching';
  if(matched)return 'match';
  const portalTeaching=String(r?.portalCategory||'').replace(/\s+/g,'').includes('교직');
  if(portalTeaching)return 'teaching_portal';
  return 'historical';
}
function getCatalogMasters(scopeMode='mine'){
  const major=state.profile.major;
  const base=scopeMode==='all' ? [...DATA.offerings,...DATA.globalOfferings,...DATA.specialCourses]
    : [...DATA.offerings.filter(o=>o.major===major),...DATA.globalOfferings,...DATA.specialCourses];
  const map=new Map();
  for(const c of base){
    const key=canonicalCode(c.courseCode)||normName(c.courseName);
    if(!key) continue;
    const ex=map.get(key);
    if(!ex){
      map.set(key,{courseCode:c.courseCode,courseName:c.courseName,aliases:[...(c.aliases||[])],category:c.category||'unknown',credits:c.credits,status:c.availability,major:c.major||'',scope:c.scope||'',sectionTitle:c.sectionTitle||''});
    }else{
      ex.aliases=[...new Set([...(ex.aliases||[]),...(c.aliases||[]),c.courseName])];
      if(ex.category==='unknown' && c.category && c.category!=='unknown') ex.category=c.category;
      if(!ex.major && c.major) ex.major=c.major;
      if(!ex.scope && c.scope) ex.scope=c.scope;
    }
  }
  return [...map.values()].sort((a,b)=>a.courseName.localeCompare(b.courseName,'ko'));
}
function offeringsForTerm(term,scopeMode='mine'){
  const major=state.profile.major;
  let list=scopeMode==='all' ? DATA.offerings.filter(o=>o.term===term) : DATA.offerings.filter(o=>o.major===major && o.term===term);
  if(term===DATA.snapshot) list=[...list,...DATA.globalOfferings.filter(o=>o.term===term)];
  list=[...list,...DATA.specialCourses];
  return list.sort((a,b)=>(a.courseName||'').localeCompare(b.courseName||'','ko'));
}
function isOtherMajorCourse(c){return c && c.major && c.major!=='__GLOBAL__' && c.major!==state.profile.major;}
function isMajorTeachingCourse(c){return c && c.major===state.profile.major && c.category==='teaching';}
function courseOriginLabel(c){
  if(!c)return '';
  if(c.major==='__GLOBAL__') return c.scope==='audit'?'청강/비산입':(c.scope==='common'||c.scope==='capstone')?'공통/학위':'교직·교과';
  return c.major||'';
}
function matchesCourseFilter(c,category,q){
  if(category==='lifelong'){
    if(!isLifelongCourse(c))return false;
  }else if(category && category!=='all' && (c.category||'unknown')!==category) return false;
  if(!q)return true;
  const nq=normName(q);
  const txt=normName((c.courseName||'')+(c.courseCode||'')+(c.professor||'')+(c.major||'')+(c.aliases||[]).join(''));
  return txt.includes(nq);
}
function evaluate(records){
  const totals={common:0,teaching:0,prerequisite:0,major_required:0,major_elective:0,thesis:0,research_guidance:0,report:0,audit:0,unknown:0};
  let totalCredits=0; const seen=new Set(), duplicates=[], unknowns=[];
  for(const r of records){
    if(r.passed===false) continue;
    const key=recordKey(r);
    if(key && seen.has(key)){duplicates.push(r);continue;}
    if(key) seen.add(key);
    const cat=r.category||'unknown', cr=Number(r.credits||0);
    if(cat==='common') totals.common += 1;
    else if(cat==='prerequisite') totals.prerequisite += cr;
    else if(cat==='audit') totals.audit += 1;
    else if(cat==='unknown'){totals.unknown += cr;unknowns.push(r);}
    else {totals[cat]=(totals[cat]||0)+cr; totalCredits+=cr;}
  }
  const rule=getRule(), req=rule.requirements;
  const result={totals,totalCredits,duplicates,unknowns,requirements:[],complete:true};
  result.requirements.push({key:'common',label:'공통',current:totals.common,min:(rule.commonMin??RULES.commonRequirement.min),unit:'과목'});
  for(const key of Object.keys(req)){
    const x=req[key];
    result.requirements.push({key,label:CATEGORY_LABELS[key],current:totals[key]||0,min:x.min,max:x.max,unit:'학점'});
  }
  result.requirements.push({key:'total',label:'총 인정학점',current:totalCredits,min:rule.totalCredits,unit:'학점'});
  for(const rr of result.requirements){if(rr.current<rr.min) result.complete=false;}
  return result;
}
function projectionSettings(){
  const settings=state.projection||{};
  return {mode:settings.mode==='selected'?'selected':'all',terms:Array.isArray(settings.terms)?settings.terms.filter(validTermValue):[]};
}
function projectionLabel(){return projectionSettings().mode==='selected'?'(선택) 계획 이수 후':'(전체) 계획 이수 후';}
function projectionPlannedRecords(){
  const settings=projectionSettings(),planned=currentScenario().planned;
  return settings.mode==='all'?planned:planned.filter(r=>settings.terms.includes(r.term));
}
function requirementState(currentOk,projectedOk){return currentOk?'ok':projectedOk?'plan':'bad';}
function requirementStateLabel(status){return {ok:'충족',plan:'계획 시 충족',bad:'미충족',pending:'확인 필요',exempt:'해당 없음'}[status]||'확인 필요';}
function requirementBadge(status){return `<span class="requirement-status ${status}">${requirementStateLabel(status)}</span>`;}
function comparisonValues(current,projected){
  return `<div class="requirement-comparison"><div><span>현재</span><b>${esc(current)}</b></div><div><span>${projectionLabel()}</span><b>${esc(projected)}</b></div></div>`;
}
function renderProjectionControls(){
  const wrap=document.getElementById('projectionControls');if(!wrap)return;
  const settings=projectionSettings();
  const terms=[...new Set(currentScenario().planned.map(r=>r.term))].filter(validTermValue).sort((a,b)=>termIndex(a)-termIndex(b));
  const selectedTerms=terms.filter(t=>settings.terms.includes(t));
  const rows=projectionPlannedRecords();
  const termText=settings.mode==='all'?terms.join(', '):selectedTerms.join(', ');
  wrap.innerHTML=`<div class="projection-heading"><b>계획 반영 범위</b><span class="muted">현재 시나리오: ${esc(currentScenario().name)}</span></div>
    <div class="projection-modes no-print"><label><input type="radio" name="projectionMode" value="all" ${settings.mode==='all'?'checked':''}> (전체) 계획 이수 후</label><label><input type="radio" name="projectionMode" value="selected" ${settings.mode==='selected'?'checked':''}> (선택) 계획 이수 후</label></div>
    ${settings.mode==='selected'?`<fieldset class="projection-terms no-print"><legend>반영할 계획 학기 선택 · 여러 학기 선택 가능</legend>${terms.length?terms.map(t=>`<label><input type="checkbox" data-projection-term="${esc(t)}" ${selectedTerms.includes(t)?'checked':''}> ${esc(t)}</label>`).join(''):'등록된 계획 학기가 없습니다.'}</fieldset>`:''}
    <p class="muted">${projectionLabel()} · ${termText?`${esc(termText)} · 계획 ${rows.length}과목 반영`:'반영할 계획이 없어 현재 이수값과 같습니다.'} · 계획 과목의 성적은 예측하지 않습니다.</p>`;
  wrap.onchange=e=>{
    if(e.target.name==='projectionMode')state.projection={...projectionSettings(),mode:e.target.value};
    else if(e.target.dataset.projectionTerm){
      const term=e.target.dataset.projectionTerm,settings=projectionSettings();
      state.projection={mode:'selected',terms:e.target.checked?[...new Set([...settings.terms,term])]:settings.terms.filter(t=>t!==term)};
    }else return;
    save();render();
  };
}
function evaluateBoth(){
  const history=state.history.filter(r=>r.passed!==false);
  return {current:evaluate(history),projected:evaluate(planCombinedRecords())};
}

function deepClone(v){return JSON.parse(JSON.stringify(v));}
function packNowIso(){return new Date().toISOString();}
function downloadJson(filename,obj){
  const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
}
function validTermValue(t){return /^\d{4}-[12]$/.test(String(t||''));}
function validHistoryTermValue(t){return /^\d{4}-[012]$/.test(String(t||''));}
function dataPackEnvelope(data=DATA,extra={}){
  return {packType:'yonsei-gse-data',schemaVersion:DATA_PACK_SCHEMA_VERSION,appVersion:APP_VERSION,snapshot:data.snapshot,updatedAt:packNowIso(),data:deepClone(data),...extra};
}
function rulesPackEnvelope(rules=RULES,extra={}){
  return {packType:'yonsei-gse-rules',schemaVersion:RULES_PACK_SCHEMA_VERSION,appVersion:APP_VERSION,snapshot:rules.snapshot,updatedAt:packNowIso(),rules:deepClone(rules),...extra};
}
function certificateRulesEnvelope(rules=CERT_RULES,extra={}){
  return {packType:'yonsei-gse-certificate-rules',schemaVersion:CERT_RULES_PACK_SCHEMA_VERSION,appVersion:APP_VERSION,snapshot:rules.snapshot,updatedAt:packNowIso(),source:deepClone(rules.source||{}),majors:deepClone(rules.majors||{}),graduationExam:deepClone(rules.graduationExam||{}),planLimits:deepClone(rules.planLimits||{}),commonMandatory:deepClone(rules.commonMandatory||{}),existingTeacherLicenseExemptions:deepClone(rules.existingTeacherLicenseExemptions||{}),...extra};
}
function unwrapDataPack(raw){
  if(raw?.packType==='yonsei-gse-data')return {envelope:raw,data:raw.data};
  if(raw?.majors&&raw?.offerings)return {envelope:null,data:raw};
  return {envelope:raw,data:null};
}
function unwrapRulesPack(raw){
  if(raw?.packType==='yonsei-gse-rules')return {envelope:raw,rules:raw.rules};
  if(raw?.cohorts&&raw?.commonRequirement)return {envelope:null,rules:raw};
  return {envelope:raw,rules:null};
}
function unwrapCertificateRules(raw){
  if(raw?.packType==='yonsei-gse-certificate-rules'&&raw?.majors)return {envelope:raw,rules:raw};
  if(raw?.majors&&raw?.graduationExam)return {envelope:null,rules:raw};
  return {envelope:raw,rules:null};
}
function validateCertificateRules(rules){
  const critical=[],warnings=[];
  if(!rules||typeof rules!=='object')return {critical:['교원자격 규정 객체가 없습니다.'],warnings,stats:{}};
  if(!validTermValue(rules.snapshot))critical.push(`교원자격 snapshot 형식 오류: ${rules.snapshot||'(없음)'}`);
  const majors=rules.majors||{};const names=Object.keys(majors);
  if(!names.length)critical.push('교원자격 대상 전공 데이터가 없습니다.');
  let groups=0,pedagogy=0;
  for(const [major,m] of Object.entries(majors)){
    if(!DATA.majors.includes(major))warnings.push(`교원자격 전공이 강의 전공목록에 없음: ${major}`);
    if(!Array.isArray(m.variants)||!m.variants.length){critical.push(`${major}: 자격종류 규정 없음`);continue;}
    for(const v of m.variants){
      if(!v.id||!v.label)critical.push(`${major}: 자격종류 id/label 누락`);
      if(!Array.isArray(v.groups))critical.push(`${major}/${v.label}: 기본이수 그룹 없음`);
      for(const g of v.groups||[]){groups++;if(!Number.isFinite(Number(g.no)))warnings.push(`${major}/${v.label}: 관리번호 오류`);for(const c of g.courses||[])if(!canonicalCode(c.code))warnings.push(`${major}/${v.label}: 학정코드 누락`);}
      pedagogy+=(v.pedagogyCourses||[]).length;
    }
  }
  return {critical,warnings,stats:{majorCount:names.length,groupCount:groups,pedagogyCount:pedagogy,warningCount:warnings.length}};
}
function validateDataCore(data){
  const critical=[],warnings=[];
  if(!data||typeof data!=='object')return {critical:['데이터 객체가 없습니다.'],warnings,stats:{}};
  if(!validTermValue(data.snapshot))critical.push(`snapshot 형식 오류: ${data.snapshot||'(없음)'}`);
  if(!Array.isArray(data.majors)||!data.majors.length)critical.push('전공 목록이 없습니다.');
  for(const key of ['offerings','globalOfferings','specialCourses'])if(!Array.isArray(data[key]))critical.push(`${key} 배열이 없습니다.`);

  const allowedCats=new Set(['common','teaching','prerequisite','major_required','major_elective','thesis','research_guidance','report','audit','unknown']);
  const arrays=['offerings','globalOfferings','specialCourses'];
  const seen=new Map(); let rowCount=0,unknownCount=0,missingCore=0;
  for(const arrName of arrays){
    const arr=Array.isArray(data[arrName])?data[arrName]:[];
    arr.forEach((r,i)=>{
      rowCount++;
      const where=`${arrName}[${i+1}]`;
      if(arrName==='offerings' && (!r.major || !data.majors?.includes(r.major))){warnings.push(`${where}: 전공 확인 필요 (${r.major||'없음'})`);missingCore++;}
      if(r.term && !(validTermValue(r.term)||(arrName==='specialCourses'&&r.term==='relative')))warnings.push(`${where}: 학기 형식 확인 (${r.term})`);
      if(!r.courseName) {warnings.push(`${where}: 과목명 없음`);missingCore++;}
      if(!r.courseCode && !/^외\s*\d/.test(String(r.courseName||'')))warnings.push(`${where}: 학정번호 없음`);
      const cr=Number(r.credits);
      if(!Number.isFinite(cr)||cr<0||cr>9)warnings.push(`${where}: 학점 이상값 (${r.credits})`);
      if(r.category && !allowedCats.has(r.category))warnings.push(`${where}: 알 수 없는 종별 (${r.category})`);
      if(r.category==='unknown')unknownCount++;
      const key=[arrName,r.major||'',r.term||'',canonicalCode(r.courseCode),r.courseName,r.professor||'',r.day||'',r.timeRaw||'',(r.sectionCodes||[]).join(',')].join('|');
      if(seen.has(key))warnings.push(`${where}: 중복 가능 · ${r.courseName} (${r.courseCode||'코드없음'})`);
      else seen.set(key,where);
    });
  }
  if(rowCount===0)critical.push('개설과목 데이터가 0건입니다.');
  if(missingCore>Math.max(10,Math.ceil(rowCount*.1)))critical.push(`핵심 필드 누락이 과다합니다 (${missingCore}/${rowCount}).`);
  return {critical,warnings,stats:{rowCount,majorCount:data.majors?.length||0,unknownCount,warningCount:warnings.length}};
}
function validateRulesCore(rules){
  const critical=[],warnings=[];
  if(!rules||typeof rules!=='object')return {critical:['규정 객체가 없습니다.'],warnings,stats:{}};
  if(!validTermValue(rules.snapshot))critical.push(`규정 snapshot 형식 오류: ${rules.snapshot||'(없음)'}`);
  if(!rules.commonRequirement||Number(rules.commonRequirement.min)<0)critical.push('공통 이수요건이 없습니다.');
  if(!Array.isArray(rules.cohorts)||rules.cohorts.length<2)critical.push('입학 코호트 규정이 부족합니다.');
  const ids=new Set();
  for(const c of rules.cohorts||[]){
    if(!c.id)critical.push('코호트 id가 없습니다.'); else if(ids.has(c.id))critical.push(`중복 코호트 id: ${c.id}`); else ids.add(c.id);
    for(const track of ['report','thesis','research']){
      const t=c.tracks?.[track];
      if(!t)critical.push(`${c.id||'?'}: ${track} 규정 없음`);
      else if(!Number.isFinite(Number(t.totalCredits))||Number(t.totalCredits)<=0)critical.push(`${c.id||'?'} ${track}: 총학점 오류`);
    }
  }
  return {critical,warnings,stats:{cohortCount:rules.cohorts?.length||0,warningCount:warnings.length}};
}
function historyRecordIssues(r){
  const critical=[],warnings=[];
  const term=String(r?.term||'');
  if(!(validHistoryTermValue(term)||term===PRE_ADMISSION_TERM||/\s*이전$/.test(term)))critical.push('학기 형식 오류');
  if(!String(r?.courseName||'').trim())critical.push('과목명 없음');
  const cr=Number(r?.credits);
  if(!Number.isFinite(cr)||cr<0||cr>9)critical.push('학점 이상값');
  if(!CATEGORY_OPTIONS.includes(r?.category||'unknown'))critical.push('종별 오류');
  const g=String(r?.grade||'').trim();
  if(g && !['P','NP','W',...LETTER_GRADES].includes(normalizeGrade(g)))warnings.push('성적 확인 필요');
  if(!canonicalCode(r?.courseCode))warnings.push('학정번호 없음');
  return {critical,warnings};
}
function validateStateObject(x){
  const critical=[],warnings=[];
  if(!x||typeof x!=='object')return {critical:['사용자 데이터가 객체가 아닙니다.'],warnings,stats:{}};
  if(!x.profile||typeof x.profile.major!=='string')critical.push('기본정보(profile)가 없습니다.');
  if(!Array.isArray(x.scenarios)||!x.scenarios.length)critical.push('시트(scenarios)가 없습니다.');
  if(!Array.isArray(x.history))critical.push('수강이력(history)이 배열이 아닙니다.');
  const hist=Array.isArray(x.history)?x.history:[];
  let invalidHistory=0;
  hist.forEach((r,i)=>{
    const v=historyRecordIssues(r);
    if(v.critical.length){invalidHistory++;warnings.push(`수강이력 ${i+1}: ${v.critical.join(', ')}`);}
  });
  const ids=(x.scenarios||[]).map(s=>s.id).filter(Boolean);
  if(new Set(ids).size!==ids.length)warnings.push('시트 ID 중복이 있습니다.');
  const dup=duplicateCourseWarnings(hist);if(dup.length)warnings.push(...dup.slice(0,10));
  return {critical,warnings,stats:{historyCount:hist.length,scenarioCount:x.scenarios?.length||0,invalidHistory}};
}
function runDeterministicSelfTests(){
  const tests=[];
  const t=(name,ok,detail='')=>tests.push({name,ok:!!ok,detail});
  const old=RULES.cohorts?.find(c=>c.id==='OLD'), newer=RULES.cohorts?.find(c=>c.id==='NEW');
  const counselor=CERT_RULES.majors?.['상담교육']?.variants?.find(v=>v.id==='counselor2');
  const counselor26=counselor?.rulesByAdmission?.find(x=>x.from==='2026-1')?.basicRule;
  const science=CERT_RULES.majors?.['통합과학교육']?.variants?.[0]?.basicRule;
  const limits=CERT_RULES.planLimits||{};

  t('학기 정렬 경계',termIndex('2024-2')<termIndex('2025-1'));
  t('A- 성적 정규화',normalizeGrade('A−')==='A-');
  t('P 이수 인정',gradePasses('P')===true);
  t('NP 미이수',gradePasses('NP')===false);
  t('W 미이수',gradePasses('W')===false);
  t('F 미이수',gradePasses('F')===false);
  t('C- 이수 인정',gradePasses('C-')===true);
  t('D+ 이수 불인정',gradePasses('D+')===false);
  t('GPA 만점 4.3',GRADE_POINTS['A+']===4.3);

  t('OLD 코호트 존재',!!old);
  t('NEW 코호트 존재',!!newer);
  t('NEW 논문 총 30학점',Number(newer?.tracks?.thesis?.totalCredits)===30);
  t('NEW 졸업연구보고서 총 30학점',Number(newer?.tracks?.report?.totalCredits)===30);
  t('NEW 연구과정 총 12학점',Number(newer?.tracks?.research?.totalCredits)===12);
  t('NEW 논문 교직 6학점',Number(newer?.tracks?.thesis?.requirements?.teaching?.min)===6);
  t('NEW 보고서 전선 15학점',Number(newer?.tracks?.report?.requirements?.major_elective?.min)===15);
  t('공통과목 3과목 기준',Number(RULES.commonRequirement?.min)===3);

  t('교원자격 전공은 강의 전공목록의 부분집합',[...teacherCertMajors()].every(m=>DATA.majors.includes(m)),[...teacherCertMajors()].filter(m=>!DATA.majors.includes(m)).join(','));
  t('교육행정은 2026-06-17 기본이수표 대상 아님',!teacherCertMajors().has('교육행정'));
  t('영어교육 교과교육 SEE6591',!!CERT_RULES.majors?.['영어교육']?.variants?.[0]?.pedagogyCourses?.some(x=>canonicalCode(x.code)==='SEE6591'));
  t('영어교육 기본이수 SEE6505',!!CERT_RULES.majors?.['영어교육']?.variants?.[0]?.groups?.some(g=>(g.courses||[]).some(x=>canonicalCode(x.code)==='SEE6505')));
  t('상담교육 2026학번 7과목',Number(counselor26?.minGroups)===7);
  t('상담교육 2026학번 관리번호 13 필수',(counselor26?.requiredGroups||[]).map(Number).includes(13));
  t('통합과학 기본이수 9영역',Number(science?.minGroups)===9);
  t('통합과학 물리영역 2과목',(science?.choiceGroups||[]).some(x=>JSON.stringify((x.groups||[]).map(Number))===JSON.stringify([2,3,4])&&Number(x.min)===2));

  t('정규학기 한도 2과목/6학점',Number(limits.regular?.maxCourses)===2&&Number(limits.regular?.maxCredits)===6);
  t('논문·보고서학기 한도 3과목/9학점',Number(limits.capstoneSemester?.maxCourses)===3&&Number(limits.capstoneSemester?.maxCredits)===9);
  t('선수 기본 학기당 2과목',Number(limits.prerequisite?.maxCoursesPerTerm)===2);
  t('2024+ 선수 3~5학기 중 1회 3과목 특례',limits.prerequisite?.exception?.admissionFrom==='2024-1'&&Number(limits.prerequisite?.exception?.fromSemester)===3&&Number(limits.prerequisite?.exception?.toSemester)===5&&Number(limits.prerequisite?.exception?.maxCourses)===3&&Number(limits.prerequisite?.exception?.maxUses)===1);
  t('공통 학기당 1과목/누적 4과목',Number(limits.common?.maxCoursesPerTerm)===1&&Number(limits.common?.maxCoursesTotal)===4);
  t('SPG6855 콘텐츠라이팅: PDF 2학점이 OCR 1보다 우선',portalPdfPreferDirect('credit',2,1)===2);
  t('PDF 종별 직접값이 OCR보다 우선',portalPdfPreferDirect('text','교직','선택')==='교직');
  t('PDF 성적 직접값이 OCR보다 우선',portalPdfPreferDirect('text','A0','A+')==='A0');
  t('전문상담1급 입학 전 교육경력 3년',Number(CERT_RULES.majors?.['상담교육']?.variants?.find(v=>v.id==='counselor1')?.eligibility?.minPreAdmissionTeachingYears)===3);
  t('교원자격 공통필수 기존자격증 소지자 포함',CERT_RULES.commonMandatory?.appliesToExistingLicenseHolders===true&&Number(CERT_RULES.commonMandatory?.aptitudeCount)===2&&Number(CERT_RULES.commonMandatory?.cprCount)===2&&Number(CERT_RULES.commonMandatory?.genderCount)===2);

  const dupCode=duplicateCourseWarnings([
    {term:'2025-1',courseCode:'TEST1001',courseName:'서로다른과목A',grade:'A0',passed:true},
    {term:'2025-2',courseCode:'TEST1001',courseName:'서로다른과목B',grade:'A0',passed:true}
  ]);
  const dupName=duplicateCourseWarnings([
    {term:'2025-1',courseCode:'TEST2001',courseName:'동일 과목',grade:'A0',passed:true},
    {term:'2025-2',courseCode:'TEST2002',courseName:'동일과목',grade:'A0',passed:true}
  ]);
  const wIgnored=duplicateCourseWarnings([
    {term:'2025-1',courseCode:'TEST3001',courseName:'철회과목',grade:'W',passed:true},
    {term:'2025-2',courseCode:'TEST3001',courseName:'철회과목',grade:'A0',passed:true}
  ]);
  t('동일 학정번호 중복 감지',dupCode.some(x=>x.includes('동일 학정번호 TEST1001')));
  t('동일 교과목명 중복 감지',dupName.some(x=>x.includes('동일 교과목명')));
  t('W 과목은 중복 판정 제외',wIgnored.length===0);
  t('강의 데이터 650건 이상',(DATA.offerings?.length||0)+(DATA.globalOfferings?.length||0)+(DATA.specialCourses?.length||0)>=650);
  t('교원자격 규정 13개 전공',Object.keys(CERT_RULES.majors||{}).length===13);

  return {tests,passed:tests.filter(x=>x.ok).length,failed:tests.filter(x=>!x.ok).length};
}
function runIntegrityChecks(showAlert=false){
  const dv=validateDataCore(DATA),rv=validateRulesCore(RULES),cv=validateCertificateRules(CERT_RULES),sv=validateStateObject(state),self=runDeterministicSelfTests();
  runtimePackMeta.dataValidation=dv;runtimePackMeta.rulesValidation=rv;runtimePackMeta.certValidation=cv;runtimePackMeta.selfTests=self;
  const critical=[...dv.critical,...rv.critical,...cv.critical,...sv.critical,...self.tests.filter(x=>!x.ok).map(x=>`테스트 실패: ${x.name}`)];
  const warnings=[...dv.warnings,...rv.warnings,...cv.warnings,...sv.warnings];
  if(DATA.snapshot!==RULES.snapshot)warnings.unshift(`강의 데이터(${DATA.snapshot})와 졸업규정(${RULES.snapshot}) 기준학기가 다릅니다.`);
  if(DATA.snapshot!==CERT_RULES.snapshot)warnings.unshift(`강의 데이터(${DATA.snapshot})와 교원자격규정(${CERT_RULES.snapshot}) 기준학기가 다릅니다.`);

  const badge=document.getElementById('dataHealthBadge');
  const summary=document.getElementById('integritySummary');
  const validationStatus=document.getElementById('runtimeValidationStatus');
  const cls=critical.length?'bad':warnings.length?'warn':'ok';
  const label=critical.length?`데이터 검증 실패 ${critical.length}`:warnings.length?`데이터 검증 완료 · 주의 ${warnings.length}`:'데이터 검증 완료';
  if(badge){badge.className=`data-health-badge no-print ${cls}`;badge.textContent=label;}
  if(validationStatus)validationStatus.textContent=label;
  const msg=`자체 테스트 ${self.passed}/${self.tests.length} 통과 · 강의데이터 ${dv.stats.rowCount||0}건 · 교원자격 전공 ${cv.stats.majorCount||0}개 · 사용자 수강이력 ${sv.stats.historyCount||0}건`;
  if(summary){
    summary.className=`integrity-summary ${cls}`;
    const issueHtml=[...critical.slice(0,5).map(x=>`<div>✕ ${esc(x)}</div>`),...warnings.slice(0,8).map(x=>`<div>△ ${esc(x)}</div>`)].join('');
    summary.innerHTML=`<b>${esc(label)}</b> · ${esc(msg)}${issueHtml?`<details style="margin-top:6px"><summary>검증 상세</summary>${issueHtml}${critical.length+warnings.length>13?`<div>… 외 ${critical.length+warnings.length-13}건</div>`:''}</details>`:''}`;
  }
  if(showAlert)alert(`${label}\n${msg}${critical.length?`\n\n치명 오류:\n- ${critical.slice(0,8).join('\n- ')}`:''}${warnings.length?`\n\n주의:\n- ${warnings.slice(0,8).join('\n- ')}`:''}`);
  return {critical,warnings,dv,rv,cv,sv,self};
}
function updateRuntimeMetaUi(){
  const ds=document.getElementById('runtimeDataStatus'),rs=document.getElementById('runtimeRulesStatus'),cs=document.getElementById('runtimeCertStatus'),ss=document.getElementById('runtimeSnapshotStatus');
  if(ds)ds.textContent=`${runtimePackMeta.dataSource} · ${DATA.snapshot}`;
  if(rs)rs.textContent=`${runtimePackMeta.rulesSource} · ${RULES.snapshot}`;
  if(cs)cs.textContent=`${runtimePackMeta.certSource} · ${CERT_RULES.snapshot}`;
  if(ss)ss.textContent=(DATA.snapshot===RULES.snapshot&&DATA.snapshot===CERT_RULES.snapshot)?DATA.snapshot:`강의 ${DATA.snapshot} / 졸업 ${RULES.snapshot} / 교원 ${CERT_RULES.snapshot}`;
  const head=document.getElementById('dataSnapshotText');if(head)head.textContent=DATA.snapshot||'-';
  const meta=document.getElementById('packMetaSummary');
  if(meta){
    const e=runtimePackMeta.dataEnvelope;
    const ver=e?.packVersion||e?.dataVersion||e?.version||DATA.snapshot||'-';
    const updated=e?.updatedAt?String(e.updatedAt).slice(0,10):'내장 데이터';
    meta.textContent=`데이터 기준 ${DATA.snapshot} · 데이터팩 ${ver} · 업데이트 ${updated} · ${runtimePackMeta.dataSource}`;
  }
}
async function fetchJsonNoCache(url){
  const r=await fetch(`${url}${url.includes('?')?'&':'?'}v=${Date.now()}`,{cache:'no-store'});
  if(!r.ok)throw new Error(`${url} HTTP ${r.status}`);
  return await r.json();
}
async function loadRuntimePacks(){
  let localData=null,localRules=null,localCert=null;
  try{localData=JSON.parse(localStorage.getItem(DATA_PACK_LOCAL_KEY)||'null');}catch(e){}
  try{localRules=JSON.parse(localStorage.getItem(RULES_PACK_LOCAL_KEY)||'null');}catch(e){}
  try{localCert=JSON.parse(localStorage.getItem(CERT_RULES_PACK_LOCAL_KEY)||'null');}catch(e){}
  if(!ALLOW_LOCAL_PACK_OVERRIDES){
    localData=null;localRules=null;localCert=null;
    [DATA_PACK_LOCAL_KEY,RULES_PACK_LOCAL_KEY,CERT_RULES_PACK_LOCAL_KEY].forEach(k=>{try{localStorage.removeItem(k);}catch(e){}});
  }

  if(ALLOW_LOCAL_PACK_OVERRIDES&&localData){
    const u=unwrapDataPack(localData),v=validateDataCore(u.data);
    if(u.data&&!v.critical.length){DATA=deepClone(u.data);runtimePackMeta.dataSource='로컬 업데이트';runtimePackMeta.dataEnvelope=u.envelope||null;}
  }else{
    try{
      const raw=await fetchJsonNoCache('./data-pack.json'),u=unwrapDataPack(raw),v=validateDataCore(u.data);
      if(u.data&&!v.critical.length){DATA=deepClone(u.data);runtimePackMeta.dataSource='GitHub data-pack';runtimePackMeta.dataEnvelope=u.envelope||null;}
    }catch(e){console.info('data-pack fallback:',e.message);}
  }
  if(ALLOW_LOCAL_PACK_OVERRIDES&&localRules){
    const u=unwrapRulesPack(localRules),v=validateRulesCore(u.rules);
    if(u.rules&&!v.critical.length){RULES=deepClone(u.rules);runtimePackMeta.rulesSource='로컬 업데이트';runtimePackMeta.rulesEnvelope=u.envelope||null;}
  }else{
    try{
      const raw=await fetchJsonNoCache('./rules-pack.json'),u=unwrapRulesPack(raw),v=validateRulesCore(u.rules);
      if(u.rules&&!v.critical.length){RULES=deepClone(u.rules);runtimePackMeta.rulesSource='GitHub rules-pack';runtimePackMeta.rulesEnvelope=u.envelope||null;}
    }catch(e){console.info('rules-pack fallback:',e.message);}
  }
  if(ALLOW_LOCAL_PACK_OVERRIDES&&localCert){
    const u=unwrapCertificateRules(localCert),v=validateCertificateRules(u.rules);
    if(u.rules&&!v.critical.length){CERT_RULES=deepClone(u.rules);runtimePackMeta.certSource='로컬 업데이트';runtimePackMeta.certEnvelope=u.envelope||null;}
  }else{
    try{
      const raw=await fetchJsonNoCache('./certificate-rules.json'),u=unwrapCertificateRules(raw),v=validateCertificateRules(u.rules);
      if(u.rules&&!v.critical.length){CERT_RULES=deepClone(u.rules);runtimePackMeta.certSource='GitHub certificate-rules';runtimePackMeta.certEnvelope=u.envelope||null;}
    }catch(e){console.info('certificate-rules fallback:',e.message);}
  }
  updateRuntimeMetaUi();
}
function createSafetySnapshot(reason='자동백업'){
  try{
    const arr=JSON.parse(localStorage.getItem(AUTO_BACKUP_KEY)||'[]');
    const next=Array.isArray(arr)?arr:[];
    next.unshift({createdAt:packNowIso(),reason,appVersion:APP_VERSION,dataSnapshot:DATA.snapshot,state:deepClone(state)});
    localStorage.setItem(AUTO_BACKUP_KEY,JSON.stringify(next.slice(0,5)));
    return true;
  }catch(e){console.warn('auto backup failed',e);return false;}
}
function restoreLatestAutoBackup(){
  try{
    const arr=JSON.parse(localStorage.getItem(AUTO_BACKUP_KEY)||'[]');
    if(!Array.isArray(arr)||!arr.length){alert('복구할 자동백업이 없습니다.');return;}
    const b=arr[0],v=validateStateObject(b.state);
    if(v.critical.length){alert('최근 자동백업이 손상되어 복구할 수 없습니다.');return;}
    if(!confirm(`${b.createdAt.slice(0,19).replace('T',' ')} · ${b.reason}\n이 자동백업으로 현재 입력값을 복구하시겠습니까?`))return;
    state=deepClone(b.state);state.schemaVersion=SCHEMA_VERSION;save();fillStaticControls();refreshCourseSelectors();render();runIntegrityChecks();
  }catch(e){alert('자동백업 복구 실패: '+e.message);}
}
function migrateImportedState(x){
  x=deepClone(x);
  x.history=Array.isArray(x.history)?x.history:[];
  for(const r of x.history)normalizeComparisonProgramTerm(r,x.profile?.admissionTerm||state?.profile?.admissionTerm||'');
  x.scenarios=Array.isArray(x.scenarios)&&x.scenarios.length?x.scenarios:[{id:'sc_default',name:'시트 1',planned:[]}];
  x.profile=x.profile||defaultState().profile;
  x.profile.wantsTeacherCertificate=!!x.profile.wantsTeacherCertificate;
  x.profile.hasTeacherLicense=!!x.profile.hasTeacherLicense;
  x.profile.teacherCertificateVariant=String(x.profile.teacherCertificateVariant||'');
  x.profileConfirmed=typeof x.profileConfirmed==='boolean'?x.profileConfirmed:x.history.length>0;
  x.teacherChecklist={...defaultState().teacherChecklist,...(x.teacherChecklist||{})};
  x.graduationChecklist={...defaultState().graduationChecklist,...(x.graduationChecklist||{})};
  x.scheduleSettings={...defaultState().scheduleSettings,...(x.scheduleSettings||{})};
  x.scheduleReferences=Array.isArray(x.scheduleReferences)?x.scheduleReferences:[];
  x.activeScenarioId=x.activeScenarioId||x.scenarios[0].id;
  x.schemaVersion=SCHEMA_VERSION;
  return x;
}
function normalizeUpdateHeader(s){return String(s||'').normalize('NFKC').replace(/\s+/g,'').replace(/[()（）\[\]·.]/g,'').toLowerCase();}
const UPDATE_HEADER_MAP={
  major:['전공','개설전공','전공명','학과','개설학과'],
  term:['학기','개설학기','년도학기','학년도학기'],
  courseCode:['학정번호','학정코드','과목코드','교과목코드'],
  section:['분반','반'],
  courseName:['교과목명','과목명','교과목'],
  credits:['학점','학점수'],
  categoryRaw:['종별','이수구분','구분','교과구분'],
  professor:['담당교수','교수명','교수'],
  day:['요일','수업요일','개설요일'],
  timeRaw:['시간','강의시간','수업시간','교시'],
  room:['강의실','장소','강의장소']
};
function pickUpdateField(row,key){
  const aliases=(UPDATE_HEADER_MAP[key]||[]).map(normalizeUpdateHeader);
  for(const [k,v] of Object.entries(row||{}))if(aliases.includes(normalizeUpdateHeader(k)))return v;
  return '';
}
function normalizeUpdateTerm(raw,fallback=''){
  const s=String(raw||'').normalize('NFKC').replace(/\s+/g,'');
  let m=s.match(/(20\d{2}).*?([12])(?:학기)?$/); if(m)return `${m[1]}-${m[2]}`;
  m=s.match(/^(20\d{2})-([12])$/); if(m)return `${m[1]}-${m[2]}`;
  return fallback;
}
function updateCategoryFromRaw(raw){
  const s=String(raw||'').replace(/\s+/g,'');
  if(/공통/.test(s))return 'common';
  if(/선수/.test(s))return 'prerequisite';
  if(/교직/.test(s))return 'teaching';
  if(/전공필수|^전공$/.test(s))return 'major_required';
  if(/전공선택|선택/.test(s))return 'major_elective';
  if(/연구지도/.test(s))return 'research_guidance';
  if(/졸업연구보고서|연구보고서/.test(s))return 'report';
  if(/논문/.test(s))return 'thesis';
  if(/청강/.test(s))return 'audit';
  return 'unknown';
}
function buildOfferingFromUpdateRow(row,sheetName,targetTerm,rowNo){
  let major=String(pickUpdateField(row,'major')||'').trim();
  if(!major&&DATA.majors.includes(sheetName))major=sheetName;
  let term=normalizeUpdateTerm(pickUpdateField(row,'term'),targetTerm);
  let courseCode=canonicalCode(pickUpdateField(row,'courseCode'));
  const section=String(pickUpdateField(row,'section')||'').trim();
  const courseName=String(pickUpdateField(row,'courseName')||'').trim();
  const categoryRaw=String(pickUpdateField(row,'categoryRaw')||'').trim();
  const category=updateCategoryFromRaw(categoryRaw);
  const professor=String(pickUpdateField(row,'professor')||'').trim();
  const day=String(pickUpdateField(row,'day')||'').trim().replace(/요일$/,'');
  const timeRaw=String(pickUpdateField(row,'timeRaw')||'').trim();
  const room=String(pickUpdateField(row,'room')||'').trim();
  const creditsRaw=String(pickUpdateField(row,'credits')||'').replace(/[^0-9.]/g,'');
  const credits=creditsRaw===''?3:Number(creditsRaw);
  const issues=[];
  if(!validTermValue(term))issues.push('학기 없음/형식 오류');
  if(!courseName)issues.push('과목명 없음');
  if(!courseCode)issues.push('학정번호 없음');
  const globalHint=/교직|공통|선수/.test(major)||/^SPT/.test(courseCode);
  if(!globalHint && !DATA.majors.includes(major))issues.push(`전공 인식 실패: ${major||'없음'}`);
  if(!Number.isFinite(credits)||credits<0||credits>9)issues.push(`학점 오류: ${creditsRaw}`);
  const isGlobal=globalHint || major==='__GLOBAL__';
  const obj={
    major:isGlobal?'__GLOBAL__':major,term,courseCode,courseName,aliases:[courseName],
    credits:Number.isFinite(credits)?credits:3,category,categoryRaw,
    availability:'actual',wasPlanned:false,plannedButNotActual:false,actualNotPlanned:true,
    professor,room,day,timeRaw,targetSemester:'',sectionCodes:[courseCode+(section?`-${section}`:'')].filter(Boolean),
    sourceActualRows:[rowNo],sourcePlanRows:[],categorySource:`관리자 Excel 업데이트/${term}`,
    ...(isGlobal?{scope:/^SPT/.test(courseCode)||category==='prerequisite'?'certificate':'common'}:{})
  };
  return {obj,isGlobal,issues,rowNo};
}
function offeringUpdateKey(r){
  const sec=(r.sectionCodes||[]).join(',');
  return [r.major||'',r.term||'',canonicalCode(r.courseCode),sec].join('|');
}
function comparableOffering(r){
  const c=deepClone(r);delete c.sourceActualRows;delete c.sourcePlanRows;delete c.categorySource;return JSON.stringify(c);
}
async function analyzeWorkbookUpdate(file,targetTerm,mode){
  await ensureXlsxLib();
  if(!validTermValue(targetTerm))throw new Error('대상 학기를 YYYY-1 또는 YYYY-2 형식으로 입력하십시오.');
  const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});
  const parsed=[],issues=[];
  for(const sheetName of wb.SheetNames){
    const rows=XLSX.utils.sheet_to_json(wb.Sheets[sheetName],{defval:'',raw:false});
    rows.forEach((row,i)=>{
      const built=buildOfferingFromUpdateRow(row,sheetName,targetTerm,i+2);
      if(built.issues.length)issues.push(...built.issues.map(x=>`${sheetName} ${i+2}행 · ${x}`));
      else parsed.push(built);
    });
  }
  if(!parsed.length)throw new Error('적용 가능한 과목 행을 찾지 못했습니다. Excel 열명을 확인하십시오.');
  const candidate=deepClone(DATA);
  if(mode==='replace_term'){
    candidate.offerings=(candidate.offerings||[]).filter(r=>r.term!==targetTerm);
    candidate.globalOfferings=(candidate.globalOfferings||[]).filter(r=>r.term!==targetTerm);
  }
  const added=[],changed=[],unchanged=[];
  for(const p of parsed){
    const arr=p.isGlobal?candidate.globalOfferings:candidate.offerings;
    const key=offeringUpdateKey(p.obj);
    const idx=arr.findIndex(x=>offeringUpdateKey(x)===key);
    if(idx<0){arr.push(p.obj);added.push(p.obj);}
    else if(comparableOffering(arr[idx])!==comparableOffering(p.obj)){arr[idx]=p.obj;changed.push(p.obj);}
    else unchanged.push(p.obj);
  }
  candidate.snapshot=targetTerm;
  const validation=validateDataCore(candidate);
  return {candidate,parsedCount:parsed.length,issues,added,changed,unchanged,validation,targetTerm,mode};
}
let pendingUpdateAnalysis=null;
function renderUpdatePreview(a){
  const box=document.getElementById('updatePreview');if(!box)return;
  if(!a){box.innerHTML='';return;}
  const hard=a.validation.critical.length;
  const allIssues=[...a.issues,...a.validation.warnings];
  box.innerHTML=`<div class="update-summary">
    <span class="update-chip ok">유효 ${a.parsedCount}행</span>
    <span class="update-chip ok">신규 ${a.added.length}</span>
    <span class="update-chip warn">변경 ${a.changed.length}</span>
    <span class="update-chip">동일 ${a.unchanged.length}</span>
    <span class="update-chip ${hard?'bad':allIssues.length?'warn':'ok'}">검증 ${hard?'실패':'통과'}${allIssues.length?` · 주의 ${allIssues.length}`:''}</span>
  </div>
  ${hard||allIssues.length?`<div class="update-issues">${a.validation.critical.map(x=>`<div>✕ ${esc(x)}</div>`).join('')}${allIssues.slice(0,30).map(x=>`<div>△ ${esc(x)}</div>`).join('')}${allIssues.length>30?`<div>… 외 ${allIssues.length-30}건</div>`:''}</div>`:'<div class="callout">검증 오류가 없습니다. 적용 전 신규/변경 건수를 확인하십시오.</div>'}`;
  document.getElementById('applyUpdatePack').disabled=!!hard;
  document.getElementById('exportUpdatePack').disabled=!!hard;
}
function applyDataCandidate(candidate,sourceLabel='관리자 로컬 업데이트'){
  const pack=dataPackEnvelope(candidate,{source:sourceLabel});
  const v=validateDataCore(candidate);
  if(v.critical.length)throw new Error(v.critical.join('; '));
  localStorage.setItem(DATA_PACK_LOCAL_KEY,JSON.stringify(pack));
  DATA=deepClone(candidate);runtimePackMeta.dataSource='로컬 업데이트';
  if(!DATA.majors.includes(state.profile.major))state.profileConfirmed=false;
  fillStaticControls();refreshCourseSelectors();render();renderOcrQueue();updateRuntimeMetaUi();runIntegrityChecks();
}

function save(){
  try{state.schemaVersion=SCHEMA_VERSION;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}
  catch(e){console.error('save failed',e);alert('브라우저 저장공간에 데이터를 저장하지 못했습니다. JSON 내보내기로 백업한 뒤 다시 시도하십시오.');return false;}
}
function defaultState(){
  return {schemaVersion:SCHEMA_VERSION,profile:{
      major:DATA.majors.includes('AI융합교육')?'AI융합교육':DATA.majors[0],
      admissionTerm:'2025-1',track:'report',hasTeacherLicense:false,wantsTeacherCertificate:false,teacherCertificateVariant:''
    },
    profileConfirmed:false,
    projection:{mode:'all',terms:[]},
    history:[],
    scenarios:[{id:'sc_default',name:'시트 1',planned:[]}],
    activeScenarioId:'sc_default',
    scheduleSettings:{
      days:['월','화','수','목','금'],
      timetableStart:'17:00',timetableEnd:'23:00',gridMinutes:60,
      slot1Start:'18:20',slot1End:'20:00',
      slot2Start:'20:10',slot2End:'21:50',
      lifelongStart:'18:20',lifelongEnd:'21:00'
    },
    scheduleReferences:[],
    activeReferenceId:null,
    teacherChecklist:{
      applicationSubmitted:false,
      relatedMajorConfirmed:false,
      recognizedMajorCredits:0,
      recognizedPedagogyCredits:0,
      basicCourseCount:0,
      basicCredits:0,
      basicSpecialConfirmed:false,
      recognizedTheoryCount:0,
      recognizedLiteracyCount:0,
      practiceExemptApproved:false,
      volunteerHours:0,
      teachingAverage100:null,
      majorAverage100:null,
      counselor1ExperienceYears:0,
      aptitudeCount:0,
      cprCount:0,
      genderCount:0,
      noExamSubmitted:false,
      drugCertificateSubmitted:false
    },
    graduationChecklist:{comprehensivePassed:0,englishStatus:'pending'}
  };
}
function load(){
  try{
    const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(x&&Array.isArray(x.scenarios)){
      x.schemaVersion=SCHEMA_VERSION;
      x.profile=x.profile||{};
      if(typeof x.profile.hasTeacherLicense!=='boolean')x.profile.hasTeacherLicense=false;
      if(typeof x.profile.wantsTeacherCertificate!=='boolean')x.profile.wantsTeacherCertificate=false;
      if(typeof x.profile.teacherCertificateVariant!=='string')x.profile.teacherCertificateVariant='';
      if(!['report','thesis','research'].includes(x.profile.track))x.profile.track='report';
      if(typeof x.profileConfirmed!=='boolean')x.profileConfirmed=Array.isArray(x.history)&&x.history.length>0;
      if(x.scenarios.length===1&&x.scenarios[0].name==='현재안')x.scenarios[0].name='시트 1';
      x.scheduleSettings={...defaultState().scheduleSettings,...(x.scheduleSettings||{})};
      x.scheduleReferences=Array.isArray(x.scheduleReferences)?x.scheduleReferences:[];
      x.activeReferenceId=x.activeReferenceId||null;
      x.history=Array.isArray(x.history)?x.history:[];
      x.teacherChecklist={
        applicationSubmitted:false,
        relatedMajorConfirmed:false,
        recognizedMajorCredits:0,
        recognizedPedagogyCredits:0,
        basicCourseCount:0,
        basicCredits:0,
        basicSpecialConfirmed:false,
        recognizedTheoryCount:0,
        recognizedLiteracyCount:0,
        practiceExemptApproved:false,
        volunteerHours:0,
        teachingAverage100:null,
        majorAverage100:null,
        aptitudeCount:0,
        cprCount:0,
        genderCount:0,
        noExamSubmitted:false,
        drugCertificateSubmitted:false,
        ...(x.teacherChecklist||{})
      };
      x.graduationChecklist={...defaultState().graduationChecklist,...(x.graduationChecklist||{})};
      return x;
    }
  }catch(e){}
  return defaultState();
}
let state=load();
function normalizeSavedHistoryCredits(){
  let changed=false;
  for(const r of state.history||[]){
    const beforeTerm=r.term;
    normalizeComparisonProgramTerm(r,state.profile.admissionTerm);
    if(r.term!==beforeTerm)changed=true;
    if(r.grade){
      const ng=normalizeGrade(r.grade);
      if(ng!==r.grade){r.grade=ng;changed=true;}
      const gp=gradePasses(ng);
      if(gp!=null && r.passed!==gp){r.passed=gp;changed=true;}
    }
    if(r.source==='manual_historical') continue;
    const code=canonicalCode(r.courseCode);
    const special=DATA.specialCourses.some(c=>canonicalCode(c.courseCode)===code);
    if(['common','audit'].includes(r.category)){if(Number(r.credits)!==0){r.credits=0;changed=true;}continue;}
    if(/^SPT/.test(code)&&Number(r.credits)!==2){r.credits=2;changed=true;}
    if(!special && r.term && termIndex(r.term)<termIndex('2025-1') && ['teaching','major_required','major_elective','unknown'].includes(r.category||'unknown')){
      if(Number(r.credits)!==2){r.credits=2;changed=true;}
    }
  }
  if(changed) save();
}
normalizeSavedHistoryCredits();

function filterCategoryOptions(){
  const ordered=['major_required','major_elective','teaching','common','prerequisite','report','thesis','research_guidance'];
  const main=ordered.map(c=>`<option value="${c}">${CATEGORY_LABELS[c]}</option>`).join('');
  return `<option value="all">전체 종별</option>`+
    main+
    `<option value="lifelong">평생교육사</option>`+
    `<option value="audit">${CATEGORY_LABELS.audit}</option>`+
    `<option value="unknown">${CATEGORY_LABELS.unknown}</option>`;
}

function isTeacherCertMajor(){return teacherCertMajors().has(state.profile.major);}
function recommendedCategory(c){
  if(!c)return 'unknown';
  const code=canonicalCode(c.courseCode);
  if(/^SPT/.test(code)&&teacherTrackEnabled())return 'prerequisite';
  return isOtherMajorCourse(c)?'unknown':(c.category||'unknown');
}
function teacherTrackEnabled(){return isTeacherCertMajor()&&!!state.profile.wantsTeacherCertificate&&state.profile.track!=='research';}
function normalizeCourseNameForRule(s){return normName(String(s||'').replace(/론$/,''));}
function matchesNameList(name,list){
  const n=normName(name);
  return list.some(x=>{
    const nx=normName(x);
    return n===nx||n.includes(nx)||nx.includes(n);
  });
}
function isTeacherQualificationCourseRecord(r){
  if(!r)return false;
  const code=canonicalCode(r.courseCode);
  const portal=String(r.portalCategory||'').replace(/\s+/g,'');
  const cat=r.category||'';
  const matched=historyCatalogCourse(r);
  return /^SPT/.test(code) ||
         ['teaching','prerequisite'].includes(cat) ||
         portal.includes('교직') ||
         matched?.scope==='certificate';
}
function qualificationCounts(records){
  const valid=(records||[]).filter(r=>r.passed!==false);
  const unique=(list,pred)=>{
    const seen=new Set();
    for(const r of list){
      if(!pred(r))continue;
      const k=recordKey(r);
      if(k)seen.add(k);
    }
    return seen.size;
  };
  const theory=unique(valid,r=>isTeacherQualificationCourseRecord(r)&&matchesNameList(r.courseName,TEACHING_THEORY_NAMES));
  const literacy=unique(valid,r=>isTeacherQualificationCourseRecord(r)&&matchesNameList(r.courseName,TEACHING_LITERACY_NAMES));
  const practice=unique(valid,r=>isTeacherQualificationCourseRecord(r)&&matchesNameList(r.courseName,TEACHING_PRACTICE_NAMES));
  const lifelong=unique(valid,r=>matchesNameList(r.courseName,LIFELONG_REQUIRED_NAMES));
  return {theory,literacy,practice,lifelong};
}
function qualificationTargets(){
  const admissionYear=Number(String(state.profile.admissionTerm||'2025-1').slice(0,4));
  return {theory:6,literacy:admissionYear>=2024?4:3,practice:1,lifelong:5};
}
function teacherMajorCreditRecords(records){
  const seen=new Set(), out=[];
  for(const r of (records||[])){
    if(r.passed===false)continue;
    const key=recordKey(r);
    if(!key||seen.has(key))continue;

    const matched=historyCatalogCourse(r);
    const cat=r.category||'';
    const ownMajorTeaching=!!matched && matched.major===state.profile.major &&
      (matched.category==='teaching' || (matched.categoryOptions||[]).includes('teaching'));

    const countsAsMajor=
      ['major_required','major_elective'].includes(cat) ||
      ownMajorTeaching ||
      isSwitchableMajorTeachingHistory(r);

    if(!countsAsMajor)continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}
function teacherMajorCredits(records){
  return teacherMajorCreditRecords(records).reduce((s,r)=>s+Number(r.credits||0),0);
}
function certificateMajorRule(major=state.profile.major){return CERT_RULES?.majors?.[major]||null;}
function certificateVariantRule(){
  const majorRule=certificateMajorRule();
  if(!majorRule)return null;
  const wanted=state.profile.teacherCertificateVariant||majorRule.defaultVariant;
  return majorRule.variants?.find(v=>v.id===wanted)||majorRule.variants?.[0]||null;
}
function effectiveBasicRule(variant=certificateVariantRule()){
  if(!variant)return null;
  if(Array.isArray(variant.rulesByAdmission)){
    const t=state.profile.admissionTerm;
    const row=variant.rulesByAdmission.find(x=>(!x.from||termIndex(t)>=termIndex(x.from))&&(!x.to||termIndex(t)<=termIndex(x.to)));
    if(row?.basicRule)return row.basicRule;
  }
  return variant.basicRule||null;
}
function certificateCodeSet(list){return new Set((list||[]).map(x=>canonicalCode(x.code)).filter(Boolean));}
function teacherPedagogyCredits(records){
  const variant=certificateVariantRule();
  if(!variant?.pedagogyRequired)return 0;
  const codes=certificateCodeSet(variant.pedagogyCourses);
  const seen=new Set();let total=0;
  for(const r of (records||[])){
    if(r.passed===false)continue;
    const code=canonicalCode(r.courseCode);if(!codes.has(code)||seen.has(code))continue;
    seen.add(code);total+=Number(r.credits||0);
  }
  return total;
}
function teacherBasicAutoProgress(records){
  const variant=certificateVariantRule();
  const rule=effectiveBasicRule(variant);
  if(!variant||!rule)return {variant,rule,matchedGroups:[],groupNos:new Set(),courseCount:0,credits:0,ruleAutoSatisfied:false,details:[]};
  const byCode=new Map();
  for(const r of (records||[])){
    if(r.passed===false)continue;
    const code=canonicalCode(r.courseCode);if(!code)continue;
    const arr=byCode.get(code)||[];arr.push(r);byCode.set(code,arr);
  }
  const matched=[];
  for(const g of variant.groups||[]){
    let best=null;
    for(const c of g.courses||[]){
      for(const r of byCode.get(canonicalCode(c.code))||[]){
        if(!best||Number(r.credits||0)>Number(best.record.credits||0))best={course:c,record:r};
      }
    }
    if(best)matched.push({group:g,best});
  }
  const groupNos=new Set(matched.map(x=>Number(x.group.no)));
  const credits=matched.reduce((s,x)=>s+Number(x.best.record.credits||0),0);
  const requiredOk=(rule.requiredGroups||[]).every(n=>groupNos.has(Number(n)));
  const choicesOk=(rule.choiceGroups||[]).every(c=>[...groupNos].filter(n=>(c.groups||[]).map(Number).includes(n)).length>=Number(c.min||1));
  const countOk=groupNos.size>=Number(rule.minGroups||0);
  const ruleAutoSatisfied=requiredOk&&choicesOk&&countOk;
  return {variant,rule,matchedGroups:matched,groupNos,courseCount:groupNos.size,credits,ruleAutoSatisfied};
}
function teacherBasicRuleLabel(rule,variant){
  if(!rule)return '기준 확인 필요';
  if(rule.type==='threshold')return `${rule.minGroups||5}과목 · ${rule.minCredits||14}학점 이상`;
  return variant?.conditionText||`${rule.minGroups||0}과목 이상 · 필수/영역 조건`;
}

function teacherRequirementModel(records){
  const t=state.teacherChecklist||{};
  const q=qualificationCounts(records);
  const target=qualificationTargets();
  const hasLicense=!!state.profile.hasTeacherLicense;
  const variant=certificateVariantRule();
  const eligibility=variant?.eligibility||{};
  const isCounselor1=eligibility.type==='professional_counselor_1'||variant?.id==='counselor1';
  const counselor1ExperienceYears=Math.max(0,Number(t.counselor1ExperienceYears||0));
  const counselor1EligibilitySatisfied=!isCounselor1||(hasLicense&&counselor1ExperienceYears>=Number(eligibility.minPreAdmissionTeachingYears||3));
  const exemptions=CERT_RULES.existingTeacherLicenseExemptions||{};
  const basicAuto=teacherBasicAutoProgress(records);
  const basicRule=basicAuto.rule||{};

  const recognizedTheory=Math.max(0,Math.min(target.theory,Number(t.recognizedTheoryCount||0)));
  const recognizedLiteracy=Math.max(0,Math.min(target.literacy,Number(t.recognizedLiteracyCount||0)));
  const theoryExempt=hasLicense&&exemptions.theory!==false;
  const literacyExempt=hasLicense&&exemptions.literacy!==false;
  const practiceExempt=hasLicense&&exemptions.practice!==false;
  const volunteerExempt=hasLicense&&exemptions.volunteer!==false;
  const theoryCurrent=theoryExempt?target.theory:Math.min(target.theory,q.theory+recognizedTheory);
  const literacyCurrent=literacyExempt?target.literacy:Math.min(target.literacy,q.literacy+recognizedLiteracy);
  const practiceSatisfied=practiceExempt || !!t.practiceExemptApproved || q.practice>=target.practice;
  const volunteerSatisfied=volunteerExempt || Number(t.volunteerHours||0)>=60;

  const gradMajorCredits=teacherMajorCredits(records);
  const totalMajorCredits=Number(t.recognizedMajorCredits||0)+gradMajorCredits;
  const pedagogyRequired=!!variant?.pedagogyRequired;
  const gradPedagogyCredits=teacherPedagogyCredits(records);
  const totalPedagogyCredits=pedagogyRequired?Number(t.recognizedPedagogyCredits||0)+gradPedagogyCredits:0;

  const externalBasicCount=Number(t.basicCourseCount||0);
  const externalBasicCredits=Number(t.basicCredits||0);
  const basicCourseCount=basicAuto.courseCount+externalBasicCount;
  const basicCredits=basicAuto.credits+externalBasicCredits;
  const thresholdCountOk=basicCourseCount>=Number(basicRule.minGroups||0);
  const thresholdCreditOk=basicCredits>=Number(basicRule.minCredits||0);
  const hasSpecial=basicRule.type==='groups';
  const specialOk=!hasSpecial || basicAuto.ruleAutoSatisfied || (!!t.basicSpecialConfirmed && externalBasicCount>0);
  const basicSatisfied=thresholdCountOk&&thresholdCreditOk&&specialOk;

  const teachingAvg=t.teachingAverage100===''||t.teachingAverage100==null?null:Number(t.teachingAverage100);
  const majorAvg=t.majorAverage100===''||t.majorAverage100==null?null:Number(t.majorAverage100);

  return {q,target,hasLicense,variant,eligibility,isCounselor1,counselor1ExperienceYears,counselor1EligibilitySatisfied,basicAuto,basicRule,basicSatisfied,externalBasicCount,externalBasicCredits,
    theoryCurrent,literacyCurrent,practiceSatisfied,volunteerSatisfied,theoryExempt,literacyExempt,practiceExempt,volunteerExempt,
    gradMajorCredits,totalMajorCredits,pedagogyRequired,gradPedagogyCredits,totalPedagogyCredits,
    basicCourseCount,basicCredits,teachingAvg,majorAvg};
}
function planCombinedRecords(){
  return [...state.history.filter(r=>r.passed!==false),...projectionPlannedRecords().map(r=>({...r,passed:true}))];
}
function renderTrackButtons(){
  document.querySelectorAll('#trackButtons [data-track]').forEach(b=>b.classList.toggle('active',b.dataset.track===state.profile.track));
  const wrap=document.getElementById('teacherLicenseWrap');
  const cert=isTeacherCertMajor()&&state.profile.track!=='research';
  wrap.style.display=cert?'flex':'none';
  document.getElementById('hasTeacherLicense').checked=!!state.profile.hasTeacherLicense;
  document.getElementById('wantsTeacherCertificate').checked=!!state.profile.wantsTeacherCertificate;
  const mr=certificateMajorRule();
  if(mr&&!mr.variants?.some(v=>v.id===state.profile.teacherCertificateVariant))state.profile.teacherCertificateVariant=mr.defaultVariant||mr.variants?.[0]?.id||'';
}
function currentSheetNextName(){
  const nums=state.scenarios.map(s=>Number((s.name.match(/시트\s*(\d+)/)||[])[1]||0));
  return `시트 ${Math.max(0,...nums)+1}`;
}
function hhmmToMinutes(s){
  const m=String(s||'').match(/^(\d{1,2}):(\d{2})$/);return m?Number(m[1])*60+Number(m[2]):9999;
}
function minutesToHHMM(n){
  const h=Math.floor(n/60),m=n%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
function timeSelectOptions(selected,step=10){
  const options=[];
  for(let m=0;m<24*60;m+=step){
    const h24=Math.floor(m/60),min=m%60;
    const period=h24<12?'오전':'오후';
    const h12=h24%12===0?12:h24%12;
    const value=`${String(h24).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
    options.push(`<option value="${value}" ${value===selected?'selected':''}>${period} ${String(h12).padStart(2,'0')}:${String(min).padStart(2,'0')}</option>`);
  }
  const selectedExists=options.some(x=>x.includes(`value="${selected}"`));
  if(selected && !selectedExists){
    const mm=hhmmToMinutes(selected);
    if(mm!==9999){
      const h24=Math.floor(mm/60),min=mm%60;
      const period=h24<12?'오전':'오후';
      const h12=h24%12===0?12:h24%12;
      options.push(`<option value="${selected}" selected>${period} ${String(h12).padStart(2,'0')}:${String(min).padStart(2,'0')}</option>`);
    }
  }
  return options.join('');
}
function isLifelongCourse(o){return /^SPL/i.test(canonicalCode(o?.courseCode))||matchesNameList(o?.courseName,LIFELONG_REQUIRED_NAMES);}
function explicitRawTime(o){
  const raw=String(o?.timeRaw||'');
  const isPm=/오후/.test(raw), isAm=/오전/.test(raw);
  const times=[...raw.matchAll(/(\d{1,2})\s*:\s*(\d{2})/g)].map(m=>{
    let h=Number(m[1]);
    if(isPm&&h<12)h+=12;
    if(isAm&&h===12)h=0;
    return `${String(h).padStart(2,'0')}:${m[2]}`;
  });
  if(times.length>=2)return `${times[0]}–${times[1]}`;
  return '';
}
function scheduleInfo(o){return scheduleInfoWithSettings(o,state.scheduleSettings||defaultState().scheduleSettings);}
function offeringForPlanRecord(r){
  const code=canonicalCode(r.courseCode), all=[...DATA.offerings,...DATA.globalOfferings];
  if(r.sectionCode){
    const exact=all.find(o=>o.term===r.term&&canonicalCode(o.courseCode)===code&&(o.sectionCodes||[]).includes(r.sectionCode));
    if(exact)return exact;
  }
  if(r.professor||r.day){
    const exact=all.find(o=>o.term===r.term&&canonicalCode(o.courseCode)===code&&(!r.professor||o.professor===r.professor)&&(!r.day||o.day===r.day));
    if(exact)return exact;
  }
  return all.find(o=>o.term===r.term&&canonicalCode(o.courseCode)===code)||all.find(o=>canonicalCode(o.courseCode)===code)||null;
}

function fillStaticControls(){
  const major=document.getElementById('majorSelect');
  major.innerHTML=DATA.majors.map(m=>`<option ${m===state.profile.major?'selected':''}>${esc(m)}</option>`).join('');
  const terms=[]; for(let y=2022;y<=2029;y++){terms.push(`${y}-1`,`${y}-2`);}
  for(const id of ['admissionSelect','historyTerm','ocrTerm']){
    const el=document.getElementById(id); el.innerHTML=terms.map(t=>`<option value="${t}">${t}</option>`).join('');
  }
  document.getElementById('admissionSelect').value=state.profile.admissionTerm;
  document.getElementById('historyTerm').value=state.profile.admissionTerm;
  document.getElementById('ocrTerm').value=state.profile.admissionTerm;

  const planTerms=[...new Set(DATA.offerings.filter(o=>o.major===state.profile.major).map(o=>o.term))].sort((a,b)=>termIndex(a)-termIndex(b));
  const allCatalogTerms=[...new Set([...DATA.offerings.map(o=>o.term),...DATA.globalOfferings.map(o=>o.term)])].filter(t=>/^\d{4}-[12]$/.test(t)).sort((a,b)=>termIndex(a)-termIndex(b));
  const planSel=document.getElementById('planTerm'), catSel=document.getElementById('catalogTerm'), ttSel=document.getElementById('timetableTerm');
  planSel.innerHTML=planTerms.map(t=>`<option>${t}</option>`).join('');
  catSel.innerHTML=allCatalogTerms.map(t=>`<option>${t}</option>`).join('');
  ttSel.innerHTML=allCatalogTerms.map(t=>`<option>${t}</option>`).join('');
  if(planTerms.includes(DATA.snapshot)) planSel.value=DATA.snapshot;
  if(allCatalogTerms.includes(DATA.snapshot)){catSel.value=DATA.snapshot;ttSel.value=DATA.snapshot;}

  document.getElementById('catalogMajor').innerHTML=`<option value="__ALL__">전체 전공</option><option value="__GLOBAL__">교직·공통(전체)</option>`+DATA.majors.map(m=>`<option value="${esc(m)}">${esc(m)}</option>`).join('');
  document.getElementById('catalogMajor').value=state.profile.major;
  document.getElementById('historyFilterCategory').innerHTML=filterCategoryOptions();
  document.getElementById('planFilterCategory').innerHTML=filterCategoryOptions();
  document.getElementById('historyFilterCategory').value='all';
  document.getElementById('planFilterCategory').value='all';
  for(const id of ['historyCategory','planCategory','manualCategory']) document.getElementById(id).innerHTML=categoryOptionsHtml('unknown');
  document.getElementById('historyGrade').innerHTML=gradeOptionsHtml('',true);
  document.getElementById('manualGrade').innerHTML=gradeOptionsHtml('',true);
  renderTrackButtons();
  renderPlanSettings();
  updateHistoryCreditNote();
}
function filteredHistoryMasters(){
  const scope=document.getElementById('historyScope').value||'mine';
  const cat=document.getElementById('historyFilterCategory').value||'all';
  const q=document.getElementById('historyCourseSearch').value||'';
  return getCatalogMasters(cat==='lifelong'?'all':scope).filter(c=>matchesCourseFilter(c,cat,q));
}
function refreshHistoryCourse(){
  const list=filteredHistoryMasters();
  const hc=document.getElementById('historyCourse');
  hc.innerHTML=`<option value="">-- 과목 선택 (${list.length}개) --</option>`+list.map((c,i)=>{
    const origin=courseOriginLabel(c); const cat=CATEGORY_LABELS[c.category||'unknown'];
    return `<option value="${i}">[${esc(cat)}] ${esc(c.courseName)}${c.courseCode?` (${esc(c.courseCode)})`:''} · ${esc(origin)}</option>`;
  }).join('');
  hc.dataset.masters=JSON.stringify(list);
  renderHistorySelectionNote(null);
}
function refreshCourseSelectors(){refreshHistoryCourse();refreshPlanCourse();}
function filteredPlanOfferings(){
  const term=document.getElementById('planTerm').value;
  const scope=document.getElementById('planScope').value||'mine';
  const cat=document.getElementById('planFilterCategory').value||'all';
  const q=document.getElementById('planCourseSearch').value||'';
  const professorQ=document.getElementById('planProfessorSearch')?.value||'';
  const np=normName(professorQ);
  return offeringsForTerm(term,cat==='lifelong'?'all':scope).filter(c=>{
    if(!matchesCourseFilter(c,cat,q))return false;
    if(np && !normName(c.professor||'').includes(np))return false;
    return true;
  });
}
function refreshPlanCourse(){
  const list=filteredPlanOfferings();
  const pc=document.getElementById('planCourse');
  pc.innerHTML=`<option value="">-- 과목 선택 (${list.length}개) --</option>`+list.map((c,i)=>{
    const disabled=c.availability==='planned_missing_actual'?'disabled':'';
    let tag=c.availability==='actual'?'실제개설':c.availability==='planned'?'개설예정':c.availability==='planned_missing_actual'?'예정→실제미확인':'특수과목';
    if(c.scope==='certificate') tag += '·교원자격';
    const displayCode=(c.sectionCodes||[])[0]||c.courseCode||'';
    const professor=c.professor?` · ${esc(c.professor)}`:'';
    return `<option value="${i}" ${disabled}>[${esc(CATEGORY_LABELS[c.category||'unknown'])}] ${esc(c.courseName)}${displayCode?` (${esc(displayCode)})`:''}${professor} · ${esc(courseOriginLabel(c))} · ${tag}</option>`;
  }).join('');
  pc.dataset.list=JSON.stringify(list);
  renderPlanSelectionNote(null);
}
function updateHistoryCreditNote(){
  const term=document.getElementById('historyTerm').value;
  const old=termIndex(term)<termIndex('2025-1');
  document.getElementById('historyCreditNote').innerHTML=old?`<span class="badge planned">2학점 체제</span> ${esc(term)} 수강 일반 과목은 기본 <b>2학점</b>으로 적용합니다. 공통/논문 등 특수과목은 해당 규칙을 따릅니다.`:`<span class="badge actual">3학점 체제</span> ${esc(term)} 수강 일반 과목은 기본 <b>3학점</b>으로 적용합니다.`;
}
function graduationTrackLabel(track){
  return track==='thesis'?'논문':track==='research'?'연구과정(비학위)':'졸업연구보고서';
}
function renderPrintProfileSummary(){
  const box=document.getElementById('printProfileSummary');
  if(!box)return;
  box.innerHTML=`
    <div class="print-profile-item"><span class="print-profile-label">전공</span><span class="print-profile-value">${esc(state.profile.major)}</span></div>
    <div class="print-profile-item"><span class="print-profile-label">입학학기</span><span class="print-profile-value">${esc(state.profile.admissionTerm)}</span></div>
    <div class="print-profile-item"><span class="print-profile-label">과정 / 졸업유형</span><span class="print-profile-value">${esc(graduationTrackLabel(state.profile.track))}</span></div>
  `;
}
function renderScenarioTabs(){
  document.getElementById('scenarioTabs').innerHTML=state.scenarios.map(s=>`<button class="tab ${s.id===state.activeScenarioId?'active':''}" data-scenario="${s.id}">${esc(s.name)}</button>`).join('');
  document.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=()=>{state.activeScenarioId=b.dataset.scenario;save();render();});
}

function evidenceRecordKey(r){
  return `${canonicalCode(r?.courseCode)}|${normName(r?.courseName)}|${r?.term||''}|${r?.category||''}`;
}
function requirementEvidenceRecords(key,records){
  const seen=new Set(),out=[];
  for(const r of records||[]){
    if(r?.passed===false)continue;
    if(key==='total'){
      if(Number(r?.credits||0)<=0)continue;
      if(['audit','prerequisite'].includes(r?.category))continue;
    }else if((r?.category||'')!==key)continue;
    const k=evidenceRecordKey(r);if(seen.has(k))continue;seen.add(k);out.push(r);
  }
  return out.sort((a,b)=>termIndex(a.term)-termIndex(b.term)||String(a.courseName||'').localeCompare(String(b.courseName||''),'ko'));
}
function evidenceRowsHtml(records,{planned=false,unit='학점'}={}){
  if(!records.length)return '';
  return records.map(r=>`<div class="evidence-row"><span class="name">${esc(r.courseName||r.courseCode||'과목')}</span><span class="term">${esc(displayAcademicTerm(r.term)||r.term||'')}</span><span class="credit">${unit==='과목'?'1과목':`${fmtCredits(Number(r.credits||0))}학점`}${planned?' <span class="evidence-plan-chip">계획</span>':''}</span></div>`).join('');
}
function requirementEvidenceHtml(key,cur,proj,min,unit){
  const current=requirementEvidenceRecords(key,state.history);
  const planned=requirementEvidenceRecords(key,projectionPlannedRecords());
  const count=current.length+planned.length;
  if(!count)return '';
  return `<details class="kpi-evidence no-print"><summary>${planned.length?'인정·계획 과목':'인정 과목'} ${count}개</summary><div class="kpi-evidence-body">
    ${current.length?`<div class="evidence-group"><div class="evidence-group-title">현재 이수</div>${evidenceRowsHtml(current,{unit})}</div>`:''}
    ${planned.length?`<div class="evidence-group"><div class="evidence-group-title">계획</div>${evidenceRowsHtml(planned,{planned:true,unit})}</div>`:''}
    <div class="evidence-summary-line">현재 ${fmtCredits(cur)} / ${fmtCredits(min)}${unit}${proj!==cur?` · 계획 반영 후 ${fmtCredits(proj)} / ${fmtCredits(min)}${unit}`:''}</div>
  </div></details>`;
}
function teacherEvidenceHtml(){
  const variant=certificateVariantRule();if(!variant)return '';
  const current=state.history.filter(r=>r.passed!==false),planned=projectionPlannedRecords();
  const currentByCode=new Map(current.map(r=>[canonicalCode(r.courseCode),r]));
  const plannedByCode=new Map(planned.map(r=>[canonicalCode(r.courseCode),r]));
  const rows=[];
  for(const g of variant.groups||[]){
    let hit=null,isPlanned=false;
    for(const c of g.courses||[]){
      const code=canonicalCode(c.code);
      if(currentByCode.has(code)){hit=currentByCode.get(code);break;}
      if(plannedByCode.has(code)){hit=plannedByCode.get(code);isPlanned=true;break;}
    }
    if(hit)rows.push({group:`기본 ${g.no}`,subject:g.basicSubject||'',record:hit,planned:isPlanned});
  }
  for(const c of variant.pedagogyCourses||[]){
    const code=canonicalCode(c.code);let hit=currentByCode.get(code),isPlanned=false;
    if(!hit&&plannedByCode.has(code)){hit=plannedByCode.get(code);isPlanned=true;}
    if(hit)rows.push({group:'교과교육',subject:c.courseName||'',record:hit,planned:isPlanned});
  }
  if(!rows.length)return '';
  return `<details class="teacher-evidence-details"><summary>기본이수·교과교육 인정 내역 ${rows.length}개</summary><div class="teacher-evidence-body">${rows.map(x=>`<div class="teacher-evidence-row"><span class="teacher-evidence-group">${esc(x.group)}</span><span class="teacher-evidence-course"><b>${esc(x.record.courseName||x.subject||x.record.courseCode)}</b><span>${esc(canonicalCode(x.record.courseCode))}${x.subject&&normName(x.subject)!==normName(x.record.courseName)?` · ${esc(x.subject)}`:''}</span></span>${x.planned?'<span class="evidence-plan-chip">계획</span>':'<span class="badge ok">인정</span>'}</div>`).join('')}</div></details>`;
}

function renderKpis(){
  const {current,projected}=evaluateBoth(),rule=getRule(),g=gpaRequirementStatus(state.history);
  const card=(key,label,cur,proj,min,unit)=>{
    const status=requirementState(cur>=min,proj>=min);
    return `<div class="card ${status==='bad'?'kpi-card-unmet':''}"><div class="kpi-top"><span class="kpi-label">${esc(label)}</span>${requirementBadge(status)}</div>
      ${comparisonValues(`${fmtCredits(cur)} / ${fmtCredits(min)}${unit}`,`${fmtCredits(proj)} / ${fmtCredits(min)}${unit}`)}
      <div class="kpi-bar"><div style="width:${min>0?Math.min(100,Math.round(cur/min*100)):0}%"></div></div>
      <div class="sub">기준 ${fmtCredits(min)}${unit} 이상${cur<min?` · 현재 부족 ${fmtCredits(min-cur)}${unit}`:''}</div>
      ${requirementEvidenceHtml(key,cur,proj,min,unit)}</div>`;
  };
  const cards=[card('total','졸업 인정학점',current.totalCredits,projected.totalCredits,rule.totalCredits,'학점')];
  const gStatus=g.state==='pass'?'ok':g.state==='fail'?'bad':'pending';
  cards.push(`<div class="card ${gStatus==='bad'?'kpi-card-unmet':''}"><div class="kpi-top"><span class="kpi-label">현재 누적평점</span>${requirementBadge(gStatus)}</div>
    <div class="value"><b>${g.gpa==null?'-':fmtGpa(g.gpa)}</b><span class="kpi-scale"> / 4.3</span></div>
    <div class="sub">기준 B0(3.00) 이상 · ${g.state==='incomplete'?'성적 일부 미입력':g.state==='unknown'?'평점자료 없음':'현재 수강이력 기준'}<br>계획 이수 후 평점은 성적 확정 후 확인</div></div>`);
  for(const pr of projected.requirements){
    if(pr.key==='total')continue;
    const cur=(current.requirements.find(x=>x.key===pr.key)||{current:0}).current;
    cards.push(card(pr.key,pr.label,cur,pr.current,pr.min,pr.unit));
  }
  document.getElementById('kpiGrid').innerHTML=cards.join('');
  const curQ=qualificationCounts(state.history),projQ=qualificationCounts(planCombinedRecords()),target=qualificationTargets();
  const lifelongActive=curQ.lifelong>0||projQ.lifelong>0;
  const lifelongWrap=document.getElementById('lifelongSection');if(lifelongWrap)lifelongWrap.style.display=lifelongActive?'':'none';
  document.getElementById('certKpiGrid').innerHTML=lifelongActive?card('평생교육사',curQ.lifelong,projQ.lifelong,target.lifelong,'과목'):'';
}

function graduationActionItems(){
  if(!state.profileConfirmed||!state.history.length)return [];
  const {current,projected}=evaluateBoth();
  const actions=[];
  const componentDeficits=current.requirements.filter(r=>r.key!=='total'&&r.current<r.min);
  for(const r of componentDeficits){
    const gap=Math.max(0,Number(r.min)-Number(r.current));
    actions.push({kind:'degree',text:`${r.label} ${fmtCredits(gap)}${r.unit} 추가 이수`});
  }
  if(!componentDeficits.length){
    const total=current.requirements.find(r=>r.key==='total');
    if(total&&total.current<total.min)actions.push({kind:'degree',text:`졸업 인정학점 ${fmtCredits(total.min-total.current)}학점 추가 이수`});
  }
  const g=gpaRequirementStatus(state.history);
  if(g.state==='fail')actions.push({kind:'degree',text:`누적평점 3.00 이상 필요 · 현재 ${fmtGpa(g.gpa)}`});
  else if(g.state==='incomplete'||g.state==='unknown')actions.push({kind:'degree',text:'평점 계산을 위해 성적 미입력 과목 확인'});

  if(state.profile.track!=='research'){
    const cfg=CERT_RULES?.graduationExam||{}, gc=state.graduationChecklist||{};
    const semesterNo=Math.max(1,termIndex(DATA.snapshot)-termIndex(state.profile.admissionTerm)+1);
    const required=Number(cfg.comprehensive?.requiredPassedCourses||2);
    if(semesterNo>=3&&Number(gc.comprehensivePassed||0)<required)actions.push({kind:'exam',text:`종합시험 ${required-Number(gc.comprehensivePassed||0)}과목 합격 확인`});
    if((cfg.englishRequiredMajors||[]).includes(state.profile.major)&&!['passed','replaced'].includes(gc.englishStatus))actions.push({kind:'exam',text:'전공영어시험 합격 또는 공인영어성적 대체 확인'});
  }

  if(teacherTrackEnabled()){
    const m=teacherRequirementModel(state.history), t=state.teacherChecklist||{}, common=CERT_RULES.commonMandatory||{};
    if(m.isCounselor1){
      if(!m.counselor1EligibilitySatisfied)actions.push({kind:'teacher',text:`전문상담교사 1급 기존자격·입학 전 교육경력 ${Number(m.eligibility?.minPreAdmissionTeachingYears||3)}년 확인`});
      if(!m.basicSatisfied)actions.push({kind:'teacher',text:'전문상담교사 교과목 요건 확인'});
    }else{
      if(!t.relatedMajorConfirmed)actions.push({kind:'teacher',text:'관련전공·표시과목 일치 여부 확인'});
      if(m.totalMajorCredits<50)actions.push({kind:'teacher',text:`교원자격 전공학점 ${fmtCredits(50-m.totalMajorCredits)}학점 추가/인정 확인`});
      if(!m.basicSatisfied)actions.push({kind:'teacher',text:'기본이수 과목·학점 및 영역조건 확인'});
      if(m.pedagogyRequired&&m.totalPedagogyCredits<6)actions.push({kind:'teacher',text:`교과교육 ${fmtCredits(6-m.totalPedagogyCredits)}학점 추가/인정 확인`});
      if(m.theoryCurrent<m.target.theory)actions.push({kind:'teacher',text:`교직이론 ${m.target.theory-m.theoryCurrent}과목 추가/인정 확인`});
      if(m.literacyCurrent<m.target.literacy)actions.push({kind:'teacher',text:`교직소양 ${m.target.literacy-m.literacyCurrent}과목 추가/인정 확인`});
      if(!m.practiceSatisfied)actions.push({kind:'teacher',text:'학교현장실습 이수 또는 면제·대체 승인 확인'});
      if(!m.volunteerSatisfied)actions.push({kind:'teacher',text:`교육봉사 ${Math.max(0,60-Number(t.volunteerHours||0))}시간 추가 확인`});
      if(m.teachingAvg==null)actions.push({kind:'teacher',text:'교직 평균성적 입력·확인 · 100점 만점 80점 이상 필요'});
      else if(m.teachingAvg<80)actions.push({kind:'teacher',text:`교직 평균성적 기준 미달 · 현재 ${m.teachingAvg.toFixed(2)}점 / 80점 이상 필요`});
      if(m.majorAvg==null)actions.push({kind:'teacher',text:'전공 평균성적 입력·확인 · 100점 만점 75점 이상 필요'});
      else if(m.majorAvg<75)actions.push({kind:'teacher',text:`전공 평균성적 기준 미달 · 현재 ${m.majorAvg.toFixed(2)}점 / 75점 이상 필요`});
    }
    if(!t.applicationSubmitted)actions.push({kind:'teacher',text:'교직과정 이수신청서 제출 여부 확인'});
    if(Number(t.aptitudeCount||0)<Number(common.aptitudeCount||2))actions.push({kind:'teacher',text:`교직적성·인성검사 ${Number(common.aptitudeCount||2)-Number(t.aptitudeCount||0)}회 추가`});
    if(Number(t.cprCount||0)<Number(common.cprCount||2))actions.push({kind:'teacher',text:`응급처치·심폐소생술 ${Number(common.cprCount||2)-Number(t.cprCount||0)}회 추가`});
    if(Number(t.genderCount||0)<Number(common.genderCount||2))actions.push({kind:'teacher',text:`성인지교육 ${Number(common.genderCount||2)-Number(t.genderCount||0)}회 추가`});
    if(!t.noExamSubmitted)actions.push({kind:'teacher',text:'졸업학기 교원자격무시험검정원서 제출 확인'});
    if(!t.drugCertificateSubmitted)actions.push({kind:'teacher',text:'약물중독 관련 진단서/검사결과 제출 확인'});
  }
  return actions;
}
function renderActionSummary(){
  const wrap=document.getElementById('resultPrimarySummary');if(!wrap)return;
  if(!state.profileConfirmed||!state.history.length){wrap.innerHTML='';return;}
  const {current,projected}=evaluateBoth(),g=gpaRequirementStatus(state.history),actions=graduationActionItems();
  let mode='warn',title='확인할 졸업요건이 있습니다.',sub='현재 입력값을 기준으로 부족한 학점과 체크 항목을 정리했습니다.';
  if(current.complete&&g.state==='pass'){
    mode='ok';title='현재 학점 요건 충족 / 현재 누적평점 기준 충족';sub='시험·교원자격·행정절차는 아래 남은 확인 항목과 상세 체크리스트를 함께 확인하십시오.';
  }else if(projected.complete){
    mode='plan';title=`${projectionLabel()} 학점 요건 충족 / ${g.state==='pass'?'현재 누적평점 기준 충족':g.state==='fail'?'현재 누적평점 기준 미충족':'현재 누적평점 확인 필요'}`;sub='계획 이수 후 누적평점은 성적 확정 후 확인합니다. 시험·교원자격·행정절차도 별도 확인이 필요합니다.';
  }
  const max=8,shown=actions.slice(0,max),extra=Math.max(0,actions.length-max);
  const list=shown.length?shown.map((a,i)=>`<div class="next-action ${esc(a.kind)}"><span class="next-action-num">${i+1}</span><span>${esc(a.text)}</span></div>`).join(''):`<div class="next-action ok"><span class="next-action-num">✓</span><span>현재 입력된 학점·평점·체크리스트 기준 추가 확인 항목이 없습니다.</span></div>`;
  wrap.innerHTML=`<div class="result-headline-card ${mode}"><div class="result-headline-kicker">현재 입력 기준</div><div class="result-headline-title">${esc(title)}</div><div class="result-headline-sub">${esc(sub)}</div></div><div class="next-actions-card"><div class="next-actions-head"><h3>지금 해야 할 일 · 현재 이수 기준</h3><span class="action-count">${actions.length}개</span></div><div class="next-action-list">${list}${extra?`<div class="muted" style="margin-top:3px">외 ${extra}개 항목은 상세 계산에서 확인할 수 있습니다.</div>`:''}</div></div>`;
}
function courseOfferingPattern(course){
  const code=canonicalCode(course?.courseCode),name=normName(course?.courseName);
  const rows=[...DATA.offerings,...DATA.globalOfferings].filter(r=>{
    if(code&&canonicalCode(r.courseCode)===code)return true;
    return !code&&name&&normName(r.courseName)===name;
  });
  const terms=[...new Set(rows.map(r=>r.term).filter(validTermValue))].sort((a,b)=>termIndex(a)-termIndex(b));
  if(!terms.length)return {terms:[],text:'학기별 개설표 수록 정보 없음',pattern:''};
  const labels=terms.map(t=>{
    const actual=rows.some(r=>r.term===t&&r.availability==='actual');
    return `${t} ${actual?'실제':'계획'}`;
  });
  const plannedTerms=terms.filter(t=>rows.some(r=>r.term===t&&r.availability!=='actual'));
  const sems=[...new Set(plannedTerms.map(t=>t.endsWith('-1')?'1':'2'))];
  const pattern=sems.length===1?`계획상 ${sems[0]}학기 중심`:sems.length>1?'계획상 1·2학기 모두':'';
  return {terms,text:`개설계획 수록 학기: ${labels.slice(-5).join(' · ')}`,pattern};
}
function plannedConflictWithCourse(course,term){
  const probe={term,courseCode:course.courseCode,courseName:course.courseName,professor:course.professor||'',day:course.day||'',timeRaw:course.timeRaw||'',room:course.room||''};
  const pr=timeRangeForPlanRecord(probe);if(!pr||!pr.day)return false;
  return currentScenario().planned.filter(r=>r.term===term).some(r=>{
    const rr=timeRangeForPlanRecord(r);return rr&&rr.day===pr.day&&Math.max(rr.start,pr.start)<Math.min(rr.end,pr.end);
  });
}
function gapCandidateTerms(){
  return [...new Set(DATA.offerings.map(o=>o.term).filter(validTermValue))]
    .filter(t=>termIndex(t)>=termIndex(DATA.snapshot))
    .sort((a,b)=>termIndex(a)-termIndex(b));
}
function gapCourseCanSatisfy(c,key){
  if((c.category||'unknown')===key)return true;
  return Array.isArray(c.categoryOptions)&&c.categoryOptions.includes(key);
}
function gapCatalogOfferingsForTerm(term,used){
  const major=state.profile.major;
  let list=DATA.offerings.filter(o=>o.major===major&&o.term===term);
  if(term===DATA.snapshot)list=[...list,...DATA.globalOfferings.filter(o=>o.term===term)];
  return list.filter(c=>c.availability!=='planned_missing_actual'&&!used.has(recordKey(c)));
}
function gapCandidateCountForTerm(term,deficits,used){
  const rows=gapCatalogOfferingsForTerm(term,used),seen=new Set();
  for(const d of deficits){
    for(const c of rows){
      if(!gapCourseCanSatisfy(c,d.key))continue;
      const k=recordKey(c);if(k)seen.add(k);
    }
  }
  return seen.size;
}
function gapTermKind(term){return term===DATA.snapshot?'확정':'예정';}
function gapCandidateCard(c,d,term,{special=false}={}){
  const pattern=courseOfferingPattern(c),conflict=special?false:plannedConflictWithCourse(c,term),schedule=scheduleInfo(c);
  const code=(c.sectionCodes||[])[0]||c.courseCode||'';
  const key=encodeURIComponent(`${term}|${canonicalCode(c.courseCode)}|${normName(c.courseName)}|${d.key}`);
  const dataBadge=special
    ? `<span class="mini-tag">별도 등록과목</span>`
    : c.availability==='actual'
      ? `<span class="mini-tag good">실제개설</span>`
      : `<span class="mini-tag">개설계획</span>`;
  const timing=special
    ? `<div class="gap-special-note">${c.targetSemester?`권장/기준 시점: ${esc(c.targetSemester)} · `:''}학기별 개설예정표와 별도로 관리되는 과목입니다.</div>`
    : `<div class="offering-pattern">${esc(pattern.text)}${pattern.pattern?` <span class="pattern-chip">${esc(pattern.pattern)}</span>`:''}</div>`;
  return `<div class="gap-candidate">
    <div class="gap-candidate-top">
      <div>
        <div class="gap-candidate-name">${esc(c.courseName)}</div>
        <div class="gap-candidate-meta">${esc(code)}${c.professor?` · ${esc(c.professor)}`:''}${c.day?` · ${esc(c.day)} ${esc(schedule.time)}`:''}</div>
      </div>
      ${special?'':`<span class="mini-tag ${conflict?'warn':'good'}">${conflict?'시간충돌':'충돌 없음'}</span>`}
    </div>
    <div class="gap-candidate-tags">
      <span class="mini-tag">${esc(CATEGORY_LABELS[d.key]||d.label)}</span>
      <span class="mini-tag">${fmtCredits(c.credits??defaultCredit(term,d.key,c.courseCode))}학점</span>
      ${dataBadge}
    </div>
    ${timing}
    <button class="btn small gap-add-btn" type="button" data-gap-key="${key}" ${conflict?'title="현재 계획과 시간이 겹칩니다."':''}>${esc(term)} 계획에 추가</button>
  </div>`;
}
function renderGapCandidates(){
  const box=document.getElementById('planGapCandidates');if(!box)return;
  if(!state.profileConfirmed||!state.history.length){box.innerHTML='';return;}
  const current=evaluate(state.history.filter(r=>r.passed!==false));
  const gapPriority={major_required:0,major_elective:1,teaching:2,common:3};
  const deficits=current.requirements
    .filter(r=>r.key!=='total'&&r.current<r.min)
    .sort((a,b)=>(gapPriority[a.key]??99)-(gapPriority[b.key]??99));
  if(!deficits.length){
    box.innerHTML=`<h3>부족요건 충족 후보</h3><div class="muted">현재 학점 요건에서 부족한 종별이 없어 별도 후보를 표시하지 않습니다.</div>`;
    return;
  }
  const used=new Set([...state.history,...currentScenario().planned].map(r=>recordKey(r)).filter(Boolean));
  const terms=gapCandidateTerms();
  const planTerm=document.getElementById('planTerm')?.value||DATA.snapshot;
  if(!gapCandidateTerm||!terms.includes(gapCandidateTerm))gapCandidateTerm=terms.includes(planTerm)?planTerm:(terms[0]||DATA.snapshot);
  const term=gapCandidateTerm;
  const tabs=terms.map(t=>{
    const count=gapCandidateCountForTerm(t,deficits,used);
    return `<button class="gap-term-tab ${t===term?'active':''}" type="button" role="tab" aria-selected="${t===term?'true':'false'}" data-gap-term="${esc(t)}">
      <span>${esc(t)}</span><span class="term-kind">${gapTermKind(t)==='확정'?'확정':'예정'}</span><span class="term-count">${count}</span>
    </button>`;
  }).join('');

  const offered=gapCatalogOfferingsForTerm(term,used);
  const groups=[];
  for(const d of deficits){
    const candidates=offered.filter(c=>gapCourseCanSatisfy(c,d.key)).slice(0,8);
    if(!candidates.length)continue;
    groups.push(`<div class="gap-candidate-group">
      <div class="gap-candidate-group-title"><span>${esc(d.label)}</span><span class="mini-tag warn">부족 ${fmtCredits(d.min-d.current)}${esc(d.unit)}</span></div>
      <div class="gap-candidate-grid">${candidates.map(c=>gapCandidateCard(c,d,term)).join('')}</div>
    </div>`);
  }

  const specialGroups=[];
  for(const d of deficits){
    const candidates=DATA.specialCourses.filter(c=>gapCourseCanSatisfy(c,d.key)&&!used.has(recordKey(c)));
    if(!candidates.length)continue;
    specialGroups.push(`<div class="gap-candidate-group">
      <div class="gap-candidate-group-title"><span>${esc(d.label)}</span><span class="mini-tag warn">부족 ${fmtCredits(d.min-d.current)}${esc(d.unit)}</span></div>
      <div class="gap-candidate-grid">${candidates.map(c=>gapCandidateCard(c,d,term,{special:true})).join('')}</div>
    </div>`);
  }

  const selectedKind=gapTermKind(term);
  const note=selectedKind==='확정'
    ? `${term}은 현재 데이터팩의 <b>확정 시간표</b> 기준입니다.`
    : `${term}은 <b>5학기 개설예정표의 예정 데이터</b>입니다. 실제 개설 시 변경될 수 있습니다.`;
  box.innerHTML=`
    <div class="gap-candidate-head">
      <div><h3>부족요건 충족 후보</h3><div class="muted">학기 탭을 눌러 부족한 요건을 채울 수 있는 과목을 확인하세요. 전공필수 → 전공선택 → 교직 → 공통 순으로 표시합니다.</div></div>
    </div>
    <div class="gap-term-tabs" role="tablist" aria-label="부족요건 후보 학기 선택">${tabs}</div>
    <div class="gap-term-note">${note} 숫자는 해당 학기에 현재 부족요건과 연결되는 <b>미이수 후보 과목 수</b>입니다. 추천이나 개설 보장이 아니며 실제 수강편람을 최종 확인하십시오.</div>
    ${groups.length?groups.join(''):`<div class="gap-term-empty"><b>${esc(term)}</b>에는 현재 부족요건에 해당하는 정규 개설 후보를 찾지 못했습니다. 다른 학기 탭을 눌러 확인해 보세요.</div>`}
    ${specialGroups.length?`<div class="gap-special-wrap"><div class="gap-special-title">학기별 개설표와 별도로 관리되는 요건 과목</div>${specialGroups.join('')}</div>`:''}
  `;
  box.querySelectorAll('[data-gap-term]').forEach(btn=>btn.onclick=()=>{
    gapCandidateTerm=btn.dataset.gapTerm;
    const planSel=document.getElementById('planTerm');
    if(planSel&&[...planSel.options].some(o=>o.value===gapCandidateTerm)){
      planSel.value=gapCandidateTerm;
      refreshPlanCourse();applyPlanSelection();renderPlanTimetable();renderPlanWarnings();
    }
    renderGapCandidates();
  });
  box.querySelectorAll('.gap-add-btn').forEach(btn=>btn.onclick=()=>addGapCandidate(btn.dataset.gapKey));
}
function addGapCandidate(encoded){
  let raw='';try{raw=decodeURIComponent(encoded||'');}catch(e){raw=encoded||'';}
  const [term,code,name,category]=raw.split('|');
  const targetTerm=validTermValue(term)?term:(document.getElementById('planTerm')?.value||DATA.snapshot);
  const c=offeringsForTerm(targetTerm,'mine').find(x=>(code&&canonicalCode(x.courseCode)===code)||(!code&&normName(x.courseName)===name));
  if(!c)return alert('선택한 학기의 개설 데이터에서 해당 과목을 다시 찾지 못했습니다.');
  if(c.availability==='planned_missing_actual')return alert('실제 개설이 확인되지 않은 과목은 계획에 바로 추가할 수 없습니다.');
  const candidate={id:uid('p'),term:targetTerm,courseCode:canonicalCode(c.courseCode),sectionCode:(c.sectionCodes||[])[0]||'',courseName:c.courseName,category:category||recommendedCategory(c),credits:Number((category==='common'||category==='audit')?0:(c.credits??defaultCredit(targetTerm,category,c.courseCode))),availability:c.availability,source:'gap_candidate',professor:c.professor||'',day:c.day||'',timeRaw:c.timeRaw||'',room:c.room||''};
  const sc=currentScenario(),key=planRecordKey(candidate);
  if(sc.planned.some(r=>planRecordKey(r)===key))return alert('같은 학기의 동일 과목이 이미 계획에 등록되어 있습니다.');
  sc.planned.push(candidate);sc.planned=dedupePlannedRecords(sc.planned);save();
  const planSel=document.getElementById('planTerm');
  if(planSel&&[...planSel.options].some(o=>o.value===targetTerm))planSel.value=targetTerm;
  gapCandidateTerm=targetTerm;
  render();
}

function renderQualificationNotes(){
  const curQ=qualificationCounts(state.history),projQ=qualificationCounts(planCombinedRecords());
  const lifelongActive=curQ.lifelong>0||projQ.lifelong>0;
  const lifelongNote=document.getElementById('lifelongNote');
  if(lifelongNote)lifelongNote.innerHTML=lifelongActive?`<div class="qualification-note"><b>평생교육사 안내</b> · 필수과목 이수 외에도 학습성적 평균 80점 이상과 법정 평생교육기관에서 4주 이상의 현장실습이 필요합니다. 평생교육실습은 실습과목을 제외한 필수과목 3과목 이수 후 신청할 수 있습니다.</div>`:'';
  const notes=[];
  if(teacherTrackEnabled())notes.push(`<div class="qualification-note"><b>교원자격 안내</b> · SPT 교직이론·소양 과목은 2학점이며 자격증 취득 희망자는 선수 종별로 수강합니다. 아래 ‘교원자격 이수 체크리스트’에서 비수강 요건도 함께 관리할 수 있습니다.</div>`);
  document.getElementById('qualificationNotes').innerHTML=notes.join('');
}
function teacherCardHtml(label,value,note,status='pending',projectedValue=null){
  return `<div class="teacher-auto-card teacher-${status}">
    <div class="teacher-card-heading"><span>${esc(label)}</span>${requirementBadge(status)}</div>
    ${projectedValue==null?`<b>${esc(value)}</b>`:comparisonValues(value,projectedValue)}
    ${note?`<span class="teacher-card-note">${esc(note)}</span>`:''}
  </div>`;
}
function teacherAcademicSatisfied(m){
  return m.isCounselor1?m.counselor1EligibilitySatisfied&&m.basicSatisfied:
    m.totalMajorCredits>=50&&m.basicSatisfied&&(!m.pedagogyRequired||m.totalPedagogyCredits>=6)&&m.theoryCurrent>=m.target.theory&&m.literacyCurrent>=m.target.literacy&&m.practiceSatisfied&&m.volunteerSatisfied;
}

function renderTeacherChecklist(){
  const section=document.getElementById('teacherChecklistSection');
  if(!section)return;
  const enabled=teacherTrackEnabled();
  section.style.display=enabled?'block':'none';
  if(enabled&&section.dataset.wasEnabled!=='true')section.open=true;
  section.dataset.wasEnabled=String(enabled);
  if(!enabled)return;

  const majorRule=certificateMajorRule();
  if(majorRule&&!majorRule.variants?.some(v=>v.id===state.profile.teacherCertificateVariant))state.profile.teacherCertificateVariant=majorRule.defaultVariant||majorRule.variants?.[0]?.id||'';
  const current=teacherRequirementModel(state.history);
  const projected=teacherRequirementModel(planCombinedRecords());
  const t=state.teacherChecklist||{};

  const variantWrap=document.getElementById('teacherCertificateVariantWrap');
  if(variantWrap){
    if((majorRule?.variants||[]).length>1){
      variantWrap.innerHTML=`<div><label>취득 예정 자격</label><select id="teacherCertificateVariantSelect">${majorRule.variants.map(v=>`<option value="${esc(v.id)}" ${v.id===state.profile.teacherCertificateVariant?'selected':''}>${esc(v.label)}</option>`).join('')}</select></div><div class="muted">자격종류에 따라 기본이수 관리번호 조건이 달라집니다.</div>`;
      document.getElementById('teacherCertificateVariantSelect').onchange=e=>{state.profile.teacherCertificateVariant=e.target.value;save();renderChecklistResults();};
    }else{
      variantWrap.innerHTML=`<div><label>취득 예정 자격/표시과목</label><div class="callout" style="padding:9px 11px">${esc(current.variant?.label||state.profile.major)}</div></div><div class="muted">2026-06-17 전공별 기본이수·교과교육표 기준</div>`;
    }
  }

  const isCounselor1=projected.isCounselor1;
  const commonCfg=CERT_RULES.commonMandatory||{};
  const requiredAptitude=Number(commonCfg.aptitudeCount||2),requiredCpr=Number(commonCfg.cprCount||2),requiredGender=Number(commonCfg.genderCount||2);
  const cards=[];
  const basicLabel=teacherBasicRuleLabel(projected.basicRule,projected.variant);
  const compareCard=(label,value,ok,note)=>teacherCardHtml(label,value(current),note,requirementState(ok(current),ok(projected)),value(projected));
  if(isCounselor1){
    cards.push(teacherCardHtml('기존 교원자격',current.hasLicense?'확인':'필수 확인','정교사(2급) 이상 등 공식 인정 자격요건 확인',current.hasLicense?'ok':'bad'));
    cards.push(teacherCardHtml('입학 전 교육경력',`${current.counselor1ExperienceYears.toFixed(current.counselor1ExperienceYears%1?1:0)} / ${Number(current.eligibility?.minPreAdmissionTeachingYears||3)}년`,'교육대학원 재학 중 경력은 포함하지 않음',current.counselor1ExperienceYears>=Number(current.eligibility?.minPreAdmissionTeachingYears||3)?'ok':'bad'));
    cards.push(compareCard('전문상담 교과목',m=>`${m.basicCourseCount}영역`,m=>m.basicSatisfied,`${basicLabel} · 기타 인정 ${current.externalBasicCount}영역 포함`));
  }else{
    cards.push(compareCard('전공학점',m=>`${m.totalMajorCredits} / 50학점`,m=>m.totalMajorCredits>=50,`학부 인정 ${Number(t.recognizedMajorCredits||0)}학점 포함`));
    cards.push(compareCard('기본이수',m=>`${m.basicCourseCount}과목 · ${m.basicCredits}학점`,m=>m.basicSatisfied,`${basicLabel} · 학부·기타 ${current.externalBasicCount}과목/${current.externalBasicCredits}학점 포함`));
    if(projected.pedagogyRequired)cards.push(compareCard('교과교육',m=>`${m.totalPedagogyCredits} / 6학점`,m=>m.totalPedagogyCredits>=6,`공식 학정코드 자동 계산 + 기타 인정 ${Number(t.recognizedPedagogyCredits||0)}학점`));
    else cards.push(teacherCardHtml('교과교육','이수 대상 아님','사서·영양·전문상담 등 교과교육 이수가 요구되지 않는 유형','exempt'));
    cards.push(compareCard('교직이론',m=>m.theoryExempt?'면제 대상':`${m.theoryCurrent} / ${m.target.theory}과목`,m=>m.theoryCurrent>=m.target.theory,current.theoryExempt?'2급 이상 교원자격증 보유 · 면제 대상 반영':`학부 인정 ${Number(t.recognizedTheoryCount||0)}과목 포함`));
    cards.push(compareCard('교직소양',m=>m.literacyExempt?'면제 대상':`${m.literacyCurrent} / ${m.target.literacy}과목`,m=>m.literacyCurrent>=m.target.literacy,current.literacyExempt?'2급 이상 교원자격증 보유 · 면제 대상 반영':`입학연도 기준 ${current.target.literacy}과목 · 학부 인정 ${Number(t.recognizedLiteracyCount||0)}과목 포함`));
    cards.push(compareCard('학교현장실습',m=>m.practiceExempt?'면제 대상':m.practiceSatisfied?'요건 충족':'미이수',m=>m.practiceSatisfied,current.practiceExempt?'교원자격증 소지자 면제범위':t.practiceExemptApproved?'면제/대체 승인 입력됨':'교육실습 이수 또는 면제/대체 승인 필요 · 계획 등록은 실제 이수가 아님'));
    cards.push(teacherCardHtml('교육봉사',current.volunteerExempt?'면제 대상':`${Number(t.volunteerHours||0)} / 60시간`,current.volunteerExempt?'교원자격증 소지자 면제범위':'60시간 이수 후 서류 제출',current.volunteerSatisfied?'ok':'bad'));
    const scoreCard=(label,value,min)=>{
      const status=value==null?'pending':value>=min?'ok':'bad';
      const detail=value==null?'성적을 입력해 주세요.':value<min?`기준보다 ${(min-value).toFixed(2)}점 부족합니다.`:'현재 입력 성적이 기준을 충족합니다.';
      return teacherCardHtml(label,value==null?'미입력':`${value.toFixed(2)} / 100`,`기준: 100점 만점 ${min}점 이상. ${detail} 승인·확인된 환산값을 입력하며, 계획 과목의 성적은 예측하지 않습니다.`,status);
    };
    cards.push(scoreCard('교직 평균성적',current.teachingAvg,80));
    cards.push(scoreCard('전공 평균성적',current.majorAvg,75));
  }
  document.getElementById('teacherChecklistAuto').innerHTML=cards.join('');
  const evidence=document.getElementById('teacherEvidenceDetails');if(evidence)evidence.innerHTML=teacherEvidenceHtml();

  const ruleNotice=document.getElementById('teacherRuleNotice');
  if(ruleNotice){
    ruleNotice.innerHTML=isCounselor1
      ? `<b>전문상담교사 1급 자격요건</b> · 기존 교원자격 요건과 <b>입학 전 교육경력 ${Number(projected.eligibility?.minPreAdmissionTeachingYears||3)}년 이상</b>을 별도로 확인합니다. 재학 중 경력은 포함하지 않습니다. 적성·인성, CPR, 성인지교육은 각각 2회 이수해야 합니다.`
      : `<b>교원자격 공통 안내</b> · 2급 이상 교원자격증 소지자는 교직이론·교직소양·학교현장실습·교육봉사 면제 대상입니다. 다만 <b>교직적성·인성검사, 응급처치·심폐소생술, 성인지교육은 각각 2회</b>이며 기존 자격증 소지자·현직교원도 포함됩니다.`;
  }
  document.querySelectorAll('.teacher-secondary-only').forEach(el=>el.style.display=isCounselor1?'none':'');
  const expWrap=document.getElementById('teacherCounselor1ExperienceWrap');if(expWrap)expWrap.style.display=isCounselor1?'block':'none';
  const specialWrap=document.getElementById('teacherBasicSpecialConfirmedWrap');
  if(specialWrap)specialWrap.style.display=projected.basicRule?.type==='groups'?'flex':'none';

  const ids={
    teacherRelatedMajorConfirmed:['relatedMajorConfirmed','bool'],teacherApplicationSubmitted:['applicationSubmitted','bool'],teacherRecognizedMajorCredits:['recognizedMajorCredits','number'],teacherRecognizedPedagogyCredits:['recognizedPedagogyCredits','number'],teacherBasicCourseCount:['basicCourseCount','number'],teacherBasicCredits:['basicCredits','number'],teacherBasicSpecialConfirmed:['basicSpecialConfirmed','bool'],teacherRecognizedTheoryCount:['recognizedTheoryCount','number'],teacherRecognizedLiteracyCount:['recognizedLiteracyCount','number'],teacherPracticeExemptApproved:['practiceExemptApproved','bool'],teacherVolunteerHours:['volunteerHours','number'],teacherTeachingAverage100:['teachingAverage100','nullableNumber'],teacherMajorAverage100:['majorAverage100','nullableNumber'],teacherCounselor1ExperienceYears:['counselor1ExperienceYears','number'],teacherAptitudeCount:['aptitudeCount','number'],teacherCprCount:['cprCount','number'],teacherGenderCount:['genderCount','number'],teacherNoExamSubmitted:['noExamSubmitted','bool'],teacherDrugCertificateSubmitted:['drugCertificateSubmitted','bool']
  };
  for(const [id,[key,type]] of Object.entries(ids)){
    const el=document.getElementById(id);if(!el)continue;
    if(type==='bool')el.checked=!!t[key];else if(type==='nullableNumber')el.value=t[key]==null?'':t[key];else el.value=Number(t[key]||0);
    el.onchange=()=>{if(type==='bool')state.teacherChecklist[key]=el.checked;else if(type==='nullableNumber')state.teacherChecklist[key]=el.value===''?null:Number(el.value);else state.teacherChecklist[key]=Math.max(0,Number(el.value||0));save();renderChecklistResults();};
  }

  const relatedOk=!!t.relatedMajorConfirmed,appOk=!!t.applicationSubmitted,aptitudeOk=Number(t.aptitudeCount||0)>=requiredAptitude,cprOk=Number(t.cprCount||0)>=requiredCpr,genderOk=Number(t.genderCount||0)>=requiredGender,noExamOk=!!t.noExamSubmitted,drugOk=!!t.drugCertificateSubmitted;
  const academicState=requirementState(teacherAcademicSatisfied(current),teacherAcademicSatisfied(projected));
  const scoreOk=current.teachingAvg!=null&&current.teachingAvg>=80&&current.majorAvg!=null&&current.majorAvg>=75,commonOk=aptitudeOk&&cprOk&&genderOk;
  const summary=document.getElementById('teacherChecklistSummary');
  if(summary){
    const item=(ok,label,pending=false)=>`<span class="${pending?'pending':ok?'ok':'bad'}">${ok?'✓':'•'} ${label}</span>`;
    if(isCounselor1){
      summary.innerHTML=[item(current.counselor1EligibilitySatisfied,'기존자격·입학 전 경력'),item(appOk,'교직과정 이수신청'),`<span class="${requirementState(current.basicSatisfied,projected.basicSatisfied)}">전문상담 교과목 · ${requirementStateLabel(requirementState(current.basicSatisfied,projected.basicSatisfied))}</span>`,item(commonOk,'적성·인성/CPR/성인지 공통필수'),item(noExamOk,'무시험검정원서'),item(drugOk,'약물중독 관련 진단서/검사결과')].join(' &nbsp;·&nbsp; ')+`<div class="muted" style="margin-top:6px">※ 전문상담교사 1급의 자격·경력 요건은 공식 자격증 안내를 함께 확인하십시오. 교과목 자동판정은 2026-06-17 기본이수표 학정코드를 기준으로 합니다.</div>`;
    }else{
      const scorePending=current.teachingAvg==null||current.majorAvg==null;
      summary.innerHTML=[item(relatedOk,'관련전공/표시과목 확인'),item(appOk,'교직과정 이수신청'),`<span class="${academicState}">교과목·학점 요건 · ${requirementStateLabel(academicState)}</span>`,item(scoreOk,'성적기준',scorePending),item(commonOk,'적성·인성/CPR/성인지 공통필수'),item(noExamOk,'무시험검정원서'),item(drugOk,'약물중독 관련 진단서/검사결과')].join(' &nbsp;·&nbsp; ')+`<div class="muted" style="margin-top:6px">※ 기본이수 자동판정은 이 PDF의 교육대학원 개설 학정코드에 한합니다. 학부에서 인정받은 과목이나 코드가 없는 관리번호는 개인별 승인결과를 함께 확인하십시오.</div>`;
    }
  }
}
function renderGraduationChecklist(){
  const section=document.getElementById('graduationChecklistSection');if(!section)return;
  const enabled=state.profile.track!=='research'&&!!state.profileConfirmed&&state.history.length>0;
  section.style.display=enabled?'block':'none';if(!enabled)return;
  const cfg=CERT_RULES?.graduationExam||{};const g=state.graduationChecklist||defaultState().graduationChecklist;
  const comprehensive=document.getElementById('graduationComprehensivePassed');
  comprehensive.value=Math.max(0,Math.min(Number(cfg.comprehensive?.requiredPassedCourses||2),Number(g.comprehensivePassed||0)));
  comprehensive.onchange=()=>{state.graduationChecklist.comprehensivePassed=Math.max(0,Math.min(2,Number(comprehensive.value||0)));save();renderChecklistResults();};
  const englishRequired=(cfg.englishRequiredMajors||[]).includes(state.profile.major);
  const ew=document.getElementById('graduationEnglishWrap'),es=document.getElementById('graduationEnglishStatus');
  ew.style.display=englishRequired?'block':'none';es.value=g.englishStatus||'pending';
  es.onchange=()=>{state.graduationChecklist.englishStatus=es.value;save();renderChecklistResults();};
  const compOk=Number(g.comprehensivePassed||0)>=Number(cfg.comprehensive?.requiredPassedCourses||2);
  const engOk=!englishRequired||['passed','replaced'].includes(g.englishStatus);
  const status=document.getElementById('graduationExamStatus'),note=document.getElementById('graduationExamNote');
  status.className=compOk&&engOk?'grad-ok':'grad-pending';status.textContent=compOk&&engOk?'시험 요건 체크 완료':'확인 필요';
  note.textContent=`종합시험 ${Number(g.comprehensivePassed||0)}/${Number(cfg.comprehensive?.requiredPassedCourses||2)}과목${englishRequired?` · 전공영어 ${g.englishStatus==='passed'?'합격':g.englishStatus==='replaced'?'대체':'미확인'}`:''}`;
}
function renderRequirements(){
  const {current,projected}=evaluateBoth(),cohort=getCohort(),rule=getRule();
  const g=gpaRequirementStatus(state.history);
  const reqs=projected.requirements.map(pr=>{
    const cr=current.requirements.find(x=>x.key===pr.key)||{current:0};
    const status=requirementState(cr.current>=pr.min,pr.current>=pr.min);
    return [pr.label,`${fmtCredits(cr.current)} ${pr.unit}`,`${fmtCredits(pr.current)} ${pr.unit}`,`최소 ${fmtCredits(pr.min)}${pr.unit} 이상 · ${requirementBadge(status)}`];
  });
  const gStatus=g.state==='pass'?'ok':g.state==='fail'?'bad':'pending';
  reqs.push(['현재 누적평점',g.gpa==null?'-':`${fmtGpa(g.gpa)} / 4.3`,'성적 확정 후 확인',`B0(3.00) 이상 · ${requirementBadge(gStatus)}`]);
  const rows=[['요건','현재',projectionLabel(),'기준/평가'],...reqs];
  document.getElementById('requirementsGrid').innerHTML=rows.flat().map(x=>`<div>${x}</div>`).join('');
  const shortages=projected.requirements.filter(pr=>pr.current<pr.min).map(pr=>`${pr.label} ${fmtCredits(pr.min-pr.current)}${pr.unit}`);
  if(projected.unknowns.length)shortages.push(`종별 확인 필요 ${projected.unknowns.length}건`);
  const creditComplete=projected.complete&&projected.unknowns.length===0;
  const gpaText=g.state==='pass'?'현재 누적평점 기준 충족':g.state==='fail'?'현재 누적평점 기준 미충족':g.state==='incomplete'?'현재 누적평점 확인 필요 · 성적 일부 미입력':'현재 누적평점 확인 필요 · 평점자료 없음';
  document.getElementById('evaluationNotes').innerHTML=`<div class="result-summary ${creditComplete&&g.state==='pass'?'ok':'bad'}"><b>${projectionLabel()} 학점 요건 ${creditComplete?'충족':'미충족'} / ${gpaText}</b>${shortages.length?`<div>계획 반영 후 추가 확인: ${shortages.join(' · ')}</div>`:''}</div>
    <div class="muted" style="margin-top:7px">계획 이수 후 누적평점은 성적 확정 후 확인합니다. 종합시험, 개별논문지도 진행요건, 연구윤리, 논문·졸업연구보고서 심사 등 별도 학사절차는 학점 계산의 자동 판정 대상이 아닙니다.</div>`;
}

function renderHistory(){
  const body=document.getElementById('historyBody');
  if(!state.history.length){
    body.innerHTML=`<tr><td colspan="7" class="empty">입력된 기존 수강이력이 없습니다.</td></tr>`;
    const switchNote=document.getElementById('historySwitchableNotice');
    if(switchNote)switchNote.innerHTML='';
    renderSemesterGpa();
    return;
  }
  body.innerHTML=state.history.map((r,i)=>{
    const st=courseStatusForHistory(r);
    const badge=st==='match'?`<span class="badge match">카탈로그 매칭</span>`:st==='major_teaching'?`<span class="badge match">전공교직 인식</span>`:st==='teaching_portal'?`<span class="badge match">교직 종별 인식</span>`:`<span class="badge manual">과거·폐지·미등재</span>`;
    const g=normalizeGrade(r.grade);
    const gp=gradePasses(g);
    const pass=r.passed===false?`<span class="badge missing">${g?`${esc(g)} · 미이수`:'NP/미이수'}</span>`:(g?`<span class="badge match">${esc(g)} · 이수</span>`:'');
    return `<tr>
      <td><select class="inline-select hist-term" data-i="${i}" style="min-width:92px">${academicTermOptionsHtml(r.term)}</select></td>
      <td>
        <div class="history-course-title">
          <span class="course-name">${esc(r.courseName)}</span>
          ${switchableMajorTeachingBadge(r)}
        </div>
        <div class="muted mono">${esc(r.courseCode||'코드 없음')}</div>
      </td>
      <td><select class="inline-select hist-cat" data-i="${i}">${categoryOptionsHtml(r.category)}</select></td>
      <td><input class="hist-credit" data-i="${i}" type="number" min="0" step="1" value="${Number(r.credits||0)}" style="width:72px;padding:6px"></td>
      <td><select class="inline-select hist-grade" data-i="${i}">${gradeOptionsHtml(g,true)}</select></td>
      <td><div class="statusline">${badge}${pass}</div></td>
      <td><button class="btn small danger hist-del" data-i="${i}">삭제</button></td></tr>`;
  }).join('');
  const switchNote=document.getElementById('historySwitchableNotice');
  if(switchNote){
    const hasSwitchable=state.history.some(isSwitchableMajorTeachingHistory);
    switchNote.innerHTML=hasSwitchable
      ? `<div class="callout warnbox" style="margin-top:10px"><b>전공교직 종별 변경 안내:</b> <b>전공교직으로 확인된 과목에 한해</b> 위 <b>종별</b> 드롭다운에서 <b>교직 ↔ 전공선택</b>으로 변경할 수 있습니다. 일반 교직과목은 전공선택으로 변경할 수 없습니다. 실제 인정 종별은 본인의 신청·학점인정 결과에 맞춰 선택하십시오. <a href="https://gse.yonsei.ac.kr/gse/board/notice.do?mode=view&articleNo=467321&article.offset=0&articleLimit=10&srSearchVal=%EC%A2%85%EB%B3%84+%EB%B3%80%EA%B2%BD" target="_blank" rel="noopener noreferrer"><b>종별 변경 공지 바로가기 ↗</b></a></div>`
      : '';
  }
  document.querySelectorAll('.hist-term').forEach(x=>x.onchange=()=>{
    const i=+x.dataset.i;
    const r=state.history[i];
    const nextTerm=x.value;
    const nextKey=historyRecordKey(nextTerm,r.courseCode,r.courseName);
    const duplicated=state.history.some((h,j)=>j!==i&&historyRecordKey(h.term,h.courseCode,h.courseName)===nextKey);
    if(duplicated){
      alert('해당 학기에 동일 과목이 이미 등록되어 있습니다.');
      render();
      return;
    }
    r.term=nextTerm;
    save();
    render();
  });
  document.querySelectorAll('.hist-cat').forEach(x=>x.onchange=()=>{state.history[+x.dataset.i].category=x.value;if(['common','audit'].includes(x.value))state.history[+x.dataset.i].credits=0;save();render();});
  document.querySelectorAll('.hist-credit').forEach(x=>x.onchange=()=>{state.history[+x.dataset.i].credits=Number(x.value||0);save();render();});
  document.querySelectorAll('.hist-grade').forEach(x=>x.onchange=()=>{
    const r=state.history[+x.dataset.i];
    r.grade=normalizeGrade(x.value);
    const p=gradePasses(r.grade);
    if(p!=null)r.passed=p;
    save();render();
  });
  document.querySelectorAll('.hist-del').forEach(x=>x.onclick=()=>{state.history.splice(+x.dataset.i,1);save();render();});
  renderSemesterGpa();
}
function renderSemesterGpa(){
  const grid=document.getElementById('semesterGpaGrid');
  if(!grid)return;
  const stats=semesterGpaStats(state.history);
  const total=gpaStats(state.history);
  const heading=document.querySelector('#historySection .semester-gpa-heading');
  // 수강이력이 없으면 학기별 평점·누적 GPA 영역 자체를 숨긴다
  if(!stats.length){
    if(heading)heading.style.display='none';
    grid.innerHTML='';
    const emptyPrintBox=document.getElementById('printSemesterGpaSummary');
    if(emptyPrintBox)emptyPrintBox.innerHTML='';
    return;
  }
  if(heading)heading.style.display='';
  const cards=stats.map(s=>{
    const complete=s.gpa!=null&&s.missingGradeCount===0;
    const ok=complete&&s.gpa>=CUMULATIVE_GPA_MIN;
    const status=s.gpa==null?'평점자료 없음':s.missingGradeCount>0?'성적 일부 미입력':ok?'B0(3.00) 이상':'B0(3.00) 미만';
    const badgeCls=s.gpa==null?'manual':s.missingGradeCount>0?'planned':ok?'match':'missing';
    const cls=complete?(ok?'grade-pass':'grade-fail'):'';
    return `<div class="semester-gpa-card">
      <div class="sg-head"><span class="term">${esc(displayAcademicTerm(s.term))}</span><span class="badge ${badgeCls}">${status}</span></div>
      <div class="sg-figures">
        <div class="sg-fig"><span class="muted">평점</span><b class="${cls}">${fmtGpa(s.gpa)}</b></div>
        <div class="sg-fig"><span class="muted">이수학점</span><b>${fmtCredits(s.earnedCredits)}</b></div>
      </div>
    </div>`;
  });
  const tComplete=total.gpa!=null&&total.missingGradeCount===0;
  const tOk=tComplete&&total.gpa>=CUMULATIVE_GPA_MIN;
  const tStatus=total.gpa==null?'평점자료 없음':total.missingGradeCount>0?'확인 필요':tOk?'B0(3.00) 이상':'B0(3.00) 미만';
  const tBadge=total.gpa==null?'manual':total.missingGradeCount>0?'planned':tOk?'match':'missing';
  cards.push(`<div class="semester-gpa-card cumulative-card">
    <div class="sg-head"><span class="term">누적 GPA</span><span class="badge ${tBadge}">${tStatus}</span></div>
    <div class="sg-figures">
      <div class="sg-fig"><span class="muted">전체 평점</span><b class="${tComplete?(tOk?'grade-pass':'grade-fail'):''}">${fmtGpa(total.gpa)} <span class="sg-scale">/ 4.3</span></b></div>
    </div>
  </div>`);
  grid.innerHTML=cards.join('');
  const printBox=document.getElementById('printSemesterGpaSummary');
  if(printBox){
    const items=stats.map(s=>{
      const g=s.gpa==null?'-':fmtGpa(s.gpa);
      return `<span class="print-gpa-item"><b>${esc(displayAcademicTerm(s.term))}</b> ${g} · ${fmtCredits(s.earnedCredits)}학점</span>`;
    }).join('');
    const totalStatus=total.gpa==null?'평점자료 없음':total.missingGradeCount>0?'확인 필요':total.gpa>=CUMULATIVE_GPA_MIN?'B0(3.00) 이상':'B0(3.00) 미만';
    printBox.innerHTML=`<span class="print-gpa-title">학기별 평점</span>${items}<span class="print-gpa-total">누적 ${fmtGpa(total.gpa)} / 4.3 · ${totalStatus}</span>`;
  }
}
function renderPlanSettings(){
  const defaults=defaultState().scheduleSettings;
  const s={...defaults,...(state.scheduleSettings||{})};
  const panel=document.getElementById('planSettingsPanel');
  if(!panel)return;
  const gridOptions=[30,60,120].map(v=>`<option value="${v}" ${Number(s.gridMinutes)===v?'selected':''}>${v===60?'1시간':v===120?'2시간':'30분'}</option>`).join('');
  panel.innerHTML=`<div class="settings-grid">
    <div>
      <label>시간표 범례</label>
      <div class="settings-range-grid">
        <div><label>시작</label><select id="timetableStart">${timeSelectOptions(s.timetableStart)}</select></div>
        <div><label>종료</label><select id="timetableEnd">${timeSelectOptions(s.timetableEnd)}</select></div>
        <div><label>구분선 단위</label><select id="gridMinutes">${gridOptions}</select></div>
      </div>
    </div>
    <div><label>시간표 표시 요일</label><div class="day-checks">${['월','화','수','목','금'].map(d=>`<label><input type="checkbox" class="schedule-day" value="${d}" ${s.days.includes(d)?'checked':''}> ${d}</label>`).join('')}</div></div>
    <div class="period-settings-grid">
      <div class="period-setting">
        <div class="period-setting-title">1·2교시</div>
        <div class="period-time-pair">
          <div><label>시작</label><select id="slot1Start">${timeSelectOptions(s.slot1Start)}</select></div>
          <div><label>종료</label><select id="slot1End">${timeSelectOptions(s.slot1End)}</select></div>
        </div>
      </div>
      <div class="period-setting">
        <div class="period-setting-title">3·4교시</div>
        <div class="period-time-pair">
          <div><label>시작</label><select id="slot2Start">${timeSelectOptions(s.slot2Start)}</select></div>
          <div><label>종료</label><select id="slot2End">${timeSelectOptions(s.slot2End)}</select></div>
        </div>
      </div>
      <div class="period-setting">
        <div class="period-setting-title">평생교육사</div>
        <div class="period-time-pair">
          <div><label>시작</label><select id="lifelongStart">${timeSelectOptions(s.lifelongStart)}</select></div>
          <div><label>종료</label><select id="lifelongEnd">${timeSelectOptions(s.lifelongEnd)}</select></div>
        </div>
      </div>
    </div>
  </div>`;
  panel.querySelectorAll('input,select').forEach(el=>el.onchange=()=>{
    const days=[...panel.querySelectorAll('.schedule-day:checked')].map(x=>x.value);
    let timetableStart=document.getElementById('timetableStart').value||'17:00';
    let timetableEnd=document.getElementById('timetableEnd').value||'23:00';
    if(hhmmToMinutes(timetableEnd)<=hhmmToMinutes(timetableStart)){
      alert('시간표 종료시간은 시작시간보다 뒤여야 합니다.');
      timetableStart=s.timetableStart||'17:00';
      timetableEnd=s.timetableEnd||'23:00';
    }
    state.scheduleSettings={
      days:days.length?days:['월','화','수','목','금'],
      timetableStart,timetableEnd,
      gridMinutes:Number(document.getElementById('gridMinutes').value||60),
      slot1Start:document.getElementById('slot1Start').value||'18:20',
      slot1End:document.getElementById('slot1End').value||'20:00',
      slot2Start:document.getElementById('slot2Start').value||'20:10',
      slot2End:document.getElementById('slot2End').value||'21:50',
      lifelongStart:document.getElementById('lifelongStart').value||'18:20',
      lifelongEnd:document.getElementById('lifelongEnd').value||'21:00'
    };
    save();
    renderPlanSettings();
    renderPlanTimetable();
    renderTimetable();
    renderCatalog();
  });
}
function buildPlanScheduleModel(records,settings){
  const days=settings.days||['월','화','수','목','금'];
  const placed=[],unplaced=[],outOfRange=[];
  const rangeStart=hhmmToMinutes(settings.timetableStart||'17:00');
  const rangeEnd=hhmmToMinutes(settings.timetableEnd||'23:00');
  for(const r of records){
    const o=offeringForPlanRecord(r)||r;
    const day=o.day||r.day||'', si=scheduleInfoWithSettings(o,settings);
    const tm=String(si.time||'').match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    if(!day||!days.includes(day)||!tm){unplaced.push({r,o});continue;}
    const start=Number(tm[1])*60+Number(tm[2]),end=Number(tm[3])*60+Number(tm[4]);
    const item={r,o,day,si,start,end};
    if(end<=rangeStart||start>=rangeEnd)outOfRange.push(item);
    else placed.push(item);
  }
  return {days,placed,unplaced,outOfRange,rangeStart,rangeEnd};
}
function scheduleInfoWithSettings(o,settings){
  const raw=[o?.timeRaw||'',o?.sectionTitle||''].filter(Boolean).join('\n');
  const explicit=explicitRawTime(o);
  if(explicit){const start=hhmmToMinutes(explicit.split('–')[0]);return {order:start,label:explicit,time:explicit};}
  if(isLifelongCourse(o)&&(o?.day==='수'||o?.day==='금')){const time=`${settings.lifelongStart}–${settings.lifelongEnd}`;return {order:hhmmToMinutes(settings.lifelongStart),label:time,time};}
  if(/(?:^|[-\s])1\s*[,·]\s*2(?:교시)?/.test(raw)||(/6:20/.test(raw)&&/8:00/.test(raw))){const time=`${settings.slot1Start}–${settings.slot1End}`;return {order:hhmmToMinutes(settings.slot1Start),label:'1·2교시',time};}
  if(/(?:^|[-\s])3\s*[,·]\s*4(?:교시)?/.test(raw)||(/8:10/.test(raw)&&/9:50/.test(raw))){const time=`${settings.slot2Start}–${settings.slot2End}`;return {order:hhmmToMinutes(settings.slot2Start),label:'3·4교시',time};}
  return {order:9999,label:'시간 미정',time:'시간 미정'};
}
let PRINT_MODE=false;
function timelineHtmlFromItems(items,settings){
  const days=settings.days||['월','화','수','목','금'];
  const rangeStart=hhmmToMinutes(settings.timetableStart||'17:00');
  const rangeEnd=hhmmToMinutes(settings.timetableEnd||'23:00');
  const unit=Math.max(15,Number(settings.gridMinutes||60));
  const total=Math.max(60,rangeEnd-rangeStart);
  const pxPerMinute=(PRINT_MODE?32:64)/60;
  const bodyHeight=PRINT_MODE?Math.max(190,Math.round(total*pxPerMinute)):Math.max(240,Math.round(total*pxPerMinute));
  const timeCol=58;
  const colWidth=`calc((100% - ${timeCol}px) / ${Math.max(1,days.length)})`;

  const ticks=[];
  for(let t=rangeStart;t<=rangeEnd;t+=unit)ticks.push(t);
  if(ticks[ticks.length-1]!==rangeEnd)ticks.push(rangeEnd);

  const gridLines=ticks.map((t,i)=>{
    const y=((t-rangeStart)/total)*bodyHeight;
    const cls=i===0||i===ticks.length-1?' major':'';
    const labelClass=i===0?' first':i===ticks.length-1?' last':'';
    return `<div class="timeline-gridline${cls}" style="top:${y}px"></div><div class="timeline-time-label${labelClass}" style="top:${y}px">${minutesToHHMM(t)}</div>`;
  }).join('');

  const dayCols=days.map((day,di)=>{
    const left=`calc(${timeCol}px + ${di} * ${colWidth})`;
    const courses=items.filter(x=>x.day===day).map(x=>{
      const start=Math.max(x.start,rangeStart),end=Math.min(x.end,rangeEnd);
      const top=((start-rangeStart)/total)*bodyHeight;
      const height=Math.max(28,((end-start)/total)*bodyHeight);
      const professor=x.o?.professor||x.professor||'';
      const room=x.o?.room||x.room||'';
      const time=x.si?.time||x.time||`${minutesToHHMM(x.start)}–${minutesToHHMM(x.end)}`;
      return `<div class="timeline-course" style="top:${top}px;height:${height}px"><b>${esc(x.r?.courseName||x.courseName||'')}</b><span>${esc(time)}</span><span>${esc([professor,room].filter(Boolean).join(' '))}</span></div>`;
    }).join('');
    return `<div class="timeline-day" style="left:${left};width:${colWidth}">${courses}</div>`;
  }).join('');

  return `<div class="timeline-wrap">
    <div class="timeline-head" style="grid-template-columns:${timeCol}px repeat(${days.length},minmax(0,1fr))">
      <div>시간</div>${days.map(d=>`<div>${d}</div>`).join('')}
    </div>
    <div class="timeline-body" style="height:${bodyHeight}px">${gridLines}${dayCols}</div>
  </div>`;
}
function buildWeeklyScheduleHtml(records,settings){
  const m=buildPlanScheduleModel(records,settings);
  return {model:m,html:timelineHtmlFromItems(m.placed,settings)};
}
function planTimetableExtraHtml(unplaced,outOfRange){
  let extra='';
  if(unplaced.length)extra+=`<h4>시간 미정 과목</h4><div class="table-wrap"><table><thead><tr><th>학정번호</th><th>과목명 / 강의정보</th><th>전공/구분</th><th>종별</th><th>상태</th></tr></thead><tbody>${unplaced.map(({r,o})=>{
    const badge=(r.availability||o.availability)==='actual'?'<span class="badge actual">확정</span>':(r.availability||o.availability)==='planned'?'<span class="badge planned">개설 예정</span>':'<span class="badge manual">시간 미정</span>';
    const si=scheduleInfoWithSettings(o||r,state.scheduleSettings||defaultState().scheduleSettings);
    const sub=[o?.professor||r.professor||'',o?.day||r.day||'',si.time!=='시간 미정'?si.time:'',o?.room||r.room||''].filter(Boolean).join(' ');
    return `<tr><td class="mono">${esc(r.courseCode||'')}</td><td><div class="course-name">${esc(r.courseName)}</div><div class="muted">${esc(sub||'요일·시간 정보 없음')}</div></td><td>${esc(courseOriginLabel(o||r))}</td><td>${esc(CATEGORY_LABELS[r.category||o.category||'unknown'])}</td><td>${badge}</td></tr>`;
  }).join('')}</tbody></table></div>`;
  if(outOfRange.length)extra+=`<div class="callout warnbox" style="margin-top:10px"><b>표시 범위 밖 과목:</b> ${outOfRange.map(x=>`${esc(x.r.courseName)} (${esc(x.si.time)})`).join(' · ')}<br>⚙ 설정에서 시간표 시작/종료 범위를 넓히면 표시됩니다.</div>`;
  return extra;
}
function renderPlanTimetable(){
  const terms=gapCandidateTerms();
  const settings=state.scheduleSettings||defaultState().scheduleSettings;
  const title=document.getElementById('planTimetableTitle');
  if(title)title.textContent='학기별 계획 시간표';
  if(!planTimetableOpenInitialized){
    openPlanTimetableTerms.add(DATA.snapshot);
    activePlanTimetableTerm=DATA.snapshot;
    planTimetableOpenInitialized=true;
  }
  if(!terms.includes(activePlanTimetableTerm))activePlanTimetableTerm=DATA.snapshot;

  const grid=document.getElementById('planTimetableGrid');
  if(!grid)return;
  grid.innerHTML=terms.map(term=>{
    const confirmed=term===DATA.snapshot;
    const records=dedupePlannedRecords(currentScenario().planned.filter(r=>r.term===term));
    const built=buildWeeklyScheduleHtml(records,settings);
    const extra=planTimetableExtraHtml(built.model.unplaced,built.model.outOfRange||[]);
    const open=openPlanTimetableTerms.has(term);
    const scheduleHtml=built.model.placed.length?`<div class="weekly-schedule">${built.html}</div>`:'';
    const empty=!records.length?`<div class="empty plan-term-empty">이 학기에 계획한 과목이 없습니다.</div>`:'';
    return `<details class="plan-term-schedule ${confirmed?'confirmed':'scheduled'}" data-plan-timetable-term="${esc(term)}" ${open?'open':''}>
      <summary>
        <span class="plan-term-schedule-title">${esc(term)}학기 시간표</span>
        <span class="plan-term-course-count">${records.length}과목</span>
      </summary>
      <div class="plan-term-schedule-body">${scheduleHtml}${empty}${extra}</div>
    </details>`;
  }).join('');

  document.getElementById('planTimetableUnplaced').innerHTML='';
  grid.querySelectorAll('[data-plan-timetable-term]').forEach(detail=>{
    detail.addEventListener('toggle',()=>{
      const term=detail.dataset.planTimetableTerm;
      if(detail.open){openPlanTimetableTerms.add(term);activePlanTimetableTerm=term;}
      else openPlanTimetableTerms.delete(term);
    });
    detail.querySelector('summary')?.addEventListener('click',()=>{activePlanTimetableTerm=detail.dataset.planTimetableTerm;});
  });
}
function saveCurrentPlanTimetableSnapshot(){
  const term=activePlanTimetableTerm||DATA.snapshot;
  const settings=JSON.parse(JSON.stringify(state.scheduleSettings||defaultState().scheduleSettings));
  const records=dedupePlannedRecords(currentScenario().planned.filter(r=>r.term===term));
  if(!records.length){alert('저장할 계획 과목이 없습니다.');return;}
  const entries=records.map(r=>{
    const o=offeringForPlanRecord(r)||r,si=scheduleInfoWithSettings(o,settings);
    return {courseCode:r.courseCode||'',sectionCode:r.sectionCode||'',courseName:r.courseName,category:r.category,credits:r.credits,day:o.day||'',time:si.time,order:si.order,professor:o.professor||'',room:o.room||'',availability:r.availability||o.availability||'planned'};
  });
  const item={id:uid('ref'),type:'plan_snapshot',name:`${term}학기 계획 시간표`,term,entries,settings,createdAt:Date.now()};
  state.scheduleReferences=state.scheduleReferences||[];
  state.scheduleReferences.unshift(item);
  if(state.scheduleReferences.length>8)state.scheduleReferences=state.scheduleReferences.slice(0,8);
  state.activeReferenceId=item.id;
  save();renderScheduleReferences();
}
function renderSnapshotSchedule(ref){
  const settings={...defaultState().scheduleSettings,...(ref.settings||{})};
  const days=settings.days||['월','화','수','목','금'];
  const rangeStart=hhmmToMinutes(settings.timetableStart||'17:00');
  const rangeEnd=hhmmToMinutes(settings.timetableEnd||'23:00');
  const placed=(ref.entries||[]).filter(e=>e.day&&e.order<9999).map(e=>{
    const m=String(e.time||'').match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    if(!m)return null;
    const start=Number(m[1])*60+Number(m[2]),end=Number(m[3])*60+Number(m[4]);
    if(end<=rangeStart||start>=rangeEnd)return null;
    return {r:e,o:e,day:e.day,si:{time:e.time},start,end};
  }).filter(Boolean);
  const unknown=(ref.entries||[]).filter(e=>!e.day||e.order>=9999);
  return `<div class="reference-snapshot"><div class="snapshot-title">${esc(ref.term)}학기 저장 시간표</div><div class="weekly-schedule">${timelineHtmlFromItems(placed,settings)}</div>${unknown.length?`<div class="snapshot-unknown"><h4>시간 미정 과목</h4>${unknown.map(e=>esc(e.courseName)).join(' · ')}</div>`:''}</div>`;
}
function renderScheduleReferences(){
  const refs=state.scheduleReferences||[];
  if(refs.length&&!refs.some(r=>r.id===state.activeReferenceId))state.activeReferenceId=refs[0].id;
  const active=refs.find(r=>r.id===state.activeReferenceId);
  const viewer=document.getElementById('scheduleReferenceViewer');
  const pane=document.getElementById('scheduleReferencePane');
  const printableReference=!!(active && ((active.type==='plan_snapshot' && (active.entries||[]).length) || active.dataUrl));
  document.body.classList.toggle('print-has-reference',printableReference);
  if(pane)pane.classList.toggle('print-empty',!printableReference);
  if(!active)viewer.innerHTML=`<div class="empty">저장한 계획 시간표가 없습니다.</div>`;
  else if(active.type==='plan_snapshot')viewer.innerHTML=renderSnapshotSchedule(active);
  else if(active.dataUrl)viewer.innerHTML=`<img src="${active.dataUrl}" alt="${esc(active.name||'기존 시간표 이미지')}">`;
  else viewer.innerHTML=`<div class="empty">표시할 시간표 데이터가 없습니다.</div>`;
  document.getElementById('scheduleReferenceFeed').innerHTML=refs.map(r=>{
    if(r.type==='plan_snapshot')return `<div class="reference-card ${r.id===state.activeReferenceId?'active':''}" data-ref="${r.id}"><div class="term">${esc(r.term||'')}</div><div>${esc(r.name||'계획 시간표')}</div><div class="count">${(r.entries||[]).length}과목</div><button class="thumb-del" data-del-ref="${r.id}" type="button">×</button></div>`;
    return `<div class="reference-thumb ${r.id===state.activeReferenceId?'active':''}" data-ref="${r.id}"><img src="${r.dataUrl}" alt="${esc(r.name||'시간표 이미지')}"><button class="thumb-del" data-del-ref="${r.id}" type="button">×</button></div>`;
  }).join('');
  document.querySelectorAll('[data-ref]').forEach(el=>el.onclick=e=>{if(e.target.dataset.delRef)return;state.activeReferenceId=el.dataset.ref;save();renderScheduleReferences();});
  document.querySelectorAll('[data-del-ref]').forEach(b=>b.onclick=e=>{e.stopPropagation();state.scheduleReferences=refs.filter(r=>r.id!==b.dataset.delRef);if(state.activeReferenceId===b.dataset.delRef)state.activeReferenceId=state.scheduleReferences[0]?.id||null;save();renderScheduleReferences();});
}

function timeRangeForPlanRecord(r){
  const o=offeringForPlanRecord(r)||r,si=scheduleInfoWithSettings(o,state.scheduleSettings||defaultState().scheduleSettings);
  const m=String(si.time||'').match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if(!m)return null;
  return {day:o.day||r.day||'',start:Number(m[1])*60+Number(m[2]),end:Number(m[3])*60+Number(m[4]),name:r.courseName};
}
function normalizedCourseNameKey(s){return normName(String(s||'').replace(/\(구[^)]*\)/g,''));}
function semesterNumberFromAdmission(term){
  const a=termIndex(state.profile.admissionTerm),t=termIndex(term);if(!Number.isFinite(a)||!Number.isFinite(t)||t<a)return null;return t-a+1;
}
function duplicateCourseWarnings(records){
  const byCode=new Map(),byName=new Map(),out=[];
  for(const r of records){
    if(r.passed===false||normalizeGrade(r.grade)==='W')continue;
    const code=canonicalCode(r.courseCode),name=normalizedCourseNameKey(r.courseName);const label=`${r.term||''} ${r.courseName||code}`;
    if(code){const arr=byCode.get(code)||[];arr.push(label);byCode.set(code,arr);}if(name){const arr=byName.get(name)||[];arr.push(label);byName.set(name,arr);}
  }
  for(const [k,v] of byCode)if(v.length>1)out.push(`동일 학정번호 ${k}: ${v.join(' / ')}`);
  for(const [k,v] of byName)if(v.length>1)out.push(`동일 교과목명: ${v.join(' / ')}`);
  return [...new Set(out)];
}
function renderPlanWarnings(){
  const box=document.getElementById('planWarnings');if(!box)return;
  const term=document.getElementById('planTerm').value;const records=dedupePlannedRecords(currentScenario().planned.filter(r=>r.term===term));const warnings=[];
  const limits=CERT_RULES?.planLimits||{};
  const regular=records.filter(r=>!['common','prerequisite','audit'].includes(r.category));
  const regularCredits=regular.reduce((s,r)=>s+Number(r.credits||0),0);
  const capstone=regular.some(r=>['thesis','report','research_guidance'].includes(r.category));
  const maxCourses=capstone?Number(limits.capstoneSemester?.maxCourses||3):Number(limits.regular?.maxCourses||2);
  const maxCredits=capstone?Number(limits.capstoneSemester?.maxCredits||9):Number(limits.regular?.maxCredits||6);
  if(regular.length>maxCourses||regularCredits>maxCredits)warnings.push(`<div class="plan-warning"><b>수강한도 확인</b> · ${esc(term)} 일반 산입과목 ${regular.length}과목 / ${fmtCredits(regularCredits)}학점입니다. 현재 계획 기준 한도 ${maxCourses}과목 / ${maxCredits}학점을 초과합니다.</div>`);
  const prereqCount=records.filter(r=>r.category==='prerequisite').length;
  const prereqCfg=limits.prerequisite||{},prereqBase=Number(prereqCfg.maxCoursesPerTerm||2),prereqEx=prereqCfg.exception||{};
  const semesterNo=termIndex(term)-termIndex(state.profile.admissionTerm)+1;
  const allPrereqRecords=[...state.history.filter(r=>r.passed!==false),...currentScenario().planned.map(r=>({...r,passed:true}))].filter(r=>r.category==='prerequisite');
  const prereqByTerm={};for(const r of allPrereqRecords){if(!r.term)continue;(prereqByTerm[r.term]||(prereqByTerm[r.term]=new Set())).add(recordKey(r)||`${r.courseCode}|${r.courseName}`);}
  const specialUsedElsewhere=Object.entries(prereqByTerm).some(([tt,set])=>tt!==term&&set.size>=Number(prereqEx.maxCourses||3));
  const exceptionCohortOk=!prereqEx.admissionFrom||termIndex(state.profile.admissionTerm)>=termIndex(prereqEx.admissionFrom);
  const specialWindow=exceptionCohortOk&&semesterNo>=Number(prereqEx.fromSemester||99)&&semesterNo<=Number(prereqEx.toSemester||-1);
  const prereqMax=specialWindow&&!specialUsedElsewhere?Number(prereqEx.maxCourses||3):prereqBase;
  const prereqExceptionText=prereqEx.maxCourses&&exceptionCohortOk?` ${prereqEx.admissionFrom||'2024-1'} 이후 입학생은 3~5학기 중 한 학기에 한해 ${prereqEx.maxCourses}과목까지 가능한 특례가 있습니다.`:'';
  if(prereqCount>prereqMax)warnings.push(`<div class="plan-warning"><b>선수 과목 확인</b> · 기본 한도는 학기당 ${prereqBase}과목입니다.${prereqExceptionText} 현재 ${prereqCount}과목이며 이 학기의 적용 한도는 ${prereqMax}과목입니다.</div>`);
  else if(prereqCount===Number(prereqEx.maxCourses||3)&&prereqMax===Number(prereqEx.maxCourses||3))warnings.push(`<div class="plan-warning"><b>선수 3과목 특례 사용 예정</b> · 2024학년도 이후 입학생의 ${semesterNo}학기차 계획에서 3~5학기 중 1회 가능한 선수 3과목 특례를 사용하는 것으로 계산했습니다. 실제 수강신청 공지를 최종 확인하십시오.</div>`);
  const commonTerm=records.filter(r=>r.category==='common').length;
  if(commonTerm>Number(limits.common?.maxCoursesPerTerm||1))warnings.push(`<div class="plan-warning"><b>공통 과목 확인</b> · 공통은 학기당 최대 ${limits.common?.maxCoursesPerTerm||1}과목입니다. 현재 ${commonTerm}과목입니다.</div>`);
  const combined=[...state.history.filter(r=>r.passed!==false),...projectionPlannedRecords().map(r=>({...r,passed:true}))];
  const commonTotal=combined.filter(r=>r.category==='common'&&!isPreAdmissionTerm(r.term)).length;
  if(commonTotal>Number(limits.common?.maxCoursesTotal||4))warnings.push(`<div class="plan-warning"><b>공통 누적 확인</b> · 개별논문지도를 포함한 공통은 재학 중 최대 ${limits.common?.maxCoursesTotal||4}과목 기준입니다. 현재/계획 합계 ${commonTotal}과목입니다.</div>`);
  const dups=duplicateCourseWarnings(combined).slice(0,5);if(dups.length)warnings.push(`<div class="plan-warning"><b>중복과목 가능성</b> · 학교 안내상 학정번호 또는 교과목명이 동일한 과목은 한 과목만 인정될 수 있습니다.<br>${dups.map(esc).join('<br>')}</div>`);
  const ranges=records.map(r=>({r,range:timeRangeForPlanRecord(r)})).filter(x=>x.range&&x.range.day),conflicts=[];
  for(let i=0;i<ranges.length;i++)for(let j=i+1;j<ranges.length;j++){const a=ranges[i].range,b=ranges[j].range;if(a.day===b.day&&Math.max(a.start,b.start)<Math.min(a.end,b.end))conflicts.push(`${a.name} ↔ ${b.name}`);}
  if(conflicts.length)warnings.push(`<div class="plan-warning danger"><b>시간표 충돌</b> · ${[...new Set(conflicts)].map(esc).join(' · ')}</div>`);
  box.innerHTML=warnings.join('');
}
const PLAN_LIST_CATEGORY_PRIORITY={
  major_required:0,major_elective:1,teaching:2,common:3,prerequisite:4,
  report:5,thesis:6,research_guidance:7,lifelong:8,audit:9,unknown:99
};
function sortedPlannedRecords(records){
  const dayOrder={월:0,화:1,수:2,목:3,금:4,토:5,일:6};
  return records.map((r,i)=>({r,i})).sort((a,b)=>{
    const termDiff=termIndex(a.r.term)-termIndex(b.r.term);
    if(termDiff)return termDiff;
    const ao=offeringForPlanRecord(a.r)||a.r,bo=offeringForPlanRecord(b.r)||b.r;
    const at=timeRangeForPlanRecord(a.r),bt=timeRangeForPlanRecord(b.r);
    const ad=dayOrder[ao.day??a.r.day]??99,bd=dayOrder[bo.day??b.r.day]??99;
    if(ad!==bd)return ad-bd;
    const as=at?.start??99999,bs=bt?.start??99999;
    if(as!==bs)return as-bs;
    const ac=PLAN_LIST_CATEGORY_PRIORITY[a.r.category]??98,bc=PLAN_LIST_CATEGORY_PRIORITY[b.r.category]??98;
    if(ac!==bc)return ac-bc;
    return String(a.r.courseName||'').localeCompare(String(b.r.courseName||''),'ko');
  });
}

function renderPlan(){
  renderGapCandidates();
  const sc=currentScenario(), body=document.getElementById('planBody');
  if(!sc.planned.length){body.innerHTML=`<tr><td colspan="6" class="empty">현재 시트의 계획 과목이 없습니다.</td></tr>`;renderPlanTimetable();renderScheduleReferences();renderPlanWarnings();return;}
  body.innerHTML=sortedPlannedRecords(sc.planned).map(({r,i})=>{
    const av=r.availability||'manual';
    const badge=av==='actual'?`<span class="badge actual">실제개설</span>`:av==='planned'?`<span class="badge planned">개설 예정</span>`:av==='special'?`<span class="badge match">학위/공통</span>`:`<span class="badge manual">직접입력</span>`;
    return `<tr><td>${esc(r.term)}</td><td><div class="course-name">${esc(r.courseName)}</div><div class="muted mono">${esc(r.sectionCode||r.courseCode||'')}</div></td>
      <td><select class="inline-select plan-cat" data-i="${i}">${categoryOptionsHtml(r.category)}</select></td>
      <td><input class="plan-credit" data-i="${i}" type="number" min="0" step="1" value="${Number(r.credits||0)}" style="width:72px;padding:6px"></td>
      <td>${badge}</td><td><button class="btn small danger plan-del" data-i="${i}">삭제</button></td></tr>`;
  }).join('');
  document.querySelectorAll('.plan-cat').forEach(x=>x.onchange=()=>{sc.planned[+x.dataset.i].category=x.value;if(['common','audit'].includes(x.value))sc.planned[+x.dataset.i].credits=0;save();render();});
  document.querySelectorAll('.plan-credit').forEach(x=>x.onchange=()=>{sc.planned[+x.dataset.i].credits=Number(x.value||0);save();render();});
  document.querySelectorAll('.plan-del').forEach(x=>x.onclick=()=>{sc.planned.splice(+x.dataset.i,1);save();render();});
  renderPlanTimetable();
  renderScheduleReferences();
  renderPlanWarnings();
}
function renderDiff(){
  const d=DATA.audit.currentVsPlanDiff[state.profile.major]||{plannedNotActual:[],actualNotPlanned:[],matchedCount:0,plannedCount:0,actualCount:0};
  const p=d.plannedNotActual.map(code=>{const o=DATA.offerings.find(x=>x.major===state.profile.major&&x.term===DATA.snapshot&&x.courseCode===code);return `<li><span class="mono">${esc(code)}</span> ${esc(o?.courseName||'')}</li>`;}).join('');
  const a=d.actualNotPlanned.map(code=>{const o=DATA.offerings.find(x=>x.major===state.profile.major&&x.term===DATA.snapshot&&x.courseCode===code);return `<li><span class="mono">${esc(code)}</span> ${esc(o?.courseName||'')}</li>`;}).join('');
  document.getElementById('diffBox').innerHTML=`<div class="muted">예정표는 중장기 개설계획이고, 실제 수강 여부는 현재학기 시간표를 우선합니다. ${DATA.snapshot} 예정 ${d.plannedCount}개 / 실제 ${d.actualCount}개 / 일치 ${d.matchedCount}개</div>${p?`<div class="callout badbox" style="margin-top:10px"><b>예정에는 있었으나 실제 시간표 미확인</b><ul>${p}</ul></div>`:''}${a?`<div class="callout warnbox" style="margin-top:10px"><b>예정표 외 실제 개설</b><ul>${a}</ul></div>`:''}`;
}
function periodInfo(o){return scheduleInfo(o);}
function termTimetableList(){
  const term=document.getElementById('timetableTerm').value||DATA.snapshot;
  const mode=document.getElementById('timetableScope').value||'major';
  const majorList=DATA.offerings.filter(o=>o.major===state.profile.major&&o.term===term);
  const majorTeaching=majorList.filter(o=>o.category==='teaching');
  const globalTeaching=term===DATA.snapshot?DATA.globalOfferings.filter(o=>o.term===term&&o.category==='teaching'):[];
  let list=mode==='major'?majorList:mode==='teaching'?[...majorTeaching,...globalTeaching]:[...majorList,...globalTeaching];
  const key=new Set();
  list=list.filter(o=>{const k=(o.major||'')+'|'+canonicalCode(o.courseCode)+'|'+(o.day||'')+'|'+(o.room||'')+'|'+(o.timeRaw||'');if(key.has(k))return false;key.add(k);return true;});
  return list.sort((a,b)=>(DAY_ORDER[a.day]||9)-(DAY_ORDER[b.day]||9)||scheduleInfo(a).order-scheduleInfo(b).order||(a.courseName||'').localeCompare(b.courseName||'','ko'));
}
function offeringPlanKey(term,course){
  return encodeURIComponent(`${term}|${canonicalCode(course?.courseCode)}|${normName(course?.courseName)}`);
}
function findOfferingForPlan(term,code,name){
  const cc=canonicalCode(code), nn=normName(name);
  const regular=[
    ...DATA.offerings.filter(o=>o.term===term),
    ...(term===DATA.snapshot?DATA.globalOfferings.filter(o=>o.term===term):[])
  ];
  let found=regular.find(o=>(cc&&canonicalCode(o.courseCode)===cc)||(!cc&&nn&&normName(o.courseName)===nn));
  if(found)return found;
  return DATA.specialCourses.find(o=>(cc&&canonicalCode(o.courseCode)===cc)||(!cc&&nn&&normName(o.courseName)===nn))||null;
}
function isOfferingAlreadyPlanned(term,course){
  const code=canonicalCode(course?.courseCode),name=normName(course?.courseName);
  return currentScenario().planned.some(r=>r.term===term&&((code&&canonicalCode(r.courseCode)===code)||(!code&&name&&normName(r.courseName)===name)));
}
function offeringPlanButton(term,course){
  if(course.availability==='planned_missing_actual'){
    return `<button class="btn small catalog-plan-btn no-print" type="button" disabled title="예정표에는 있었지만 실제 개설이 확인되지 않았습니다.">추가 불가</button>`;
  }
  if(isOfferingAlreadyPlanned(term,course)){
    return `<button class="btn small catalog-plan-btn no-print is-added" type="button" disabled>계획됨</button>`;
  }
  const key=offeringPlanKey(term,course);
  return `<button class="btn small catalog-plan-btn no-print" type="button" data-offering-plan="${key}">계획에 추가</button>`;
}
function addOfferingFromCatalog(encoded){
  let raw='';try{raw=decodeURIComponent(encoded||'');}catch(e){raw=encoded||'';}
  const [term,code,name]=raw.split('|');
  const targetTerm=validTermValue(term)?term:DATA.snapshot;
  const c=findOfferingForPlan(targetTerm,code,name);
  if(!c)return alert('선택한 학기의 개설 데이터에서 해당 과목을 다시 찾지 못했습니다.');
  if(c.availability==='planned_missing_actual')return alert('예정표에는 있었지만 실제 개설이 확인되지 않은 과목은 계획에 바로 추가할 수 없습니다.');
  const category=recommendedCategory(c);
  const candidate={
    id:uid('p'),term:targetTerm,courseCode:canonicalCode(c.courseCode),
    sectionCode:(c.sectionCodes||[])[0]||'',courseName:c.courseName,
    category,credits:Number((category==='common'||category==='audit')?0:(c.credits??defaultCredit(targetTerm,category,c.courseCode))),
    availability:c.availability,source:'catalog_quick_add',professor:c.professor||'',
    day:c.day||'',timeRaw:c.timeRaw||'',room:c.room||''
  };
  const sc=currentScenario(), key=planRecordKey(candidate);
  if(sc.planned.some(r=>planRecordKey(r)===key))return alert('같은 학기의 동일 과목이 이미 계획에 등록되어 있습니다.');
  sc.planned.push(candidate);
  sc.planned=dedupePlannedRecords(sc.planned);
  const planSel=document.getElementById('planTerm');
  if(planSel&&[...planSel.options].some(o=>o.value===targetTerm))planSel.value=targetTerm;
  gapCandidateTerm=targetTerm;
  save();render();
}
function bindOfferingPlanButtons(root=document){
  root.querySelectorAll('[data-offering-plan]').forEach(btn=>btn.onclick=()=>addOfferingFromCatalog(btn.dataset.offeringPlan));
}

function renderTimetable(){
  const list=termTimetableList(), body=document.getElementById('timetableBody');
  const term=document.getElementById('timetableTerm')?.value||DATA.snapshot;
  body.innerHTML=list.length?list.map(o=>{
    const p=scheduleInfo(o),video=String(o.timeRaw||'').includes('동영상')?' · 동영상 병행':'';
    return `<tr>
      <td>${esc(o.day||'미정')}</td>
      <td class="period">${esc(p.label)}${p.label!==p.time?`<div class="muted">${esc(p.time)}</div>`:''}</td>
      <td><div class="course-name">${esc(o.courseName)}</div><div class="muted mono">${esc((o.sectionCodes||[])[0]||o.courseCode||'')}${video}</div></td>
      <td>${CATEGORY_LABELS[o.category||'unknown']}</td>
      <td>${esc(o.professor||'')} / ${esc(o.room||'')}</td>
      <td class="course-plan-action">${offeringPlanButton(term,o)}</td>
    </tr>`;
  }).join(''):`<tr><td colspan="6" class="empty">해당 학기/범위의 강의 정보가 없습니다.</td></tr>`;
  bindOfferingPlanButtons(body);
}
function renderCatalog(){
  const term=document.getElementById('catalogTerm').value, major=document.getElementById('catalogMajor').value, q=normName(document.getElementById('catalogSearch').value);
  let list=[];
  if(major==='__ALL__') list=[...DATA.offerings.filter(o=>o.term===term),...(term===DATA.snapshot?DATA.globalOfferings.filter(o=>o.term===term):[])];
  else if(major==='__GLOBAL__') list=[...(term===DATA.snapshot?DATA.globalOfferings.filter(o=>o.term===term):[]),...DATA.specialCourses];
  else list=DATA.offerings.filter(o=>o.major===major&&o.term===term);
  list=list.filter(o=>{const text=normName((o.courseName||'')+(o.courseCode||'')+(o.professor||''));return !q||text.includes(q);});
  list.sort((a,b)=>(DAY_ORDER[a.day]||9)-(DAY_ORDER[b.day]||9)||scheduleInfo(a).order-scheduleInfo(b).order||(a.courseName||'').localeCompare(b.courseName||'','ko'));
  const body=document.getElementById('catalogBody');
  body.innerHTML=list.length?list.map(o=>{
    let badge=o.availability==='actual'?`<span class="badge actual">실제개설</span>`:o.availability==='planned'?`<span class="badge planned">개설 예정</span>`:o.availability==='planned_missing_actual'?`<span class="badge missing">실제미확인</span>`:`<span class="badge match">특수</span>`;
    const p=scheduleInfo(o);
    const sub=[o.professor||'',o.day||'',p.time!=='시간 미정'?p.time:'',o.room||''].filter(Boolean).join(' ');
    const displayCode=(o.sectionCodes||[])[0]||o.courseCode||'';
    const pattern=courseOfferingPattern(o);
    return `<tr>
      <td class="mono">${esc(displayCode)}</td>
      <td><div class="course-name">${esc(o.courseName)}</div><div class="muted">${esc(sub)}</div><div class="offering-pattern">${esc(pattern.text)}${pattern.pattern?` <span class="pattern-chip">${esc(pattern.pattern)}</span>`:''}</div></td>
      <td>${esc(courseOriginLabel(o))}</td>
      <td>${CATEGORY_LABELS[o.category||'unknown']}</td>
      <td>${badge}</td>
      <td class="course-plan-action">${offeringPlanButton(term,o)}</td>
    </tr>`;
  }).join(''):`<tr><td colspan="6" class="empty">해당 조건의 과목이 없습니다.</td></tr>`;
  bindOfferingPlanButtons(body);
}
function profileSummaryText(){
  return `${state.profile.major} · ${state.profile.admissionTerm} · ${graduationTrackLabel(state.profile.track)}`;
}
function markProfileUnconfirmed(){
  if(state.profileConfirmed){
    state.profileConfirmed=false;
    save();
  }
}
function renderUxState(){
  const historyCount=state.history.length;
  const profileConfirmed=!!state.profileConfirmed;
  const readyForAnalysis=profileConfirmed&&historyCount>0;

  const analysis=document.getElementById('analysisZone');
  if(analysis)analysis.classList.toggle('is-empty',!readyForAnalysis);

  const confirmBar=document.getElementById('profileConfirmBar');
  const confirmTitle=document.getElementById('profileConfirmTitle');
  const confirmSummary=document.getElementById('profileConfirmSummary');
  const confirmBtn=document.getElementById('confirmProfileBtn');
  if(confirmBar){
    confirmBar.classList.toggle('confirmed',profileConfirmed);
    if(confirmTitle)confirmTitle.textContent=profileConfirmed?'기본정보 확인 완료':'기본정보를 확인해주세요.';
    if(confirmSummary)confirmSummary.textContent=profileSummaryText();
    if(confirmBtn){
      confirmBtn.textContent=profileConfirmed?'기본정보 다시 확인':'기본정보 확인 완료';
      confirmBtn.classList.toggle('primary',!profileConfirmed);
    }
  }

  const profileStep=document.getElementById('profileStepLabel');
  if(profileStep)profileStep.classList.toggle('done',profileConfirmed);

  const inputStatus=document.getElementById('inputStatus');
  if(inputStatus){
    if(!profileConfirmed){
      inputStatus.innerHTML=`<span class="badge planned">확인 필요</span><strong>1단계 기본정보</strong><span>선택값이 기본으로 표시되어 있어도, 확인 완료를 눌러야 다음 단계로 진행됩니다.</span>`;
    }else if(!historyCount){
      inputStatus.innerHTML=`<span class="badge actual">1단계 완료</span><strong>기본정보 확인됨</strong><span>· 2단계 수강이력에서 최소 1과목을 등록해주세요.</span>`;
    }else{
      inputStatus.innerHTML=`<span class="badge actual">입력 완료</span><strong>${historyCount}과목 등록됨</strong><span>· 아래 분석 결과가 활성화되었습니다.</span>`;
    }
  }

  const resultStatus=document.getElementById('resultStatus');
  if(resultStatus){
    resultStatus.textContent=!profileConfirmed?'':historyCount?`${historyCount}과목 기준 자동 계산`:'수강이력 입력 대기';
  }

  const compact=document.getElementById('historyCompactSummary');
  if(compact){
    compact.textContent=!profileConfirmed?'':historyCount?`· ${historyCount}과목 등록됨`:'· 입력 필요';
  }

  const analysisDetails=document.getElementById('analysisZone');
  if(analysisDetails)analysisDetails.classList.toggle('profile-locked',!profileConfirmed);
  const planDetails=document.getElementById('planSection');
  if(planDetails){
    planDetails.classList.toggle('profile-locked',!profileConfirmed);
    planDetails.querySelectorAll('input,select,button').forEach(el=>{el.disabled=!profileConfirmed;});
  }

  // Open relevant steps once on entry; preserve manual folding during ordinary edits.
  const firstVisit=window.__prevProfileConfirmed===undefined;
  const justUnlocked=profileConfirmed&&(firstVisit||window.__prevProfileConfirmed===false);
  const justReady=readyForAnalysis&&(window.__prevAnalysisReady!==true);
  const historyDetails=document.getElementById('historySection');
  if(!profileConfirmed){
    document.getElementById('inputZone').open=true;
    if(analysisDetails)analysisDetails.open=false;
    if(planDetails)planDetails.open=false;
    if(historyDetails)historyDetails.open=false;
  }else{
    if(justUnlocked&&historyDetails)historyDetails.open=true;
    if(justUnlocked&&analysisDetails)analysisDetails.open=true;
    if(justReady){
      ['analysisZone','resultDetailsPanel','planSection','teacherChecklistSection','graduationChecklistSection'].forEach(id=>{
        const el=document.getElementById(id);if(el)el.open=true;
      });
    }
  }
  window.__prevProfileConfirmed=profileConfirmed;
  window.__prevAnalysisReady=readyForAnalysis;
  if(historyDetails){
    historyDetails.classList.toggle('profile-locked',!profileConfirmed);
    historyDetails.querySelectorAll('input,select,button').forEach(el=>{el.disabled=!profileConfirmed;});
  }

  const emptyTitle=document.getElementById('dashboardEmptyTitle');
  const emptyText=document.getElementById('dashboardEmptyText');
  const goBtn=document.getElementById('goHistoryInput');
  if(!profileConfirmed){
    if(emptyTitle)emptyTitle.textContent='먼저 기본정보 확인이 필요합니다.';
    if(emptyText)emptyText.textContent='1단계에서 전공·입학학기·과정/졸업유형을 확인한 뒤 [기본정보 확인 완료]를 눌러주세요.';
    if(goBtn)goBtn.textContent='기본정보 확인하러 가기 ↑';
  }else{
    if(emptyTitle)emptyTitle.textContent='아직 분석할 수강이력이 없습니다.';
    if(emptyText)emptyText.textContent='2단계 수강이력 입력에서 이수한 과목을 등록하면 이수학점·평점·졸업요건이 여기에 표시됩니다.';
    if(goBtn)goBtn.textContent='수강이력 입력하러 가기 ↑';
  }

  const steps=[...document.querySelectorAll('#workflowStrip .workflow-step')];
  if(steps.length){
    steps.forEach(x=>x.classList.remove('active','done'));
    if(!profileConfirmed){
      steps[0]?.classList.add('active');
    }else if(historyCount===0){
      steps[0]?.classList.add('done');
      steps[1]?.classList.add('active');
    }else{
      steps[0]?.classList.add('done');
      steps[1]?.classList.add('done');
      steps[2]?.classList.add('active');
    }
  }
}
function renderChecklistResults(){
  renderTeacherChecklist();renderGraduationChecklist();renderActionSummary();
}
function render(){
  renderProjectionControls();renderScenarioTabs();renderKpis();renderQualificationNotes();renderRequirements();renderTeacherChecklist();renderGraduationChecklist();renderActionSummary();renderHistory();renderPlan();renderTimetable();renderDiff();renderCatalog();renderPrintProfileSummary();renderUxState();
}


let ocrWorker=null;
let ocrCandidates=[];

function allCatalogEntries(){
  return [...DATA.offerings,...DATA.globalOfferings,...DATA.specialCourses,...LEGACY_MAJOR_TEACHING_COURSES];
}
function preferredCatalogMatchByCode(code){
  const cc=canonicalCode(code);
  if(!cc)return null;
  const all=allCatalogEntries().filter(x=>canonicalCode(x.courseCode)===cc);
  if(!all.length)return null;
  return all.find(x=>x.major===state.profile.major) ||
         all.find(x=>x.scope==='common') ||
         all.find(x=>x.major==='__GLOBAL__') ||
         all[0];
}
function preferredCatalogMatchByName(name){
  const nn=normName(name);
  if(!nn)return null;
  const all=allCatalogEntries().filter(x =>
    normName(x.courseName)===nn || (x.aliases||[]).some(a=>normName(a)===nn)
  );
  if(!all.length)return null;
  return all.find(x=>x.major===state.profile.major) ||
         all.find(x=>x.scope==='common') ||
         all.find(x=>x.major==='__GLOBAL__') ||
         all[0];
}
function valueAfterOcrLabel(block,labelPattern){
  const lines=String(block||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  for(let i=0;i<lines.length;i++){
    if(labelPattern.test(lines[i])){
      const same=lines[i].replace(labelPattern,'').replace(/^[:：\s-]+/,'').trim();
      if(same)return same;
      if(lines[i+1])return lines[i+1].trim();
    }
  }
  return '';
}
function mapPortalCategory(raw, matched){
  const s=String(raw||'').replace(/\s+/g,'');
  if(s.includes('청강'))return 'audit';
  if(s.includes('공통'))return 'common';
  if(s.includes('선수'))return 'prerequisite';
  if(s.includes('교직'))return 'teaching';
  if(s.includes('선택')){
    if(Array.isArray(matched?.categoryOptions) && matched.categoryOptions.includes('major_elective'))return 'major_elective';
    if(matched?.category && matched.category!=='unknown')return matched.category;
    return 'major_elective';
  }
  if(s.includes('전공')){
    if(matched?.category && matched.category!=='unknown')return matched.category;
    // 연세포털 전체성적조회에서 '전공'은 계산기 종별의 전공필수에 대응한다.
    return 'major_required';
  }
  if(matched?.category && matched.category!=='unknown')return matched.category;
  return 'unknown';
}
function cleanOcrText(text){
  return String(text||'')
    .replace(/\r/g,'\n')
    .replace(/[ \t]+/g,' ')
    .replace(/\n{3,}/g,'\n\n');
}
function parseGrade(block){
  const lines=String(block||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const idx=lines.findIndex(x=>/성적\s*등급|성적등급/i.test(x));
  const candidates=[];
  if(idx>=0){
    const same=lines[idx].replace(/.*?(성적\s*등급|성적등급)/i,'').replace(/^[:：\s-]+/,'').trim();
    if(same)candidates.push(same);
    if(lines[idx+1])candidates.push(lines[idx+1]);
    if(lines[idx+2])candidates.push(lines[idx+2]);
  }
  const byLabel=valueAfterOcrLabel(block,/성적\s*등급|성적등급/i);
  if(byLabel)candidates.unshift(byLabel);
  for(const raw of candidates){
    const compact=String(raw).toUpperCase()
      .replace(/[−–—‐]/g,'-')
      .replace(/[ＯO○]/g,'0')
      .replace(/\s+/g,'');
    let m=compact.match(/^(A|B|C|D)(\+|0|-)/);
    if(m)return normalizeGrade(m[1]+m[2]);
    m=compact.match(/^(A|B|C|D)$/);
    if(m)return normalizeGrade(m[1]+'0');
    if(/^F\b/.test(compact))return 'F';
    if(/^NP\b/.test(compact))return 'NP';
    if(/^P\b/.test(compact))return 'P';
  }
  // OCR frequently inserts spaces between the letter and +/-; scan only grade-like tokens.
  const normalized=String(block||'').toUpperCase()
    .replace(/[−–—‐]/g,'-')
    .replace(/[ＯO○]/g,'0');
  const token=normalized.match(/(?:^|[\s:：])([ABCD])\s*([+\-0])(?=$|[\s|])/m);
  if(token)return normalizeGrade(token[1]+token[2]);
  const simple=normalized.match(/(?:성적\s*등급|성적등급)[^\n]*\n?\s*(F|NP|P)(?=$|[\s|])/i);
  return simple?normalizeGrade(simple[1]):'';
}
function parseCredits(block){
  const byLabel=valueAfterOcrLabel(block,/(?:^|\s)학점(?:\s|$)/);
  let m=String(byLabel).match(/(\d+(?:\.\d+)?)/);
  if(m)return Number(m[1]);
  m=String(block).match(/학점\s*[:：]?\s*(\d+(?:\.\d+)?)/);
  return m?Number(m[1]):null;
}
function parsePortalCategory(block){
  const byLabel=valueAfterOcrLabel(block,/과목\s*종별|과목종별/);
  const s=String(byLabel||block);
  const m=s.match(/(청강|공통|선수|전공|선택|교직)/);
  return m?m[1]:'';
}
function parseCourseName(block){
  let x=valueAfterOcrLabel(block,/교과\s*목명|교과목명/);
  if(x){
    x=x.replace(/^(?:담당교수|과목종별|학점).*$/,'').trim();
    if(x.length>1)return x;
  }
  return '';
}
function knownCatalogCodeList(){
  if(knownCatalogCodeList.cache)return knownCatalogCodeList.cache;
  const seen=new Set(), out=[];
  for(const c of allCatalogEntries()){
    const code=canonicalCode(c.courseCode);
    if(code && !seen.has(code)){seen.add(code);out.push(code);}
  }
  knownCatalogCodeList.cache=out;
  return out;
}
function editDistanceAtMostOne(a,b){
  a=String(a||'');b=String(b||'');
  if(a===b)return 0;
  if(Math.abs(a.length-b.length)>1)return 2;
  if(a.length===b.length){
    let diff=0;
    for(let i=0;i<a.length;i++)if(a[i]!==b[i]&&++diff>1)return 2;
    return diff;
  }
  const long=a.length>b.length?a:b, short=a.length>b.length?b:a;
  let i=0,j=0,diff=0;
  while(i<long.length&&j<short.length){
    if(long[i]===short[j]){i++;j++;continue;}
    if(++diff>1)return 2;
    i++;
  }
  return 1;
}
function detectCatalogCodeInText(raw){
  const upper=String(raw||'').toUpperCase().replace(/[−–—‐]/g,'-');
  const known=new Set(knownCatalogCodeList());
  const strict=[...upper.matchAll(/\b([A-Z]{2,5}\s*\d{4})(?:\s*-\s*(\d{2}))?\b/g)];
  for(const m of strict){
    const base=canonicalCode(m[1]);
    return {code:base,section:m[2]||'',method:known.has(base)?'exact':'exact_unmatched',raw:m[0]};
  }
  // 학정번호 한 글자 오인식(S↔5, O↔0 등)을 카탈로그에 존재하는 코드에 한해서만 복원한다.
  const tokens=[...upper.matchAll(/\b([A-Z0-9]{6,10})(?:\s*-\s*(\d{2}))?\b/g)];
  const splitLike=[...upper.matchAll(/\b([A-Z0-9]{2,5})\s+([A-Z0-9]{4})(?:\s*-\s*(\d{2}))?\b/g)].map(m=>({0:m[0],1:m[1]+m[2],2:m[3]||''}));
  for(const m of splitLike)tokens.push(m);
  for(const m of tokens){
    const token=m[1].replace(/\s+/g,'');
    const candidates=[];
    for(const code of knownCatalogCodeList()){
      if(Math.abs(code.length-token.length)>1)continue;
      const d=editDistanceAtMostOne(token,code);
      if(d<=1)candidates.push({code,d});
    }
    candidates.sort((a,b)=>a.d-b.d);
    if(candidates.length && candidates[0].d===1 && (candidates.length===1 || candidates[1].d>1)){
      return {code:candidates[0].code,section:m[2]||'',method:'fuzzy',raw:m[0]};
    }
  }
  return null;
}
function parseTsvLines(tsv){
  const rows=String(tsv||'').split(/\r?\n/).filter(Boolean);
  if(rows.length<2)return [];
  const groups=new Map();
  for(let i=1;i<rows.length;i++){
    const p=rows[i].split('\t');
    if(p.length<12 || p[0]!=='5')continue;
    const txt=p.slice(11).join('\t').trim();
    if(!txt)continue;
    const key=[p[1],p[2],p[3],p[4]].join('|');
    const word={text:txt,left:Number(p[6])||0,top:Number(p[7])||0,width:Number(p[8])||0,height:Number(p[9])||0,conf:Number(p[10])};
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(word);
  }
  return [...groups.values()].map(words=>{
    words.sort((a,b)=>a.left-b.left);
    const left=Math.min(...words.map(w=>w.left)), top=Math.min(...words.map(w=>w.top));
    const right=Math.max(...words.map(w=>w.left+w.width)), bottom=Math.max(...words.map(w=>w.top+w.height));
    const validConf=words.map(w=>w.conf).filter(x=>Number.isFinite(x)&&x>=0);
    return {text:words.map(w=>w.text).join(' '),left,top,right,bottom,width:right-left,height:bottom-top,conf:validConf.length?validConf.reduce((a,b)=>a+b,0)/validConf.length:null};
  }).sort((a,b)=>a.top-b.top||a.left-b.left);
}
function buildCandidateFromCode(detected,block,term,lineConf=null){
  const code=canonicalCode(detected.code);
  let matched=preferredCatalogMatchByCode(code);
  const ocrName=parseCourseName(block);
  if(!matched && ocrName)matched=preferredCatalogMatchByName(ocrName);
  const portalCategory=parsePortalCategory(block);
  const category=mapPortalCategory(portalCategory,matched);
  let credits=parseCredits(block);
  if(category==='common'||category==='audit')credits=0;
  if(credits==null)credits=matched?.credits ?? defaultCredit(term,category,code);
  if(/^SPT/.test(code))credits=2;
  else if(category!=='common' && category!=='audit' && !DATA.specialCourses.some(x=>canonicalCode(x.courseCode)===code) && termIndex(term)<termIndex('2025-1'))credits=2;
  let grade=parseGrade(block);
  if(category==='common'){credits=0;grade='P';}
  if(category==='audit')credits=0;
  const gradePass=gradePasses(grade);
  const passed=['common','audit'].includes(category)?true:(gradePass==null?true:gradePass);
  return {
    selected:true,term,courseCode:code,section:detected.section||'',
    courseName:matched?.courseName||ocrName||`미확인 과목 ${code}`,
    ocrCourseName:ocrName,portalCategory,category,credits:Number(credits||0),grade,passed,
    matched:!!matched,matchMajor:matched?.major||'',confidence:matched?'code':'ocr',
    majorTeachingSwitchable:!!(matched && matched.major===state.profile.major && Array.isArray(matched.categoryOptions) && matched.categoryOptions.includes('teaching') && matched.categoryOptions.includes('major_elective')),
    codeMethod:detected.method||'exact',lineConfidence:lineConf,gradeSource:grade?'initial':''
  };
}
function parseOcrCandidates(text,term){
  const cleaned=cleanOcrText(text);
  const codeRe=/\b([A-Z]{2,5}\s*\d{4})(?:\s*-\s*(\d{2}))?\b/g;
  const matches=[...cleaned.matchAll(codeRe)];
  const results=[],seen=new Set();
  for(let i=0;i<matches.length;i++){
    const detected=detectCatalogCodeInText(matches[i][0]);
    if(!detected || seen.has(detected.code))continue;
    const start=matches[i].index;
    const end=i+1<matches.length?matches[i+1].index:cleaned.length;
    const block=cleaned.slice(start,end);
    results.push(buildCandidateFromCode(detected,block,term));
    seen.add(detected.code);
  }
  return results;
}
function supplementCandidatesByTsvLines(results,tsv,term){
  const seen=new Set(results.map(r=>canonicalCode(r.courseCode)));
  const lines=parseTsvLines(tsv);
  for(const line of lines){
    const detected=detectCatalogCodeInText(line.text);
    if(!detected || seen.has(detected.code))continue;
    results.push(buildCandidateFromCode(detected,line.text,term,line.conf));
    seen.add(detected.code);
  }
  return results;
}
function supplementCandidatesByCatalogName(results,text,term){
  const seen=new Set(results.map(r=>canonicalCode(r.courseCode)||normName(r.courseName)));
  const compact=normName(text);
  if(!compact)return results;
  const pool=allCatalogEntries();
  for(const c of pool){
    const code=canonicalCode(c.courseCode);
    const names=[c.courseName,...(c.aliases||[])].map(normName).filter(n=>n.length>=5);
    if(!names.some(n=>compact.includes(n)))continue;
    const key=code||normName(c.courseName);
    if(seen.has(key))continue;
    results.push({
      selected:false,term,courseCode:code,section:'',courseName:c.courseName,
      ocrCourseName:c.courseName,portalCategory:'',category:c.category||'unknown',
      credits:c.category==='common'||c.category==='audit'?0:(/^SPT/.test(code)?2:(c.credits??defaultCredit(term,c.category,code))),
      grade:c.category==='common'?'P':'',passed:true,matched:true,matchMajor:c.major||'',confidence:'name',codeMethod:'name',gradeSource:'',lineConfidence:null
    });
    seen.add(key);
  }
  return results;
}
function parseGradeLoose(block){
  const normalized=String(block||'').toUpperCase().replace(/[−–—‐]/g,'-').replace(/[ＯO○]/g,'0');
  const tokens=[...normalized.matchAll(/(?:^|[\s|:：])((?:A|B|C|D)\s*[+\-0]|F|NP|P)(?=$|[\s|,])/g)].map(m=>normalizeGrade(m[1].replace(/\s+/g,''))).filter(Boolean);
  const valid=tokens.filter(g=>Object.prototype.hasOwnProperty.call(GRADE_POINTS,g)||g==='P'||g==='NP');
  return valid.length?valid[valid.length-1]:'';
}
function findOcrLineForCandidate(lines,candidate){
  const code=canonicalCode(candidate.courseCode);
  return lines.find(line=>detectCatalogCodeInText(line.text)?.code===code)||null;
}
async function refineOcrGradesByRow(candidates,tsv,worker,prepared){
  const lines=parseTsvLines(tsv);
  if(!lines.length)return candidates;
  const anchors=candidates.map(r=>({r,line:findOcrLineForCandidate(lines,r)})).filter(x=>x.line).sort((a,b)=>a.line.top-b.line.top);
  const targets=anchors.filter(x=>!x.r.grade && !['common','audit'].includes(x.r.category)).slice(0,10);
  if(!targets.length)return candidates;
  await worker.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1',user_defined_dpi:'300'});
  for(let i=0;i<targets.length;i++){
    const {r,line}=targets[i];
    if(Number.isFinite(line.conf))r.lineConfidence=line.conf;
    const anchorIndex=anchors.findIndex(x=>x.r===r);
    const next=anchorIndex>=0?anchors[anchorIndex+1]:null;
    const pad=Math.max(10,Math.round(line.height*0.8));
    const top=Math.max(0,Math.round(line.top-pad));
    let bottom=next?Math.round(next.line.top-pad):Math.round(line.bottom+Math.max(220,line.height*10));
    bottom=Math.min(prepared.height,Math.max(top+Math.max(80,line.height*3),bottom));
    const rectangle={left:0,top,width:prepared.width,height:bottom-top};
    document.getElementById('ocrStatus').textContent=`성적 보강 인식 중 · ${i+1}/${targets.length}`;
    document.getElementById('ocrProgressBar').style.width=`${85+Math.round((i+1)/targets.length*13)}%`;
    try{
      const rr=await worker.recognize(prepared,{rectangle},{text:true});
      const rowText=rr?.data?.text||'';
      const grade=parseGrade(rowText)||parseGradeLoose(rowText);
      if(grade){
        r.grade=grade;r.gradeSource='row';
        const p=gradePasses(grade);if(p!=null)r.passed=p;
      }
    }catch(e){console.warn('row OCR retry failed',e);}
  }
  await worker.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1',user_defined_dpi:'300'});
  return candidates;
}
function finalizeOcrConfidence(candidates){
  for(const r of candidates){
    const gradeRequired=!['common','audit'].includes(r.category);
    const portalTeaching=r.category==='teaching' && String(r.portalCategory||'').replace(/\s+/g,'').includes('교직');
    let level='high', reason='학정번호·성적 확인';
    if(!r.matched && portalTeaching){
      if(gradeRequired&&!r.grade){level='review';reason='교직 종별 인식 · 성적 확인 필요';}
      else if(r.codeMethod==='fuzzy'){level='review';reason='교직 종별 인식 · 학정번호 1글자 보정';}
      else if(Number.isFinite(r.lineConfidence)&&r.lineConfidence<55){level='review';reason='교직 종별 인식 · 문자 인식 신뢰도 낮음';}
      else {level='high';reason='교직 종별 인식';}
    }
    else if(!r.matched){level='low';reason='카탈로그 미매칭';}
    else if(r.codeMethod==='name'){level='low';reason='과목명으로만 감지';}
    else if(gradeRequired&&!r.grade){level='review';reason='성적 확인 필요';}
    else if(r.codeMethod==='fuzzy'){level='review';reason='학정번호 1글자 보정';}
    else if(Number.isFinite(r.lineConfidence)&&r.lineConfidence<55){level='review';reason='문자 인식 신뢰도 낮음';}
    r.confidenceLevel=level;r.confidenceReason=reason;
    r.needsReview=level!=='high';
    if(r.needsReview)r.selected=false;
  }
  return candidates;
}


function fieldConfidenceHtml(r,source='ocr'){
  const chip=(label,level,title='')=>`<span class="field-chip ${level}"${title?` title="${esc(title)}"`:''}>${esc(label)}</span>`;
  if(source==='pdf'){
    const code=canonicalCode(r.courseCode)?'high':'low';
    const name=plausiblePortalCourseName(r.pdfCourseName||'')?'high':r.ocrCourseName?'review':plausiblePortalCourseName(r.courseName)?'review':'low';
    const cat=pdfKnownCategory(r.pdfPortalCategory||'')?'high':pdfKnownCategory(r.portalCategory||'')?'review':'low';
    const credit=(r.pdfCredits!==null&&r.pdfCredits!==undefined)?'high':Number.isFinite(Number(r.credits))?'review':'low';
    const grade=r.pdfGrade?'high':r.grade?'review':(['common','audit'].includes(r.category)?'high':'low');
    return `<div class="field-confidence">${chip('학정번호',code)}${chip('과목명',name)}${chip('종별',cat)}${chip('학점',credit)}${chip('성적',grade)}</div>`;
  }
  const code=(r.codeMethod==='exact'&&r.matched)?'high':canonicalCode(r.courseCode)?'review':'low';
  const name=r.matched?'high':r.courseName?'review':'low';
  const cat=r.portalCategory||r.matched?'review':'low';
  const credit=Number.isFinite(Number(r.credits))?(r.matched?'high':'review'):'low';
  const grade=r.grade?(r.gradeSource==='row'||r.gradeSource==='manual'?'high':'review'):(['common','audit'].includes(r.category)?'high':'low');
  return `<div class="field-confidence">${chip('학정번호',code)}${chip('과목명',name)}${chip('종별',cat)}${chip('학점',credit)}${chip('성적',grade)}</div>`;
}

function renderOcrCandidates(){
  const box=document.getElementById('ocrResult');
  if(!ocrCandidates.length){
    box.innerHTML=`<div class="callout badbox">학정번호가 포함된 과목을 찾지 못했습니다. 캡처에 <b>학정번호-분반</b>과 성적이 보이도록 다시 캡처하거나 직접 입력하십시오.</div>`;
    return;
  }
  const high=ocrCandidates.filter(r=>r.confidenceLevel==='high').length;
  const review=ocrCandidates.length-high;
  box.innerHTML=`
    <div class="callout"><b>${ocrCandidates.length}개 과목 후보</b> · 자동확인 ${high}개 · 확인 필요 ${review}개<br>
    학정번호를 중심으로 카탈로그를 대조했으며, 성적이 불명확한 항목은 영역 재인식을 수행했습니다. <span class="warn">확인 필요 항목은 기본 선택이 해제됩니다.</span></div>
    <div class="table-wrap" style="margin-top:10px;max-height:420px">
      <table>
        <thead><tr><th>등록</th><th>과목</th><th>OCR 종별</th><th>계산 종별</th><th>학점</th><th>성적</th><th>신뢰도</th></tr></thead>
        <tbody>
        ${ocrCandidates.map((r,i)=>{
          const cls=r.confidenceLevel==='low'?'ocr-row-low':r.confidenceLevel==='review'?'ocr-row-review':'';
          const badgeClass=r.confidenceLevel==='high'?'conf-high':r.confidenceLevel==='review'?'conf-review':'conf-low';
          const badgeLabel=r.confidenceLevel==='high'?'높음':r.confidenceLevel==='review'?'확인 필요':'낮음';
          const portalTeaching=r.category==='teaching' && String(r.portalCategory||'').replace(/\s+/g,'').includes('교직');
          const matchLabel=r.majorTeachingSwitchable?'전공교직 인식':(!r.matched&&portalTeaching)?'교직 종별 인식':r.codeMethod==='fuzzy'?'학정번호 보정':r.codeMethod==='name'?'과목명 감지':r.matched?'학정번호 매칭':'미매칭';
          return `<tr class="${cls}">
          <td><input class="ocr-check ocr-select" data-i="${i}" type="checkbox" ${r.selected?'checked':''}></td>
          <td><div class="course-name">${esc(r.courseName)}</div><div class="muted mono">${esc(r.courseCode)}${r.section?'-'+esc(r.section):''} · ${esc(r.term)}</div><div class="muted">${esc(matchLabel)}</div></td>
          <td>${esc(r.portalCategory||'미인식')}</td>
          <td><select class="inline-select ocr-cat" data-i="${i}">${categoryOptionsHtml(r.category)}</select></td>
          <td><select class="inline-select ocr-credit" data-i="${i}">${creditOptionsHtml(r.credits)}</select></td>
          <td><select class="inline-select ocr-grade" data-i="${i}">${gradeOptionsHtml(r.grade,true)}</select></td>
          <td><div class="ocr-confidence"><span class="badge ${badgeClass}">${badgeLabel}</span><span class="muted">${esc(r.confidenceReason||'')}</span>${fieldConfidenceHtml(r,'ocr')}</div></td>
        </tr>`;
        }).join('')}
        </tbody>
      </table>
    </div>
    <div class="toolbar" style="margin-top:10px">
      <button class="btn primary" id="importOcrCandidates">선택 과목 일괄등록</button>
      <button class="btn" id="clearOcrCandidates">결과 지우기</button>
    </div>`;
  document.querySelectorAll('.ocr-select').forEach(x=>x.onchange=()=>{ocrCandidates[+x.dataset.i].selected=x.checked;});
  document.querySelectorAll('.ocr-cat').forEach(x=>x.onchange=()=>{
    const r=ocrCandidates[+x.dataset.i];r.category=x.value;
    if(r.category==='common'){r.credits=0;r.grade='P';r.passed=true;}
    else if(r.category==='audit'){r.credits=0;r.passed=true;}
    finalizeOcrConfidence([r]);
    if(!r.needsReview)r.selected=true;
    renderOcrCandidates();
  });
  document.querySelectorAll('.ocr-credit').forEach(x=>x.onchange=()=>{ocrCandidates[+x.dataset.i].credits=Number(x.value||0);});
  document.querySelectorAll('.ocr-grade').forEach(x=>x.onchange=()=>{
    const r=ocrCandidates[+x.dataset.i];
    r.grade=normalizeGrade(x.value);
    const p=gradePasses(r.grade);if(p!=null)r.passed=p;
    if(r.grade)r.gradeSource='manual';
    finalizeOcrConfidence([r]);
    if(!r.needsReview)r.selected=true;
    renderOcrCandidates();
  });
  document.getElementById('importOcrCandidates').onclick=importOcrCandidates;
  document.getElementById('clearOcrCandidates').onclick=()=>{ocrCandidates=[];box.innerHTML='';};
}


async function ensureOcrWorker(){
  if(ocrWorker)return ocrWorker;
  await ensureTesseractLib();
  ocrWorker=await window.Tesseract.createWorker('kor+eng',1,{
    workerPath:'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
    corePath:'https://cdn.jsdelivr.net/npm/tesseract.js-core@5',
    langPath:'https://tessdata.projectnaptha.com/4.0.0',
    logger:m=>{
      const status=document.getElementById('ocrStatus'), bar=document.getElementById('ocrProgressBar');
      const pct=Number(m.progress||0);
      const batch=ocrBatchContext;
      const overall=batch?Math.min(1,((batch.index-1)+pct)/batch.total):pct;
      bar.style.width=Math.round(overall*100)+'%';
      const labels={
        'loading tesseract core':'OCR 엔진 불러오는 중',
        'initializing tesseract':'OCR 엔진 초기화 중',
        'loading language traineddata':'한글/영문 언어 데이터 불러오는 중',
        'initializing api':'문자 인식 준비 중',
        'recognizing text':'이미지 문자 인식 중'
      };
      const prefix=batch?`${batch.index}/${batch.total} · `:'';
      status.textContent=prefix+(labels[m.status]||m.status||'OCR 처리 중')+(pct?` · ${Math.round(pct*100)}%`:'');
    }
  });
  await ocrWorker.setParameters({
    tessedit_pageseg_mode:'11',
    preserve_interword_spaces:'1',
    user_defined_dpi:'300'
  });
  return ocrWorker;
}

async function preprocessOcrImage(blob,aggressive=false){
  const bitmap=await createImageBitmap(blob);
  const maxDim=aggressive?5600:4600;
  const maxScale=aggressive?4:3;
  const scale=Math.max(1,Math.min(maxScale,maxDim/Math.max(bitmap.width,bitmap.height)));
  const canvas=document.createElement('canvas');
  canvas.width=Math.round(bitmap.width*scale);
  canvas.height=Math.round(bitmap.height*scale);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  if(bitmap.close)bitmap.close();

  const image=ctx.getImageData(0,0,canvas.width,canvas.height);
  const d=image.data;
  const hist=new Uint32Array(256);
  for(let i=0;i<d.length;i+=4){
    const g=Math.max(0,Math.min(255,Math.round(0.299*d[i]+0.587*d[i+1]+0.114*d[i+2])));
    hist[g]++;
    d[i]=d[i+1]=d[i+2]=g;
  }
  const px=canvas.width*canvas.height;
  const lowTarget=px*(aggressive?0.015:0.01), highTarget=px*(aggressive?0.985:0.99);
  let acc=0, low=0, high=255;
  for(let i=0;i<256;i++){acc+=hist[i];if(acc>=lowTarget){low=i;break;}}
  acc=0;
  for(let i=0;i<256;i++){acc+=hist[i];if(acc>=highTarget){high=i;break;}}
  if(high<=low+8){low=0;high=255;}
  const span=high-low;
  for(let i=0;i<d.length;i+=4){
    let g=Math.round((d[i]-low)*255/span);
    g=Math.max(0,Math.min(255,g));
    g = g < (aggressive?155:145) ? Math.max(0,g-(aggressive?28:18)) : Math.min(255,g+(aggressive?12:8));
    d[i]=d[i+1]=d[i+2]=g;
  }
  ctx.putImageData(image,0,0);
  return canvas;
}

function countCourseCodes(text){
  return ([...String(text||'').matchAll(/\b[A-Z]{2,5}\s*\d{4}(?:\s*-\s*\d{2})?\b/g)]).length;
}
function ocrConfidenceScore(r){
  const level={high:30,review:20,low:10}[r?.confidenceLevel]||0;
  return level+(r?.grade?4:0)+(r?.matched?3:0)+(canonicalCode(r?.courseCode)?3:0)+(Number(r?.credits)>=0?1:0);
}
function mergeOcrCandidateBatches(items){
  const map=new Map();
  for(const r of items||[]){
    const key=historyRecordKey(r.term,r.courseCode,r.courseName)||`${r.term}|${normName(r.courseName)}|${Math.random()}`;
    const prev=map.get(key);
    if(!prev || ocrConfidenceScore(r)>ocrConfidenceScore(prev))map.set(key,r);
  }
  return [...map.values()];
}
async function recognizeOcrQueueItem(item,worker,index,total){
  ocrBatchContext={index,total};
  document.getElementById('ocrStatus').textContent=`${index}/${total} · ${item.name} 확대·명암 보정 중…`;
  let prepared=null;
  try{
    prepared=await preprocessOcrImage(item.blob,false);
    await worker.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1',user_defined_dpi:'300'});
    let result=await worker.recognize(prepared,{}, {text:true,tsv:true});
    let text=result?.data?.text||'',tsv=result?.data?.tsv||'';
    let candidates=parseOcrCandidates(text,item.term);
    candidates=supplementCandidatesByTsvLines(candidates,tsv,item.term);
    if(!candidates.length || countCourseCodes(text)===0){
      document.getElementById('ocrStatus').textContent=`${index}/${total} · 작은 글씨 자동 확대 재인식 중…`;
      releaseCanvas(prepared);prepared=await preprocessOcrImage(item.blob,true);
      await worker.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1',user_defined_dpi:'360'});
      const retry=await worker.recognize(prepared,{}, {text:true,tsv:true});
      text=text+'\n'+(retry?.data?.text||'');tsv=tsv+'\n'+(retry?.data?.tsv||'');
      candidates=parseOcrCandidates(text,item.term);candidates=supplementCandidatesByTsvLines(candidates,tsv,item.term);
      await worker.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1',user_defined_dpi:'300'});
    }
    candidates=supplementCandidatesByCatalogName(candidates,text,item.term);
    candidates=await refineOcrGradesByRow(candidates,tsv,worker,prepared);
    candidates=finalizeOcrConfidence(candidates);
    return {candidates,text};
  }finally{releaseCanvas(prepared);}
}
async function runOcr(){
  if(!ocrImageQueue.length){alert('성적 캡처 이미지를 한 장 이상 선택하거나 붙여넣으십시오.');return;}
  const btn=document.getElementById('runOcr');
  btn.disabled=true; btn.textContent='여러 장 OCR 처리 중…';
  document.getElementById('ocrProgressBar').style.width='2%';
  document.getElementById('ocrResult').innerHTML='';
  try{
    const worker=await ensureOcrWorker();
    const all=[]; const raw=[];
    for(let i=0;i<ocrImageQueue.length;i++){
      const item=ocrImageQueue[i];
      const one=await recognizeOcrQueueItem(item,worker,i+1,ocrImageQueue.length);
      all.push(...one.candidates);
      raw.push(`===== ${i+1}. ${item.name} · ${item.term} =====\n${one.text}`);
    }
    ocrCandidates=mergeOcrCandidateBatches(all);
    ocrCandidates=finalizeOcrConfidence(ocrCandidates);
    const high=ocrCandidates.filter(r=>r.confidenceLevel==='high').length;
    const review=ocrCandidates.length-high;
    document.getElementById('ocrStatus').textContent=`OCR 완료 · 캡처 ${ocrImageQueue.length}장 · 중복 통합 후 ${ocrCandidates.length}개 후보 · 자동확인 ${high} · 확인 필요 ${review}`;
    document.getElementById('ocrProgressBar').style.width='100%';
    renderOcrCandidates();
    const box=document.getElementById('ocrResult');
    box.insertAdjacentHTML('beforeend',`<details style="margin-top:10px"><summary>OCR 인식 원문 보기 (문제 진단용)</summary><pre class="ocr-raw">${esc(raw.join('\n\n'))}</pre></details>`);
  }catch(err){
    console.error(err);
    document.getElementById('ocrStatus').textContent='OCR 실패';
    document.getElementById('ocrResult').innerHTML=`<div class="callout badbox">OCR 처리에 실패했습니다: ${esc(err?.message||err)}<br>인터넷 연결을 확인한 뒤 다시 시도하십시오. 이미지는 서버에 저장하지 않습니다.</div>`;
  }finally{
    ocrBatchContext=null;
    btn.disabled=false; btn.textContent='선택한 캡처 OCR';
  }
}

function importOcrCandidates(){
  const selected=ocrCandidates.filter(x=>x.selected);
  if(!selected.length){alert('등록할 과목을 선택하십시오.');return;}
  let added=0, skipped=0;
  for(const r of selected){
    const exists=historyAlreadyExists(r.term,r.courseCode,r.courseName);
    if(exists){skipped++;continue;}
    const rec={
      id:uid('h'),term:r.term,courseCode:canonicalCode(r.courseCode),courseName:r.courseName,
      category:r.category||'unknown',credits:Number(r.credits||0),passed:r.passed!==false,
      grade:r.grade||'',portalCategory:r.portalCategory||'',source:'ocr_screenshot'
    };
    const guard=historyRecordIssues(rec);
    if(guard.critical.length){skipped++;continue;}
    state.history.push(rec);
    added++;
  }
  save();render();
  document.getElementById('ocrStatus').textContent=`일괄등록 완료 · ${added}개 등록${skipped?` · 중복 ${skipped}개 건너뜀`:''}`;
  ocrCandidates=[];
  document.getElementById('ocrResult').innerHTML='';
}


let portalPdfCandidates=[];

function pdfValueText(v){
  // PDF.js가 글자 단위로 텍스트를 추출하며 한글 사이에 공백이 끼는 현상 보정
  return String(v==null?'':v).replace(/([가-힣])\s+(?=[가-힣])/g,'$1').trim();
}
function pdfNormalizeTerm(raw){
  const s=pdfValueText(raw)
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF\u0000-\u001F]/g,'')
    .replace(/\s+/g,'');

  // 2023-0 같은 특수학기 표기가 있으면 '인정학점'보다 우선하여 그대로 보존한다.
  let m=s.match(/(20\d{2})[^0-9]{0,10}([012])(?:[^0-9]{0,6}학기)?/);
  if(m && (m[2]==='0' || /학기/.test(s)))return `${m[1]}-${m[2]}`;

  if(/인정학점/.test(s))return PRE_ADMISSION_TERM;

  // PDF.js가 한글 일부를 깨뜨려도 '연도 + 학기 숫자'는 보존되는 경우가 많다.
  const digits=s.replace(/\D/g,'');
  m=digits.match(/^(20\d{2})([012])/);
  return m?`${m[1]}-${m[2]}`:'';
}
function pdfGradeValue(raw){
  const s=pdfValueText(raw).toUpperCase().replace(/[−–—‐]/g,'-').replace(/[ＯO○]/g,'0');
  if(/^W$/.test(s))return 'W';
  if(/^Z\d+$/i.test(s))return '';
  return normalizeGrade(s);
}
function groupPdfItemsIntoLines(items,tolerance=4.5){
  const rows=[];
  const sorted=[...items]
    .filter(it=>pdfValueText(it.str))
    .map(it=>({
      str:pdfValueText(it.str),
      x:Number(it.transform?.[4]||0),
      y:Number(it.transform?.[5]||0),
      w:Number(it.width||0)
    }))
    .sort((a,b)=>b.y-a.y || a.x-b.x);
  for(const item of sorted){
    let row=rows.find(r=>Math.abs(r.y-item.y)<=tolerance);
    if(!row){row={y:item.y,items:[]};rows.push(row);}
    row.items.push(item);
  }
  rows.sort((a,b)=>b.y-a.y);
  rows.forEach(r=>r.items.sort((a,b)=>a.x-b.x));
  return rows;
}
function pdfJoinCellItems(items,{multiline=false}={}){
  const arr=[...(items||[])].sort((a,b)=>{
    const dy=Number(b.y||0)-Number(a.y||0);
    if(Math.abs(dy)>1.2)return dy; // 위 줄 → 아래 줄
    return Number(a.x||0)-Number(b.x||0);
  });
  if(!arr.length)return '';

  let out='';
  let prev=null;
  for(const it of arr){
    const s=pdfValueText(it.str);
    if(!s)continue;

    if(!out){out=s;prev=it;continue;}

    const sameColumn=prev && Math.abs(Number(it.x||0)-Number(prev.x||0))<3.5;
    const differentLine=prev && Math.abs(Number(it.y||0)-Number(prev.y||0))>1.2;

    // 교과목명이 셀 안에서 자동 줄바꿈된 경우는 원래 한 문자열이므로 공백 없이 연결.
    if(multiline && sameColumn && differentLine)out+=s;
    else out+=' '+s;

    prev=it;
  }
  return out.replace(/\s+/g,' ').trim();
}
function pdfTermFromRowItems(items){
  // 연세포털 출력물에서 학기 열은 표의 가장 왼쪽 열이다.
  // 전체 행 문자열을 쓰면 신청/취득학점 숫자가 섞일 수 있으므로 왼쪽 셀만 읽는다.
  const xs=items.map(x=>Number(x.x||0)).filter(Number.isFinite);
  if(!xs.length)return '';
  const left=Math.min(...xs);
  const leftItems=items.filter(x=>Number(x.x||0)<=left+78);
  const raw=leftItems.map(x=>pdfValueText(x.str)).join('');
  return pdfNormalizeTerm(raw);
}
function pdfKnownCategory(text){
  const s=pdfValueText(text).replace(/\s+/g,'');
  for(const c of ['청강','공통','교직','전공','선택']){
    if(s===c || s.endsWith(c))return c;
  }
  return '';
}
function pdfFindCode(items){
  for(let i=0;i<items.length;i++){
    let joined='';
    for(let len=1;len<=5 && i+len<=items.length;len++){
      joined+=pdfTokenCompact(items[i+len-1].str);
      const m=joined.match(/^([A-Z]{2,5}\d{4})(?:0?(\d{1,2}))?$/);
      if(m){
        return {
          index:i,
          endIndex:i+len,
          code:canonicalCode(m[1]),
          section:m[2]||''
        };
      }
      if(joined.length>11)break;
    }
  }
  return null;
}
function pdfFindGradeToken(items,startIndex){
  for(let i=items.length-1;i>startIndex;i--){
    const raw=pdfValueText(items[i].str).toUpperCase()
      .replace(/[−–—‐]/g,'-').replace(/[ＯO○]/g,'0')
      .replace(/[^\x20-\x7Eㄱ-ㅎ가-힣]/g,'');
    if(/^W$/.test(raw))return {index:i,grade:'W',raw};
    if(/^NP$/.test(raw))return {index:i,grade:'NP',raw};
    if(/^P$/.test(raw))return {index:i,grade:'P',raw};
    if(/^F$/.test(raw))return {index:i,grade:'F',raw};
    if(/^[A-D](?:\+|0|-)$/.test(raw))return {index:i,grade:normalizeGrade(raw),raw};
  }
  return null;
}
function pdfFindCreditIndex(items,gradeIndex,codeIndex){
  const end=gradeIndex==null?items.length:gradeIndex;
  for(let i=end-1;i>codeIndex;i--){
    const s=pdfValueText(items[i].str).replace(/,/g,'');
    if(/^\d+(?:\.\d+)?$/.test(s)){
      const n=Number(s);
      if(n>=0 && n<=9)return i;
    }
  }
  return -1;
}
function parsePortalPdfYonseiFixed(rows,pageWidth,pageNo=1){
  // 연세포털 전체성적조회 [출력] PDF의 표 열 경계.
  // 절대 px가 아니라 A4 페이지 폭 대비 비율로 계산한다.
  const ratios=[
    0,       // page left
    .207,    // 학기 | 신청
    .250,    // 신청 | 취득
    .292,    // 취득 | 평균
    .343,    // 평균 | 종별
    .392,    // 종별 | 학정번호
    .470,    // 학정번호 | 분반
    .509,    // 분반 | 교과목명
    .697,    // 교과목명 | 담당교수
    .763,    // 담당교수 | 학점
    .807,    // 학점 | 평가
    .857,    // 평가 | 비고
    1.01
  ];
  const labels=['학기','신청','취득','평균','종별','학정번호','분반','교과목명','담당교수','학점','평가','비고'];
  const bounds=ratios.map(r=>r*pageWidth);
  const courseRows=[];
  let currentTerm='';
  let detectedCodeCount=0;

  for(const row of rows){
    const cells=Object.fromEntries(labels.map(x=>[x,[]]));

    for(const it of row.items){
      const x=Number(it.x||0);
      let ci=0;
      while(ci<labels.length-1 && x>=bounds[ci+1])ci++;
      cells[labels[Math.min(ci,labels.length-1)]].push(it);
    }

    const val={};
    for(const label of labels){
      val[label]=pdfJoinCellItems(cells[label],{multiline:label==='교과목명'});
    }

    const detectedTerm=pdfNormalizeTerm(val['학기']);
    let rowTerm=currentTerm;
    if(detectedTerm===PRE_ADMISSION_TERM){
      // 인정학점은 이 행만 입학 전으로 분류. 정규학기 currentTerm을 덮어쓰지 않는다.
      rowTerm=PRE_ADMISSION_TERM;
    }else if(detectedTerm){
      currentTerm=detectedTerm;
      rowTerm=currentTerm;
    }

    const codeRaw=pdfTokenCompact(val['학정번호']);
    const codeMatch=codeRaw.match(/([A-Z]{2,5}\d{4})/);
    if(!codeMatch)continue;
    detectedCodeCount++;

    const code=canonicalCode(codeMatch[1]);
    const matched=preferredCatalogMatchByCode(code);
    const portalCategory=pdfKnownCategory(val['종별'])||pdfValueText(val['종별']);
    const category=mapPortalCategory(portalCategory,matched);

    const sectionMatch=pdfValueText(val['분반']).match(/\d{1,2}/);
    const section=sectionMatch?sectionMatch[0].padStart(2,'0'):'';
    const parsedName=pdfValueText(val['교과목명']);
    const professor=pdfValueText(val['담당교수']);

    const creditMatch=pdfValueText(val['학점']).match(/\d+(?:\.\d+)?/);
    const credits=creditMatch
      ? Number(creditMatch[0])
      : (matched?.credits??defaultCredit(currentTerm||state.profile.admissionTerm,category,code));

    const rawGrade=pdfValueText(val['평가']);
    const grade=pdfGradeValue(rawGrade);
    const passed=grade==='W'?false:(grade?gradePasses(grade)!==false:true);
    const courseName=matched?.courseName||parsedName||code;
    const note=pdfValueText(val['비고']);

    courseRows.push({
      selected:true,
      term:rowTerm||currentTerm||state.profile.admissionTerm,
      courseCode:code,
      section,
      courseName,
      pdfCourseName:parsedName,
      pdfPortalCategory:pdfKnownCategory(portalCategory)||'',
      pdfCredits:creditMatch?Number(creditMatch[0]):null,
      pdfGrade:grade||'',
      professor,
      portalCategory,
      category,
      credits:['common','audit'].includes(category)?0:credits,
      grade,
      rawGrade,
      passed,
      note,
      matched:!!matched,
      matchMajor:matched?.major||'',
      majorTeachingSwitchable:!!(matched && matched.major===state.profile.major && Array.isArray(matched.categoryOptions) &&
        matched.categoryOptions.includes('teaching') && matched.categoryOptions.includes('major_elective')),
      confidenceLevel:'high',
      confidenceReason:matched?'연세포털 PDF 표 직접 추출 · 카탈로그 확인':'연세포털 PDF 표 직접 추출',
      source:'portal_pdf',
      _pdfPage:pageNo,
      _pdfY:Number(row.y||0)
    });
  }

  return {rows:courseRows,detectedCodeCount,parser:'yonsei_fixed'};
}
function pdfHeaderGeometry(rows){
  const labels=['학기','신청','취득','평균','종별','학정번호','분반','교과목명','담당교수','학점','평가','비고'];
  for(const row of rows){
    const found={};
    for(const it of row.items){
      const s=pdfValueText(it.str).normalize('NFKC').replace(/\s+/g,'');
      const label=labels.find(x=>s===x);
      if(label)found[label]=Number(it.x||0);
    }
    if(found['학기']!=null && found['종별']!=null && found['학정번호']!=null &&
       found['교과목명']!=null && found['학점']!=null && found['평가']!=null){
      return labels.filter(x=>found[x]!=null).map(label=>({label,x:found[label]})).sort((a,b)=>a.x-b.x);
    }
  }
  return null;
}
function pdfCellsByGeometry(items,geometry){
  const cells=Object.fromEntries(geometry.map(g=>[g.label,[]]));
  const bounds=[];
  for(let i=0;i<geometry.length-1;i++)bounds.push((geometry[i].x+geometry[i+1].x)/2);
  for(const it of items){
    const x=Number(it.x||0);
    let ci=0;
    while(ci<bounds.length && x>=bounds[ci])ci++;
    const label=geometry[Math.min(ci,geometry.length-1)].label;
    cells[label].push(it);
  }
  const values={};
  for(const [label,arr] of Object.entries(cells)){
    values[label]=pdfJoinCellItems(arr,{multiline:label==='교과목명'});
  }
  return values;
}
function parsePortalPdfGeometry(rows){
  const geometry=pdfHeaderGeometry(rows);
  if(!geometry)return {rows:[],detectedCodeCount:0,geometryFound:false};

  const courseRows=[];
  let currentTerm='';
  let detectedCodeCount=0;

  for(const row of rows){
    const cells=pdfCellsByGeometry(row.items,geometry);
    const detectedTerm=pdfNormalizeTerm(cells['학기']);
    let rowTerm=currentTerm;
    if(detectedTerm===PRE_ADMISSION_TERM){
      rowTerm=PRE_ADMISSION_TERM;
    }else if(detectedTerm){
      currentTerm=detectedTerm;
      rowTerm=currentTerm;
    }

    const codeRaw=pdfTokenCompact(cells['학정번호']);
    const codeMatch=codeRaw.match(/([A-Z]{2,5}\d{4})/);
    if(!codeMatch)continue;
    detectedCodeCount++;

    const code=canonicalCode(codeMatch[1]);
    const matched=preferredCatalogMatchByCode(code);
    const portalCategory=pdfKnownCategory(cells['종별'])||pdfValueText(cells['종별']);
    const category=mapPortalCategory(portalCategory,matched);

    const sectionMatch=pdfValueText(cells['분반']).match(/\d{1,2}/);
    const section=sectionMatch?sectionMatch[0].padStart(2,'0'):'';
    const parsedName=pdfValueText(cells['교과목명']);
    const professor=pdfValueText(cells['담당교수']);

    const creditMatch=pdfValueText(cells['학점']).match(/\d+(?:\.\d+)?/);
    const credits=creditMatch
      ? Number(creditMatch[0])
      : (matched?.credits??defaultCredit(currentTerm||state.profile.admissionTerm,category,code));

    const rawGrade=pdfValueText(cells['평가']);
    const grade=pdfGradeValue(rawGrade);
    const passed=grade==='W'?false:(grade?gradePasses(grade)!==false:true);
    const courseName=matched?.courseName||parsedName||code;
    const note=pdfValueText(cells['비고']);

    courseRows.push({
      selected:true,
      term:rowTerm||currentTerm||state.profile.admissionTerm,
      courseCode:code,
      section,
      courseName,
      pdfCourseName:parsedName,
      pdfPortalCategory:pdfKnownCategory(portalCategory)||'',
      pdfCredits:creditMatch?Number(creditMatch[0]):null,
      pdfGrade:grade||'',
      professor,
      portalCategory,
      category,
      credits:['common','audit'].includes(category)?0:credits,
      grade,
      rawGrade,
      passed,
      note,
      matched:!!matched,
      matchMajor:matched?.major||'',
      majorTeachingSwitchable:!!(matched && matched.major===state.profile.major && Array.isArray(matched.categoryOptions) && matched.categoryOptions.includes('teaching') && matched.categoryOptions.includes('major_elective')),
      confidenceLevel:'high',
      confidenceReason:matched?'PDF 표 직접 추출 · 카탈로그 확인':'PDF 표 직접 추출',
      source:'portal_pdf'
    });
  }
  return {rows:courseRows,detectedCodeCount,geometryFound:true};
}
function parsePortalPdfRows(rows){
  const courseRows=[];
  let currentTerm='';
  let detectedCodeCount=0;

  for(const row of rows){
    const detectedTerm=pdfTermFromRowItems(row.items);
    let rowTerm=currentTerm;
    if(detectedTerm===PRE_ADMISSION_TERM){
      rowTerm=PRE_ADMISSION_TERM;
    }else if(detectedTerm){
      currentTerm=detectedTerm;
      rowTerm=currentTerm;
    }

    const codeInfo=pdfFindCode(row.items);
    if(!codeInfo)continue;
    detectedCodeCount++;

    const {index:codeIndex,code}=codeInfo;
    const matched=preferredCatalogMatchByCode(code);

    let portalCategory='';
    for(let i=codeIndex-1;i>=0;i--){
      const c=pdfKnownCategory(row.items[i].str);
      if(c){portalCategory=c;break;}
    }

    let section=codeInfo.section||'';
    let afterStart=codeInfo.endIndex||codeIndex+1;
    if(!section && row.items[afterStart] && /^\d{1,2}$/.test(pdfValueText(row.items[afterStart].str))){
      section=pdfValueText(row.items[afterStart].str).padStart(2,'0');
      afterStart++;
    }

    const gradeInfo=pdfFindGradeToken(row.items,codeIndex);
    const creditIndex=pdfFindCreditIndex(row.items,gradeInfo?.index,codeIndex);
    const creditRaw=creditIndex>=0?pdfValueText(row.items[creditIndex].str):'';
    const creditsMatch=creditRaw.match(/\d+(?:\.\d+)?/);

    // 담당교수는 학점 바로 앞 텍스트, 교과목명은 분반 다음부터 담당교수 직전까지.
    // 학정번호가 카탈로그에서 확인되면 과목명은 카탈로그 값을 우선한다.
    let professor='';
    let parsedName='';
    if(creditIndex>afterStart){
      professor=pdfValueText(row.items[creditIndex-1].str);
      parsedName=row.items.slice(afterStart,creditIndex-1).map(x=>x.str).join(' ').trim();
    }else{
      parsedName=row.items.slice(afterStart,gradeInfo?.index??row.items.length).map(x=>x.str).join(' ').trim();
    }

    const rawGrade=gradeInfo?.raw||'';
    const grade=gradeInfo?.grade||pdfGradeValue(rawGrade);
    const category=mapPortalCategory(portalCategory,matched);
    const credits=creditsMatch
      ? Number(creditsMatch[0])
      : (matched?.credits??defaultCredit(currentTerm||state.profile.admissionTerm,category,code));
    const passed=grade==='W'?false:(grade?gradePasses(grade)!==false:true);
    const courseName=matched?.courseName||parsedName||code;

    // 평가 오른쪽의 비고(Z3 등)는 별도 보존
    const noteStart=(gradeInfo?.index??row.items.length)+1;
    const note=row.items.slice(noteStart).map(x=>x.str).join(' ').trim();

    courseRows.push({
      selected:true,
      term:rowTerm||currentTerm||state.profile.admissionTerm,
      courseCode:code,
      section,
      courseName,
      pdfCourseName:parsedName,
      pdfPortalCategory:pdfKnownCategory(portalCategory)||'',
      pdfCredits:creditMatch?Number(creditMatch[0]):null,
      pdfGrade:grade||'',
      professor,
      portalCategory,
      category,
      credits:['common','audit'].includes(category)?0:credits,
      grade,
      rawGrade,
      passed,
      note,
      matched:!!matched,
      matchMajor:matched?.major||'',
      majorTeachingSwitchable:!!(matched && matched.major===state.profile.major && Array.isArray(matched.categoryOptions) && matched.categoryOptions.includes('teaching') && matched.categoryOptions.includes('major_elective')),
      confidenceLevel:'high',
      confidenceReason:matched?'PDF 직접 추출 · 카탈로그 확인':'PDF 직접 추출',
      source:'portal_pdf'
    });
  }
  return {rows:courseRows,detectedCodeCount};
}
async function loadPdfDocument(data){
  await ensurePdfJsLib();
  window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  try{
    return await window.pdfjsLib.getDocument({data}).promise;
  }catch(firstErr){
    // 일부 모바일/보안 환경에서 Worker 로딩이 차단되는 경우 메인 스레드 방식으로 한 번 더 시도
    try{
      return await window.pdfjsLib.getDocument({data,disableWorker:true}).promise;
    }catch(secondErr){
      throw new Error(`PDF 문서를 열 수 없습니다: ${secondErr?.message||firstErr?.message||'알 수 없는 오류'}`);
    }
  }
}
function pdfTokenCompact(v){
  return pdfValueText(v).normalize('NFKC').toUpperCase().replace(/[^A-Z0-9]/g,'');
}
function pdfFindSequentialCodes(items){
  const found=[];
  let i=0;
  while(i<items.length){
    let hit=null;
    for(let len=1;len<=8 && i+len<=items.length;len++){
      const raw=items.slice(i,i+len).map(x=>pdfTokenCompact(x.str)).join('');
      const m=raw.match(/^([A-Z]{2,5}\d{4})$/);
      if(m){hit={start:i,end:i+len,code:canonicalCode(m[1])};break;}
      if(raw.length>10)break;
    }
    if(hit){found.push(hit);i=hit.end;}
    else i++;
  }
  return found;
}
function pdfSequentialTermAt(items,index,currentTerm){
  for(let back=0;back<=12;back++){
    const start=Math.max(0,index-back);
    for(let len=1;len<=5 && start+len<=index+1;len++){
      const raw=items.slice(start,start+len).map(x=>pdfValueText(x.str)).join('').replace(/\s+/g,'');
      const t=pdfNormalizeTerm(raw);
      if(t)return t;
    }
  }
  return currentTerm;
}
function pdfCategoryBefore(items,start){
  for(let i=start-1;i>=Math.max(0,start-10);i--){
    const c=pdfKnownCategory(items[i].str);
    if(c)return c;
  }
  return '';
}
function pdfSequentialGrade(chunk){
  for(let i=chunk.length-1;i>=0;i--){
    const raw=pdfValueText(chunk[i].str).normalize('NFKC').toUpperCase()
      .replace(/[−–—‐]/g,'-').replace(/[ＯO○]/g,'0')
      .replace(/[^\x20-\x7Eㄱ-ㅎ가-힣]/g,'');
    if(/^W$/.test(raw))return {index:i,grade:'W',raw};
    if(/^NP$/.test(raw))return {index:i,grade:'NP',raw};
    if(/^P$/.test(raw))return {index:i,grade:'P',raw};
    if(/^F$/.test(raw))return {index:i,grade:'F',raw};
    if(/^[A-D](?:\+|0|-)$/.test(raw))return {index:i,grade:normalizeGrade(raw),raw};
  }
  return null;
}
function parsePortalPdfSequential(items){
  const codes=pdfFindSequentialCodes(items);
  const rows=[];
  let currentTerm='';

  for(let ci=0;ci<codes.length;ci++){
    const hit=codes[ci];
    currentTerm=pdfSequentialTermAt(items,hit.start,currentTerm);

    // '인정학점'은 해당 행에만 적용한다.
    // currentTerm을 PRE_ADMISSION_TERM으로 바꾸면 다른 정규학기 행까지 오염될 수 있다.
    let rowTerm=currentTerm;
    for(let j=Math.max(0,hit.start-4);j<hit.start;j++){
      if(pdfNormalizeTerm(items[j].str)===PRE_ADMISSION_TERM){
        rowTerm=PRE_ADMISSION_TERM;
        break;
      }
    }

    const nextStart=ci+1<codes.length?codes[ci+1].start:Math.min(items.length,hit.end+16);
    const chunk=items.slice(hit.end,Math.min(nextStart,hit.end+18));
    const code=hit.code;
    const matched=preferredCatalogMatchByCode(code);
    const portalCategory=pdfCategoryBefore(items,hit.start);

    let pos=0;
    let section='';
    if(chunk[pos] && /^\d{1,2}$/.test(pdfValueText(chunk[pos].str))){
      section=pdfValueText(chunk[pos].str).padStart(2,'0');
      pos++;
    }

    const gradeInfo=pdfSequentialGrade(chunk);
    const gradeIdx=gradeInfo?.index ?? chunk.length;

    // 학점은 평가 앞쪽에서 0~9 범위의 마지막 숫자
    let creditIdx=-1;
    for(let i=gradeIdx-1;i>=pos;i--){
      const s=pdfValueText(chunk[i].str).replace(/,/g,'');
      if(/^\d+(?:\.\d+)?$/.test(s)){
        const n=Number(s);
        if(n>=0&&n<=9){creditIdx=i;break;}
      }
    }

    const creditRaw=creditIdx>=0?pdfValueText(chunk[creditIdx].str):'';
    const creditsMatch=creditRaw.match(/\d+(?:\.\d+)?/);

    let professor='',parsedName='';
    if(creditIdx>pos){
      professor=pdfValueText(chunk[creditIdx-1].str);
      parsedName=chunk.slice(pos,Math.max(pos,creditIdx-1)).map(x=>pdfValueText(x.str)).join(' ').trim();
    }else{
      parsedName=chunk.slice(pos,gradeIdx).map(x=>pdfValueText(x.str)).join(' ').trim();
    }

    // 학정번호 뒤에 다음 과목의 종별/학기 정보가 붙지 않도록 기본 정리
    parsedName=parsedName.replace(/\s+(전공|선택|공통|교직|청강)\s*$/,'').trim();

    const rawGrade=gradeInfo?.raw||'';
    const grade=gradeInfo?.grade||pdfGradeValue(rawGrade);
    const category=mapPortalCategory(portalCategory,matched);
    const credits=creditsMatch
      ? Number(creditsMatch[0])
      : (matched?.credits??defaultCredit(currentTerm||state.profile.admissionTerm,category,code));
    const passed=grade==='W'?false:(grade?gradePasses(grade)!==false:true);
    const courseName=matched?.courseName||parsedName||code;

    const noteStart=(gradeInfo?.index??chunk.length)+1;
    const note=chunk.slice(noteStart).map(x=>pdfValueText(x.str)).join(' ').trim();

    rows.push({
      selected:true,
      term:rowTerm||state.profile.admissionTerm,
      courseCode:code,
      section,
      courseName,
      pdfCourseName:parsedName,
      pdfPortalCategory:pdfKnownCategory(portalCategory)||'',
      pdfCredits:creditMatch?Number(creditMatch[0]):null,
      pdfGrade:grade||'',
      professor,
      portalCategory,
      category,
      credits:['common','audit'].includes(category)?0:credits,
      grade,
      rawGrade,
      passed,
      note,
      matched:!!matched,
      matchMajor:matched?.major||'',
      majorTeachingSwitchable:!!(matched && matched.major===state.profile.major && Array.isArray(matched.categoryOptions) && matched.categoryOptions.includes('teaching') && matched.categoryOptions.includes('major_elective')),
      confidenceLevel:'high',
      confidenceReason:matched?'PDF 직접 추출 · 카탈로그 확인':'PDF 직접 추출',
      source:'portal_pdf'
    });
  }
  return {rows,detectedCodeCount:codes.length};
}
function pdfTermMarkersFromItems(items){
  const markers=[];
  for(let i=0;i<items.length;i++){
    let joined='';
    for(let len=1;len<=8 && i+len<=items.length;len++){
      joined+=pdfValueText(items[i+len-1].str);
      const term=pdfNormalizeTerm(joined);

      // '인정학점'은 정규학기 경계가 아니라 해당 행만의 구분값이다.
      // 전역 마커로 사용하면 2023-1 같은 입학학기 수업까지
      // '입학학기 이전'으로 덮어쓰는 문제가 생길 수 있다.
      if(term && term!==PRE_ADMISSION_TERM){
        markers.push({index:i,term});
        break;
      }
    }
  }
  // 같은 학기 문자열에서 여러 중복 마커가 생기면 첫 번째만 유지
  return markers.filter((m,i,a)=>i===0 || m.term!==a[i-1].term || m.index-a[i-1].index>3);
}
function pdfCourseOccurrencesWithTerms(items){
  const markers=pdfTermMarkersFromItems(items);
  const codes=pdfFindSequentialCodes(items);
  const result=[];
  let mi=0,currentTerm='';
  for(const c of codes){
    while(mi<markers.length && markers[mi].index<c.start){
      currentTerm=markers[mi].term;
      mi++;
    }
    result.push({code:c.code,term:currentTerm});
  }
  return result;
}
function applyPdfOccurrenceTerms(parsedRows,items){
  const occ=pdfCourseOccurrencesWithTerms(items);
  if(!occ.length)return parsedRows;

  let oi=0;
  for(const row of parsedRows){
    const code=canonicalCode(row.courseCode);
    let found=-1;
    for(let j=oi;j<occ.length;j++){
      if(occ[j].code===code){found=j;break;}
    }
    if(found>=0){
      // 인정학점 행은 개별 행 판정을 보존하고,
      // 정규학기 행만 학기 발생순서 후처리를 적용한다.
      if(row.term!==PRE_ADMISSION_TERM && occ[found].term)row.term=occ[found].term;
      oi=found+1;
    }
  }
  return parsedRows;
}
function portalPdfCropCanvas(pageCanvas,viewport,rowY,x1Ratio,x2Ratio,extraY=0){
  const scale=Number(viewport.scale||1);
  const point=viewport.convertToViewportPoint(0,Number(rowY||0));
  const baselineY=Number(point[1]||0);
  const top=Math.max(0,Math.floor(baselineY-(10+extraY)*scale));
  const bottom=Math.min(pageCanvas.height,Math.ceil(baselineY+(5+extraY)*scale));
  const left=Math.max(0,Math.floor(pageCanvas.width*x1Ratio));
  const right=Math.min(pageCanvas.width,Math.ceil(pageCanvas.width*x2Ratio));
  const sw=Math.max(2,right-left),sh=Math.max(2,bottom-top);

  const out=document.createElement('canvas');
  const upscale=2;
  out.width=Math.max(20,Math.round(sw*upscale));
  out.height=Math.max(20,Math.round(sh*upscale));
  const ctx=out.getContext('2d',{willReadFrequently:true});
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,out.width,out.height);
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(pageCanvas,left,top,sw,sh,0,0,out.width,out.height);
  return out;
}
function cleanPortalPdfOcrText(v){
  return String(v||'')
    .replace(/\r/g,' ')
    .replace(/\n+/g,' ')
    .replace(/[|¦]/g,' ')
    .replace(/\s+/g,' ')
    .replace(/([가-힣])\s+(?=[가-힣])/g,'$1')
    .trim();
}
function plausiblePortalCourseName(v){
  const s=cleanPortalPdfOcrText(v);
  if(s.length<2)return '';
  if(/^[A-Z]{2,5}\d{4}(?:-\d{2})?$/i.test(s.replace(/\s+/g,'')))return '';
  return s;
}
function portalPdfPreferDirect(kind,directValue,ocrValue){
  if(kind==='credit'){
    const d=(directValue===null||directValue===undefined||directValue==='')?null:Number(directValue);
    if(d!==null&&Number.isFinite(d)&&d>=0&&d<=9)return d;
    const o=(ocrValue===null||ocrValue===undefined||ocrValue==='')?null:Number(ocrValue);
    return o!==null&&Number.isFinite(o)&&o>=0&&o<=9?o:null;
  }
  const d=String(directValue??'').trim();
  return d || String(ocrValue??'').trim();
}
function portalPdfValueConflict(kind,directValue,ocrValue){
  const d=portalPdfPreferDirect(kind,directValue,null),o=portalPdfPreferDirect(kind,null,ocrValue);
  if(d===null||d===''||o===null||o==='')return false;
  if(kind==='credit')return Number(d)!==Number(o);
  return normName(String(d))!==normName(String(o));
}
async function portalPdfOcrCell(worker,canvas,kind){
  let whitelist='';
  if(kind==='credit')whitelist='0123456789.';
  if(kind==='grade')whitelist='ABCDEFGHIJKLMNOPQRSTUVWXYZ+-0';
  await worker.setParameters({
    tessedit_pageseg_mode:'7',
    preserve_interword_spaces:'1',
    user_defined_dpi:'300',
    tessedit_char_whitelist:whitelist
  });
  const result=await worker.recognize(canvas,{}, {text:true});
  return cleanPortalPdfOcrText(result?.data?.text||'');
}
async function refinePortalPdfUnmatchedByOcr(file,candidates,statusEl){
  const targets=candidates.filter(r=>!r.matched && r._pdfPage && Number.isFinite(r._pdfY));
  if(!targets.length)return candidates;

  const data=await file.arrayBuffer();
  const pdf=await loadPdfDocument(data);
  const worker=await ensureOcrWorker();
  const pageCache=new Map();

  async function getPageRender(pageNo){
    if(pageCache.has(pageNo))return pageCache.get(pageNo);
    const page=await pdf.getPage(pageNo);
    const viewport=page.getViewport({scale:2.6});
    const canvas=document.createElement('canvas');
    canvas.width=Math.ceil(viewport.width);
    canvas.height=Math.ceil(viewport.height);
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    ctx.fillStyle='#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    await page.render({canvasContext:ctx,viewport}).promise;
    const obj={page,viewport,canvas};
    pageCache.set(pageNo,obj);
    return obj;
  }

  for(let i=0;i<targets.length;i++){
    const r=targets[i];
    if(statusEl)statusEl.textContent=`카탈로그 미등록 과목 OCR 보완 중 · ${i+1}/${targets.length} · ${r.courseCode}`;
    try{
      const {viewport,canvas}=await getPageRender(r._pdfPage);

      // 연세포털 표 열 비율:
      // 종별 .343-.392 / 과목명 .509-.697 / 학점 .763-.807 / 평가 .807-.857
      const directNameBeforeOcr=plausiblePortalCourseName(r.pdfCourseName||r.courseName);
      const categoryCanvas=portalPdfCropCanvas(canvas,viewport,r._pdfY,.338,.397,3);
      const creditCanvas=portalPdfCropCanvas(canvas,viewport,r._pdfY,.755,.812,3);
      const gradeCanvas=portalPdfCropCanvas(canvas,viewport,r._pdfY,.805,.865,3);
      let nameCanvas=null;

      const ocrCategoryText=await portalPdfOcrCell(worker,categoryCanvas,'text');
      let ocrNameText='';
      // 텍스트 레이어에서 정상 과목명을 확보하지 못한 경우에만 과목명 셀 OCR 수행.
      if(!directNameBeforeOcr){
        nameCanvas=portalPdfCropCanvas(canvas,viewport,r._pdfY,.503,.704,13);
        ocrNameText=await portalPdfOcrCell(worker,nameCanvas,'text');
      }
      const ocrCreditText=await portalPdfOcrCell(worker,creditCanvas,'credit');
      const ocrGradeText=await portalPdfOcrCell(worker,gradeCanvas,'grade');
      releaseCanvas(categoryCanvas);releaseCanvas(nameCanvas);releaseCanvas(creditCanvas);releaseCanvas(gradeCanvas);

      const ocrPortalCategory=pdfKnownCategory(ocrCategoryText);
      const directPortalCategory=pdfKnownCategory(r.pdfPortalCategory||r.portalCategory);
      const chosenPortalCategory=portalPdfPreferDirect('text',directPortalCategory,ocrPortalCategory);
      if(chosenPortalCategory){
        r.portalCategory=chosenPortalCategory;
        r.category=mapPortalCategory(chosenPortalCategory,null);
      }

      const ocrName=plausiblePortalCourseName(ocrNameText);
      const directName=directNameBeforeOcr||plausiblePortalCourseName(r.pdfCourseName||r.courseName);
      r.courseName=portalPdfPreferDirect('text',directName,ocrName)||r.courseName;
      r.ocrCourseName=ocrName||'';

      const ocrCreditMatch=ocrCreditText.match(/\d+(?:\.\d+)?/);
      const ocrCredit=ocrCreditMatch?Number(ocrCreditMatch[0]):null;
      const chosenCredit=portalPdfPreferDirect('credit',r.pdfCredits,ocrCredit);
      if(chosenCredit!==null)r.credits=['common','audit'].includes(r.category)?0:chosenCredit;

      const ocrGrade=pdfGradeValue(ocrGradeText)||parseGradeLoose(ocrGradeText);
      const chosenGrade=portalPdfPreferDirect('text',r.pdfGrade||'',ocrGrade);
      if(chosenGrade){
        r.grade=chosenGrade;
        // PDF 직접 추출 성적이 있으면 rawGrade도 그대로 보존한다.
        if(!r.pdfGrade)r.rawGrade=ocrGradeText;
        const p=gradePasses(chosenGrade);
        if(p!=null)r.passed=p;
      }

      const ocrConflicts=[];
      if(portalPdfValueConflict('text',directPortalCategory,ocrPortalCategory))ocrConflicts.push(`종별 PDF ${directPortalCategory} / OCR ${ocrPortalCategory}`);
      if(portalPdfValueConflict('credit',r.pdfCredits,ocrCredit))ocrConflicts.push(`학점 PDF ${r.pdfCredits} / OCR ${ocrCredit}`);
      if(portalPdfValueConflict('text',r.pdfGrade||'',ocrGrade))ocrConflicts.push(`성적 PDF ${r.pdfGrade} / OCR ${ocrGrade}`);
      r.ocrConflicts=ocrConflicts;

      // 우선순위: PDF 텍스트 직접 추출 > OCR > 기본 추정값
      r.ocrFallbackUsed=true;
      const unresolved=
        r.category==='unknown' ||
        !plausiblePortalCourseName(r.courseName) ||
        (!['common','audit'].includes(r.category) && !r.grade);
      r.needsReview=unresolved;
      r.selected=!unresolved;
      r.confidenceReason=unresolved
        ? '카탈로그 미등록 · PDF/OCR 확인 필요'
        : r.ocrConflicts?.length
          ? `카탈로그 미등록 · PDF 직접 추출 우선 · OCR 상이(${r.ocrConflicts.join(', ')})`
          : '카탈로그 미등록 · PDF 직접 추출 우선 + OCR 결측 보완';
    }catch(e){
      console.warn('portal PDF row OCR fallback failed',r.courseCode,e);
      r.ocrFallbackUsed=false;
      r.needsReview=r.category==='unknown'||(!['common','audit'].includes(r.category)&&!r.grade);
      r.selected=!r.needsReview;
      r.confidenceReason=r.needsReview?'카탈로그 미등록 · 직접 확인 필요':'카탈로그 미등록 · PDF 직접 추출';
    }
  }

  // 일반 이미지 OCR 기능에 영향을 주지 않도록 기본 파라미터 복구
  try{
    await worker.setParameters({
      tessedit_pageseg_mode:'11',
      preserve_interword_spaces:'1',
      user_defined_dpi:'300',
      tessedit_char_whitelist:''
    });
  }catch(e){}

  for(const v of pageCache.values()){releaseCanvas(v.canvas);try{v.page?.cleanup?.();}catch(e){}}
  pageCache.clear();
  try{pdf?.cleanup?.();}catch(e){}
  return candidates;
}
async function extractPortalPdfCandidates(file){
  const data=await file.arrayBuffer();
  const pdf=await loadPdfDocument(data);
  const all=[];
  let totalTextItems=0,totalDetectedCodes=0,pagesWithRows=0;

  for(let p=1;p<=pdf.numPages;p++){
    const page=await pdf.getPage(p);
    const content=await page.getTextContent({normalizeWhitespace:true});
    const items=content.items||[];
    totalTextItems+=items.length;
    const rows=groupPdfItemsIntoLines(items);
    const viewport=page.getViewport({scale:1});

    // 1순위: 연세포털 전체성적조회 출력물의 고정 표 열 위치를 사용.
    // 제공된 실제 PDF에서 학기/종별/학정번호/과목/교수/학점/평가를 가장 안정적으로 분리한다.
    let parsed=parsePortalPdfYonseiFixed(rows,viewport.width,p);

    // 고정표 파서가 충분한 과목을 읽지 못한 경우 헤더 좌표 기반으로 재시도
    if(parsed.rows.length<3)parsed=parsePortalPdfGeometry(rows);

    // 그마저 실패하면 행 단위 파싱
    if(!parsed.rows.length)parsed=parsePortalPdfRows(rows);

    // 마지막으로 텍스트 조각 순서 기반 복구
    if(!parsed.rows.length){
      const sequential=parsePortalPdfSequential(items);
      if(sequential.rows.length)parsed=sequential;
      else parsed.detectedCodeCount=Math.max(parsed.detectedCodeCount||0,sequential.detectedCodeCount||0);
    }

    // 표 기반 파서가 결정한 학기를 최종값으로 사용한다.
    // PDF.js의 원시 text item 순서는 시각적 행 순서와 다를 수 있으므로,
    // 문서 순서 기반 학기 후처리로 정상 학기를 덮어쓰지 않는다.
    totalDetectedCodes+=parsed.detectedCodeCount;
    if(parsed.rows.length)pagesWithRows++;
    all.push(...parsed.rows);
  }

  if(totalTextItems<10){
    throw new Error('이 PDF에는 읽을 수 있는 텍스트 레이어가 없습니다. 전체성적조회 [출력]에서 생성한 PDF를 사용하십시오.');
  }
  if(!all.length){
    throw new Error(`PDF 텍스트는 읽었지만 교과목 행을 찾지 못했습니다. 학정번호 감지 ${totalDetectedCodes}개 / 텍스트 조각 ${totalTextItems}개 / ${pdf.numPages}페이지`);
  }

  // PDF 내 동일 학기·동일 과목이 중복 추출될 경우 한 번만 유지
  const seen=new Set();
  return all.filter(r=>{
    const key=historyRecordKey(r.term,r.courseCode,r.courseName);
    if(seen.has(key))return false;
    seen.add(key);
    return true;
  });
}
function renderPortalPdfCandidates(){
  const box=document.getElementById('portalPdfResult');
  if(!box)return;
  if(!portalPdfCandidates.length){box.innerHTML='';return;}
  box.innerHTML=`<div class="table-wrap">
    <table>
      <thead><tr><th>등록</th><th>학기</th><th>과목</th><th>포털 종별</th><th>인정 종별</th><th>학점</th><th>성적</th><th>상태</th></tr></thead>
      <tbody>${portalPdfCandidates.map((r,i)=>{
        const duplicate=historyAlreadyExists(r.term,r.courseCode,r.courseName);
        const status=r.majorTeachingSwitchable
          ? '전공교직 · 종별 변경 가능'
          : r.matched
            ? '카탈로그 확인'
            : r.needsReview
              ? '카탈로그 미등록 · 확인 필요'
              : r.ocrFallbackUsed
                ? '카탈로그 미등록 · OCR 보완'
                : '카탈로그 미등록 · PDF 직접 추출';
        return `<tr class="${duplicate||r.needsReview?'pdf-row-review':''}">
          <td><input class="ocr-check pdf-select" data-i="${i}" type="checkbox" ${r.selected&&!duplicate?'checked':''} ${duplicate?'disabled':''}></td>
          <td><select class="inline-select pdf-term" data-i="${i}" style="min-width:105px">${academicTermOptionsHtml(r.term)}</select></td>
          <td><div class="course-name">${esc(r.courseName)}</div><div class="muted mono">${esc(r.courseCode)}${r.section?'-'+esc(r.section):''}</div>${r.professor?`<div class="muted">담당교수 ${esc(r.professor)}</div>`:''}</td>
          <td>${esc(r.portalCategory||'')}</td>
          <td><select class="inline-select pdf-cat" data-i="${i}">${categoryOptionsHtml(r.category)}</select></td>
          <td><select class="inline-select pdf-credit" data-i="${i}">${creditOptionsHtml(r.credits)}</select></td>
          <td><select class="inline-select pdf-grade" data-i="${i}">${gradeOptionsHtml(r.grade,true)}</select></td>
          <td><span class="badge ${duplicate?'planned':'conf-high'}">${duplicate?'이미 등록됨':esc(status)}</span>${r.rawGrade&&!r.grade?`<div class="muted">평가 ${esc(r.rawGrade)}</div>`:''}${fieldConfidenceHtml(r,'pdf')}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>
  </div>
  <div class="toolbar" style="margin-top:10px">
    <button class="btn primary" id="importPortalPdf">선택 과목 일괄등록</button>
    <button class="btn" id="clearPortalPdf" type="button">결과 지우기</button>
  </div>`;

  document.querySelectorAll('.pdf-select').forEach(x=>x.onchange=()=>{portalPdfCandidates[+x.dataset.i].selected=x.checked;});
  document.querySelectorAll('.pdf-term').forEach(x=>x.onchange=()=>{
    portalPdfCandidates[+x.dataset.i].term=x.value;
    renderPortalPdfCandidates();
  });
  document.querySelectorAll('.pdf-cat').forEach(x=>x.onchange=()=>{
    const r=portalPdfCandidates[+x.dataset.i];
    r.category=x.value;
    if(['common','audit'].includes(r.category))r.credits=0;
    renderPortalPdfCandidates();
  });
  document.querySelectorAll('.pdf-credit').forEach(x=>x.onchange=()=>{portalPdfCandidates[+x.dataset.i].credits=Number(x.value||0);});
  document.querySelectorAll('.pdf-grade').forEach(x=>x.onchange=()=>{
    const r=portalPdfCandidates[+x.dataset.i];
    r.grade=normalizeGrade(x.value);
    const gp=gradePasses(r.grade);
    r.passed=gp==null?r.passed:gp;
  });
  document.getElementById('importPortalPdf').onclick=importPortalPdfCandidates;
  document.getElementById('clearPortalPdf').onclick=()=>{
    portalPdfCandidates=[];
    box.innerHTML='';
    document.getElementById('portalPdfStatus').textContent='PDF 결과를 지웠습니다.';
  };
}
async function readPortalPdf(){
  const file=document.getElementById('portalPdfFile').files?.[0];
  if(!file){alert('연세포털에서 출력한 PDF 파일을 선택하십시오.');return;}
  const btn=document.getElementById('readPortalPdf');
  const status=document.getElementById('portalPdfStatus');
  btn.disabled=true;
  btn.textContent='PDF 읽는 중…';
  status.textContent='PDF 텍스트를 읽고 학기·학정번호·종별·학점·성적을 분석하는 중입니다.';
  document.getElementById('portalPdfResult').innerHTML='';
  try{
    portalPdfCandidates=await extractPortalPdfCandidates(file);
    portalPdfCandidates.forEach(r=>normalizeComparisonProgramTerm(r,state.profile.admissionTerm));
    if(!portalPdfCandidates.length){
      throw new Error('수강 과목 행을 찾지 못했습니다. 연세포털 전체성적조회에서 [출력]으로 생성한 PDF인지 확인하십시오.');
    }

    // 학정번호가 카탈로그에 없으면 해당 PDF 행의 종별/과목명/학점/성적 셀을
    // 하나씩 OCR로 재확인해 자동 입력값을 보완한다.
    const unmatchedCount=portalPdfCandidates.filter(x=>!x.matched).length;
    if(unmatchedCount){
      status.textContent=`PDF 표 분석 완료 · 카탈로그 미등록 ${unmatchedCount}과목을 OCR로 보완하는 중입니다.`;
      await refinePortalPdfUnmatchedByOcr(file,portalPdfCandidates,status);
    }

    const terms=[...new Set(portalPdfCandidates.map(x=>x.term))];
    const academicTerms=terms.filter(t=>t!==PRE_ADMISSION_TERM).sort((a,b)=>termIndex(a)-termIndex(b));
    const termLabel=[...academicTerms.map(displayAcademicTerm),...(terms.includes(PRE_ADMISSION_TERM)?['입학 전 인정학점']:[])].join(' · ');
    const wCount=portalPdfCandidates.filter(x=>x.grade==='W').length;
    const ocrFallbackCount=portalPdfCandidates.filter(x=>x.ocrFallbackUsed).length;
    const reviewCount=portalPdfCandidates.filter(x=>x.needsReview).length;
    const suspiciousSingleTerm=portalPdfCandidates.length>=5 && academicTerms.length<=1;
    const admissionBoundaryError=portalPdfCandidates.some(r=>
      canonicalCode(r.courseCode)!=='SPG6658' &&
      r.term===PRE_ADMISSION_TERM &&
      state.profile.admissionTerm==='2023-1'
    );
    status.textContent=`PDF 표 분석 완료 · ${portalPdfCandidates.length}과목 · ${terms.length}개 구간${ocrFallbackCount?` · 카탈로그 미등록 OCR 보완 ${ocrFallbackCount}과목`:''}${reviewCount?` · 확인 필요 ${reviewCount}과목`:''}${wCount?` · W(미취득) ${wCount}과목 포함`:''}${termLabel?` · ${termLabel}`:''}${suspiciousSingleTerm?' · ⚠ 학기 구분 확인 필요':''}${admissionBoundaryError?' · ⚠ 입학학기 경계 확인 필요':''}`;
    renderPortalPdfCandidates();
  }catch(err){
    console.error(err);
    portalPdfCandidates=[];
    status.textContent=`PDF를 읽지 못했습니다 · ${err?.message||err}`;
    document.getElementById('portalPdfResult').innerHTML=`<div class="callout warnbox"><b>PDF 가져오기 실패</b><br>${esc(err?.message||String(err))}<br><span class="muted">연세포털 → 성적 → 학생 → 전체성적조회 → 우측 [출력]에서 생성한 PDF인지 확인하십시오.</span></div>`;
  }finally{
    btn.disabled=false;
    btn.textContent='PDF 읽어오기';
  }
}
function importPortalPdfCandidates(){
  const selected=portalPdfCandidates.filter(x=>x.selected && !historyAlreadyExists(x.term,x.courseCode,x.courseName));
  if(!selected.length){alert('새로 등록할 과목을 선택하십시오.');return;}
  let added=0,skipped=0;
  for(const r of selected){
    if(historyAlreadyExists(r.term,r.courseCode,r.courseName)){skipped++;continue;}
    const rec={
      id:uid('h'),
      term:r.term,
      courseCode:canonicalCode(r.courseCode),
      courseName:r.courseName,
      category:r.category||'unknown',
      credits:Number(r.credits||0),
      passed:r.passed!==false,
      grade:r.grade||'',
      portalCategory:r.portalCategory||'',
      source:'portal_pdf',
      professor:r.professor||'',
      section:r.section||'',
      portalNote:r.note||''
    };
    const guard=historyRecordIssues(rec);
    if(guard.critical.length){skipped++;continue;}
    state.history.push(rec);
    added++;
  }
  save();
  render();
  document.getElementById('portalPdfStatus').textContent=`PDF 일괄등록 완료 · ${added}과목 등록${skipped?` · 중복 ${skipped}과목 건너뜀`:''}`;
  portalPdfCandidates=[];
  document.getElementById('portalPdfResult').innerHTML='';
}


let ocrImageQueue=[];
let ocrBatchContext=null;

function ocrTermOptionsHtml(selected){
  const source=document.getElementById('ocrTerm');
  return [...(source?.options||[])].map(o=>`<option value="${esc(o.value)}" ${o.value===selected?'selected':''}>${esc(o.textContent)}</option>`).join('');
}
function revokeOcrQueueUrls(){
  for(const item of ocrImageQueue){if(item.url)URL.revokeObjectURL(item.url);}
}
function renderOcrQueue(){
  const box=document.getElementById('ocrQueue');
  if(!box)return;
  if(!ocrImageQueue.length){
    box.innerHTML='<div class="muted" style="padding:7px 2px">아직 선택된 캡처가 없습니다.</div>';
    document.getElementById('ocrPasteZone')?.classList.remove('paste-ready');
    return;
  }
  document.getElementById('ocrPasteZone')?.classList.add('paste-ready');
  box.innerHTML=ocrImageQueue.map((item,i)=>`<div class="ocr-queue-item" data-ocr-id="${esc(item.id)}">
    <img class="ocr-queue-thumb" src="${esc(item.url)}" alt="${esc(item.name)} 미리보기">
    <div class="ocr-queue-meta"><div class="ocr-queue-name">${i+1}. ${esc(item.name)}</div><div class="muted">${Math.max(1,Math.round((item.blob.size||0)/1024))} KB</div></div>
    <div class="ocr-queue-term"><label>수강학기</label><select class="ocr-queue-term-select" data-id="${esc(item.id)}">${ocrTermOptionsHtml(item.term)}</select></div>
    <button class="btn small danger ocr-queue-remove" type="button" data-id="${esc(item.id)}" title="이 캡처 제거">삭제</button>
  </div>`).join('');
  box.querySelectorAll('.ocr-queue-term-select').forEach(el=>el.onchange=()=>{
    const item=ocrImageQueue.find(x=>x.id===el.dataset.id);if(item)item.term=el.value;
  });
  box.querySelectorAll('.ocr-queue-remove').forEach(el=>el.onclick=()=>{
    const idx=ocrImageQueue.findIndex(x=>x.id===el.dataset.id);if(idx<0)return;
    const [item]=ocrImageQueue.splice(idx,1);if(item?.url)URL.revokeObjectURL(item.url);
    renderOcrQueue();
    document.getElementById('ocrStatus').textContent=ocrImageQueue.length?`캡처 ${ocrImageQueue.length}장 준비됨 · 이미지별 수강학기를 확인하세요.`:'캡처를 여러 장 선택하거나 하나씩 붙여넣으세요.';
  });
}
function addOcrQueueBlob(blob,name='붙여넣은 이미지',term){
  if(!blob || !String(blob.type||'').startsWith('image/'))return false;
  const selectedTerm=term||document.getElementById('ocrTerm')?.value||state.profile.admissionTerm;
  const id=`ocr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`;
  const url=URL.createObjectURL(blob);
  ocrImageQueue.push({id,blob,name,term:selectedTerm,url});
  renderOcrQueue();
  ocrCandidates=[];
  document.getElementById('ocrResult').innerHTML='';
  document.getElementById('ocrStatus').textContent=`캡처 ${ocrImageQueue.length}장 준비됨 · 이미지별 수강학기를 확인하세요.`;
  return true;
}
function handleOcrPaste(e){
  const items=[...(e.clipboardData?.items||[])].filter(x=>String(x.type||'').startsWith('image/'));
  if(!items.length)return;
  e.preventDefault();
  let added=0;
  for(const imageItem of items){const blob=imageItem.getAsFile();if(blob&&addOcrQueueBlob(blob,`붙여넣은 캡처 ${ocrImageQueue.length+1}`))added++;}
  if(added)document.getElementById('ocrStatus').textContent=`클립보드 캡처 ${added}장 추가 · 총 ${ocrImageQueue.length}장 준비됨`;
}
function previewOcrImage(){
  const input=document.getElementById('ocrImage');
  const files=[...(input.files||[])];
  if(!files.length)return;
  const defaultTerm=document.getElementById('ocrTerm').value;
  let added=0;
  for(const file of files){if(addOcrQueueBlob(file,file.name,defaultTerm))added++;}
  input.value='';
  document.getElementById('ocrStatus').textContent=`파일 ${added}장 추가 · 총 ${ocrImageQueue.length}장 준비됨`;
}
function clearOcrImage(){
  document.getElementById('ocrImage').value='';
  revokeOcrQueueUrls();
  ocrImageQueue=[];
  renderOcrQueue();
  document.getElementById('ocrProgressBar').style.width='0';
  document.getElementById('ocrStatus').textContent='캡처를 여러 장 선택하거나 하나씩 붙여넣으세요.';
  ocrCandidates=[];
  document.getElementById('ocrResult').innerHTML='';
}

function selectedMaster(){
  const hc=document.getElementById('historyCourse'), idx=Number(hc.value);
  if(hc.value==='')return null; const list=JSON.parse(hc.dataset.masters||'[]'); return list[idx]||null;
}
function selectedPlanCourse(){
  const pc=document.getElementById('planCourse'), idx=Number(pc.value);
  if(pc.value==='')return null; const list=JSON.parse(pc.dataset.list||'[]'); return list[idx]||null;
}
function renderHistorySelectionNote(c){
  const box=document.getElementById('historySelectionNote');
  if(!c){box.innerHTML='';return;}
  if(isMajorTeachingCourse(c)) box.innerHTML=`<div class="callout warnbox"><b>전공교직 주의:</b> 이 과목은 전공교직 과목으로, 기본적으로 교직으로 표시됩니다. 전공선택으로 변경·인정되는 경우가 있을 수 있으나 자동 전환하지 않습니다. 실제 수강신청/학점인정 결과에 맞춰 <b>인정 종별</b>을 교직 또는 전공선택으로 선택하십시오. <a href="https://gse.yonsei.ac.kr/gse/board/notice.do?mode=view&articleNo=467321&article.offset=0&articleLimit=10&srSearchVal=%EC%A2%85%EB%B3%84+%EB%B3%80%EA%B2%BD" target="_blank" rel="noopener noreferrer"><b>종별 변경 공지 바로가기 ↗</b></a></div>`;
  else if(isOtherMajorCourse(c)) box.innerHTML=`<div class="callout warnbox"><b>타 전공 개설 과목:</b> 소속 전공은 ${esc(c.major)}입니다. 공통·전공선택 등 실제 인정 종별을 확인한 뒤 직접 선택하십시오.</div>`;
  else if(c.scope==='certificate') box.innerHTML=`<div class="callout warnbox"><b>교원자격 관련 교과:</b> 개인별 자격증 이수요건과 학점 인정 여부를 별도로 확인하십시오.</div>`;
  else box.innerHTML='';
}
function renderPlanSelectionNote(c){
  const box=document.getElementById('planSelectionNote');
  if(!c){box.innerHTML='';return;}
  if(isMajorTeachingCourse(c)) box.innerHTML=`<div class="callout warnbox"><b>전공교직 주의:</b> 이 과목은 전공교직 과목입니다. 교직으로 수강할지 전공선택으로 인정받을지는 개인의 신청/인정 결과에 따라 달라질 수 있습니다. 계획 단계에서는 원하는 인정 종별을 선택하되 최종 확인은 행정 안내를 따르십시오. <a href="https://gse.yonsei.ac.kr/gse/board/notice.do?mode=view&articleNo=467321&article.offset=0&articleLimit=10&srSearchVal=%EC%A2%85%EB%B3%84+%EB%B3%80%EA%B2%BD" target="_blank" rel="noopener noreferrer"><b>종별 변경 공지 바로가기 ↗</b></a></div>`;
  else if(isOtherMajorCourse(c)) box.innerHTML=`<div class="callout warnbox"><b>타 전공 과목:</b> ${esc(c.major)} 개설 과목입니다. 본인 전공에서의 인정 종별을 확인하십시오.</div>`;
  else if(c.scope==='certificate') box.innerHTML=`<div class="callout warnbox"><b>교원자격 관련 교과:</b> 자격증 취득 트랙 여부에 따라 필요성이 달라질 수 있습니다.</div>`;
  else box.innerHTML='';
}
function applyHistorySelection(){
  const c=selectedMaster(); if(!c){renderHistorySelectionNote(null);return;}
  const term=document.getElementById('historyTerm').value;
  const category=recommendedCategory(c);
  document.getElementById('historyCategory').value=category;
  document.getElementById('historyCredits').value=defaultCredit(term,category,c.courseCode);
  renderHistorySelectionNote(c);
}
function applyPlanSelection(){
  const c=selectedPlanCourse(); if(!c){renderPlanSelectionNote(null);return;}
  const category=recommendedCategory(c);
  document.getElementById('planCategory').value=category;
  document.getElementById('planCredits').value=(category==='common'||category==='audit')?0:(/^SPT/.test(canonicalCode(c.courseCode))?2:(c.credits??defaultCredit(document.getElementById('planTerm').value,category,c.courseCode)));
  renderPlanSelectionNote(c);
}
function historyRecordKey(term,courseCode,courseName){
  return `${term||''}|${canonicalCode(courseCode)||normName(courseName)}`;
}
function historyAlreadyExists(term,courseCode,courseName){
  const key=historyRecordKey(term,courseCode,courseName);
  return state.history.some(h=>historyRecordKey(h.term,h.courseCode,h.courseName)===key);
}
function addHistoryRecord(){
  const c=selectedMaster(), term=document.getElementById('historyTerm').value;
  if(!c){alert('과목을 선택하십시오.');return;}
  if(historyAlreadyExists(term,c.courseCode,c.courseName)){alert('같은 학기에 이미 등록된 과목입니다.');return;}
  const category=document.getElementById('historyCategory').value;
  const credits=Number(document.getElementById('historyCredits').value||0);
  const grade=normalizeGrade(document.getElementById('historyGrade').value);
  const gp=gradePasses(grade);
  const passed=gp==null?(document.getElementById('historyPassed').value==='true'):gp;
  state.history.push({id:uid('h'),term,courseCode:canonicalCode(c.courseCode),courseName:c.courseName,category,credits,grade,passed,source:'catalog_snapshot',offeringMajor:c.major||''});
  save();render();
}
function openManualHistory(){
  const panel=document.getElementById('manualHistoryPanel'); panel.classList.add('open');
  const term=document.getElementById('historyTerm').value;
  const cat=document.getElementById('manualCategory').value||'unknown';
  document.getElementById('manualCredits').value=defaultCredit(term,cat,'');
  document.getElementById('manualCourseName').focus();
}
function saveManualHistory(){
  const term=document.getElementById('historyTerm').value;
  const courseName=document.getElementById('manualCourseName').value.trim();
  const courseCode=document.getElementById('manualCourseCode').value.trim();
  const category=document.getElementById('manualCategory').value;
  const credits=Number(document.getElementById('manualCredits').value||0);
  const grade=normalizeGrade(document.getElementById('manualGrade').value);
  const gp=gradePasses(grade);
  const passed=gp==null?(document.getElementById('manualPassed').value==='true'):gp;
  if(!courseName){alert('과목명을 입력하십시오.');return;}
  if(historyAlreadyExists(term,courseCode,courseName)){alert('같은 학기에 이미 등록된 과목입니다.');return;}
  state.history.push({id:uid('h'),term,courseCode:canonicalCode(courseCode),courseName,category,credits,grade,passed,source:'manual_historical'});
  document.getElementById('manualCourseName').value=''; document.getElementById('manualCourseCode').value=''; document.getElementById('manualGrade').value='';
  document.getElementById('manualHistoryPanel').classList.remove('open');
  save();render();
}
function planRecordKey(r){
  return `${r.term||''}|${canonicalCode(r.courseCode)||normName(r.courseName)}`;
}
function dedupePlannedRecords(records){
  const seen=new Set(), out=[];
  for(const r of records||[]){
    const key=planRecordKey(r);
    if(!key || seen.has(key))continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}
function addPlanRecord(){
  const c=selectedPlanCourse(); if(!c){alert('과목을 선택하십시오.');return;}
  if(c.availability==='planned_missing_actual'){alert('이 과목은 2026-2 예정표에는 있으나 실제 시간표에서 확인되지 않아 기본 계획에 추가할 수 없습니다. 공식 개설이 확인되면 과거/직접 입력 방식으로 추가하십시오.');return;}
  const sc=currentScenario(), term=document.getElementById('planTerm').value;
  const candidate={id:uid('p'),term,courseCode:canonicalCode(c.courseCode),sectionCode:(c.sectionCodes||[])[0]||'',courseName:c.courseName,category:document.getElementById('planCategory').value,credits:Number(document.getElementById('planCredits').value||0),availability:c.availability,source:'catalog_snapshot',professor:c.professor||'',day:c.day||'',timeRaw:c.timeRaw||'',room:c.room||''};
  const key=planRecordKey(candidate);
  if(sc.planned.some(r=>planRecordKey(r)===key)){
    alert('같은 학기의 동일 과목이 이미 계획에 등록되어 있습니다.');
    return;
  }
  sc.planned.push(candidate);
  sc.planned=dedupePlannedRecords(sc.planned);
  save();render();
}

document.getElementById('majorSelect').onchange=e=>{
  if(state.history.length||currentScenario().planned.length){
    if(!confirm('전공을 변경해도 기존 수강이력/계획은 삭제되지 않습니다. 계속하시겠습니까?')){e.target.value=state.profile.major;return;}
  }
  state.profile.major=e.target.value;
  state.profile.teacherCertificateVariant='';
  state.profileConfirmed=false;
  if(!isTeacherCertMajor()){state.profile.hasTeacherLicense=false;state.profile.wantsTeacherCertificate=false;}
  save();loadCustomTitle();fillStaticControls();refreshCourseSelectors();render();
};
document.getElementById('admissionSelect').onchange=e=>{
  state.profile.admissionTerm=e.target.value;
  state.profileConfirmed=false;
  document.getElementById('historyTerm').value=state.profile.admissionTerm;
  document.getElementById('ocrTerm').value=state.profile.admissionTerm;
  save();
  updateHistoryCreditNote();
  applyHistorySelection();
  document.getElementById('ocrStatus').textContent=`새 캡처의 기본 수강학기 ${state.profile.admissionTerm} 선택됨.`;
  ocrCandidates=[];
  document.getElementById('ocrResult').innerHTML='';
  render();
};
const historySummary=document.querySelector('#historySection > summary');
if(historySummary)historySummary.addEventListener('click',e=>{
  if(!state.profileConfirmed){
    e.preventDefault();
    document.getElementById('profileSection')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
});
document.getElementById('historyTerm').onchange=()=>{updateHistoryCreditNote();applyHistorySelection();};
document.getElementById('historyFilterCategory').onchange=refreshHistoryCourse;
document.getElementById('historyScope').onchange=refreshHistoryCourse;
document.getElementById('historyCourseSearch').oninput=refreshHistoryCourse;
document.getElementById('historyCourse').onchange=applyHistorySelection;
document.getElementById('historyGrade').onchange=()=>{
  const p=gradePasses(document.getElementById('historyGrade').value);
  if(p!=null)document.getElementById('historyPassed').value=p?'true':'false';
};
document.getElementById('planTerm').onchange=()=>{gapCandidateTerm=document.getElementById('planTerm').value;refreshPlanCourse();applyPlanSelection();renderGapCandidates();renderPlanTimetable();};
document.getElementById('planFilterCategory').onchange=refreshPlanCourse;
document.getElementById('planScope').onchange=refreshPlanCourse;
document.getElementById('planCourseSearch').oninput=refreshPlanCourse;
document.getElementById('planProfessorSearch').oninput=refreshPlanCourse;
document.getElementById('planCourse').onchange=applyPlanSelection;
document.getElementById('ocrImage').onchange=previewOcrImage;
document.getElementById('ocrPasteZone').addEventListener('paste',handleOcrPaste);
document.getElementById('ocrPasteZone').addEventListener('click',()=>document.getElementById('ocrPasteZone').focus());
document.addEventListener('paste',e=>{
  const tag=(document.activeElement?.tagName||'').toLowerCase();
  const editing=['input','textarea','select'].includes(tag) || document.activeElement?.isContentEditable;
  if(!editing)handleOcrPaste(e);
});
document.getElementById('ocrTerm').onchange=()=>{
  const term=document.getElementById('ocrTerm').value;
  document.getElementById('ocrStatus').textContent=`새로 추가하는 캡처의 기본 수강학기: ${term}${ocrImageQueue.length?` · 기존 ${ocrImageQueue.length}장의 학기는 목록에서 개별 변경 가능`:''}`;
};
document.getElementById('runOcr').onclick=runOcr;
document.getElementById('clearOcrImage').onclick=clearOcrImage;

document.querySelectorAll('#trackButtons [data-track]').forEach(b=>b.onclick=()=>{
  state.profile.track=b.dataset.track;
  state.profileConfirmed=false;
  save();renderTrackButtons();render();
});
document.getElementById('wantsTeacherCertificate').onchange=e=>{state.profile.wantsTeacherCertificate=e.target.checked;save();render();};
document.getElementById('hasTeacherLicense').onchange=e=>{state.profile.hasTeacherLicense=e.target.checked;save();render();};
document.getElementById('planSettingsBtn').onclick=()=>document.getElementById('planSettingsPanel').classList.toggle('open');
document.getElementById('savePlanTimetableBtn').onclick=saveCurrentPlanTimetableSnapshot;

document.getElementById('addHistory').onclick=addHistoryRecord;
document.getElementById('manualHistory').onclick=openManualHistory;
document.getElementById('saveManualHistory').onclick=saveManualHistory;
document.getElementById('cancelManualHistory').onclick=()=>document.getElementById('manualHistoryPanel').classList.remove('open');
document.getElementById('manualCategory').onchange=()=>{document.getElementById('manualCredits').value=defaultCredit(document.getElementById('historyTerm').value,document.getElementById('manualCategory').value,'');};
document.getElementById('manualGrade').onchange=()=>{
  const p=gradePasses(document.getElementById('manualGrade').value);
  if(p!=null)document.getElementById('manualPassed').value=p?'true':'false';
};
document.getElementById('addPlan').onclick=addPlanRecord;
document.getElementById('catalogTerm').onchange=renderCatalog;
document.getElementById('catalogMajor').onchange=renderCatalog;
document.getElementById('timetableScope').onchange=renderTimetable;
document.getElementById('timetableTerm').onchange=renderTimetable;
document.getElementById('catalogSearch').oninput=renderCatalog;

document.getElementById('addScenario').onclick=()=>{
  const n={id:uid('sc'),name:currentSheetNextName(),planned:[]};
  state.scenarios.push(n);state.activeScenarioId=n.id;save();render();
};
document.getElementById('duplicateScenario').onclick=()=>{
  const sc=currentScenario(); const n={id:uid('sc'),name:sc.name+' 복제',planned:JSON.parse(JSON.stringify(sc.planned))};
  state.scenarios.push(n);state.activeScenarioId=n.id;save();render();
};
document.getElementById('renameScenario').onclick=()=>{
  const sc=currentScenario();const name=prompt('시트 이름',sc.name);if(!name)return;sc.name=name;save();render();
};
document.getElementById('deleteScenario').onclick=()=>{
  if(state.scenarios.length<=1){alert('시트는 최소 1개 필요합니다.');return;}
  if(!confirm('현재 시트를 삭제하시겠습니까?'))return;
  const idx=state.scenarios.findIndex(s=>s.id===state.activeScenarioId);state.scenarios.splice(idx,1);state.activeScenarioId=state.scenarios[0].id;save();render();
};
document.getElementById('exportData').onclick=()=>{
  const backup={
    format:'yonsei-gse-user-backup',backupVersion:1,appVersion:APP_VERSION,
    createdAt:packNowIso(),dataSnapshot:DATA.snapshot,rulesSnapshot:RULES.snapshot,
    state:deepClone(state)
  };
  downloadJson(`yonsei-gse-plan-${new Date().toISOString().slice(0,10)}.json`,backup);
};
document.getElementById('importData').onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  try{
    const raw=JSON.parse(await f.text());
    const imported=raw?.format==='yonsei-gse-user-backup'?raw.state:raw;
    const initial=validateStateObject(imported);
    if(initial.critical.length)throw new Error(initial.critical.join('; '));
    const migrated=migrateImportedState(imported);
    const after=validateStateObject(migrated);
    if(after.critical.length)throw new Error(after.critical.join('; '));
    const msg=`수강이력 ${after.stats.historyCount}과목 · 시트 ${after.stats.scenarioCount}개${after.warnings.length?` · 확인 필요 ${after.warnings.length}건`:''}\n이 백업을 불러오시겠습니까?`;
    if(!confirm(msg))return;
    createSafetySnapshot('JSON 불러오기 전');
    state=migrated;save();fillStaticControls();refreshCourseSelectors();render();runIntegrityChecks();
  }catch(err){alert('백업 파일을 읽을 수 없습니다: '+err.message);}
  e.target.value='';
};
document.getElementById('resetData').onclick=()=>{
  if(!confirm('브라우저에 저장된 모든 입력과 시나리오를 초기화하시겠습니까?\n초기화 직전 상태는 자동백업됩니다.'))return;
  createSafetySnapshot('전체 초기화 전');
  state=defaultState();save();fillStaticControls();refreshCourseSelectors();render();runIntegrityChecks();
};
document.getElementById('runIntegrityCheck').onclick=()=>runIntegrityChecks(true);
document.getElementById('restoreAutoBackup').onclick=restoreLatestAutoBackup;

if(document.getElementById('dataUpdateSection')){
document.getElementById('analyzeUpdateWorkbook').onclick=async()=>{
  const file=document.getElementById('updateWorkbookFile').files?.[0];
  const target=document.getElementById('updateTargetTerm').value.trim();
  const mode=document.getElementById('updateMode').value;
  if(!file){alert('수강편람 Excel/CSV 파일을 선택하십시오.');return;}
  const btn=document.getElementById('analyzeUpdateWorkbook');btn.disabled=true;btn.textContent='분석 중…';
  try{pendingUpdateAnalysis=await analyzeWorkbookUpdate(file,target,mode);renderUpdatePreview(pendingUpdateAnalysis);}
  catch(e){pendingUpdateAnalysis=null;renderUpdatePreview(null);alert('업데이트 파일 분석 실패: '+e.message);}
  finally{btn.disabled=false;btn.textContent='파일 분석';}
};
document.getElementById('applyUpdatePack').onclick=()=>{
  if(!pendingUpdateAnalysis)return;
  if(!confirm(`${pendingUpdateAnalysis.targetTerm} 데이터 업데이트를 이 브라우저에 적용하시겠습니까?\n신규 ${pendingUpdateAnalysis.added.length} · 변경 ${pendingUpdateAnalysis.changed.length}`))return;
  try{applyDataCandidate(pendingUpdateAnalysis.candidate);alert('로컬 데이터 업데이트를 적용했습니다. 전체 사용자 배포는 data-pack.json을 GitHub 루트에 업로드하십시오.');}
  catch(e){alert('적용 실패: '+e.message);}
};
document.getElementById('exportUpdatePack').onclick=()=>{
  if(!pendingUpdateAnalysis)return;
  downloadJson('data-pack.json',dataPackEnvelope(pendingUpdateAnalysis.candidate,{source:'관리자 Excel 업데이트'}));
};
document.getElementById('clearLocalDataPack').onclick=()=>{
  if(!confirm('이 브라우저의 로컬 데이터 업데이트를 제거하고 배포 데이터/내장 데이터로 되돌리시겠습니까?'))return;
  localStorage.removeItem(DATA_PACK_LOCAL_KEY);location.reload();
};
document.getElementById('rulesPackFile').onchange=async e=>{
  const f=e.target.files?.[0];if(!f)return;
  const status=document.getElementById('rulesPackStatus');
  try{
    const raw=JSON.parse(await f.text()),u=unwrapRulesPack(raw),v=validateRulesCore(u.rules);
    if(!u.rules||v.critical.length)throw new Error((v.critical||['규정 형식 오류']).join('; '));
    if(!confirm(`규정 패키지 ${u.rules.snapshot}을 이 브라우저에 적용하시겠습니까?`))return;
    const pack=rulesPackEnvelope(u.rules,{source:'관리자 규정 업데이트'});
    localStorage.setItem(RULES_PACK_LOCAL_KEY,JSON.stringify(pack));RULES=deepClone(u.rules);runtimePackMeta.rulesSource='로컬 업데이트';
    render();updateRuntimeMetaUi();runIntegrityChecks();status.textContent=`적용 완료 · ${RULES.snapshot}`;
  }catch(err){status.textContent='적용 실패 · '+err.message;}
  e.target.value='';
};
document.getElementById('clearLocalRulesPack').onclick=()=>{
  if(!confirm('이 브라우저의 로컬 규정 업데이트를 제거하시겠습니까?'))return;
  localStorage.removeItem(RULES_PACK_LOCAL_KEY);location.reload();
};
document.getElementById('certificateRulesFile').onchange=async e=>{
  const f=e.target.files?.[0];if(!f)return;const status=document.getElementById('certificateRulesStatus');
  try{const raw=JSON.parse(await f.text()),u=unwrapCertificateRules(raw),v=validateCertificateRules(u.rules);if(!u.rules||v.critical.length)throw new Error((v.critical||['교원자격 규정 형식 오류']).join('; '));if(!confirm(`교원자격 규정 ${u.rules.snapshot}을 이 브라우저에 적용하시겠습니까?`))return;localStorage.setItem(CERT_RULES_PACK_LOCAL_KEY,JSON.stringify(u.rules));CERT_RULES=deepClone(u.rules);runtimePackMeta.certSource='로컬 업데이트';render();updateRuntimeMetaUi();runIntegrityChecks();status.textContent=`적용 완료 · ${CERT_RULES.snapshot}`;}catch(err){status.textContent='적용 실패 · '+err.message;}e.target.value='';
};
document.getElementById('clearLocalCertificateRules').onclick=()=>{if(!confirm('이 브라우저의 로컬 교원자격 규정 업데이트를 제거하시겠습니까?'))return;localStorage.removeItem(CERT_RULES_PACK_LOCAL_KEY);location.reload();};


}
document.getElementById('editTitleBtn').onclick=editCustomTitle;
const portalPdfBtn=document.getElementById('readPortalPdf');
if(portalPdfBtn)portalPdfBtn.onclick=readPortalPdf;
const portalPdfInput=document.getElementById('portalPdfFile');
if(portalPdfInput)portalPdfInput.onchange=()=>{
  const f=portalPdfInput.files?.[0];
  document.getElementById('portalPdfStatus').textContent=f?`선택됨: ${f.name} · [PDF 읽어오기]를 누르십시오.`:'PDF를 선택하십시오.';
  portalPdfCandidates=[];
  document.getElementById('portalPdfResult').innerHTML='';
};
const confirmProfileBtn=document.getElementById('confirmProfileBtn');
if(confirmProfileBtn)confirmProfileBtn.onclick=()=>{
  if(state.profileConfirmed){
    state.profileConfirmed=false;
    save();
    render();
    document.getElementById('profileSection')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  state.profileConfirmed=true;
  save();
  render();
  const h=document.getElementById('historySection');
  if(h){h.open=true;h.scrollIntoView({behavior:'smooth',block:'start'});}
};

const goHistoryInputBtn=document.getElementById('goHistoryInput');
if(goHistoryInputBtn)goHistoryInputBtn.onclick=()=>{
  if(!state.profileConfirmed){
    document.getElementById('profileSection')?.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  const h=document.getElementById('historySection');
  if(h){h.open=true;h.scrollIntoView({behavior:'smooth',block:'start'});}
};

function applyPrintMode(enabled){
  PRINT_MODE=enabled;
  renderPrintProfileSummary();
  renderSemesterGpa();
  renderPlanTimetable();
  renderScheduleReferences();
}
let closedBeforePrint=[];
window.addEventListener('beforeprint',()=>{
  closedBeforePrint=[...document.querySelectorAll('details.step-details:not([open]),#historySection:not([open]),#resultDetailsPanel:not([open]),#extraFeatures:not([open])')];
  closedBeforePrint.forEach(d=>d.open=true);
  applyPrintMode(true);
});
window.addEventListener('afterprint',()=>{
  applyPrintMode(false);
  closedBeforePrint.forEach(d=>d.open=false);
  closedBeforePrint=[];
});

document.getElementById('quickPrint').onclick=()=>window.print();

function openWorkflowTarget(id){
  let target=id==='top'?document.body:document.getElementById(id);
  if(!target)return;
  if(id!=='top'&&!state.profileConfirmed)target=document.getElementById('inputZone');
  for(let el=target;el;el=el.parentElement){if(el.tagName==='DETAILS')el.open=true;}
  target.scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('#mobileNav [data-target]').forEach(btn=>{
  btn.addEventListener('click',()=>openWorkflowTarget(btn.dataset.target));
});
document.querySelectorAll('[data-analysis-target]').forEach(btn=>{
  btn.addEventListener('click',()=>openWorkflowTarget(btn.dataset.analysisTarget));
});

document.getElementById('pdfSaveBottom').onclick=()=>window.print();
document.getElementById('scrollTopBtn').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
document.getElementById('quickReset').onclick=()=>document.getElementById('resetData').click();

const workflowTargets={profile:'inputZone',history:'historySection',result:'analysisZone'};
document.querySelectorAll('#workflowStrip .workflow-step').forEach(s=>{
  s.addEventListener('click',()=>openWorkflowTarget(workflowTargets[s.dataset.step]));
});

document.getElementById('importTabs').addEventListener('click',e=>{
  const btn=e.target.closest('.tab');if(!btn)return;
  document.querySelectorAll('#importTabs .tab').forEach(t=>t.classList.toggle('active',t===btn));
  document.querySelectorAll('#historySection .import-pane').forEach(p=>p.classList.toggle('active',p.id===btn.dataset.pane));
});

async function bootApplication(){
  await loadRuntimePacks();
  const hadStoredState=!!localStorage.getItem(STORAGE_KEY);
  if(!hadStoredState)state=defaultState();
  normalizeSavedHistoryCredits();
  fillStaticControls();refreshCourseSelectors();render();updateRuntimeMetaUi();runIntegrityChecks();
  const t=document.getElementById('updateTargetTerm');if(t&&!t.value)t.value=DATA.snapshot;
}
bootApplication();

