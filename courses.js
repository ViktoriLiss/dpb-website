const courseHeroTitle = document.querySelector('.catalog-hero h1');
if (courseHeroTitle) {
  const desktopTitleMarkup = courseHeroTitle.innerHTML;
  const mobileTitleMarkup = '<span>Работа руками.</span> <span>Фокус на результате</span>';
  const mobileTitleQuery = window.matchMedia('(max-width: 680px)');
  const updateCourseHeroTitle = event => {
    if (event.matches) {
      if (courseHeroTitle.innerHTML !== mobileTitleMarkup) courseHeroTitle.innerHTML = mobileTitleMarkup;
    } else if (courseHeroTitle.innerHTML !== desktopTitleMarkup) {
      courseHeroTitle.innerHTML = desktopTitleMarkup;
    }
  };
  updateCourseHeroTitle(mobileTitleQuery);
  mobileTitleQuery.addEventListener('change', updateCourseHeroTitle);
}

const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.course-card')];
const emptyState = document.querySelector('.empty-state');
const advancedSelects = [...document.querySelectorAll('select[data-course-select]')];
const moreCoursesButton = document.querySelector('[data-courses-more]');
const coursesPerPage = 3;
let visibleCourseLimit = coursesPerPage;
let audienceFilter = 'all';

function enhanceCourseSelect(select) {
  const shell = document.createElement('div');
  const trigger = document.createElement('button');
  const menu = document.createElement('div');
  const options = [...select.options];

  shell.className = 'course-select';
  trigger.className = 'course-select-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.textContent = select.selectedOptions[0].textContent;
  menu.className = 'course-select-menu';
  menu.hidden = true;

  options.forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.value = option.value;
    button.textContent = option.textContent;
    button.classList.toggle('active', option.selected);
    button.addEventListener('click', () => {
      select.value = option.value;
      trigger.textContent = option.textContent;
      menu.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    menu.append(button);
  });

  trigger.addEventListener('click', () => {
    const opening = menu.hidden;
    document.querySelectorAll('.course-select-menu').forEach(item => item.hidden = true);
    document.querySelectorAll('.course-select-trigger').forEach(item => item.setAttribute('aria-expanded', 'false'));
    menu.hidden = !opening;
    trigger.setAttribute('aria-expanded', String(opening));
  });

  select.classList.add('native-course-select');
  shell.append(trigger, menu);
  select.after(shell);

  document.addEventListener('click', event => {
    if (shell.contains(event.target)) return;
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  });
}

advancedSelects.forEach(enhanceCourseSelect);

function applyCourseFilter(value, resetLimit = true) {
  audienceFilter = value;
  if (resetLimit) visibleCourseLimit = coursesPerPage;
  filters.forEach(item => item.classList.toggle('active', item.dataset.filter === value));
  let matched = 0;
  cards.forEach(card => {
    const tags = card.dataset.tags.split(' ');
    const audienceMatches = value === 'all' || tags.includes(value);
    const advancedMatches = advancedSelects.every(select => select.value === 'all' || tags.includes(select.value));
    const matches = audienceMatches && advancedMatches;
    if (matches) matched += 1;
    card.hidden = !matches || matched > visibleCourseLimit;
  });
  emptyState.hidden = matched !== 0;
  if (moreCoursesButton) {
    moreCoursesButton.parentElement.hidden = matched === 0;
    moreCoursesButton.disabled = matched <= visibleCourseLimit;
    moreCoursesButton.title = moreCoursesButton.disabled ? 'Сейчас показаны все курсы' : '';
  }
}

moreCoursesButton?.addEventListener('click', () => {
  visibleCourseLimit += coursesPerPage;
  applyCourseFilter(audienceFilter, false);
});
applyCourseFilter(audienceFilter);

filters.forEach(button => button.addEventListener('click', () => applyCourseFilter(button.dataset.filter)));
advancedSelects.forEach(select => select.addEventListener('change', () => applyCourseFilter(audienceFilter)));
document.querySelectorAll('[data-pick]').forEach(button => button.addEventListener('click', () => {
  applyCourseFilter(button.dataset.pick);
  document.querySelector('#catalog').scrollIntoView({ behavior: 'smooth' });
}));

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
menuButton.insertAdjacentHTML('beforebegin', '<div class="header-socials" aria-label="Социальные сети dpb"><a href="contacts.html#socials" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="4"></rect><path d="M10 9l5 3-5 3z"></path></svg></a><a href="contacts.html#socials" aria-label="VK"><b>VK</b></a><a href="contacts.html#socials" aria-label="Telegram"><svg viewBox="0 0 24 24"><path d="M20 4L3 11l6 2 2 6 3-4 4 3z"></path><path d="M9 13l8-6"></path></svg></a><a href="mailto:dpb.center@dpb.center" aria-label="Электронная почта"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"></rect><path d="M4 7l8 6 8-6"></path></svg></a></div>');
menuButton.insertAdjacentHTML('beforebegin', '<a class="header-phone" href="tel:+79514354099" aria-label="Позвонить в dpb">+7 (951) 435-40-99</a>');
document.querySelectorAll('.desktop-nav a[href="contacts.html"],.mobile-nav a[href="contacts.html"]').forEach(link => link.remove());
menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));


