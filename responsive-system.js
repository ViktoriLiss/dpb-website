/* Shared, opt-in headline fitting. No page-name or title-specific sizing. */
(() => {
  'use strict';
  if (!document.body.classList.contains('dpb-responsive')) return;
  // Legacy home code suppresses the source on mobile; keep a real player at every width.
  const setupMotion = () => {
    const marqueeRows = document.querySelectorAll('.home-v3 .partner-row');
    const syncMarqueeSpeed = () => marqueeRows.forEach(row => {
      const distance = row.scrollWidth / 2;
      if (distance > 0) row.style.setProperty('--responsive-marquee-duration', `${Math.max(1, distance / 80)}s`);
    });
    syncMarqueeSpeed();
    if (marqueeRows.length) new ResizeObserver(syncMarqueeSpeed).observe(marqueeRows[0].parentElement);
    const motionItems = document.querySelectorAll('.home-v3 .directions .three > a, .home-v3 .speakers .speaker-grid > article, .home-v3 .events article, .home-v3 .materials .three > article, .home-v3 .lab-grid figure, .home-v3 .learning .carousel, .home-v3 .reviews-quotes .review-quote, .home-v3 .faq .accordion details');
    if (motionItems.length) {
      document.documentElement.classList.add('dpb-motion-ready');
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) motionItems.forEach(item => item.classList.add('is-visible'));
      else {
      const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        motionObserver.unobserve(entry.target);
      }), {threshold: .12, rootMargin: '0px 0px -8% 0px'});
      motionItems.forEach(item => motionObserver.observe(item));
      }
    }
    const countdown = document.querySelector('#event-countdown');
    if (countdown && Date.now() >= new Date('2026-09-04T00:00:00+07:00').getTime()) countdown.textContent = '0';
    const video = document.querySelector('.home-hero video');
    if (video) {
      video.dataset.loaded = 'true';
      video.src = 'assets/hero-lab-video-web.mp4';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !navigator.connection?.saveData) video.play().catch(() => {});
    }
    // A tall mobile section may never reach the old 30% intersection threshold.
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in-view');
      revealObserver.unobserve(entry.target);
    }), {threshold: 0, rootMargin: '0px 0px -10% 0px'});
    document.querySelectorAll('.clinical-doubts').forEach(section => revealObserver.observe(section));
    const speakers = document.querySelector('.speaker-grid');
    if (speakers) {
      speakers.tabIndex = 0;
      speakers.setAttribute('aria-label', 'Преподаватели — листайте горизонтально');
      const controls = document.createElement('div');
      controls.className = 'responsive-speaker-controls';
      for (const [direction, label, glyph] of [[-1, 'Предыдущий преподаватель', '←'], [1, 'Следующий преподаватель', '→']]) {
        const button = document.createElement('button');
        button.type = 'button'; button.textContent = glyph; button.setAttribute('aria-label', label);
        button.addEventListener('click', () => speakers.scrollBy({left: direction * (speakers.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(speakers).columnGap)), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
        controls.append(button);
      }
      speakers.after(controls);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupMotion, {once: true});
  else setupMotion();
  const titles = [...document.querySelectorAll('main h1')];
  for (const heading of document.querySelectorAll('main h2')) {
    const updateLength = () => heading.classList.toggle('responsive-title-long', heading.textContent.trim().length >= 30);
    updateLength();
    new MutationObserver(updateLength).observe(heading, {childList: true, characterData: true, subtree: true});
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context || !titles.length) return;
  const pending = new Set();
  const widths = new WeakMap();
  let frame = 0;
  let fontsReady = false;

  function schedule(title) {
    pending.add(title);
    if (fontsReady && !frame) frame = requestAnimationFrame(fitPending);
  }

  function fits(text, size, width, style, heightLimit, checkOrphan = false) {
    context.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
    context.fontKerning = 'normal';
    const spacing = -0.025 * size;
    const measure = value => context.measureText(value).width + Math.max(0, value.length - 1) * spacing;
    const words = text.split(/ +/);
    const lines = [''];
    for (const word of words) {
      if (measure(word) > width) return false;
      const index = lines.length - 1;
      const next = lines[index] ? lines[index] + ' ' + word : word;
      if (measure(next) <= width) lines[index] = next;
      else lines.push(word);
      if (lines.length > 3) return false;
    }
    const last = lines.at(-1);
    if (lines.length * size * 1.04 > heightLimit) return false;
    return !checkOrphan || lines.length === 1 || !(last.length <= 4 && !last.includes(' ') && !last.includes('\u00a0'));
  }

  function fitPending() {
    frame = 0;
    const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const textScale = Math.max(1, rootSize / 16);
    const results = [...pending].map(title => {
      const style = getComputedStyle(title);
      const width = title.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      if (!width || style.display === 'none') return null;
      const text = title.textContent.replace(/\s+/g, ' ').trim();
      // A viewport-relative typographic budget, not a fixed CSS block height.
      // The surrounding grid remains content-sized and can grow with user text scaling.
      const heightLimit = Math.max(160, window.innerHeight * .42);
      const min = 20;
      const max = Math.max(160, width);
      let low = min, high = max;
      // Find the widest fitting headline, then check the discrete half-pixel boundary.
      while (high - low > .5) {
        const mid = (low + high) / 2;
        if (fits(text, mid, width - 1, style, heightLimit)) low = mid;
        else high = mid;
      }
      let size = Math.floor(low * 2) / 2;
      while (size > min && !fits(text, size, width - 1, style, heightLimit, true)) size -= .5;
      // Preserve an increased root text preference rather than fitting it away.
      size *= textScale;
      return {title, size, constrained: !fits(text, size, width - 1, style, heightLimit, true)};
    });
    pending.clear();
    // All layout reads above; only final writes below.
    for (const result of results) {
      if (!result) continue;
      const value = result.size + 'px';
      if (result.title.style.getPropertyValue('--fit-size') !== value) result.title.style.setProperty('--fit-size', value);
      result.title.setAttribute('data-fit-ready', '');
      result.title.toggleAttribute('data-fit-needs-review', result.constrained);
    }
  }

  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      const width = entry.contentRect.width;
      if (widths.get(entry.target) === width) continue;
      widths.set(entry.target, width);
      for (const title of titles) if (title.parentElement === entry.target) schedule(title);
    }
  });
  for (const title of titles) {
    observer.observe(title.parentElement);
    new MutationObserver(() => schedule(title)).observe(title, {childList: true, characterData: true, subtree: true});
    schedule(title);
  }
  document.fonts.ready.then(() => {
    fontsReady = true;
    titles.forEach(schedule);
  });
  document.fonts.addEventListener('loadingdone', () => titles.forEach(schedule));
  window.addEventListener('resize', () => titles.forEach(schedule), {passive: true});
})();
