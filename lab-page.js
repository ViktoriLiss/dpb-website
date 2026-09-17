(() => { const gallery = document.querySelector('.lab-v3__gallery:not([data-gallery-extra])'); const extra = document.querySelector('[data-gallery-extra]'); const technical = ['IMG-20240816-WA0006.jpg','IMG-20240901-WA0011.jpg','IMG-20240909-WA0002.jpg']; if (gallery && extra) technical.reverse().forEach(name => { const image = [...extra.querySelectorAll('img')].find(item => item.src.endsWith('/' + name)); if (image) gallery.prepend(image); }); const toggle = document.querySelector('[data-gallery-toggle]'); if (!toggle || !extra) return; toggle.addEventListener('click', () => { const expanded = toggle.getAttribute('aria-expanded') === 'true'; extra.hidden = expanded; toggle.setAttribute('aria-expanded', String(!expanded)); toggle.textContent = expanded ? 'Смотреть больше работ ↓' : 'Скрыть дополнительные работы ↑'; }); })();

// Mobile carousel reuses all original images and restores the desktop galleries.
(() => {
 const section = document.querySelector('.lab-v3__works');
 const track = section?.querySelector('.lab-v3__gallery:not([data-gallery-extra])');
 const extra = section?.querySelector('[data-gallery-extra]');
 if (!track || !extra) return;
 const primaryImages = [...track.children], extraImages = [...extra.children];
 const controls = document.createElement('div');
 controls.className = 'lab-v3__carousel-controls';
 controls.innerHTML = '<button type="button" aria-label="Предыдущая работа"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><output aria-live="polite"></output><button type="button" aria-label="Следующая работа"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button>';
 track.after(controls);
 const [prev,next] = controls.querySelectorAll('button'), count = controls.querySelector('output');
 const mobile = matchMedia('(max-width: 680px)');
 let index=0, frame=0;
 const update = () => {
  if (!mobile.matches) return;
  const items=[...track.children];
  const left=track.getBoundingClientRect().left;
  index=items.reduce((best,item,i)=>Math.abs(item.getBoundingClientRect().left-left)<Math.abs(items[best].getBoundingClientRect().left-left)?i:best,0);
  count.textContent=`${index+1} / ${items.length}`;
  prev.disabled=index===0; next.disabled=index===items.length-1;
 };
 const move = step => {
  const item=track.children[Math.max(0,Math.min(track.children.length-1,index+step))];
  track.scrollTo({left:track.scrollLeft+item.getBoundingClientRect().left-track.getBoundingClientRect().left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 };
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)},{passive:true});
 track.addEventListener('keydown',event=>{if(mobile.matches&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}});
 const sync = () => {
  section.classList.toggle('is-carousel',mobile.matches);
  if(mobile.matches){track.append(...extraImages);track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-label','Работы лаборатории — листайте или используйте стрелки');}
  else{track.append(...primaryImages);extra.append(...extraImages);track.removeAttribute('tabindex');track.removeAttribute('role');track.removeAttribute('aria-label');}
  track.scrollLeft=0;requestAnimationFrame(update);
 };
 mobile.addEventListener('change',sync);sync();
})();
