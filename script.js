
const cur  = document.getElementById('cur');
const curR = document.getElementById('curR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
(function loop(){
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  curR.style.left=rx+'px'; curR.style.top=ry+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.col-card,.t-dot,.nav-shop').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ cur.classList.add('hov'); curR.classList.add('hov'); });
  el.addEventListener('mouseleave',()=>{ cur.classList.remove('hov'); curR.classList.remove('hov'); });
});


const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{ threshold:.1 });
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));


const collectionsSection = document.querySelector('#collections');
const horizontalScrollTrack = document.getElementById('horizontalScrollTrack');
let horizontalScrollMM;

function getHorizontalScrollDistance() {
  if (!horizontalScrollTrack) return 0;
  return Math.max(0, horizontalScrollTrack.scrollWidth - window.innerWidth);
}

function clearHorizontalScroll() {
  if (!horizontalScrollTrack || typeof gsap === 'undefined') return;
  gsap.set(horizontalScrollTrack, { clearProps: 'transform' });
}

function initHorizontalScrollTrigger() {
  if (!collectionsSection || !horizontalScrollTrack || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  if (horizontalScrollMM) {
    horizontalScrollMM.revert();
    horizontalScrollMM = null;
  }

  horizontalScrollMM = gsap.matchMedia();

  horizontalScrollMM.add('(min-width: 1100px)', () => {
    gsap.set(horizontalScrollTrack, { x: 0 });

    const horizontalTween = gsap.to(horizontalScrollTrack, {
      x: () => -getHorizontalScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: collectionsSection,
        start: 'top top',
        end: () => `+=${getHorizontalScrollDistance()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      horizontalTween.scrollTrigger.kill();
      horizontalTween.kill();
      clearHorizontalScroll();
    };
  });

  horizontalScrollMM.add('(max-width: 1099px)', () => {
    clearHorizontalScroll();
  });
}

window.addEventListener('load', () => initHorizontalScrollTrigger());


window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY>70);
});


const testimonials = [
  { q:'"I wear KiKA not as an accessory — but as an identity. The craftsmanship is unlike anything I\'ve seen in Indian silver jewellery."', a:'— Priya S., Mumbai' },
  { q:'"Every piece feels like it was made for me. The customisation process was seamless and the result was breathtaking."',              a:'— Anika R., Delhi' },
  { q:'"I gifted my sister a KiKA set and she cried. That says everything about the quality and feeling these jewels carry."',            a:'— Rohan M., Bangalore' },
];
let cur_t = 0;
function setT(i){
  cur_t = i;
  const tq = document.getElementById('tq');
  const ta = document.getElementById('ta');
  tq.style.opacity='0';
  setTimeout(()=>{
    tq.textContent = testimonials[i].q;
    ta.textContent = testimonials[i].a;
    tq.style.opacity='1';
  },300);
  document.querySelectorAll('.t-dot').forEach((d,idx)=>d.classList.toggle('on',idx===i));
}
setInterval(()=>setT((cur_t+1)%testimonials.length),5000);


const sp = document.getElementById('sparkles');
[
  {t:'10%',l:'7%'},{t:'16%',l:'21%'},{t:'7%',l:'53%'},{t:'13%',l:'74%'},
  {t:'22%',l:'87%'},{t:'68%',l:'5%'},{t:'74%',l:'32%'},{t:'79%',l:'61%'},
  {t:'70%',l:'82%'},{t:'84%',l:'91%'},{t:'44%',l:'2%'},{t:'47%',l:'95%'},
  {t:'33%',l:'14%'},{t:'58%',l:'44%'},{t:'19%',l:'38%'},{t:'88%',l:'26%'},
  {t:'28%',l:'84%'},{t:'54%',l:'68%'},
].forEach(p=>{
  const s=document.createElement('span');
  s.style.cssText=`top:${p.t};left:${p.l};animation-duration:${(1.6+Math.random()*2.4).toFixed(1)}s;animation-delay:${(Math.random()*4).toFixed(1)}s;`;
  sp.appendChild(s);
});
