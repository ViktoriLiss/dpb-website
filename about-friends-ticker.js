(() => {
  const ticker = document.querySelector('[data-friends-ticker]');
  if (!ticker) return;

  const track = ticker.querySelector('[data-friends-track]');
  const firstGroup = track?.querySelector('.about-v2__friends-group');
  if (!track || !firstGroup) return;

  const desktop = window.matchMedia('(min-width: 721px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let lastTime = 0;
  let paused = false;
  let dragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  const loopWidth = () => {
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    return firstGroup.getBoundingClientRect().width + gap;
  };

  const canAutoMove = () => desktop.matches && !reducedMotion.matches && !paused && !dragging;

  const animate = (time) => {
    if (!lastTime) lastTime = time;
    const elapsed = time - lastTime;
    lastTime = time;

    if (canAutoMove()) {
      const width = loopWidth();
      if (width) {
        ticker.scrollLeft += (width / 54000) * elapsed;
        if (ticker.scrollLeft >= width) ticker.scrollLeft -= width;
      }
    }

    frame = window.requestAnimationFrame(animate);
  };

  const normalizeLoop = () => {
    const width = loopWidth();
    if (width && ticker.scrollLeft >= width) ticker.scrollLeft -= width;
  };

  ticker.addEventListener('mouseenter', () => { paused = true; });
  ticker.addEventListener('mouseleave', () => {
    paused = false;
    dragging = false;
    ticker.classList.remove('is-dragging');
  });

  ticker.addEventListener('pointerdown', (event) => {
    if (!desktop.matches) return;
    dragging = true;
    paused = true;
    dragStartX = event.clientX;
    dragStartScroll = ticker.scrollLeft;
    ticker.classList.add('is-dragging');
    ticker.setPointerCapture(event.pointerId);
  });

  ticker.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    ticker.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
    normalizeLoop();
  });

  const finishDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    paused = false;
    ticker.classList.remove('is-dragging');
    if (ticker.hasPointerCapture(event.pointerId)) ticker.releasePointerCapture(event.pointerId);
    normalizeLoop();
  };

  ticker.addEventListener('pointerup', finishDrag);
  ticker.addEventListener('pointercancel', finishDrag);
  window.addEventListener('resize', normalizeLoop);

  frame = window.requestAnimationFrame(animate);
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(frame), { once: true });
})();
