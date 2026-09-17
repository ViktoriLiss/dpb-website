const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const pageMain = document.querySelector('main');
if (pageMain && !pageMain.id) pageMain.id = 'top';
if (location.pathname.endsWith('/materials.html')) document.querySelector('.materials-hero-copy>.kicker')?.remove();
if (location.pathname.endsWith('/materials.html')) document.querySelectorAll('.materials-page .kicker').forEach(label => label.remove());
menuButton?.insertAdjacentHTML('beforebegin', '<div class="header-socials" aria-label="Социальные сети dpb"><a href="contacts.html#socials" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="4"></rect><path d="M10 9l5 3-5 3z"></path></svg></a><a href="contacts.html#socials" aria-label="VK"><b>VK</b></a><a href="contacts.html#socials" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M20 4L3 11l6 2 2 6 3-4 4 3z"></path><path d="M9 13l8-6"></path></svg></a><a href="mailto:dpb.center@dpb.center" aria-label="Электронная почта"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="M4 7l8 6 8-6"></path></svg></a></div>');
menuButton?.insertAdjacentHTML('beforebegin', '<a class="header-phone" href="tel:+79514354099" aria-label="Позвонить в dpb">+7 (951) 435-40-99</a>');
document.querySelectorAll('.desktop-nav a[href="contacts.html"],.mobile-nav a[href="contacts.html"]').forEach(link => link.remove());
document.querySelectorAll('a[href="announcements.html"]').forEach(link => link.textContent = 'События');
menuButton?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.inner-form').forEach(form => {
  [...form.querySelectorAll('input')].slice(0, 2).forEach(input => input.required = true);
  form.addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const button = event.currentTarget.querySelector('button');
  button.textContent = 'Запрос принят';
  button.disabled = true;
  event.currentTarget.querySelector('.form-success')?.remove();
  event.currentTarget.insertAdjacentHTML('beforeend', '<p class="form-success" role="status">Спасибо! В рабочей версии сайта координатор dpb получит этот запрос и свяжется с вами.</p>');
  });
});

document.querySelectorAll('.solution-filters button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.solution-filters button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const category = button.dataset.solutionFilter;
  if (category) {
    document.querySelectorAll('[data-solution-category]').forEach(card => {
      card.hidden = card.dataset.solutionCategory !== category;
    });
  }
}));

const caseToggle = document.querySelector('[data-case-toggle]');
const caseList = document.querySelector('[data-case-list]');
caseToggle?.addEventListener('click', () => {
  const willOpen = caseList.hidden;
  caseList.hidden = !willOpen;
  caseToggle.setAttribute('aria-expanded', String(willOpen));
  caseToggle.textContent = willOpen ? 'Скрыть дополнительные кейсы ↑' : 'Показать больше кейсов ↓';
});

