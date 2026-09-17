(() => {
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  if (document.querySelector('script[data-course-editor]')) return;
  const editorScript = document.createElement('script');
  editorScript.src = 'course-editor.js?v=open-sans-clean-1';
  editorScript.dataset.courseEditor = 'true';
  document.head.append(editorScript);
})();
