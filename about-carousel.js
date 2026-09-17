document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(':scope > img')];
  const count = carousel.querySelector('[data-carousel-count]');
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const isCaseCarousel = carousel.classList.contains('about-v2__case-carousel');
  const configuredStart = Number.parseInt(carousel.dataset.carouselStart || '0', 10);
  let active = Number.isFinite(configuredStart) ? configuredStart : 0;
  let startX = 0;

  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === active;
      const isPrevious = slideIndex === (active - 1 + slides.length) % slides.length;
      const isNext = slideIndex === (active + 1) % slides.length;
      slide.hidden = !isCaseCarousel && !isActive;
      slide.classList.toggle('is-active', slideIndex === active);
      slide.classList.toggle('is-previous', isCaseCarousel && isPrevious);
      slide.classList.toggle('is-next', isCaseCarousel && isNext);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    if (count) count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  previous?.addEventListener('click', () => show(active - 1));
  next?.addEventListener('click', () => show(active + 1));
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(active - 1);
    if (event.key === 'ArrowRight') show(active + 1);
  });
  carousel.addEventListener('pointerdown', (event) => { startX = event.clientX; });
  carousel.addEventListener('pointerup', (event) => {
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 45) show(active + (distance < 0 ? 1 : -1));
  });
    show(active);
});
