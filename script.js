const notePanel = document.querySelector('.notes-panel');
const noteToggle = document.querySelector('.notes-toggle');
const noteClose = document.querySelector('.notes-close');
const pins = [...document.querySelectorAll('.idea-pin')];

function setNotes(open) {
  notePanel.classList.toggle('open', open);
  noteToggle.setAttribute('aria-pressed', String(open));
  noteToggle.textContent = `Комментарии: ${open ? 'включены' : 'выключены'}`;
  pins.forEach(pin => pin.hidden = !open);
}

noteToggle?.addEventListener('click', () => setNotes(!notePanel.classList.contains('open')));
noteClose?.addEventListener('click', () => setNotes(false));
pins.forEach(pin => pin.addEventListener('click', () => {
  setNotes(true);
  document.querySelectorAll('[data-note-card]').forEach(card => card.classList.remove('active'));
  const card = document.querySelector(`[data-note-card="${pin.dataset.note}"]`);
  if (card) { card.classList.add('active'); card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}));
if (notePanel && noteToggle) setNotes(false);

const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.course-card')];
const emptyState = document.querySelector('.empty-state');
const eventCountdown = document.querySelector('#event-countdown');

if (eventCountdown) {
  const eventStart = new Date('2026-08-29T00:00:00+07:00').getTime();
  const daysLeft = Math.ceil((eventStart - Date.now()) / 86400000);
  const dayWord = value => {
    const mod100 = value % 100;
    const mod10 = value % 10;
    if (mod100 >= 11 && mod100 <= 14) return 'дней';
    if (mod10 === 1) return 'день';
    if (mod10 >= 2 && mod10 <= 4) return 'дня';
    return 'дней';
  };
  eventCountdown.textContent = daysLeft > 0 ? `${daysLeft} ${dayWord(daysLeft)}` : 'Событие началось';
}
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  let visible = 0;
  cards.forEach(card => {
    const show = button.dataset.filter === 'all' || card.dataset.tags.split(' ').includes(button.dataset.filter);
    card.hidden = !show;
    if (show) visible += 1;
  });
  emptyState.hidden = visible !== 0;
}));

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
if (!document.querySelector('.header-socials')) menuButton.insertAdjacentHTML('beforebegin', '<div class="header-socials" aria-label="Социальные сети dpb"><a href="contacts.html#socials" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="4"></rect><path d="M10 9l5 3-5 3z"></path></svg></a><a href="contacts.html#socials" aria-label="VK"><b>VK</b></a><a href="contacts.html#socials" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M20 4L3 11l6 2 2 6 3-4 4 3z"></path><path d="M9 13l8-6"></path></svg></a><a href="mailto:dpb.center@dpb.center" aria-label="Электронная почта"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="M4 7l8 6 8-6"></path></svg></a></div>');
if (!document.querySelector('.header-phone')) menuButton.insertAdjacentHTML('beforebegin', '<a class="header-phone" href="tel:+79514354099" aria-label="Позвонить в dpb">+7 (951) 435-40-99</a>');
document.querySelectorAll('.desktop-nav a[href="contacts.html"],.mobile-nav a[href="contacts.html"]').forEach(link => link.remove());
menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const educationTrigger = document.querySelector('.nav-dropdown-trigger');
const educationMenu = document.querySelector('.mega-menu');
const megaScrim = document.querySelector('.mega-scrim');
const siteHeader = document.querySelector('.site-header');

function positionMegaMenu() {
  educationMenu.style.top = `${siteHeader.getBoundingClientRect().bottom}px`;
}

function setMegaMenu(open) {
  educationMenu.hidden = !open;
  megaScrim.hidden = !open;
  educationTrigger.setAttribute('aria-expanded', String(open));
  if (open) positionMegaMenu();
}

educationTrigger.addEventListener('click', () => setMegaMenu(educationMenu.hidden));
megaScrim.addEventListener('click', () => setMegaMenu(false));
let megaCloseTimer;
const openMegaOnHover = () => { clearTimeout(megaCloseTimer); setMegaMenu(true); };
const closeMegaAfterHover = () => { clearTimeout(megaCloseTimer); megaCloseTimer = setTimeout(() => setMegaMenu(false), 180); };
educationTrigger.addEventListener('pointerenter', openMegaOnHover);
educationTrigger.addEventListener('pointerleave', closeMegaAfterHover);
educationMenu.addEventListener('pointerenter', () => clearTimeout(megaCloseTimer));
educationMenu.addEventListener('pointerleave', closeMegaAfterHover);
window.addEventListener('resize', () => { if (!educationMenu.hidden) positionMegaMenu(); });
window.addEventListener('scroll', () => { if (!educationMenu.hidden) positionMegaMenu(); }, { passive: true });
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMegaMenu(false); });

const dialog = document.querySelector('.course-dialog');
document.querySelectorAll('.open-course').forEach(button => button.addEventListener('click', () => dialog.showModal()));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

document.querySelector('.lead-form input')?.setAttribute('required', '');
document.querySelector('.lead-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const submit = event.currentTarget.querySelector('button');
  const original = submit.textContent;
  submit.textContent = 'Заявка в прототипе не отправляется';
  setTimeout(() => submit.textContent = original, 2600);
});

// Клиентский маршрут главной: доверие → направления → обучение → решения → доказательства → контакт.
const heroSection = document.querySelector('.hero');
const aboutSection = document.querySelector('.about');
const numbersSection = document.querySelector('.numbers-section');
const directionsSection = document.querySelector('.directions');
const partnersSection = document.querySelector('.partners');
if (heroSection && aboutSection) heroSection.after(aboutSection);
if (aboutSection && numbersSection) aboutSection.after(numbersSection);
if (directionsSection && partnersSection) directionsSection.after(partnersSection);

const whySection = document.querySelector('.why');
const processSection = document.querySelector('.process');
const certificateSection = document.querySelector('.certificate-preview');
if (whySection && processSection) whySection.after(processSection);
if (processSection && certificateSection) processSection.after(certificateSection);

const knowledgeSection = document.querySelector('.knowledge');
const testimonialsSection = document.querySelector('.testimonials');
if (knowledgeSection && testimonialsSection) knowledgeSection.after(testimonialsSection);
document.querySelector('.home-map span')?.replaceChildren('Карта · Барнаул, Сиреневая, 31');

const partnerTrack = document.querySelector('.partner-marquee-track');
const partnerSource = partnerTrack?.querySelector('.partner-logo-set');
if (partnerTrack && partnerSource && !partnerTrack.dataset.twoRowMarquee) {
  const partnerItems = [...partnerSource.children];
  partnerTrack.dataset.twoRowMarquee = 'true';
  partnerTrack.replaceChildren(...[partnerItems.slice(0, 8), partnerItems.slice(8)].map((items, rowIndex) => {
    const line = document.createElement('div');
    line.className = `partner-marquee-line ${rowIndex ? 'partner-marquee-line--reverse' : 'partner-marquee-line--forward'}`;
    const sequence = document.createElement('div');
    sequence.className = 'partner-marquee-sequence';
    const firstSet = document.createElement('div');
    firstSet.className = 'partner-logo-set';
    items.forEach(item => firstSet.append(item));
    const copySet = firstSet.cloneNode(true);
    copySet.setAttribute('aria-hidden', 'true');
    sequence.append(firstSet, copySet);
    line.append(sequence);
    return line;
  }));
}
