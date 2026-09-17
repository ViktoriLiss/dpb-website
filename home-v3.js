const m=document.querySelector('.menu-button'),n=document.querySelector('.mobile-nav');m?.addEventListener('click',()=>{const o=n.classList.toggle('open');m.setAttribute('aria-expanded',o)});n?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));const c=document.querySelector('#event-countdown');function count(){const x=new Date('2026-09-04T00:00:00+07:00')-Date.now();c.textContent=x>0?`${Math.floor(x/864e5)} д. ${String(Math.floor(x%864e5/36e5)).padStart(2,'0')} ч.`:'Событие началось'}count();setInterval(count,6e4);const d=document.querySelector('.lead-dialog'),f=d?.querySelector('.form-wrap'),s=d?.querySelector('.success');document.querySelectorAll('[data-open-lead]').forEach(b=>b.addEventListener('click',()=>{f.hidden=false;s.hidden=true;d.showModal()}));document.querySelectorAll('.close,.close-success').forEach(b=>b.addEventListener('click',()=>d.close()));d?.addEventListener('click',e=>{if(e.target===d)d.close()});document.querySelector('#lead-form')?.addEventListener('submit',e=>{e.preventDefault();if(e.currentTarget.reportValidity()){f.hidden=true;s.hidden=false;e.currentTarget.reset()}});const t=document.querySelector('.carousel');document.querySelector('[data-prev]')?.addEventListener('click',()=>t.scrollBy({left:-t.clientWidth*.72,behavior:'smooth'}));document.querySelector('[data-next]')?.addEventListener('click',()=>t.scrollBy({left:t.clientWidth*.72,behavior:'smooth'}));

const reviewsTrack=document.querySelector('.reviews-quotes');
if(reviewsTrack){
  const reviewsViewport=document.createElement('div');
  reviewsViewport.className='reviews-carousel';
  reviewsTrack.parentNode?.insertBefore(reviewsViewport,reviewsTrack);
  reviewsViewport.append(reviewsTrack);
  reviewsTrack.classList.add('reviews-track');
  reviewsTrack.tabIndex=0;
  const cards=[...reviewsTrack.children];
  const head=cards.map(card=>card.cloneNode(true));
  const tail=cards.map(card=>card.cloneNode(true));
  head.reverse().forEach(card=>reviewsTrack.prepend(card));
  tail.forEach(card=>reviewsTrack.append(card));
  reviewsTrack.scrollLeft=reviewsTrack.clientWidth;
  const controls=document.createElement('div');
  controls.className='reviews-carousel-controls';
  controls.innerHTML='<button type="button" data-reviews-prev aria-label="Предыдущий отзыв">←</button><button type="button" data-reviews-next aria-label="Следующий отзыв">→</button>';
  reviewsViewport.append(controls);
  const step=()=>reviewsTrack.firstElementChild?.getBoundingClientRect().width+(parseFloat(getComputedStyle(reviewsTrack).gap)||0);
  const move=direction=>reviewsTrack.scrollBy({left:direction*step(),behavior:'smooth'});
  controls.querySelector('[data-reviews-prev]').addEventListener('click',()=>move(-1));
  controls.querySelector('[data-reviews-next]').addEventListener('click',()=>move(1));
  let resetTimer;
  reviewsTrack.addEventListener('scroll',()=>{clearTimeout(resetTimer);resetTimer=setTimeout(()=>{const width=step();if(reviewsTrack.scrollLeft<width*.5)reviewsTrack.scrollLeft+=width*cards.length;else if(reviewsTrack.scrollLeft>width*(cards.length*2-.5))reviewsTrack.scrollLeft-=width*cards.length},180)});
}
const reviewVideos=document.querySelectorAll('.reviews-video-grid video');reviewVideos.forEach(video=>{video.preload='auto';video.load();});
const heroVideo=document.querySelector('.home-hero video');if(heroVideo){const source=heroVideo.querySelector('source');const heroSrc=source?.dataset.src||source?.getAttribute('src');if(source&&heroSrc){source.src=heroSrc;delete source.dataset.src;heroVideo.dataset.loaded='true';heroVideo.muted=true;heroVideo.playsInline=true;heroVideo.preload='metadata';heroVideo.load();const connection=navigator.connection;const pauseMotion=matchMedia('(prefers-reduced-motion:reduce)').matches||connection?.saveData||/2g/.test(connection?.effectiveType||'');if(!pauseMotion)heroVideo.play().catch(()=>{});}}
