
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

const nav = document.getElementById('nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navShop = document.querySelector('.nav-shop');
const collectionsSection = document.querySelector('#collections');
const horizontalScrollTrack = document.getElementById('horizontalScrollTrack');
let horizontalScrollMM;
let horizontalScrollTrigger;

function closeMobileMenu() {
  if (!nav || !navToggle) return;
  nav.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
}

function updateHash(hash) {
  if (history.pushState) {
    history.pushState(null, '', hash);
  } else {
    window.location.hash = hash;
  }
}

function scrollElementToCenter(target) {
  const rect = target.getBoundingClientRect();
  const scrollTop = window.scrollY + rect.top - ((window.innerHeight - rect.height) / 2);
  window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
}

function scrollCollectionCardToCenter(target) {
  const isDesktop = window.matchMedia('(min-width: 1100px)').matches;
  const isCollectionCard = horizontalScrollTrack && horizontalScrollTrack.contains(target);

  if (!isDesktop || !isCollectionCard || !horizontalScrollTrigger) {
    scrollElementToCenter(target);
    return;
  }

  const maxScroll = getHorizontalScrollDistance();
  const targetCenter = target.offsetLeft + (target.offsetWidth / 2);
  const viewportCenter = window.innerWidth / 2;
  const horizontalOffset = Math.min(Math.max(0, targetCenter - viewportCenter), maxScroll);

  window.scrollTo({
    top: Math.max(0, horizontalScrollTrigger.start + horizontalOffset),
    behavior: 'smooth'
  });
}

function scrollToHash(hash) {
  if (!hash || hash === '#') return false;

  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return false;

  if (horizontalScrollTrack && horizontalScrollTrack.contains(target)) {
    scrollCollectionCardToCenter(target);
  } else {
    scrollElementToCenter(target);
  }

  updateHash(hash);
  closeMobileMenu();
  return true;
}

if (nav && navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
      if (scrollToHash(link.hash)) event.preventDefault();
    });
  });

  document.addEventListener('click', event => {
    if (!nav.classList.contains('menu-open') || nav.contains(event.target)) return;
    closeMobileMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileMenu();
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (navLinks && navLinks.contains(link)) return;

  link.addEventListener('click', event => {
    if (scrollToHash(link.hash)) event.preventDefault();
  });
});

if (navShop) {
  navShop.removeAttribute('onclick');
  navShop.onclick = null;
  navShop.addEventListener('click', event => {
    event.preventDefault();
    scrollToHash('#collections');
  });
}


const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{ threshold:.1 });
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));


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
        id: 'collections-horizontal',
        trigger: collectionsSection,
        start: 'top top',
        end: () => `+=${getHorizontalScrollDistance()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });
    horizontalScrollTrigger = horizontalTween.scrollTrigger;

    return () => {
      horizontalScrollTrigger = null;
      horizontalTween.scrollTrigger.kill();
      horizontalTween.kill();
      clearHorizontalScroll();
    };
  });

  horizontalScrollMM.add('(max-width: 1099px)', () => {
    horizontalScrollTrigger = null;
    clearHorizontalScroll();
  });
}

window.addEventListener('load', () => {
  initHorizontalScrollTrigger();
  if (window.location.hash) {
    setTimeout(() => scrollToHash(window.location.hash), 80);
  }
});


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
