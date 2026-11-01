(() => {
'use strict';
const $ = id => document.getElementById(id);
const STORE = 'dnanimal-save-v1';
const ANIMALS = [
 {id:'fox',name:'붉은여우',emoji:'🦊',life:8,desc:'민첩하고 감각이 뛰어난 잡식성 포유류',stats:{strength:35,speed:72,defense:35,senses:76,stamina:55}},
 {id:'wolf',name:'늑대',emoji:'🐺',life:10,desc:'지구력과 협동 능력이 뛰어난 포식자',stats:{strength:72,speed:70,defense:58,senses:74,stamina:82}},
 {id:'lion',name:'사자',emoji:'🦁',life:14,desc:'강한 근력과 포식 능력을 지닌 대형 고양잇과',stats:{strength:88,speed:68,defense:72,senses:68,stamina:65}},
 {id:'tiger',name:'호랑이',emoji:'🐅',life:15,desc:'강력한 근력과 은밀한 사냥 능력',stats:{strength:94,speed:76,defense:70,senses:72,stamina:70}},
 {id:'elephant',name:'코끼리',emoji:'🐘',life:60,desc:'큰 체구와 뛰어난 기억력, 높은 지구력',stats:{strength:98,speed:32,defense:96,senses:75,stamina:92}},
 {id:'bear',name:'불곰',emoji:'🐻',life:25,desc:'강한 힘과 두꺼운 지방층을 가진 잡식성 동물',stats:{strength:92,speed:52,defense:86,senses:65,stamina:72}},
 {id:'eagle',name:'독수리',emoji:'🦅',life:25,desc:'날카로운 시력과 비행 능력을 가진 맹금류',stats:{strength:60,speed:88,defense:40,senses:98,stamina:72}},
 {id:'deer',name:'사슴',emoji:'🦌',life:12,desc:'빠른 도주 능력과 뛰어난 청각',stats:{strength:38,speed:84,defense:35,senses:83,stamina:76}},
 {id:'rabbit',name:'토끼',emoji:'🐇',life:5,desc:'민첩한 움직임과 높은 번식 잠재력을 지닌 초식동물',stats:{strength:15,speed:86,defense:20,senses:72,stamina:52}},
 {id:'croc',name:'악어',emoji:'🐊',life:45,desc:'강력한 턱과 단단한 피부를 가진 반수생 포식자',stats:{strength:94,speed:35,defense:95,senses:55,stamina:60}},
 {id:'turtle',name:'거북이',emoji:'🐢',life:80,desc:'단단한 등딱지와 느린 대사, 긴 수명',stats:{strength:20,speed:12,defense:98,senses:45,stamina:45}},
 {id:'boar',name:'멧돼지',emoji:'🐗',life:15,desc:'튼튼한 체격과 돌진 능력을 가진 잡식성 동물',stats:{strength:76,speed:58,defense:72,senses:60,stamina:72}}
];
const HABITATS = [
 {id:'savanna',name:'사바나',icon:'🌾',desc:'넓은 초원과 높은 기온, 물과 그늘이 제한적인 환경',climate:'고온·건조',fav:['heat','speed','senses','stamina']},
 {id:'jungle',name:'정글',icon:'🌴',desc:'높은 습도와 빽빽한 식생, 다양한 먹이와 포식자',climate:'고온·다습',fav:['climb','camouflage','senses','poison']},
 {id:'desert',name:'사막',icon:'🏜️',desc:'극심한 일교차와 부족한 수분, 뜨거운 지표',climate:'고온·건조·물 부족',fav:['heat','water','night','burrow']},
 {id:'tundra',name:'툰드라',icon:'❄️',desc:'낮은 기온과 긴 겨울, 짧은 활동 가능 기간',climate:'한랭·강풍',fav:['cold','fur','fat','stamina']},
 {id:'city',name:'도시',icon:'🏙️',desc:'인공 구조물과 교통, 인간 활동과 새로운 먹이원',climate:'인공 환경',fav:['intelligence','hearing','night','adaptability']},
 {id:'forest',name:'삼림',icon:'🌲',desc:'나무와 수풀이 풍부하고 계절 변화가 뚜렷한 환경',climate:'온대·계절 변화',fav:['camouflage','climb','senses','fur']},
 {id:'ocean',name:'해양',icon:'🌊',desc:'물속에서의 부력과 염분, 수압이 작용하는 환경',climate:'수중·염분',fav:['aquatic','gills','streamline','senses']}
];
const TRAITS = [
 {id:'wings',name:'날개',desc:'활공과 비행에 유리한 구조. 에너지 소모가 커질 수 있다.',type:'이동',stat:'speed',value:8},
 {id:'sharp_teeth',name:'날카로운 이빨',desc:'먹이를 붙잡고 사냥하는 능력이 향상된다.',type:'공격',stat:'strength',value:9},
 {id:'venom',name:'독 생성 기관',desc:'독성 물질을 이용해 포식자나 먹이에 대응한다.',type:'공격',stat:'strength',value:8},
 {id:'six_legs',name:'다리 6개',desc:'복잡한 지형에서 안정적인 이동에 도움이 된다.',type:'신체',stat:'stamina',value:7},
 {id:'armor',name:'두꺼운 외골격',desc:'외부 충격과 공격으로부터 몸을 보호한다.',type:'방어',stat:'defense',value:15},
 {id:'thick_fur',name:'두꺼운 털',desc:'추운 환경에서 체온을 유지하는 데 유리하다.',type:'환경',stat:'defense',value:8,habitat:'tundra'},
 {id:'night_vision',name:'야간 시력',desc:'어두운 환경에서 주변을 더 잘 파악한다.',type:'감각',stat:'senses',value:13},
 {id:'keen_smell',name:'발달한 후각',desc:'먹이와 위험의 흔적을 더 잘 감지한다.',type:'감각',stat:'senses',value:12},
 {id:'webbed_feet',name:'물갈퀴',desc:'물속에서 추진력을 얻고 헤엄치기 쉽다.',type:'이동',stat:'speed',value:10,habitat:'ocean'},
 {id:'gills',name:'아가미',desc:'물속에서 산소를 얻는 데 유리한 기관이다.',type:'기관',stat:'adaptation',value:15,habitat:'ocean'},
 {id:'camouflage',name:'위장 피부',desc:'주변 환경에 몸을 숨기는 데 도움이 된다.',type:'방어',stat:'defense',value:10},
 {id:'heat_resist',name:'열 저항성',desc:'높은 기온과 강한 햇빛에 더 잘 견딘다.',type:'환경',stat:'stamina',value:10,habitat:'desert'},
 {id:'fat_layer',name:'두꺼운 지방층',desc:'추위와 먹이 부족에 버틸 여유를 제공한다.',type:'환경',stat:'defense',value:12,habitat:'tundra'},
 {id:'claws',name:'강화된 발톱',desc:'등반과 사냥, 방어에 폭넓게 활용된다.',type:'공격',stat:'strength',value:8},
 {id:'long_legs',name:'긴 다리',desc:'넓은 지형에서 빠르게 이동할 수 있다.',type:'이동',stat:'speed',value:12},
 {id:'large_ears',name:'큰 귀',desc:'작은 소리와 주변 움직임을 감지하기 쉽다.',type:'감각',stat:'senses',value:10},
 {id:'water_storage',name:'수분 저장 능력',desc:'물 부족 환경에서 수분을 오래 유지한다.',type:'환경',stat:'adaptation',value:15,habitat:'desert'},
 {id:'climbing',name:'발달한 등반 능력',desc:'나무와 바위 지형을 오르내리기 쉽다.',type:'이동',stat:'speed',value:9,habitat:'jungle'},
 {id:'bioluminescence',name:'생물 발광',desc:'몸에서 빛을 내 어두운 곳에서 신호를 보낼 수 있다.',type:'특수',stat:'senses',value:8},
 {id:'thick_skin',name:'두꺼운 피부',desc:'마찰과 외부 손상에 대한 저항력이 높아진다.',type:'방어',stat:'defense',value:12}
];
const STAT_NAMES={strength:'근력',speed:'속도',defense:'방어',senses:'감각',stamina:'지구력',adaptation:'환경 적응력'};
let db=loadDB(),selectedAnimal='fox',selectedHabitat='savanna',selectedCreatureId=null,lastDeadId=null,customStart=null,currentActionOptions=[];
function loadDB(){try{return JSON.parse(localStorage.getItem(STORE))||{active:[],archive:[],born:0};}catch(e){return {active:[],archive:[],born:0};}}
function save(){try{localStorage.setItem(STORE,JSON.stringify(db));$('saveIndicator').textContent='SAVED';setTimeout(()=>$('saveIndicator').textContent='LOCAL SAVE',1100);}catch(e){$('saveIndicator').textContent='SAVE ERROR';}}
function uid(){return 'life-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);}
function animal(id){return ANIMALS.find(a=>a.id===id)||ANIMALS[0];}
function habitat(id){return HABITATS.find(h=>h.id===id)||HABITATS[0];}
function trait(id){return TRAITS.find(t=>t.id===id);}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.nav===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='homeScreen')renderHome();if(id==='archiveScreen')renderArchive();}
function openModal(id){$(id).classList.add('open');}
function closeModal(id){$(id).classList.remove('open');}
function makeTrait(id,origin='변이'){const t=trait(id);return {id:t.id,name:t.name,desc:t.desc,type:t.type,origin,acquiredAt:null};}
function renderHome(){
 $('bornCount').textContent=db.born||db.archive.length+db.active.length;$('deadCount').textContent=db.archive.length;$('speciesCount').textContent=new Set(db.archive.map(x=>x.speciesName).concat(db.active.map(x=>x.speciesName))).size;$('collectionCount').textContent='전시 생물 '+db.archive.length;
 const active=$('activeList');active.innerHTML=db.active.length?db.active.map(c=>`<button class="mini-creature" data-open-creature="${c.id}"><span class="mini-emoji">${c.emoji}</span><span class="mini-info"><strong>${escapeHTML(c.name)}</strong><small>${escapeHTML(c.speciesName)} · ${habitat(c.habitatId).name} · ${Math.floor(c.survivalDays)}일</small></span><span class="mini-arrow">↗</span></button>`).join(''):'<div class="empty-state">아직 진행 중인 생물이 없습니다.<br>새로운 생명을 탄생시켜 보세요.</div>';
 const recent=$('recentArchive');const arr=db.archive.slice().sort((a,b)=>b.diedAt-a.diedAt).slice(0,2);recent.innerHTML=arr.length?arr.map(archiveMini).join(''):'<div class="empty-state">첫 번째 생물이 생을 마치면 이곳에 전시됩니다.</div>';
}
function archiveMini(c){return `<button class="archive-card" data-detail="${c.id}"><div class="archive-card-art">${c.emoji}</div><div class="archive-card-info"><strong>${escapeHTML(c.name)}</strong><small>${escapeHTML(c.speciesName)}</small><span class="tagline">생존 ${Math.floor(c.survivalDays)}일</span></div></button>`;}
function renderCreate(){
 selectedAnimal='fox';selectedHabitat='savanna';
 $('creatureName').value='';
 const cards=ANIMALS.map(a=>`<button class="choice-card ${a.id===selectedAnimal?'selected':''}" data-animal="${a.id}"><span class="animal-emoji">${a.emoji}</span><strong>${a.name}</strong><small>평균 수명 약 ${a.life}년</small></button>`).join('');
 const custom=db.archive.filter(c=>c.speciesId).slice().reverse().filter((c,i,a)=>a.findIndex(x=>x.speciesId===c.speciesId)===i);
 $('animalChoices').innerHTML=cards+custom.slice(0,8).map(c=>`<button class="choice-card custom-choice" data-custom="${c.id}"><span class="animal-emoji">${c.emoji}</span><strong>${escapeHTML(c.speciesName)}</strong><small>연구소 발견 종 · 특성 ${c.traits.length}개</small></button>`).join('');
 renderHabitatChoices();updateOriginPreview();
}
function renderHabitatChoices(){ $('habitatChoices').innerHTML=HABITATS.map(h=>`<button class="choice-card habitat-card ${h.id===selectedHabitat?'selected':''}" data-habitat="${h.id}"><span class="habitat-icon">${h.icon}</span><span><strong>${h.name}</strong><small>${h.climate}</small></span></button>`).join('');}
function updateOriginPreview(){let a=customStart?customStart:animal(selectedAnimal);$('originPreview').textContent=customStart?'선택한 발견 종의 유전적 특성 '+customStart.traits.length+'개를 이어받아 새로운 개체가 탄생합니다.':'시작 동물: '+a.name+' · 예상 수명: 약 '+a.life+'년 · 서식지: '+habitat(selectedHabitat).name;}
function createCreature(){
 const name=$('creatureName').value.trim();if(!name){$('creatureName').focus();$('creatureName').placeholder='이름을 입력해 주세요';return;}
 let base=customStart?{id:customStart.baseAnimalId,name:customStart.baseAnimalName,emoji:customStart.emoji,life:customStart.life,stats:{...customStart.stats}}:animal(selectedAnimal);
 const traits=customStart?customStart.traits.map(t=>({...t,origin:'계승',acquiredAt:null})): (base.id==='eagle'?[makeTrait('wings','기본 특성')]:base.id==='croc'?[makeTrait('thick_skin','기본 특성')]:base.id==='turtle'?[makeTrait('armor','기본 특성')]:[]);
 const c={id:uid(),name,speciesName:customStart?customStart.speciesName:base.name,speciesId:customStart?customStart.speciesId:base.id,baseAnimalId:base.id,baseAnimalName:base.name,emoji:base.emoji,life:base.life,habitatId:selectedHabitat,ageDays:0,survivalDays:0,health:100,energy:100,stats:{...base.stats},traits,counts:{growth:0,mutation:0,adaptation:0,move:0},journal:[],createdAt:Date.now(),lastEvent:'탄생'};
 c.journal.push({day:0,title:'새로운 생명의 탄생',desc:c.name+'이(가) '+habitat(c.habitatId).name+'에서 태어났다.',kind:'birth',icon:'✦'});
 db.active.push(c);db.born=(db.born||0)+1;selectedCreatureId=c.id;save();renderCreature(c);showScreen('creatureScreen');
}
function renderCreature(c){
 window.dispatchEvent(new CustomEvent('dnanimal:render-creature',{detail:{id:c.id,name:c.name,baseAnimalId:c.baseAnimalId,ageDays:c.ageDays,life:c.life,traits:c.traits||[],habitatId:c.habitatId}}));
 selectedCreatureId=c.id;const h=habitat(c.habitatId);$('creatureEmoji').textContent=c.emoji;$('creatureTitle').textContent=c.name;$('creatureSpeciesLabel').textContent=c.speciesName.toUpperCase()+' · CURRENT SPECIES';$('creatureMeta').textContent=h.name+' · '+Math.floor(c.survivalDays)+'일 생존';$('visualCaption').textContent=h.id.toUpperCase()+' / '+c.id.slice(-5).toUpperCase();
 const age=c.ageDays/365;$('ageValue').textContent=age.toFixed(1)+'세';$('lifeStage').textContent=age<1?'어린 개체':age<c.life*.18?'성장기':age<c.life*.7?'성체':age<c.life*.88?'노년기':'수명 말기';$('healthValue').textContent=Math.round(c.health)+'%';$('healthMeter').style.width=Math.max(0,c.health)+'%';$('energyValue').textContent=Math.round(c.energy)+'%';$('energyMeter').style.width=Math.max(0,c.energy)+'%';$('daysValue').textContent=Math.floor(c.survivalDays)+'일';
 $('traitCount').textContent=c.traits.length+'개';$('traitList').innerHTML=c.traits.length?c.traits.map(t=>`<span class="trait-chip" title="${escapeHTML(t.desc)}">${escapeHTML(t.name)}<small>${escapeHTML(t.origin||'')}</small></span>`).join(''):'<span class="no-traits">아직 특별한 변이 특성이 없습니다.</span>';
 $('currentHabitat').innerHTML=`<span class="habitat-icon">${h.icon}</span><div><strong>${h.name} · ${h.climate}</strong><p>${h.desc}</p></div>`;
 $('eventCount').textContent=c.journal.length+'개 기록';$('lifeJournal').innerHTML=c.journal.slice(-5).reverse().map(journalHTML).join('');
 renderActionChoices(c);
}
function renderActionChoices(c){
 const all=[{id:'growth',icon:'↗',name:'성장',desc:'나이를 더 많이 먹고 기존 신체 능력과 기본 특성이 향상됩니다.'},{id:'mutation',icon:'✧',name:'변이',desc:'새로운 신체적 특성이 무작위로 발현될 수 있습니다. 실패할 수도 있습니다.'},{id:'adaptation',icon:'⌁',name:'적응',desc:'현재 서식지에 맞춰 특성이 발달하거나 퇴화할 수 있습니다.'}];
 const shuffled=all.sort(()=>Math.random()-.5);const count=1+Math.floor(Math.random()*3);currentActionOptions=shuffled.slice(0,count);
 $('actionChoices').innerHTML=currentActionOptions.map(a=>`<button class="action-card" data-action="${a.id}"><span class="action-icon">${a.icon}</span><strong>${a.name}</strong><small>${a.desc}</small></button>`).join('');
}
function addJournal(c,title,desc,kind='event',icon='✧'){c.journal.push({day:Math.floor(c.survivalDays),title,desc,kind,icon});}
function journalHTML(j){return `<div class="journal-item"><span class="journal-mark">${j.icon||'✧'}</span><div><strong>${escapeHTML(j.title)} <span class="subtle">· ${Math.floor(j.day)}일</span></strong><p>${escapeHTML(j.desc)}</p></div></div>`;}
function weighted(list){let total=list.reduce((s,x)=>s+x.w,0),n=Math.random()*total;for(const x of list){n-=x.w;if(n<=0)return x.v;}return list[list.length-1].v;}
function chooseAction(id){
 const c=db.active.find(x=>x.id===selectedCreatureId);if(!c)return;
 let title='',desc='',impact='',icon='✧',kind=id;
 const elapsed=id==='growth'?14:7;c.ageDays+=elapsed;c.survivalDays+=elapsed;c.energy=Math.max(0,c.energy-(id==='growth'?12:7));
 if(id==='growth'){
  c.counts.growth++;const keys=['strength','speed','defense','senses','stamina'];const stat=keys[Math.floor(Math.random()*keys.length)];const gain=3+Math.floor(Math.random()*5);c.stats[stat]=Math.min(100,c.stats[stat]+gain);c.health=Math.min(100,c.health+4);
  title='신체 성장';desc='시간이 흐르며 '+STAT_NAMES[stat]+'이(가) '+gain+'만큼 향상됐다. 개체의 몸이 성장했다.';impact=STAT_NAMES[stat]+' +'+gain+' · 나이 +14일';icon='↗';
 }else if(id==='mutation'){
  c.counts.mutation++;const available=TRAITS.filter(t=>!c.traits.some(x=>x.id===t.id));
  if(available.length&&Math.random()<.66){const t=available[Math.floor(Math.random()*available.length)];const newT=makeTrait(t.id,'변이');newT.acquiredAt=c.survivalDays;c.traits.push(newT);c.stats[t.stat]=Math.min(100,(c.stats[t.stat]||0)+t.value);title='새로운 변이 발생';desc=t.name+' 특성이 발현됐다. '+t.desc;impact='특성 획득: '+t.name;icon='✧';}
  else{c.health=Math.max(0,c.health-5);title='변이 실패';desc='이번 변이는 안정적으로 발현되지 못했다. 신체에 작은 부담이 남았다.';impact='변이 실패 · 건강 -5';icon='◇';}
 }else{
  c.counts.adaptation++;const h=habitat(c.habitatId),fav=TRAITS.filter(t=>!c.traits.some(x=>x.id===t.id)&&t.habitat===h.id);
  const success=Math.random()<(h.id==='ocean'?.48:.72);
  if(success){
   let t=fav.length?fav[Math.floor(Math.random()*fav.length)]:null;
   if(t&&Math.random()<.62){c.traits.push(makeTrait(t.id,'환경 적응'));c.stats[t.stat]=Math.min(100,(c.stats[t.stat]||0)+t.value);title='환경 적응 성공';desc=h.name+' 환경에 적응하며 '+t.name+' 특성이 발달했다. '+t.desc;impact='새로운 특성: '+t.name;icon='⌁';}
   else{const stat=h.fav[Math.floor(Math.random()*h.fav.length)];c.stats[stat]=Math.min(100,(c.stats[stat]||0)+5);title='환경 적응 성공';desc=h.name+' 환경에 적응하며 '+STAT_NAMES[stat]+'이(가) 발달했다.';impact=STAT_NAMES[stat]+' +5';icon='⌁';}
  }else{
   const stat=h.fav[Math.floor(Math.random()*h.fav.length)];c.stats[stat]=Math.max(5,(c.stats[stat]||30)-4);c.health=Math.max(0,c.health-8);title='적응 실패';desc=h.name+' 환경에 적응하는 데 실패했다. '+STAT_NAMES[stat]+'이(가) 저하되고 건강이 악화됐다.';impact='적응 실패 · 건강 -8 · '+STAT_NAMES[stat]+' -4';icon='⚠';
  }
 }
 addJournal(c,title,desc,kind,icon);
 const event=generateEvent(c,id);if(event){c.health=Math.max(0,Math.min(100,c.health+(event.health||0)));c.energy=Math.max(0,Math.min(100,c.energy+(event.energy||0)));if(event.stat){c.stats[event.stat]=Math.max(0,Math.min(100,(c.stats[event.stat]||30)+event.statValue));}addJournal(c,event.title,event.desc,'event',event.icon);title=event.title;desc=event.desc;impact+=(event.impact?' · '+event.impact:'');}
 if(c.energy<12){c.health=Math.max(0,c.health-4);c.energy=28;addJournal(c,'에너지 고갈','에너지가 부족해 건강이 악화됐다. 가까스로 먹이를 확보했다.','event','!');}
 const dead=c.health<=0||c.ageDays>=c.life*365;
 if(dead){const cause=c.health<=0?'건강 악화와 생존력 저하':c.ageDays>=c.life*365?'노화에 따른 자연사':'생존 실패';finishCreature(c,cause);return;}
 save();renderCreature(c);showEvent({title,desc,impact:impact||'생존 기록이 갱신되었습니다.',icon:icon||'✧',type:id==='growth'?'GROWTH EVENT':id==='mutation'?'MUTATION EVENT':'ADAPTATION EVENT'});
}
function generateEvent(c,action){
 const h=habitat(c.habitatId),has=id=>c.traits.some(t=>t.id===id);
 const pool=[
  {w:12,v:{title:'먹이가 풍부한 시기',desc:h.name+'에서 먹이를 충분히 확보했다. 에너지가 회복됐다.',energy:20,impact:'에너지 +20',icon:'＋'}},
  {w:8,v:{title:'휴식처 발견',desc:'안전한 은신처를 발견해 잠시 안정을 되찾았다.',health:7,impact:'건강 +7',icon:'⌂'}},
  {w:8,v:{title:'경쟁자와의 대치',desc:'먹이를 두고 다른 동물과 대치했다. 큰 충돌은 피했지만 에너지를 소모했다.',energy:-8,impact:'에너지 -8',icon:'⚔'}},
  {w:9,v:{title:'포식자에게 노출',desc:'주변 포식자에게 위치가 발각됐다. 가까스로 도망쳤지만 부상을 입었다.',health:-13,impact:'건강 -13',icon:'!'}},
  {w:7,v:{title:'계절의 변화',desc:h.name+'의 기후가 변하기 시작했다. 환경 변화에 적응해야 한다.',stat:h.fav[0],statValue:2,impact:'환경 변화 감지',icon:'☼'}},
  {w:5,v:{title:'작은 질병',desc:'낯선 병원체에 노출되어 일시적으로 건강이 악화됐다.',health:-9,impact:'건강 -9',icon:'＋'}},
  {w:6,v:{title:'뜻밖의 먹이원',desc:'새로운 먹이원을 발견했다. 당분간 에너지 확보가 쉬워질 것 같다.',energy:26,impact:'에너지 +26',icon:'✦'}},
  {w:5,v:{title:'영역의 우위',desc:'주변 경쟁자보다 우세한 위치를 차지했다. 먹이와 은신처 확보가 유리해졌다.',health:4,energy:12,impact:'건강 +4 · 에너지 +12',icon:'♛'}},
  {w:4,v:{title:'위험한 지형',desc:'험한 지형을 통과하다 작은 부상을 입었다.',health:-7,impact:'건강 -7',icon:'△'}},
  {w:4,v:{title:'희귀한 관찰',desc:'주변 환경을 탐색하던 중 이전에 접하지 못한 자극을 경험했다. 감각이 발달했다.',stat:'senses',statValue:3,impact:'감각 +3',icon:'◎'}}
 ];
 if(h.id==='desert')pool.push({w:9,v:{title:'수자원 부족',desc:'오랫동안 물을 찾지 못했다. 탈수로 건강이 악화됐다.',health:-12,impact:'건강 -12',icon:'☀'}});
 if(h.id==='tundra')pool.push({w:9,v:{title:'한파',desc:'갑작스러운 기온 하락으로 체온 유지가 어려워졌다.',health:has('thick_fur')||has('fat_layer')?-1:-12,impact:has('thick_fur')||has('fat_layer')?'특성으로 피해 완화':'건강 -12',icon:'❄'}});
 if(h.id==='jungle')pool.push({w:8,v:{title:'수풀 속 매복',desc:'빽빽한 수풀 속에서 포식자가 접근했다.',health:has('camouflage')?-2:-10,impact:has('camouflage')?'위장 특성으로 피해 완화':'건강 -10',icon:'🌿'}});
 if(h.id==='city')pool.push({w:8,v:{title:'도시의 먹이',desc:'인간 거주지 주변에서 새로운 먹이를 발견했다.',energy:18,impact:'에너지 +18',icon:'⌂'}});
 if(h.id==='ocean')pool.push({w:10,v:{title:'강한 해류',desc:'강한 해류에 휩쓸렸다. 수중 이동 특성이 부족하면 큰 부담이 된다.',health:has('webbed_feet')||has('gills')?-2:-14,impact:has('webbed_feet')||has('gills')?'특성으로 피해 완화':'건강 -14',icon:'≈'}});
 if(c.stats.strength>80&&Math.random()<.12)pool.push({w:20,v:{title:'최상위 포식자의 지위',desc:'강력한 신체 능력으로 주변 경쟁자를 압도했다. 이 지역에서 최상위 포식자로 인정받기 시작했다.',health:5,energy:15,impact:'건강 +5 · 에너지 +15',icon:'♛'}});
 if(c.stats.speed>80&&Math.random()<.08)pool.push({w:12,v:{title:'위험을 앞선 도주',desc:'뛰어난 속도로 위협을 빠르게 벗어났다. 부상을 피했다.',health:5,impact:'건강 +5',icon:'↗'}});
 return weighted(pool);
}
function showEvent(e){$('eventSymbol').textContent=e.icon||'✧';$('eventType').textContent=e.type||'LIFE EVENT';$('eventTitle').textContent=e.title;$('eventDescription').textContent=e.desc;$('eventImpact').textContent=e.impact||'생애 기록이 갱신되었습니다.';openModal('eventModal');}
function finishCreature(c,cause){
 const index=db.active.findIndex(x=>x.id===c.id);if(index>=0)db.active.splice(index,1);
 c.deathCause=cause;c.diedAt=Date.now();c.speciesName=deriveSpeciesName(c);c.speciesId='sp-'+c.baseAnimalId+'-'+c.traits.map(t=>t.id).sort().join('-');
 addJournal(c,'생애의 끝',c.name+'의 생명이 끝났다. 사망 원인: '+cause,'death','✧');
 db.archive.push(c);lastDeadId=c.id;save();renderResult(c);showScreen('resultScreen');
}
function deriveSpeciesName(c){if(!c.traits.length)return c.baseAnimalName;const prefix=c.traits.length>=3?'다중변이형 ':c.traits.some(t=>t.id==='wings')?'익형 ':c.traits.some(t=>t.id==='venom')?'독성 ':c.traits.some(t=>t.id==='armor'||t.id==='thick_skin')?'갑각형 ':'변이형 ';return prefix+c.baseAnimalName;}
function renderResult(c){
 $('resultName').textContent=c.name;$('resultSubtitle').textContent=c.speciesName+' · 최초 종 '+c.baseAnimalName;$('deathCause').textContent='사망 원인: '+c.deathCause;
 const stats=[['생존 기간',Math.floor(c.survivalDays)+'일'],['최종 나이',(c.ageDays/365).toFixed(1)+'세'],['성장',c.counts.growth+'회'],['변이',c.counts.mutation+'회'],['적응',c.counts.adaptation+'회'],['서식지 이동',c.counts.move+'회']];
 $('resultStats').innerHTML=stats.map(x=>`<div class="result-stat"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
 $('resultTimeline').innerHTML=c.journal.slice().reverse().map(journalHTML).join('');$('resultTraits').innerHTML=c.traits.length?c.traits.map(t=>`<span class="trait-chip" title="${escapeHTML(t.desc)}">${escapeHTML(t.name)}<small>${escapeHTML(t.origin||'')}</small></span>`).join(''):'<span class="no-traits">특별한 변이 특성 없이 생을 마감했습니다.</span>';
}
function openMove(){const c=db.active.find(x=>x.id===selectedCreatureId);if(!c)return;$('moveChoices').innerHTML=HABITATS.filter(h=>h.id!==c.habitatId).map(h=>`<button class="choice-card habitat-card" data-move="${h.id}"><span class="habitat-icon">${h.icon}</span><span><strong>${h.name}</strong><small>${h.climate}</small></span></button>`).join('');openModal('moveModal');}
function moveTo(id){const c=db.active.find(x=>x.id===selectedCreatureId);if(!c)return;const old=habitat(c.habitatId),next=habitat(id);c.habitatId=id;c.counts.move++;c.ageDays+=3;c.survivalDays+=3;c.energy=Math.max(0,c.energy-9);
 let risk=Math.random(),event;
 if(risk<.18){c.health=Math.max(0,c.health-15);event={title:'이동 중 부상',desc:old.name+'에서 '+next.name+'로 이동하던 중 위험한 지형에 노출되어 부상을 입었다.',impact:'건강 -15',icon:'!'};}
 else if(risk<.42){c.energy=Math.min(100,c.energy+12);event={title:'새로운 먹이원 발견',desc:next.name+'에 도착하자 새로운 먹이원을 발견했다.',impact:'에너지 +12',icon:'＋'};}
 else if(risk<.68){c.health=Math.max(0,c.health-7);event={title:'낯선 환경의 스트레스',desc:'새로운 기후와 냄새, 지형에 적응하는 동안 스트레스가 발생했다.',impact:'건강 -7',icon:'⌁'};}
 else{event={title:'안전한 이동',desc:'큰 위험 없이 '+next.name+'에 도착했다. 새로운 환경을 탐색하기 시작했다.',impact:'이동 성공',icon:'↗'};}
 addJournal(c,'서식지 이동: '+old.name+' → '+next.name,old.name+'을 떠나 '+next.name+'에 정착하기 시작했다.','move','⌖');addJournal(c,event.title,event.desc,'event',event.icon);closeModal('moveModal');
 if(c.health<=0){finishCreature(c,'서식지 이동 중 발생한 부상');return;}save();renderCreature(c);showEvent({...event,type:'RELOCATION EVENT'});
}
function renderArchive(){
 const q=($('archiveSearch').value||'').trim().toLowerCase(),sort=$('archiveSort').value;let list=db.archive.filter(c=>(c.name+' '+c.speciesName+' '+c.baseAnimalName).toLowerCase().includes(q));
 if(sort==='longest')list.sort((a,b)=>b.survivalDays-a.survivalDays);else if(sort==='traits')list.sort((a,b)=>b.traits.length-a.traits.length);else list.sort((a,b)=>b.diedAt-a.diedAt);
 $('archiveGrid').innerHTML=list.length?list.map(c=>`<button class="archive-card" data-detail="${c.id}"><div class="archive-card-art">${c.emoji}</div><div class="archive-card-info"><strong>${escapeHTML(c.name)}</strong><small>${escapeHTML(c.speciesName)}</small><span class="tagline">${Math.floor(c.survivalDays)}일 생존 · 특성 ${c.traits.length}개</span><div class="archive-meta">최종 나이 ${(c.ageDays/365).toFixed(1)}세</div></div></button>`).join(''):'<div class="empty-state">아직 전시된 생물이 없습니다.<br>생물이 생을 마감하면 이곳에 보관됩니다.</div>';
}
function showDetail(id){const c=db.archive.find(x=>x.id===id);if(!c)return;$('detailContent').innerHTML=`<div class="detail-hero"><div class="detail-emoji">${c.emoji}</div><p class="eyebrow">ARCHIVED LIFEFORM</p><h2>${escapeHTML(c.name)}</h2><p class="subtle">${escapeHTML(c.speciesName)} · ${escapeHTML(c.baseAnimalName)}</p></div><div class="detail-section"><h3>생애 요약</h3><p>생존 기간 ${Math.floor(c.survivalDays)}일 · 최종 나이 ${(c.ageDays/365).toFixed(1)}세<br>사망 원인: ${escapeHTML(c.deathCause)}<br>최종 서식지: ${habitat(c.habitatId).name}</p><p>성장 ${c.counts.growth}회 · 변이 ${c.counts.mutation}회 · 적응 ${c.counts.adaptation}회 · 이동 ${c.counts.move}회</p></div><div class="detail-section"><h3>최종 보유 특성</h3><div class="trait-list">${c.traits.map(t=>`<span class="trait-chip">${escapeHTML(t.name)}</span>`).join('')||'<span class="no-traits">특별한 변이 없음</span>'}</div></div><div class="detail-section"><h3>생애 기록</h3><div class="journal-list">${c.journal.slice().reverse().map(journalHTML).join('')}</div></div><button class="primary-button full-button" id="detailStartSpecies">이 종으로 새 생물 생성 ↗</button>`;
 $('detailStartSpecies').addEventListener('click',()=>{closeModal('detailModal');startFromArchive(c.id);});openModal('detailModal');}
function startFromArchive(id){const c=db.archive.find(x=>x.id===id);if(!c)return;customStart={speciesName:c.speciesName,speciesId:c.speciesId,baseAnimalId:c.baseAnimalId,baseAnimalName:c.baseAnimalName,emoji:c.emoji,life:c.life,stats:{...c.stats},traits:c.traits.map(t=>({...t}))};renderCreate();showScreen('createScreen');}
function openCreature(id){const c=db.active.find(x=>x.id===id);if(!c)return;renderCreature(c);showScreen('creatureScreen');}
function bind(){
 $('newLifeBtn').addEventListener('click',()=>{customStart=null;renderCreate();showScreen('createScreen');});$('createCreatureBtn').addEventListener('click',createCreature);
 document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go)));
 document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='createScreen'){customStart=null;renderCreate();}showScreen(b.dataset.nav);}));
 $('openArchiveBtn').addEventListener('click',()=>showScreen('archiveScreen'));$('creatureHomeBtn').addEventListener('click',()=>showScreen('homeScreen'));
 $('moveHabitatBtn').addEventListener('click',openMove);$('closeMoveBtn').addEventListener('click',()=>closeModal('moveModal'));$('closeDetailBtn').addEventListener('click',()=>closeModal('detailModal'));$('eventContinueBtn').addEventListener('click',()=>closeModal('eventModal'));
 $('resultHomeBtn').addEventListener('click',()=>showScreen('homeScreen'));$('resultArchiveBtn').addEventListener('click',()=>showScreen('archiveScreen'));$('newFromSpeciesBtn').addEventListener('click',()=>startFromArchive(lastDeadId));
 $('archiveSearch').addEventListener('input',renderArchive);$('archiveSort').addEventListener('change',renderArchive);
 document.addEventListener('click',e=>{
  const a=e.target.closest('[data-animal]');if(a){selectedAnimal=a.dataset.animal;customStart=null;document.querySelectorAll('[data-animal]').forEach(x=>x.classList.toggle('selected',x===a));document.querySelectorAll('.custom-choice').forEach(x=>x.classList.remove('selected'));updateOriginPreview();return;}
  const h=e.target.closest('[data-habitat]');if(h){selectedHabitat=h.dataset.habitat;renderHabitatChoices();updateOriginPreview();return;}
  const cs=e.target.closest('[data-custom]');if(cs){const c=db.archive.find(x=>x.id===cs.dataset.custom);if(c){customStart={speciesName:c.speciesName,speciesId:c.speciesId,baseAnimalId:c.baseAnimalId,baseAnimalName:c.baseAnimalName,emoji:c.emoji,life:c.life,stats:{...c.stats},traits:c.traits.map(t=>({...t}))};document.querySelectorAll('[data-animal]').forEach(x=>x.classList.remove('selected'));document.querySelectorAll('.custom-choice').forEach(x=>x.classList.toggle('selected',x===cs));updateOriginPreview();}return;}
  const act=e.target.closest('[data-action]');if(act){chooseAction(act.dataset.action);return;}
  const mv=e.target.closest('[data-move]');if(mv){moveTo(mv.dataset.move);return;}
  const open=e.target.closest('[data-open-creature]');if(open){openCreature(open.dataset.openCreature);return;}
  const detail=e.target.closest('[data-detail]');if(detail){showDetail(detail.dataset.detail);return;}
 });
}
bind();renderHome();
})();