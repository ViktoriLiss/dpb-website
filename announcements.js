const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
menuButton.insertAdjacentHTML('beforebegin', '<div class="header-socials" aria-label="Социальные сети dpb"><a href="contacts.html#socials" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="4"></rect><path d="M10 9l5 3-5 3z"></path></svg></a><a href="contacts.html#socials" aria-label="VK"><b>VK</b></a><a href="contacts.html#socials" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M20 4L3 11l6 2 2 6 3-4 4 3z"></path><path d="M9 13l8-6"></path></svg></a><a href="mailto:dpb.center@dpb.center" aria-label="Электронная почта"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="M4 7l8 6 8-6"></path></svg></a></div>');
menuButton.insertAdjacentHTML('beforebegin', '<a class="header-phone" href="tel:+79514354099" aria-label="Позвонить в dpb">+7 (951) 435-40-99</a>');
document.querySelectorAll('.desktop-nav a[href="contacts.html"],.mobile-nav a[href="contacts.html"]').forEach(link => link.remove());

menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});


const eventFilters = [...document.querySelectorAll('.event-filter')];
const eventCards = [...document.querySelectorAll('.announcement-card')];
const eventEmpty = document.querySelector('.event-empty');
const eventCount = document.querySelector('#event-count');
eventFilters.forEach(button => button.addEventListener('click', () => {
  eventFilters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  let visible = 0;
  eventCards.forEach(card => {
    const show = button.dataset.eventFilter === 'all' || card.dataset.eventTags.split(' ').includes(button.dataset.eventFilter);
    card.hidden = !show;
    if (show) visible += 1;
  });
  eventCount.textContent = visible;
  eventEmpty.hidden = visible !== 0;
}));

document.querySelector('.announcement-form input')?.setAttribute('required', '');
document.querySelector('.announcement-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const submit = event.currentTarget.querySelector('button');
  const original = submit.textContent;
  submit.textContent = 'Подписка в прототипе не отправляется';
  setTimeout(() => submit.textContent = original, 2600);
});

document.querySelectorAll('a[href="tel:+70000000000"]').forEach((link) => { link.href = 'tel:+79514354099'; link.textContent = '+7 (951) 435-40-99'; });
document.querySelectorAll('a[href="mailto:dpb.center@dpb.center"]').forEach((link) => { link.href = 'mailto:dpb.center@dpb.center'; if (!link.getAttribute('aria-label')) link.textContent = 'dpb.center@dpb.center'; });
document.querySelectorAll('.footer-contact p').forEach((item) => { item.textContent = 'Барнаул · ул. Сиреневая, 31'; });

const eventGallery = document.querySelector('#event-gallery');
if (eventGallery) {
  const galleryStep = (direction) => eventGallery.scrollBy({ left: direction * eventGallery.clientWidth * 0.86, behavior: 'smooth' });
  document.querySelector('.gallery-arrow--prev')?.addEventListener('click', () => galleryStep(-1));
  document.querySelector('.gallery-arrow--next')?.addEventListener('click', () => galleryStep(1));
}