document.querySelectorAll('.course-lead-form').forEach(form => {
  [...form.querySelectorAll('input')].slice(0, 2).forEach(input => input.required = true);
  form.addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const original = submit.textContent;
  submit.textContent = 'Форма в прототипе не отправляется';
  setTimeout(() => submit.textContent = original, 2600);
  });
});

document.querySelectorAll('[data-course-select]').forEach(select => {
  const field = select.closest('.course-field');
  const nativeSelect = field.querySelector('.course-select-native');
  const trigger = select.querySelector('.course-select__trigger');
  const triggerText = trigger.querySelector('span');
  const menu = select.querySelector('.course-select__menu');
  const options = [...menu.querySelectorAll('[role="option"]')];
  const setOpen = open => {
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  };
  trigger.addEventListener('click', () => setOpen(menu.hidden));
  options.forEach(option => option.addEventListener('click', () => {
    nativeSelect.value = option.dataset.value;
    triggerText.textContent = option.textContent;
    options.forEach(item => item.setAttribute('aria-selected', String(item === option)));
    nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    setOpen(false);
  }));
  document.addEventListener('click', event => { if (!select.contains(event.target)) setOpen(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
});

document.querySelectorAll('a[href="tel:+70000000000"]').forEach((link) => { link.href = 'tel:+79514354099'; link.textContent = '+7 (951) 435-40-99'; });
document.querySelectorAll('a[href="mailto:dpb.center@dpb.center"]').forEach((link) => { link.href = 'mailto:dpb.center@dpb.center'; if (!link.getAttribute('aria-label')) link.textContent = 'dpb.center@dpb.center'; });

document.querySelectorAll('[data-photo-gallery]').forEach(gallery => {
  const imagesHost = gallery.querySelector('.gallery__images');
  const images = [...imagesHost.querySelectorAll('img')];
  const controls = gallery.querySelector('.gallery__controls');
  if (images.length <= 4) return;

  const pages = document.createElement('div');
  pages.className = 'gallery__pages';
  const pageItems = [];
  for (let index = 0; index < images.length; index += 4) {
    const page = document.createElement('div');
    page.className = 'gallery__page';
    images.slice(index, index + 4).forEach((image, imageIndex) => {
      image.classList.toggle('gallery-main', imageIndex === 0);
      page.append(image);
    });
    pages.append(page);
    pageItems.push(page);
  }
  imagesHost.replaceWith(pages);

  const previous = gallery.querySelector('[data-gallery-prev]');
  const next = gallery.querySelector('[data-gallery-next]');
  const counter = gallery.querySelector('[data-gallery-counter]');
  let currentPage = 0;
  const render = () => {
    pageItems.forEach((page, index) => { page.hidden = index !== currentPage; });
    previous.disabled = currentPage === 0;
    next.disabled = currentPage === pageItems.length - 1;
    counter.textContent = `${currentPage + 1} / ${pageItems.length}`;
  };
  const showPage = direction => {
    const nextPage = Math.min(Math.max(currentPage + direction, 0), pageItems.length - 1);
    if (nextPage === currentPage) return;
    currentPage = nextPage;
    render();
  };

  previous.addEventListener('click', () => showPage(-1));
  next.addEventListener('click', () => showPage(1));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPage(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPage(1); }
  });
  controls.hidden = false;
  render();
});

const trainingGallery = document.querySelector('#training-gallery');
if (trainingGallery) {
  const moveTrainingGallery = direction => trainingGallery.scrollBy({ left: direction * trainingGallery.clientWidth * 0.86, behavior: 'smooth' });
  document.querySelector('.training-gallery-arrow--prev')?.addEventListener('click', () => moveTrainingGallery(-1));
  document.querySelector('.training-gallery-arrow--next')?.addEventListener('click', () => moveTrainingGallery(1));
}
