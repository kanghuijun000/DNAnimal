import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('creature3dCanvas');
const loading = document.getElementById('modelLoading');
if (!canvas) throw new Error('3D canvas not found');

let renderer, scene, camera, model, stage, frame = 0, autoRotate = true;
let pointer = null, targetRotation = 0, targetTilt = 0, zoom = 1;
const clock = new THREE.Clock();
const MAT = (color, roughness=.78, metalness=0) => new THREE.MeshStandardMaterial({color,roughness,metalness});
const palettes = {
 fox:['#c8793d','#f1d7ad','#35241c'],wolf:['#858d8b','#d2d3c8','#303b3b'],
 lion:['#c99b4c','#f1d7a2','#57331e'],tiger:['#d88732','#f5e5c7','#30231b'],
 elephant:['#858b88','#b5aaa0','#5b6260'],bear:['#604432','#b68a5d','#241a16'],
 eagle:['#76513b','#e5d4ae','#27231e'],deer:['#ad794a','#f0d7b1','#463025'],
 rabbit:['#b8a99a','#eee2d5','#52443b'],croc:['#536e50','#a6a47c','#293e34'],
 turtle:['#668c58','#b6a36b','#334b35'],boar:['#76513c','#c29a6b','#35251e']
};
const sphereGeo = new THREE.SphereGeometry(1,24,18);
function mesh(parent, geo, material, pos, scale, rot) {
 const m = new THREE.Mesh(geo, material);
 m.position.set(...pos); m.scale.set(...scale);
 if (rot) m.rotation.set(...rot);
 m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
function ball(parent,mat,pos,scale,rot){return mesh(parent,sphereGeo,mat,pos,scale,rot);}
function cone(parent,mat,pos,r,h,rot=[0,0,0]){return mesh(parent,new THREE.ConeGeometry(r,h,18),mat,pos,[1,1,1],rot);}
function tube(parent,points,r,mat){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,28,r,9,false),mat);m.castShadow=true;parent.add(m);return m;}
function limb(parent,mat,x,z,len=.62,r=.15){const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);ball(g,mat,[0,-len*.45,0],[r,len*.58,r]);ball(g,mat,[0,-len,0],[r*1.15,r*.7,r*1.35]);return g;}
function addEyes(head,dark,glow=false){
 const eye=MAT(dark,.25),iris=MAT(glow?'#8df0c0':'#d8b46c',.25,.05);
 for(const x of [-.22,.22]){ball(head,eye,[x,.13,.31],[.085,.095,.06]);ball(head,iris,[x,.13,.36],[.035,.04,.025]);}
}