const mediaCards = [...document.querySelectorAll('[data-media-theme]')];
const mediaThemeButtons = [...document.querySelectorAll('[data-media-theme]:is(button)')];
const mediaFormatButtons = [...document.querySelectorAll('[data-media-format]:is(button)')];
let activeMediaTheme = 'all';
let activeMediaFormat = 'all';
const updateMediaLibrary = () => {
  let visibleCount = 0;
  mediaCards.filter(card => card.matches('article')).forEach(card => {
    const visible = (activeMediaTheme === 'all' || card.dataset.mediaTheme === activeMediaTheme) && (activeMediaFormat === 'all' || card.dataset.mediaFormat === activeMediaFormat);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  const emptyState = document.querySelector('[data-media-empty]');
  if (emptyState) emptyState.hidden = visibleCount > 0;
};
mediaThemeButtons.forEach(button => button.addEventListener('click', () => {
  activeMediaTheme = button.dataset.mediaTheme;
  mediaThemeButtons.forEach(item => item.classList.toggle('active', item === button));
  updateMediaLibrary();
}));
mediaFormatButtons.forEach(button => button.addEventListener('click', () => {
  activeMediaFormat = button.dataset.mediaFormat;
  mediaFormatButtons.forEach(item => item.classList.toggle('active', item === button));
  updateMediaLibrary();
}));

const mediaDialog = document.querySelector('.media-video-dialog');
const mediaDialogVideo = mediaDialog?.querySelector('video');
document.querySelectorAll('[data-media-preview]').forEach(button => button.addEventListener('click', () => {
  const title = button.dataset.videoTitle || 'Профессиональный материал';
  const dialogTitle = mediaDialog?.querySelector('[data-media-dialog-title]');
  if (dialogTitle) dialogTitle.textContent = title;
  mediaDialog?.showModal();
}));
document.querySelector('.media-video-close')?.addEventListener('click', () => {
  mediaDialogVideo?.pause();
  mediaDialog?.close();
});
mediaDialog?.addEventListener('close', () => mediaDialogVideo?.pause());

if (location.pathname.endsWith('/contacts.html')) {
  document.querySelector('main')?.insertAdjacentHTML('beforeend', `<section class="contact-details section-dark section-pad" id="socials"><div><p class="kicker">Социальные сети и мессенджеры</p><h2>Каналы связи</h2><p>Telegram · уточняется<br>VK · уточняется<br>WhatsApp · уточняется</p></div><div><p class="kicker">Реквизиты</p><h2>Юридическая информация</h2><p>Название организации, ИНН, ОГРН и юридический адрес нужно получить у dpb.</p><span>Политика конфиденциальности · текст нужен</span><br><span>Согласие на обработку данных · текст нужен</span></div></section>`);
}

if (location.pathname.endsWith('/solution-detail.html')) {
  document.querySelector('.inner-request')?.insertAdjacentHTML('beforebegin', `<section class="service-responsibility section-dark section-pad"><div><p class="kicker">Запуск и сервис</p><h2>Ответственные известны до заказа</h2><p>Для конкретной позиции здесь фиксируются реальные обязательства dpb, производителя и сервисного партнёра.</p></div><div class="responsibility-grid"><article><b>Кто принимает заявку</b><p>Координатор dpb · имя и прямой контакт будут указаны после согласования.</p></article><article><b>Кто запускает</b><p>Доставка, установка, настройка и обучение перечисляются отдельно для выбранного решения.</p></article><article><b>Кто поддерживает</b><p>dpb, производитель или партнёр; канал, рабочее время и срок ответа указываются до заказа.</p></article><article><b>Что входит в сервис</b><p>Диагностика, консультации, ремонт и расходные материалы не объединяются в одно неподтверждённое обещание.</p></article><article><b>Порядок обращения</b><p>Один контакт принимает вопрос и передаёт его стороне, которая отвечает по условиям поставки.</p></article><article><b>Статус условий</b><p>Пока данные не подтверждены, карточка честно показывает «уточняется».</p></article></div></section>`);
}

document.querySelector('.barnaul-branch dl div:nth-child(3) dd')?.replaceChildren('Барнаул · Сиреневая, 31');

// Логотипы партнёров в карточках материалов: изображения берутся из локального каталога partners.
if (location.pathname.endsWith('/materials.html')) {
  const partnerLogos = {
    'РИКОМ': ['assets/partners/rikom.webp'],
    'VITA': ['assets/partners/vita (2).webp'],
    'Creality': ['assets/partners/creality.svg'],
    'Zubler': ['assets/partners/zubler.webp'],
    'UPCERA': ['assets/partners/upcera.webp'],
    'SRLMaterials': ['assets/partners/final-bk-giulini.png'],
    'HARZLabs': ['assets/partners/harz-labs (2).webp'],
    '3Shape': ['assets/partners/3shape.webp'],
    'HASS': ['assets/partners/hass.webp'],
    'FormlabsDental': ['assets/partners/formlabs.svg'],
    'XTCERA': ['assets/partners/xtcera.png'],
    'JensenDental': ['assets/partners/jensen-dental.png'],
    'MEDICLUS': ['assets/partners/f1346d61-aae0-4a24-94aa-fb3936ade637.webp'],
    'RESTART': ['assets/partners/restart.png'],
    'indexmedica.pro': ['assets/partners/Изображение Codex 28 авг. 2026 г., 00_13_42.png'],
  };
  const partnerLinks = {
    'РИКОМ': 'https://rikom-dent.ru/',
    'VITA': 'https://www.vita-zahnfabrik.com/',
    'Creality': 'https://store.creality.com/',
    'Zubler': 'https://zubler.de/?lang=en',
    'UPCERA': 'https://upcera.com/en',
    'SRLMaterials': 'https://srl-materials.com/en/',
    'HARZLabs': 'https://harzlabs.com/',
    '3Shape': 'https://www.3shape.com/',
    'HASS': 'https://hassbio.com/en',
    'FormlabsDental': 'https://dental.formlabs.com/global/',
    'XTCERA': 'https://dw.xtcera.com/',
    'JensenDental': 'https://jensendental.com/',
    'MEDICLUS': 'https://mediclus.co.kr/home/main.php',
    'RESTART': 'https://restart-lab.ru/',
    'indexmedica.pro': 'https://indexmedica.pro/',
  };
  document.querySelectorAll('.brand-grid article').forEach(card => {
    const label = card.querySelector('.brand-name')?.textContent?.replace(/\s+/g, ' ').trim();
    const key = label?.replace(/\s+/g, '');
    const sources = key ? partnerLogos[key] : undefined;
    if (!sources) return;
    const logos = card.querySelector('.brand-logos') || document.createElement('div');
    logos.className = sources.length > 1 ? 'brand-logos' : 'brand-logos brand-logos--single';
    if (!logos.parentElement) card.querySelector('.brand-name')?.before(logos);
    logos.replaceChildren(...sources.map((src, index) => {
      const image = document.createElement('img');
      image.className = 'brand-logo';
      image.src = src;
      image.alt = `${label} — логотип${sources.length > 1 ? ` ${index + 1}` : ''}`;
      image.loading = 'lazy';
      return image;
    }));
    const link = card.querySelector('a');
    if (link && partnerLinks[key]) {
      link.href = partnerLinks[key];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}

document.querySelectorAll('.materials-form').forEach((form) => {
  if (form.querySelector('.course-form-consents')) return;
  const consents = document.createElement('div');
  consents.className = 'course-form-consents';
  consents.innerHTML = '<label class="course-consent"><input type="checkbox" name="personal-data-consent" required><span>Даю согласие на обработку персональных данных.</span></label><label class="course-consent"><input type="checkbox" name="privacy-policy-consent" required><span>Ознакомлен(а) с политикой обработки персональных данных.</span></label>';
  const button = form.querySelector('button[type="submit"]');
  if (button) form.insertBefore(consents, button);
  const note = form.querySelector('small');
  if (note) {
    note.className = 'course-form-note';
    note.innerHTML = '<span>Координатор свяжется с вами и поможет выбрать подходящий формат.</span><span>Поля с согласиями обязательны для отправки формы.</span>';
  }
});

// Длинная карточка курса должна оставаться обозримой: ключевые блоки доступны сразу после первого экрана.
const realCoursePage = document.querySelector('.real-course-page:not(.gomzhin-course)');
if (realCoursePage && !realCoursePage.querySelector('.course-jump-nav')) {
  const hero = realCoursePage.querySelector('.real-course-hero');
  const result = realCoursePage.querySelector('.course-outcomes');
  const materials = realCoursePage.querySelector('.course-tools');
  if (result) result.id = 'result';
  if (materials) materials.id = 'materials';
  hero?.insertAdjacentHTML('afterend', '<nav class="course-jump-nav" aria-label="Навигация по странице курса"><a href="#result">Результат</a><a href="#program">Программа</a><a href="#materials">Материалы</a><a href="#registration">Запись</a></nav>');
}

// Страница курса следует логике решения: подходит ли → кто ведёт → что будет → условия → доказательства → запись.
const courseDetailPage = document.querySelector('.course-detail-page');
if (courseDetailPage) {
  const focus = courseDetailPage.querySelector('.course-focus');
  const fit = courseDetailPage.querySelector('.course-fit');
  const speaker = courseDetailPage.querySelector('.speaker-detail');
  const video = courseDetailPage.querySelector('.course-video-block');
  if (focus && fit) focus.after(fit);
  if (fit && speaker) fit.after(speaker);
  if (speaker && video) speaker.after(video);

  const tools = courseDetailPage.querySelector('.course-tools');
  const cost = courseDetailPage.querySelector('.cost-scope')?.closest('section');
  const clarity = courseDetailPage.querySelector('.course-clarity');
  const kit = courseDetailPage.querySelector('.implementation-kit');
  const economy = courseDetailPage.querySelector('.course-economy');
  if (tools && cost) tools.after(cost);
  if (cost && clarity) cost.after(clarity);
  if (clarity && kit) clarity.after(kit);
  if (kit && economy) kit.after(economy);
}
