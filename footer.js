/*
 * Canonical DPB footer. This is the only footer template used by the static
 * prototype. Keep its markup and motion in sync with styles.css.
 */
(() => {
  if (!document.querySelector('link[data-dpb-footer-standard]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'footer.css?v=approved-20260916';
    stylesheet.dataset.dpbFooterStandard = 'true';
    document.head.append(stylesheet);
  }

  const footer = document.querySelector('footer') || document.body.appendChild(document.createElement('footer'));

  footer.id = 'contacts';
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-shell">
      <a class="footer-cta" href="contacts.html">
        <span>Есть профессиональная задача?</span>
        <strong>Обсудить её с dpb</strong>
        <i aria-hidden="true">↗</i>
      </a>
      <div class="footer-grid">
        <div class="footer-brand">
          <img class="footer-logo-image" src="assets/Лого дпб/Ресурс 4.svg" alt="dpb">
          <p>Профессиональный образовательный и зуботехнический хаб Сибири.</p>
        </div>
        <div class="footer-contact">
          <span>Координатор dpb</span>
          <a href="tel:+79514354099">+7 (951) 435-40-99</a>
          <a href="mailto:dpb.center@dpb.center">dpb.center@dpb.center</a>
          <p>Барнаул · Сиреневая, 31</p>
        </div>
        <nav class="footer-links" aria-label="Навигация в подвале">
          <span>Разделы</span>
          <a href="courses.html">Курсы</a>
          <a href="announcements.html">События</a>
          <a href="materials.html">Материалы</a>
          <a href="kits.html">Комплекты партнёров</a>
          <a href="lab.html">Лаборатория</a>
        </nav>
        <div class="footer-socials" aria-label="Каналы связи">
          <span>Каналы связи</span>
          <div>
            <a href="contacts.html" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M20 4 3 11l6 2 2 6 3-4 4 3z"></path><path d="m9 13 8-6"></path></svg></a>
            <a href="contacts.html" aria-label="VK"><b>VK</b></a>
            <a href="contacts.html" aria-label="MAX"><b>MAX</b></a>
            <a href="mailto:dpb.center@dpb.center" aria-label="Электронная почта"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="m4 7 8 6 8-6"></path></svg></a>
          </div>
        </div>
      </div>
    </div>`;
})();
