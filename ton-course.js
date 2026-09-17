(() => {
  const doubts = document.querySelector('#doubts');
  if (doubts) {
    const reveal = () => doubts.classList.add('is-in-view');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) reveal();
    else new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) reveal(); }), {threshold: .3}).observe(doubts);
  }
  const dialog = document.querySelector('.course-registration-dialog');
  const form = dialog?.querySelector('form');
  document.querySelectorAll('.js-open-registration').forEach(button => button.addEventListener('click', () => dialog?.showModal()));
  form?.addEventListener('submit', event => {
    if (event.submitter?.classList.contains('course-registration-close')) return;
    event.preventDefault();
    if (form.reportValidity()) form.querySelector('.course-registration-status').hidden = false;
  });
})();
