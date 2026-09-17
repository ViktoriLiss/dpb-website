/* Scroll-driven mobile thoughts. Existing content remains readable without this enhancement. */
(() => {
  'use strict';
  const section = document.querySelector('main .clinical-doubts, main .dv-thoughts-section');
  const stage = section?.querySelector('.clinical-doubts__stage, .dv-thoughts-stage');
  const center = stage?.querySelector('.clinical-doubts__center, .dv-thought-center');
  const thoughts = stage ? [...stage.querySelectorAll('.clinical-thought, .dv-thought')] : [];
  if (!section || !stage || !center || !thoughts.length) return;

  const mobile = matchMedia('(max-width: 760px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  stage.classList.add('course-thought-stage');
  center.classList.add('course-thought-center');
  thoughts.forEach((thought, index) => {
    thought.classList.add('course-thought');
    thought.style.setProperty('--thought-left', index % 2 ? '12%' : '2%');
    thought.style.setProperty('--thought-tilt', index % 2 ? '2deg' : '-2deg');
  });

  let enabled = false;
  let travel = 0;
  let headerHeight = 0;
  let rowHeight = 0;
  let frame = 0;
  let measureFrame = 0;
  let lastIndex = -1;

  function render() {
    frame = 0;
    if (!enabled) return;
    const progress = Math.min(1, Math.max(0, (headerHeight - section.getBoundingClientRect().top) / travel));
    const active = Math.min(thoughts.length - 1, Math.floor(progress * thoughts.length));
    if (active === lastIndex) return;
    lastIndex = active;
    const first = Math.max(0, active - 2);
    thoughts.forEach((thought, index) => {
      const age = active - index;
      const visible = age >= 0 && age <= 2;
      const slot = Math.min(3, Math.max(-1, index - first));
      thought.style.setProperty('--thought-opacity', visible ? String(1 - age * .23) : '0');
      thought.style.setProperty('--thought-scale', String(visible ? 1 - age * .035 : .94));
      thought.style.setProperty('--thought-y', `${slot * rowHeight}px`);
      thought.style.setProperty('--thought-x', `${index > active ? (index % 2 ? 24 : -24) : 0}px`);
    });
  }

  function scheduleRender() {
    if (enabled && !frame) frame = requestAnimationFrame(render);
  }

  function measure() {
    measureFrame = 0;
    enabled = false;
    section.classList.remove('course-thought-story');
    if (!mobile.matches || reducedMotion.matches) return;
    const header = document.querySelector('body > header');
    headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 66;
    travel = Math.round(innerHeight * .75);
    section.style.setProperty('--thought-header', `${headerHeight}px`);
    section.style.setProperty('--thought-stage-height', `calc(100svh - ${headerHeight}px)`);
    section.style.setProperty('--thought-travel', `${travel}px`);
    section.classList.add('course-thought-story');
    rowHeight = Math.ceil(Math.max(...thoughts.map(thought => thought.offsetHeight))) + 16;
    const deckTop = center.offsetTop + center.offsetHeight + 28;
    // Short screens and enlarged text keep the natural list instead of clipping the copy.
    if (deckTop + rowHeight * 3 + 16 > stage.clientHeight) {
      section.classList.remove('course-thought-story');
      return;
    }
    section.style.setProperty('--thought-deck', `${deckTop}px`);
    // Keep the pinned scene only as tall as its content, without an empty tail.
    section.style.setProperty('--thought-stage-height', `${deckTop + rowHeight * 3 + 16}px`);
    enabled = true;
    lastIndex = -1;
    render();
  }

  function scheduleMeasure() {
    if (!measureFrame) measureFrame = requestAnimationFrame(measure);
  }

  addEventListener('scroll', scheduleRender, { passive: true });
  addEventListener('resize', scheduleMeasure, { passive: true });
  addEventListener('pageshow', scheduleMeasure);
  mobile.addEventListener('change', scheduleMeasure);
  reducedMotion.addEventListener('change', scheduleMeasure);
  new ResizeObserver(scheduleMeasure).observe(center);
  document.fonts.ready.then(scheduleMeasure);
  measure();
})();

/* Native swipe gallery; controls also support keyboard and pointer users. */
(() => {
  const mobile = matchMedia('(max-width: 760px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('main.gomzhin-course .gomzhin-gallery').forEach((gallery, galleryIndex) => {
    const slides = [...gallery.children];
    if (slides.length < 2) return;
    gallery.id ||= `course-gallery-${galleryIndex + 1}`;
    const controls = document.createElement('div');
    controls.className = 'course-gallery-controls';
    const previous = document.createElement('button');
    const next = document.createElement('button');
    const counter = document.createElement('span');
    previous.type = next.type = 'button';
    previous.textContent = '←';
    next.textContent = '→';
    previous.setAttribute('aria-label', 'Предыдущее фото');
    next.setAttribute('aria-label', 'Следующее фото');
    previous.setAttribute('aria-controls', gallery.id);
    next.setAttribute('aria-controls', gallery.id);
    counter.setAttribute('aria-live', 'polite');
    counter.setAttribute('aria-atomic', 'true');
    controls.append(previous, counter, next);
    gallery.after(controls);
    let current = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      const left = gallery.getBoundingClientRect().left;
      current = slides.reduce((best, slide, index) =>
        Math.abs(slide.getBoundingClientRect().left - left) < Math.abs(slides[best].getBoundingClientRect().left - left) ? index : best, 0);
      counter.textContent = `${current + 1} / ${slides.length}`;
      previous.disabled = current === 0;
      next.disabled = current === slides.length - 1;
    };
    const move = (direction) => {
      const target = slides[Math.max(0, Math.min(slides.length - 1, current + direction))];
      gallery.scrollBy({left: target.getBoundingClientRect().left - gallery.getBoundingClientRect().left, behavior: reduced.matches ? 'instant' : 'smooth'});
    };
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    gallery.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, {passive: true});
    gallery.addEventListener('keydown', (event) => {
      if (!mobile.matches || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    });
    new ResizeObserver(update).observe(gallery);
    update();
  });
  document.querySelectorAll('.gomzhin-registration__inner').forEach((inner) => {
    const resize = () => {
      if (!mobile.matches) return;
      const diameter = Math.ceil(Math.hypot(inner.offsetWidth, inner.offsetHeight) + 24);
      inner.parentElement.style.setProperty('--registration-circle', `${diameter}px`);
    };
    new ResizeObserver(resize).observe(inner);
    mobile.addEventListener('change', resize);
    document.fonts.ready.then(resize);
    resize();
  });
})();