function shellDome(rx,rz,height,baseY){
 const v=[],uv=[],idx=[],rings=30,steps=88;
 for(let i=0;i<=rings;i++){const t=i/rings*Math.PI/2;for(let j=0;j<=steps;j++){const a=j/steps*Math.PI*2;v.push(Math.cos(a)*Math.sin(t)*rx,baseY+Math.cos(t)*height,Math.sin(a)*Math.sin(t)*rz);uv.push(j/steps,i/rings);}}
 for(let i=0;i<rings;i++)for(let j=0;j<steps;j++){const a=i*(steps+1)+j,b=a+steps+1;idx.push(a,a+1,b,a+1,b+1,b);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
function turtleTexture(base,amount=28){
 const c=document.createElement('canvas');c.width=c.height=512;
 const x=c.getContext('2d'),im=x.createImageData(512,512),h=base.slice(1);
 const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));
 for(let y=0;y<512;y++)for(let z=0;z<512;z++){
  const n=(Math.sin(z*.08+Math.sin(y*.03)*2)+Math.sin(y*.11+z*.02))*.25+(Math.random()-.5)*.3,k=n*amount,i=(y*512+z)*4;
  for(let q=0;q<3;q++)im.data[i+q]=THREE.MathUtils.clamp(rgb[q]+k,0,255);
  im.data[i+3]=255;
 }
 x.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function turtleScute(parent,cx,cz,rx,rz,mat,seed){
 const pts=[],n=7;
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=1+Math.sin(i*8+seed)*.08;pts.push([cx+Math.cos(a)*rx*r,cz+Math.sin(a)*rz*r]);}
 const y=(x,z)=>.76+.63*Math.sqrt(Math.max(.02,1-(x/.82)**2-(z/.98)**2))+.009;
 const v=[cx,y(cx,cz),cz];pts.forEach(p=>v.push(p[0],y(...p),p[1]));
 const ix=[];for(let i=0;i<n;i++)ix.push(0,(i+1)%n+1,i+1);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();
 const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;parent.add(m);
 const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],y(...p)+.002,p[1])),true);
 parent.add(new THREE.Mesh(new THREE.TubeGeometry(curve,48,.006,5,true),MAT('#49321f',.78)));
}
function buildDetailedTurtle(body,skin,light,dark,traits){
 const st=turtleTexture('#80603d',42),kt=turtleTexture('#89966b',30);
 const hide=new THREE.MeshStandardMaterial({color:'#aab786',map:kt,bumpMap:kt,bumpScale:.035,roughness:.94});
 const carapace=new THREE.MeshStandardMaterial({color:'#987248',map:st,bumpMap:st,bumpScale:.065,roughness:.62});
 const colors=['#a77f4d','#8d673e','#b28a55','#987044','#785638'];
 const scutes=colors.map(c=>new THREE.MeshStandardMaterial({color:c,map:st,bumpMap:st,bumpScale:.045,roughness:.64}));
 const belly=MAT('#c4a875',.88),seam=MAT('#493a29',.9),claw=MAT('#594735',.52);
 ball(body,hide,[0,.54,-.03],[.65,.30,.82]);
 ball(body,belly,[0,.39,-.03],[.59,.10,.75]);
 mesh(body,shellDome(.82,.98,.63,.76),carapace,[0,0,0],[1,1,1]);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(.79,.052,16,112),belly);rim.rotation.x=Math.PI/2;rim.scale.set(1,1.22,1);rim.position.set(0,.77,-.02);body.add(rim);
 // Individual keratin scutes follow the curved shell surface.
 [-.68,-.34,0,.34,.68].forEach((z,i)=>turtleScute(body,0,z,.17,.19,scutes[i%5],i));
 for(const side of [-1,1])for(let i=0;i<4;i++)turtleScute(body,side*(i===0||i===3?.43:.49),-.57+i*.38,.18,.19,scutes[(i+(side>0?2:0))%5],i+side*4);
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2,x=Math.cos(a)*.75,z=Math.sin(a)*.91,y=.76+.63*Math.sqrt(Math.max(.02,1-(x/.82)**2-(z/.98)**2));ball(body,scutes[i%5],[x,y-.02,z],[.09,.045,.12],[0,-a,0]);}
 // Thick, splayed legs with folded skin, individual toes and dark nails.
 for(const side of [-1,1])for(const front of [-1,1]){
  const leg=new THREE.Group();leg.position.set(side*.49,.48,front*.52);leg.rotation.z=side*.12;body.add(leg);
  ball(leg,hide,[side*.04,-.13,front*.03],[.20,.25,.27],[.12*front,0,side*.1]);
  ball(leg,hide,[side*.10,-.30,front*.17],[.23,.14,.30]);
  for(let j=0;j<3;j++){const r=new THREE.Mesh(new THREE.TorusGeometry(.17-j*.012,.009,6,24),MAT('#718052',.96));r.rotation.x=Math.PI/2;r.position.set(0,-.12-j*.08,0);leg.add(r);}
  for(let t=-1;t<=1;t++){ball(leg,hide,[side*.1+t*.10,-.34,front*.38],[.07,.07,.16]);cone(leg,claw,[side*.1+t*.10,-.345,front*.51],.032,.10,[Math.PI/2,0,0]);}
  for(let k=0;k<8;k++){const ang=k*2.4;ball(leg,scutes[k%5],[side*.05+Math.cos(ang)*.16,-.04-(k%4)*.07,front*.08+Math.sin(ang)*.14],[.035,.03,.045]);}
 }
 const neck=new THREE.Group();neck.position.set(0,.57,.58);body.add(neck);
 ball(neck,hide,[0,0,.27],[.22,.19,.46],[-.2,0,0]);
 const head=new THREE.Group();head.position.set(0,0,.61);neck.add(head);
 ball(head,hide,[0,0,.10],[.28,.22,.36]);
 ball(head,hide,[0,-.07,.33],[.21,.12,.22]);
 const iris=MAT('#8b7042',.42),pupil=MAT('#171711',.18);
 for(const side of [-1,1]){
  ball(head,iris,[side*.22,.10,.20],[.055,.055,.04]);
  ball(head,pupil,[side*.235,.10,.23],[.025,.03,.016]);
  ball(head,dark,[side*.075,.015,.50],[.012,.01,.01]);
 }
 tube(head,[[-.12,-.11,.42],[0,-.14,.46],[.12,-.11,.42]],.007,dark);
 if(traits.some(t=>t.id==='wings'))for(const side of [-1,1]){
  const wing=new THREE.Group();wing.position.set(side*.52,1.05,-.2);wing.rotation.z=side*-.24;body.add(wing);
  ball(wing,MAT('#aab8bd',.9),[side*.25,.02,0],[.30,.075,.25]);
  for(let i=0;i<8;i++){const t=i/7;ball(wing,MAT(i%2?'#d0d8d8':'#819aa2',.92),[side*(.28+t*.34),-.015,-.10-t*.10],[.09,.035,.27-t*.06],[.08,0,side*.12]);}
 }
 if(traits.some(t=>t.id==='armor'))for(let i=0;i<3;i++)cone(body,seam,[0,1.24,-.48+i*.35],.09,.22);
}
function buildAnimal(data){
 const id=data.baseAnimalId||'fox', p=palettes[id]||palettes.fox;
 const fur=MAT(p[0]), light=MAT(p[1]), dark=MAT(p[2]), shell=MAT('#718b4c'), shellDark=MAT('#354d35');
 const skin=MAT(data.traits?.some(t=>t.id==='camouflage')?'#657c58':p[0]);
 const root=new THREE.Group(), body=new THREE.Group();root.add(body);
 const scale=THREE.MathUtils.clamp(1+(data.ageDays||0)/365/Math.max(1,(data.life||10))*.20,.78,1.22);
 body.scale.setScalar(scale);
 const isBird=id==='eagle',isTurtle=id==='turtle',isCroc=id==='croc',isElephant=id==='elephant';
 if(isTurtle){
  buildDetailedTurtle(body,skin,light,dark,data.traits||[]);
 }else if(isCroc){
  ball(body,skin,[0,.52,-.08],[.48,.35,1.25]);
  ball(body,skin,[0,.48,.95],[.35,.20,.78]);
  ball(body,light,[0,.37,1.10],[.30,.10,.67]);
  for(let i=0;i<8;i++){const z=-.9-i*.20;ball(body,shellDark,[0,.82,z],[.13,.10,.11]);}
  for(const x of [-.38,.38])for(const z of [-.65,.62])limb(body,skin,x,z,.42,.12);
  const tail= new THREE.Group();tail.position.set(0,.53,-1.1);body.add(tail);
  for(let i=0;i<5;i++)ball(tail,skin,[0,-.01,-i*.22],[.32-i*.045,.20-i*.025,.25]);
 }else if(isBird){
  ball(body,fur,[0,.75,0],[.43,.60,.78]);
  ball(body,light,[0,.48,.18],[.32,.40,.55]);
  const neck=ball(body,fur,[0,1.15,.43],[.22,.42,.24]);
  const head=new THREE.Group();head.position.set(0,1.48,.52);body.add(head);
  ball(head,fur,[0,0,0],[.34,.31,.36]);addEyes(head,dark);
  cone(head,MAT('#d6a64b'),[0,-.10,.43],.16,.46,[Math.PI/2,0,0]);
  for(const x of [-.24,.24]){const leg=limb(body,MAT('#b98b42'),x,.05,.48,.07);leg.position.y=.2;}
  // folded wings; separate feather layers make the silhouette readable
  for(const side of [-1,1]){
   const wing=new THREE.Group();wing.position.set(side*.34,1.0,-.02);wing.rotation.z=side*-.15;body.add(wing);
   ball(wing,light,[side*.38,0,-.02],[.48,.14,.62],[0,0,side*.18]);
   for(let k=0;k<4;k++)ball(wing,fur,[side*(.35+k*.12),-.04,-.30-k*.10],[.18,.09,.34]);
  }
 }else{
  const bodyLen=id==='elephant'?1.0:.82, bodyY=id==='elephant'?.78:.72, bodyWide=id==='elephant'?.62:.48;
  ball(body,fur,[0,bodyY,-.02],[bodyWide,.48,bodyLen]);
  ball(body,light,[0,bodyY-.20,.10],[bodyWide*.83,.28,bodyLen*.72]);
  for(const x of [-.34,.34])for(const z of [-.56,.56])limb(body,fur,x,z,id==='elephant'?.68:.62,id==='elephant'?.19:.13);
  const head=new THREE.Group();head.position.set(0,bodyY+.20,.70);body.add(head);
  ball(head,fur,[0,0,.08],[id==='elephant'?.42:.34,id==='elephant'?.42:.34,.40]);
  ball(head,light,[0,-.14,.34],[.24,.18,.28]);
  addEyes(head,dark,data.traits?.some(t=>t.id==='night_vision'));
  if(id==='fox'||id==='wolf'||id==='deer'||id==='rabbit'||id==='bear'||id==='boar'){
   for(const x of [-.22,.22])cone(head,fur,[x,.40,.02],id==='rabbit'?.12:.15,id==='rabbit'?.68:.48,[x>0?-.12:.12,0,x>0?-.12:.12]);
  }
  if(id==='lion'){ball(head, MAT('#93602e'),[0,.02,-.02],[.53,.54,.50]);}
  if(id==='tiger'){for(let k=0;k<5;k++)ball(body,dark,[0,.95,-.62+k*.28],[.49,.045,.06],[0,0,(k%2?-.16:.16)]);}
  if(isElephant){
   ball(head,fur,[0,-.05,.43],[.18,.20,.18]);
   tube(head,[[0,-.05,.38],[0,-.30,.63],[0,-.54,.68],[0,-.64,.52]],.105,fur);
   for(const x of [-.26,.26]){ball(head,light,[x,.0,-.02],[.27,.35,.12],[0,0,x>0?-.3:.3]);cone(head,light,[x*.8,-.18,.35],.07,.40,[Math.PI/2,0,x>0?.25:-.25]);}
  }
  if(id==='deer'){for(const x of [-.16,.16]){tube(head,[[x,.22,-.02],[x*1.5,.55,-.08],[x*1.5,.75,-.02]],.035,light);for(let k=0;k<2;k++)tube(head,[[x*1.5,.52+k*.10,-.06],[x*2,.65+k*.1,-.06]],.025,light);}}
  if(id==='rabbit'){ball(body,fur,[-.12,.95,-.72],[.12,.14,.16]);}
  if(id==='boar'){cone(head,dark,[-.22,-.14,.39],.07,.24,[Math.PI/2,0,-.35]);cone(head,dark,[.22,-.14,.39],.07,.24,[Math.PI/2,0,.35]);}
  // tails
  if(id==='fox'||id==='wolf'||id==='lion'||id==='tiger'||id==='deer'||id==='rabbit'||id==='boar'){
   const tailLen=id==='fox'?.95:.58;
   tube(body,[[0,.75,-.72],[.02,.82,-1.0],[.08,.74,-1.0-tailLen*.5],[.08,.55,-1.0-tailLen]],id==='fox'?.14:.08,fur);
   if(id==='fox')ball(body,light,[.08,.55,-1.0-tailLen],[.15,.15,.18]);
  }
 }
 // Trait-driven anatomy: these are real meshes attached to the base animal, not replacement icons.
 const traits=data.traits||[];
 const has=id=>traits.some(t=>t.id===id);
 if(has('wings')&&!isBird&&!isTurtle){
  for(const side of [-1,1]){
   const wing=new THREE.Group();wing.position.set(side*.35,1.02,-.12);wing.rotation.z=side*-.12;body.add(wing);
   ball(wing,MAT('#8e9eaa'),[side*.42,.05,0],[.53,.13,.42],[0,0,side*.16]);
   for(let k=0;k<5;k++)ball(wing,MAT(k%2?'#c8d3d5':'#879ca7'),[side*(.34+k*.13),-.03,-.18-k*.08],[.18,.075,.29]);
  }
 }
 if(has('sharp_teeth')){const head=body.children.find(o=>o.isGroup&&o.position.z>.4);if(head){for(const x of [-.13,.13])cone(head,light,[x,-.20,.43],.045,.20,[Math.PI,0,0]);}}
 if(has('venom')){for(const x of [-.24,.24])ball(body,MAT('#86b96a'),[x,.80,.80],[.13,.14,.15]);}
 if(has('six_legs')){for(const x of [-.40,.40])limb(body,skin,x,.02,.56,.11);}
 if(has('armor')){for(let i=0;i<3;i++)ball(body,shellDark,[0,1.12,-.35+i*.28],[.45,.20,.23]);}
 if(has('thick_fur')){for(let i=0;i<7;i++)cone(body,fur,[(i%2?-.4:.4),1.0,-.55+i*.18],.12,.34,[0,0,(i%2?-.4:.4)]);}
 if(has('night_vision')){const glow=MAT('#8df0c0',.2,.1);glow.emissive=new THREE.Color('#1d9b62');glow.emissiveIntensity=.65;for(const x of [-.22,.22])ball(body,glow,[x,1.0,.99],[.07,.07,.06]);}
 if(has('keen_smell')){ball(body,light,[0,.83,1.18],[.11,.09,.12]);}
 if(has('webbed_feet')){for(const x of [-.4,.4])for(const z of [-.5,.5])ball(body,MAT('#d1a66c'),[x,.12,z],[.22,.045,.20]);}
 if(has('gills')){for(const x of [-.39,.39])for(let k=0;k<3;k++)ball(body,MAT('#bd786c'),[x,.72,.34-k*.15],[.045,.10,.035]);}
 if(has('camouflage')){for(let i=0;i<14;i++)ball(body,MAT(i%2?'#405d43':'#8b9b58'),[(Math.random()-.5)*.55,.72+(Math.random()-.5)*.28,(Math.random()-.5)*1.0],[.07,.045,.09]);}
 if(has('heat_resist')){ball(body,MAT('#c49a5c'),[0,.92,-.1],[.50,.05,.68]);}
 if(has('fat_layer'))ball(body,MAT('#c4b18b'),[0,.54,-.05],[.52,.38,.83]);
 if(has('claws')){for(const x of [-.4,.4])for(const z of [-.5,.5])cone(body,dark,[x,.22,z+.1],.07,.22,[Math.PI/2,0,0]);}
 if(has('long_legs')){body.children.filter(o=>o.isGroup&&o.position.y===0&&o.children.length>=2).forEach(o=>o.scale.y*=1.35);}
 if(has('large_ears'))for(const x of [-.35,.35])ball(body,light,[x,1.12,.70],[.16,.25,.08]);
 if(has('water_storage'))ball(body,MAT('#78a7a0'),[0,.55,-.1],[.49,.32,.82]);
 if(has('climbing'))for(const x of [-.4,.4])cone(body,dark,[x,.18,.4],.10,.32,[Math.PI/2,0,0]);
 if(has('bioluminescence')){const bio=MAT('#73e8d1',.25,.05);bio.emissive=new THREE.Color('#1aa98d');bio.emissiveIntensity=.9;for(let i=0;i<7;i++)ball(body,bio,[(Math.random()-.5)*.65,.95,(Math.random()-.5)*1.1],[.045,.045,.045]);}
 if(has('thick_skin')){for(let i=0;i<5;i++)ball(body,shellDark,[0,1.03,-.55+i*.25],[.42,.07,.10]);}
 return root;
}
function init(){
 try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  scene=new THREE.Scene();scene.background=null;
  camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(3.8,2.7,5.2);
  scene.add(new THREE.HemisphereLight('#e6f4df','#25352b',2.0));
  const key=new THREE.DirectionalLight('#fff0d4',3.0);key.position.set(3,6,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
  const rim=new THREE.DirectionalLight('#91dcae',2.1);rim.position.set(-4,3,-3);scene.add(rim);
  stage=new THREE.Group();scene.add(stage);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(2.2,64),new THREE.MeshStandardMaterial({color:'#263a2c',roughness:1,transparent:true,opacity:.72}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.03;floor.receiveShadow=true;stage.add(floor);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.48,.012,8,90),new THREE.MeshBasicMaterial({color:'#8dbb91',transparent:true,opacity:.36}));
  ring.rotation.x=Math.PI/2;ring.position.y=-.015;stage.add(ring);
  resize();new ResizeObserver(resize).observe(canvas.parentElement);
  canvas.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY,rot:targetRotation,tilt:targetTilt};canvas.setPointerCapture(e.pointerId);autoRotate=false;});
  canvas.addEventListener('pointermove',e=>{if(!pointer)return;targetRotation=pointer.rot+(e.clientX-pointer.x)*.012;targetTilt=THREE.MathUtils.clamp(pointer.tilt+(e.clientY-pointer.y)*.006,-.25,.35);});
  canvas.addEventListener('pointerup',()=>{pointer=null;});
  canvas.addEventListener('pointercancel',()=>{pointer=null;});
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=THREE.MathUtils.clamp(zoom+e.deltaY*.001,.72,1.55);},{passive:false});
  window.addEventListener('dnanimal:render-creature',e=>render(e.detail));
  animate();loading.style.display='none';
 }catch(err){loading.textContent='이 기기에서 3D 모델을 표시할 수 없습니다.';console.error(err);}
}
window.dnanimalZoom=(delta)=>{zoom=THREE.MathUtils.clamp(zoom+delta,.72,1.55);};
function resize(){
 if(!renderer||!canvas.parentElement)return;
 const w=canvas.parentElement.clientWidth,h=canvas.parentElement.clientHeight;
 renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
}
function render(data){
 if(!scene)return;
 if(model){stage.remove(model);model.traverse(o=>{if(o.geometry&&o.geometry!==sphereGeo)o.geometry.dispose();if(o.material){for(const m of (Array.isArray(o.material)?o.material:[o.material]))m.dispose();}});}
 model=buildAnimal(data);model.position.y=.02;stage.add(model);
 targetRotation=0;targetTilt=0;autoRotate=true;
}
function animate(){
 frame=requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.04);
 if(model){if(autoRotate)targetRotation+=dt*.28;model.rotation.y+=(targetRotation-model.rotation.y)*.08;model.rotation.x+=(targetTilt-model.rotation.x)*.08;}
 if(camera){const d=5.4/zoom;camera.position.set(d*.62,d*.43,d*.88);camera.lookAt(0,.78,0);}
 renderer?.render(scene,camera);
}
init();
// The classic game script can create the creature before this module finishes loading.
// Replay the latest model once the 3D scene and its event listener are ready.
if (window.__dnanimalCurrent) render(window.__dnanimalCurrent);
