(() => {
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  const page = document.querySelector('.gomzhin-course'); if (!page) return;
  const legacyKey = 'dpb-course-detail-edits-v2';
  const key = `dpb-course-editor:${location.pathname}:v1`;
  const css = document.createElement('style');
  css.textContent = '.course-editor-panel{position:fixed;right:16px;top:88px;z-index:1000;width:310px;max-height:calc(100vh - 104px);overflow:auto;padding:16px;background:#080808;color:#f5f4ee;box-shadow:0 12px 40px #0005;font:14px Open Sans}.course-editor-panel h2{margin:0 0 10px;font-size:18px}.course-editor-panel p{margin:0 0 10px;color:#bdbdb7;font-size:12px;line-height:1.35}.course-editor-panel h3{margin:16px 0 8px;padding-top:10px;border-top:1px solid #444;font-size:12px;text-transform:uppercase;letter-spacing:.08em}.course-editor-panel label{display:grid;grid-template-columns:1fr 105px;gap:8px;align-items:center;margin:7px 0;font-size:12px}.course-editor-panel input,.course-editor-panel select{width:100%;min-height:29px;border:1px solid #777;background:#151515;color:#fff;padding:4px}.course-editor-panel button{margin:8px 6px 0 0;padding:8px 10px;border:1px solid #aaa;background:#f5f4ee;color:#080808;cursor:pointer;font:700 12px Open Sans}.course-editor-panel .secondary{background:transparent;color:#f5f4ee}.course-editor-selected{outline:2px solid #1976d2!important;outline-offset:3px!important}.course-editor-panel .hint{color:#888;font-size:11px}@media(max-width:700px){.course-editor-panel{right:8px;left:8px;top:74px;width:auto}}'; document.head.append(css);
  const panel = document.createElement('aside'); panel.className = 'course-editor-panel';
  panel.innerHTML = '<h2>Редактор страницы</h2><p>Выбери текст или картинку. Изменения сохраняются только в этом браузере.</p><h3>Текст</h3><label>Шрифт<select id="editor-family"><option value="Axiforma">Axiforma — заголовки</option><option value="Open Sans">Open Sans — основной текст</option></select></label><label>Размер, px<input id="editor-size" type="number" min="10" max="160"></label><label>Толщина<select id="editor-weight"><option value="400">Regular</option><option value="500">Medium</option><option value="600">SemiBold</option><option value="700">Bold</option><option value="800">ExtraBold</option></select></label><label>Интерлиньяж<input id="editor-line" type="number" min="0.7" max="3" step="0.05"></label><label>Межбуквенное<input id="editor-letter" type="number" min="-5" max="20" step="0.1"></label><label>Выравнивание<select id="editor-align"><option value="left">Слева</option><option value="center">По центру</option><option value="right">Справа</option><option value="justify">По ширине</option></select></label><label>Цвет<input id="editor-color" type="color" value="#080808"></label><h3>Картинка</h3><p class="hint">Нажми на картинку, чтобы изменить её размер и положение.</p><label>Ширина, px<input id="image-width" type="number" min="20" max="2400"></label><label>Высота, px<input id="image-height" type="number" min="20" max="1600"></label><label>Положение X, px<input id="image-x" type="number" min="-1000" max="1000"></label><label>Положение Y, px<input id="image-y" type="number" min="-1000" max="1000"></label><label>Масштаб<input id="image-scale" type="number" min="0.1" max="4" step="0.05" value="1"></label><button id="editor-save">Сохранить</button><button class="secondary" id="editor-reset">Сбросить</button><button class="secondary" id="editor-close">Закрыть</button>';
  document.body.append(panel);
  let selected = null; const textTargets = '.gomzhin-hero h1 span,h1,h2,h3,h4,p,li,a,button,b,strong,em,small,figcaption,dt,dd,summary,.gomzhin-faq summary,.clinical-thought,.course-path-grid article > span'; const field = id => document.querySelector(`#${id}`); const hex = rgb => { const p = rgb.match(/\d+/g); return p ? `#${p.slice(0,3).map(v => Number(v).toString(16).padStart(2,'0')).join('')}` : '#080808'; };
  const choose = (el, image = false) => { page.querySelectorAll('.course-editor-selected').forEach(item => item.classList.remove('course-editor-selected')); selected = el; selected.classList.add('course-editor-selected'); if (image) { field('image-width').value = Math.round(el.getBoundingClientRect().width); field('image-height').value = Math.round(el.getBoundingClientRect().height); field('image-x').value = parseInt(el.dataset.editorX || 0, 10); field('image-y').value = parseInt(el.dataset.editorY || 0, 10); field('image-scale').value = el.dataset.editorScale || 1; } else { selected.contentEditable = 'true'; selected.focus(); const s=getComputedStyle(el); field('editor-family').value=s.fontFamily.split(',')[0].replaceAll('"','').trim(); field('editor-size').value=Math.round(parseFloat(s.fontSize)); field('editor-weight').value=s.fontWeight; field('editor-line').value=parseFloat(s.lineHeight)/parseFloat(s.fontSize); field('editor-letter').value=parseFloat(s.letterSpacing)||0; field('editor-align').value=s.textAlign; field('editor-color').value=hex(s.color); } };
  const apply = (name, value) => { if (selected && value !== '') selected.style.setProperty(name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`), value, 'important'); }; const applyImage = () => { if (!selected || selected.tagName !== 'IMG') return; const x=Number(field('image-x').value)||0,y=Number(field('image-y').value)||0,s=Number(field('image-scale').value)||1; selected.style.setProperty('width',`${field('image-width').value}px`,'important'); selected.style.setProperty('height',`${field('image-height').value}px`,'important'); selected.style.setProperty('transform',`translate(${x}px,${y}px) scale(${s})`,'important'); selected.dataset.editorX=x; selected.dataset.editorY=y; selected.dataset.editorScale=s; selected.style.setProperty('object-fit','cover','important'); };
  const bind = root => { root.querySelectorAll(textTargets).forEach(el => el.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); choose(el); })); root.querySelectorAll('summary').forEach(el => el.addEventListener('click', e => { if (!e.altKey) return; e.preventDefault(); e.stopPropagation(); choose(el); })); root.querySelectorAll('img').forEach(el => el.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); choose(el, true); })); };
  bind(page); field('editor-family').addEventListener('change', e => apply('fontFamily', e.target.value)); field('editor-size').addEventListener('input', e => apply('fontSize', `${e.target.value}px`)); field('editor-weight').addEventListener('change', e => apply('fontWeight', e.target.value)); field('editor-line').addEventListener('input', e => apply('lineHeight', e.target.value)); field('editor-letter').addEventListener('input', e => apply('letterSpacing', `${e.target.value}px`)); field('editor-align').addEventListener('change', e => apply('textAlign', e.target.value)); field('editor-color').addEventListener('input', e => apply('color', e.target.value)); ['image-width','image-height','image-x','image-y','image-scale'].forEach(id => field(id).addEventListener('input', applyImage)); field('editor-save').addEventListener('click', () => localStorage.setItem(key, page.innerHTML)); field('editor-reset').addEventListener('click', () => { localStorage.removeItem(key); location.reload(); }); field('editor-close').addEventListener('click', () => { location.href = location.pathname; });
  const saved = localStorage.getItem(key) || (location.pathname.endsWith('/course-detail.html') ? localStorage.getItem(legacyKey) : null); if (saved) { page.innerHTML = saved; page.querySelectorAll('.course-editor-selected').forEach(item => item.classList.remove('course-editor-selected')); bind(page); document.dispatchEvent(new Event('course-editor-ready')); }
})();

/* Стили, сохранённые до включения приоритета редактора, также получают приоритет. */
(() => {
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  document.querySelectorAll('.gomzhin-course [style]').forEach(node => {
    for (let index = 0; index < node.style.length; index += 1) {
      const property = node.style.item(index);
      node.style.setProperty(property, node.style.getPropertyValue(property), 'important');
    }
  });
})();

/* FAQ: редактирование вопроса и ответа без раскрытия details. */
(() => {
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  const page = document.querySelector('.gomzhin-course');
  const panel = document.querySelector('.course-editor-panel');
  if (!page || !panel) return;
  let selected = null;
  const field = id => panel.querySelector(`#${id}`);
  const hex = rgb => { const values = rgb.match(/\d+/g); return values ? `#${values.slice(0, 3).map(value => Number(value).toString(16).padStart(2, '0')).join('')}` : '#080808'; };
  const choose = element => {
    page.querySelectorAll('.course-editor-selected').forEach(item => item.classList.remove('course-editor-selected'));
    selected = element;
    selected.classList.add('course-editor-selected');
    selected.contentEditable = 'true';
    selected.focus();
    const styles = getComputedStyle(selected);
    field('editor-family').value = styles.fontFamily.split(',')[0].replaceAll('"', '').trim();
    field('editor-size').value = Math.round(parseFloat(styles.fontSize));
    field('editor-weight').value = styles.fontWeight;
    field('editor-line').value = parseFloat(styles.lineHeight) / parseFloat(styles.fontSize);
    field('editor-letter').value = parseFloat(styles.letterSpacing) || 0;
    field('editor-align').value = styles.textAlign;
    field('editor-color').value = hex(styles.color);
  };
  const apply = (property, value) => { if (selected && value !== '') selected.style.setProperty(property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`), value, 'important'); };
  page.addEventListener('click', event => {
    if (event.target.closest('.gomzhin-faq .faq-toggle')) { event.stopPropagation(); return; }
    const target = event.target.closest('.gomzhin-faq summary > span:first-child, .gomzhin-faq details > div p');
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    choose(target);
  }, true);
  field('editor-family').addEventListener('change', event => apply('fontFamily', event.target.value));
  field('editor-size').addEventListener('input', event => apply('fontSize', `${event.target.value}px`));
  field('editor-weight').addEventListener('change', event => apply('fontWeight', event.target.value));
  field('editor-line').addEventListener('input', event => apply('lineHeight', event.target.value));
  field('editor-letter').addEventListener('input', event => apply('letterSpacing', `${event.target.value}px`));
  field('editor-align').addEventListener('change', event => apply('textAlign', event.target.value));
  field('editor-color').addEventListener('input', event => apply('color', event.target.value));
})();

(() => {
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  const css = document.createElement('style');
  css.textContent = '.course-editor-code .code-label{display:block;margin:10px 0 0}.course-editor-code textarea{display:block;width:100%;min-height:180px;box-sizing:border-box;margin-top:5px;padding:8px;border:1px solid #777;background:#151515;color:#f5f4ee;resize:vertical;font:12px/1.4 Open Sans}.course-editor-code textarea#code-css{min-height:130px}.course-editor-code .hint{margin-bottom:8px}';
  document.head.append(css);
})();

/* Полное редактирование HTML и CSS блока. */
(() => {
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  const page = document.querySelector('.gomzhin-course');
  const panel = document.querySelector('.course-editor-panel');
  if (!page || !panel) return;
  const legacyCodeKey = 'dpb-course-detail-code-css-v1';
  const key = `dpb-course-editor:${location.pathname}:v1`;
  const codeKey = `dpb-course-editor-css:${location.pathname}:v1`;
  const section = document.createElement('section');
  section.className = 'course-editor-code';
  section.innerHTML = '<h3>Код страницы</h3><p class="hint">Редактируй HTML блока и дополнительные CSS-правила. Изменения сохраняются только в этом браузере.</p><label class="code-label">HTML блока<textarea id="code-html" spellcheck="false"></textarea></label><label class="code-label">CSS-правила<textarea id="code-css" spellcheck="false" placeholder=".gomzhin-course .my-block { color: red; }"></textarea></label><button id="code-apply">Применить код</button><button class="secondary" id="code-save">Сохранить код</button><button class="secondary" id="code-reset">Сбросить код</button>';
  panel.append(section);
  const htmlField = section.querySelector('#code-html');
  const cssField = section.querySelector('#code-css');
  const apply = () => { localStorage.setItem(key, htmlField.value); localStorage.setItem(codeKey, cssField.value); location.reload(); };
  section.querySelector('#code-apply').addEventListener('click', apply);
  section.querySelector('#code-save').addEventListener('click', apply);
  section.querySelector('#code-reset').addEventListener('click', () => { localStorage.removeItem(key); localStorage.removeItem(codeKey); location.reload(); });
  htmlField.value = page.innerHTML;
  cssField.value = localStorage.getItem(codeKey) || (location.pathname.endsWith('/course-detail.html') ? localStorage.getItem(legacyCodeKey) : '') || '';
  const customStyle = document.createElement('style');
  customStyle.id = 'course-editor-custom-code';
  customStyle.textContent = cssField.value;
  document.head.append(customStyle);
})();

/* Дополнительные параметры текстовой области: размер, масштаб и положение. */
(() => {
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  const panel = document.querySelector('.course-editor-panel');
  if (!panel || panel.querySelector('#text-width')) return;
  const section = document.createElement('div');
  section.innerHTML = '<h3>Текстовая область</h3><label>Ширина, px<input id="text-width" type="number" min="20" max="2400"></label><label>Высота, px<input id="text-height" type="number" min="20" max="1600"></label><label>Положение X, px<input id="text-x" type="number" min="-1000" max="1000" value="0"></label><label>Положение Y, px<input id="text-y" type="number" min="-1000" max="1000" value="0"></label><label>Масштаб<input id="text-scale" type="number" min="0.1" max="4" step="0.05" value="1"></label>';
  panel.insertBefore(section, panel.querySelector('h3:nth-of-type(2)'));
  const field = id => panel.querySelector(`#${id}`);
  const selectedText = () => document.querySelector('.course-editor-selected:not(img)');
  const sync = () => { const el = selectedText(); if (!el) return; field('text-width').value = Math.round(el.getBoundingClientRect().width); field('text-height').value = Math.round(el.getBoundingClientRect().height); field('text-x').value = el.dataset.editorTextX || 0; field('text-y').value = el.dataset.editorTextY || 0; field('text-scale').value = el.dataset.editorTextScale || 1; };
  const apply = () => { const el = selectedText(); if (!el) return; const x=Number(field('text-x').value)||0,y=Number(field('text-y').value)||0,s=Number(field('text-scale').value)||1; el.style.setProperty('display','inline-block','important'); el.style.setProperty('max-width','none','important'); el.style.setProperty('width',`${field('text-width').value}px`,'important'); el.style.setProperty('height',`${field('text-height').value}px`,'important'); el.style.setProperty('transform',`translate(${x}px,${y}px) scale(${s})`,'important'); el.dataset.editorTextX=x; el.dataset.editorTextY=y; el.dataset.editorTextScale=s; };
  ['text-width','text-height','text-x','text-y','text-scale'].forEach(id => field(id).addEventListener('input', apply));
  document.addEventListener('click', e => { if (e.target.closest('.course-editor-panel')) return; setTimeout(sync, 0); }, true);
  setTimeout(sync, 0);
})();
