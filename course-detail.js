(() => {
  const syncGalleryAssets = () => {
    const triptych = document.querySelector('.gomzhin-gallery__triptych');
    const source = 'assets/фото%20кур%201/67e65b4d-4916-4b0c-9ae0-048118628591.webp';
    if (!triptych) return;
    triptych.href = source;
    const image = triptych.querySelector('img');
    if (image) image.src = source;
  };
  const applyCleanGalleryAssets = () => Object.entries({tall:'assets/Ресурс%206.webp',apple:'assets/gomzhin-case-007-clean.webp',portrait:'assets/gomzhin-case-006-clean.webp',wide:'assets/gomzhin-case-005-clean.webp'}).forEach(([name, source]) => {
    const link = document.querySelector(`.gomzhin-gallery__${name}`);
    if (!link) return;
    link.href = source;
    const image = link.querySelector('img');
    if (image) image.src = source;
  });
  syncGalleryAssets();
  applyCleanGalleryAssets();
  document.addEventListener('course-editor-ready', syncGalleryAssets);
  document.addEventListener('course-editor-ready', applyCleanGalleryAssets);

  const doubts = document.querySelector('#doubts');
  if (doubts) {
    const reveal = () => doubts.classList.add('is-in-view');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) reveal();
    else {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal(); observer.unobserve(entry.target);
      }), {threshold:.3});
      observer.observe(doubts);
    }
  }

  const dialog = document.querySelector('.course-registration-dialog');
  const form = dialog?.querySelector('form');
  document.querySelectorAll('.js-open-registration').forEach(button => button.addEventListener('click', () => dialog?.showModal()));
  form?.addEventListener('submit', event => {
    if (event.submitter?.classList.contains('course-registration-close')) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.querySelector('.course-registration-status').hidden = false;
  });

  const addEditorMenu = () => {
    if (new URLSearchParams(location.search).get('edit') === '1') return;
    const menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'course-editor-entry';
    menu.textContent = 'Редактировать страницу';
    menu.hidden = true;
    menu.setAttribute('aria-label', 'Открыть редактор страницы');
    const style = document.createElement('style');
    style.textContent = '.course-editor-entry{position:fixed;z-index:10002;padding:12px 16px;border:1px solid #3c3c38;border-radius:10px;background:#1d1d1b;color:#f5f4ee;box-shadow:0 12px 32px #0004;font:600 14px/1.2 "Open Sans";cursor:pointer}.course-editor-entry:hover,.course-editor-entry:focus-visible{background:#f5f4ee;color:#111;outline:none}.course-editor-entry[hidden]{display:none}';
    document.head.append(style);
    document.body.append(menu);
    const hide = () => { menu.hidden = true; };
    const openEditor = () => {
      const url = new URL(location.href);
      url.searchParams.set('edit', '1');
      location.assign(url);
    };
    document.addEventListener('contextmenu', event => {
      if (event.target.closest('.course-editor-entry')) return;
      event.preventDefault();
      menu.hidden = false;
      const x = Math.min(event.clientX, innerWidth - menu.offsetWidth - 12);
      const y = Math.min(event.clientY, innerHeight - menu.offsetHeight - 12);
      menu.style.left = `${Math.max(12, x)}px`;
      menu.style.top = `${Math.max(12, y)}px`;
      menu.focus();
    });
    menu.addEventListener('click', openEditor);
    document.addEventListener('pointerdown', event => { if (!event.target.closest('.course-editor-entry')) hide(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
    addEventListener('scroll', hide, { passive: true });
  };
  addEditorMenu();

  if (new URLSearchParams(location.search).get('edit') === '1') {
    const editorScript = document.createElement('script');
    editorScript.src = 'course-editor.js?v=open-sans-clean-1';
    editorScript.dataset.courseEditor = 'true';
    document.head.append(editorScript);
  }
})();
