(() => {
 const media=matchMedia('(max-width:680px)');
 const education=document.querySelector('.about-v2__education');
 if(education){const sync=()=>education.open=!media.matches;media.addEventListener('change',sync);sync();}
 for(const [selector,itemSelector,label] of [['.about-v2__archive','img','архива'],['.about-v2__people-grid','article','команды'],['.about-v2__friends-ticker','.about-v2__friend-card','друзей dpb']]){
  const track=document.querySelector(selector);if(!track)continue;
  const cards=[...track.querySelectorAll(itemSelector)];
  const controls=document.createElement('div');controls.className='about-mobile-controls';
  controls.innerHTML=`<button type="button" aria-label="Предыдущая карточка ${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><output aria-live="polite"></output><button type="button" aria-label="Следующая карточка ${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button>`;
  track.after(controls);
  const [prev,next]=controls.querySelectorAll('button'),counter=controls.querySelector('output');let index=0,frame;
  const update=()=>{if(!media.matches)return;const left=track.getBoundingClientRect().left;index=cards.reduce((best,c,i)=>Math.abs(c.getBoundingClientRect().left-left)<Math.abs(cards[best].getBoundingClientRect().left-left)?i:best,0);if(track.scrollWidth-track.clientWidth-track.scrollLeft<2)index=cards.length-1;counter.textContent=`${index+1} / ${cards.length}`;prev.disabled=index===0;next.disabled=index===cards.length-1;};
  const move=step=>{const c=cards[Math.max(0,Math.min(cards.length-1,index+step))];track.scrollTo({left:track.scrollLeft+c.getBoundingClientRect().left-track.getBoundingClientRect().left,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});};
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)},{passive:true});
  track.addEventListener('keydown',e=>{if(media.matches&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
  const sync=()=>{if(media.matches){track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-label',`Галерея ${label}`);requestAnimationFrame(update);}else{track.removeAttribute('tabindex');track.removeAttribute('role');}};media.addEventListener('change',sync);sync();
 }
})();
