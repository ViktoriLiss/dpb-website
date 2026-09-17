const quiz = document.querySelector('#learning-quiz');
const steps = [...document.querySelectorAll('.quiz-step')];
const nextButton = document.querySelector('.quiz-next');
const backButton = document.querySelector('.quiz-back');
const errorMessage = document.querySelector('.quiz-error');
const currentLabel = document.querySelector('#quiz-current');
const progressBar = document.querySelector('#quiz-progress-bar');
let currentStep = 0;

function renderStep() {
  steps.forEach((step, index) => step.classList.toggle('active', index === currentStep));
  currentLabel.textContent = currentStep + 1;
  progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  backButton.hidden = currentStep === 0;
  nextButton.textContent = currentStep === steps.length - 1 ? 'Получить PDF-гайд' : 'Продолжить';
  errorMessage.hidden = true;
}

nextButton.addEventListener('click', () => {
  const selected = steps[currentStep].querySelector('input:checked');
  if (!selected) { errorMessage.hidden = false; return; }
  if (currentStep < steps.length - 1) { currentStep += 1; renderStep(); return; }
  const data = new FormData(quiz);
  document.querySelector('#result-title').textContent = 'Ваш PDF-гайд готов';
  document.querySelector('#result-role').textContent = data.get('role');
  document.querySelector('#result-level').textContent = data.get('level');
  document.querySelector('#result-goal').textContent = data.get('goal');
  document.querySelector('#result-format').textContent = data.get('format');
  quiz.hidden = true;
  document.querySelector('.quiz-progress').hidden = true;
  document.querySelector('.quiz-result').hidden = false;
  document.querySelector('.quiz-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

backButton.addEventListener('click', () => { currentStep -= 1; renderStep(); });
document.querySelector('.quiz-contact').addEventListener('submit', event => {
  event.preventDefault();
  event.currentTarget.querySelector('button').textContent = 'В прототипе данные не отправляются';
});
renderStep();
