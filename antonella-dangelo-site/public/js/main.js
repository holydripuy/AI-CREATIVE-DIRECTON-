(function(){
  var $=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  addEventListener('load',function(){requestAnimationFrame(function(){document.body.classList.add('loaded');var h=$('.hero .fr')[0];h&&h.classList.add('in')})});
  /* reveals */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $('.fr:not(.a):not(.b),.rv,.cmp,.cut').forEach(function(el){io.observe(el)});
  /* nav */
  var hd=document.getElementById('hd'),mm=document.getElementById('mm'),bg=document.getElementById('bg');
  function menu(o){mm.classList.toggle('o',o);mm.setAttribute('aria-hidden',!o);bg.setAttribute('aria-expanded',o);bg.textContent=o?'CLOSE':'MENU';document.body.style.overflow=o?'hidden':''}
  bg.addEventListener('click',function(){menu(!mm.classList.contains('o'))});
  $('.mm a').forEach(function(a){a.addEventListener('click',function(){menu(false)})});
  /* section rail */
  var rail=document.getElementById('rail');
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){rail.textContent='INDEX / '+e.target.dataset.label}})},{threshold:.35});
  $('[data-label]').forEach(function(s){so.observe(s)});
  /* scroll: nav + parallax */
  var pars=$('[data-par]'),tick=false;
  function frame(){
    tick=false;var y=scrollY,vh=innerHeight;
    hd.classList.toggle('s',y>40);
    if(rm)return;
    pars.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;
      var d=(r.top+r.height/2-vh/2);el.style.transform='translate3d(0,'+(d*parseFloat(el.dataset.par)).toFixed(1)+'px,0)'});
    var h=$('.hero')[0];if(y<vh){var t=y/vh;h.querySelector('h1').style.transform='translate3d(0,'+(-y*.12)+'px,0)';h.querySelector('.fr').style.opacity=1-t*.6}
  }
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});frame();
  /* magnetic buttons */
  if(!rm&&matchMedia('(hover:hover)').matches){$('.mag').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.22)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)'});
    b.addEventListener('mouseleave',function(){b.style.transform=''})})}
  /* before / after */
  var c=document.getElementById('cmp'),rg=document.getElementById('rg');
  rg.addEventListener('input',function(){c.style.setProperty('--x',rg.value+'%');c.classList.add('dr')});
  /* drag scroll */
  var sg=document.getElementById('sg');
  if(sg){var dn=false,x0=0,l0=0;
    sg.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dn=true;x0=e.clientX;l0=sg.scrollLeft;sg.classList.add('dg')});
    addEventListener('pointerup',function(){dn=false;sg.classList.remove('dg')});
    addEventListener('pointermove',function(e){if(dn){sg.scrollLeft=l0-(e.clientX-x0)}});
    sg.addEventListener('dragstart',function(e){e.preventDefault()})}
  /* heading wipes */
  $('main h2.d').forEach(function(h){h.classList.add('rh');io.observe(h)});
  /* interstitial line scrub */
  var gaps=$('.gap');
  function gp(){var vh=innerHeight;gaps.forEach(function(g){var r=g.getBoundingClientRect(),p=(vh-r.top)/(vh+r.height);p=Math.max(0,Math.min(1,p));g.style.setProperty('--g',(Math.sin(Math.PI*p)*100).toFixed(1))})}
  addEventListener('scroll',gp,{passive:true});addEventListener('resize',gp);gp();
  /* carousels */
  function car(x){
    var g=function(i){return document.getElementById(i+x)};
    var ct=g('ctr'),cp=g('cp'),cn=g('cn'),sl=$('.ac',ct);
    function cu(){var m=ct.scrollWidth-ct.clientWidth,r=m>0?ct.scrollLeft/m:0,v=ct.clientWidth/ct.scrollWidth;cp.style.width=(v*100)+'%';cp.style.left=(r*(1-v)*100)+'%';cn.textContent='0'+(Math.round(r*(sl.length-1))+1)+' / 0'+sl.length}
    function cg(d){var st=sl[1].offsetLeft-sl[0].offsetLeft;ct.scrollBy({left:d*st,behavior:'smooth'})}
    ct.addEventListener('scroll',cu,{passive:true});addEventListener('resize',cu);cu();
    g('cpv').addEventListener('click',function(){cg(-1)});
    g('cnx').addEventListener('click',function(){cg(1)});
    ct.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();cg(1)}if(e.key==='ArrowLeft'){e.preventDefault();cg(-1)}});
    var dx=0,ds=0,dn=false;
    ct.addEventListener('mousedown',function(e){dn=true;dx=e.clientX;ds=ct.scrollLeft;ct.classList.add('dg')});
    addEventListener('mousemove',function(e){if(dn)ct.scrollLeft=ds-(e.clientX-dx)});
    addEventListener('mouseup',function(){if(dn){dn=false;ct.classList.remove('dg')}});
  }
  car('');car('2');car('4');car('5');car('6');car('7');car('8');car('9');car('10');car('11');car('12');
  /* social reel */
  (function(){var v=$('.svv')[0];if(!v)return;
    if(rm){v.removeAttribute('autoplay');v.pause()}
    var vio=new IntersectionObserver(function(es){es.forEach(function(e){if(rm)return;var p=e.isIntersecting?v.play():v.pause();if(p&&p.catch)p.catch(function(){})})},{threshold:.25});vio.observe(v);
    v.addEventListener('click',function(){if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})})();
})();
