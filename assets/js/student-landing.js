(() => {
  const button = document.querySelector('.fyp-menu-toggle');
  const menu = document.querySelector('.fyp-menu');
  const links = [...menu.querySelectorAll('a[href*="#"]')].filter(link => link.pathname === location.pathname);
  button.hidden = false;
  document.documentElement.classList.add('fyp-js');
  function closeMenu() { button.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open'); }
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded)); menu.classList.toggle('is-open', expanded);
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') { closeMenu(); button.focus(); } });
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  let scheduled = false;
  function updateActiveSection() {
    if (!sections.length) return;
    const headerBottom = document.querySelector('.fyp-header').getBoundingClientRect().bottom + 120;
    const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= headerBottom) || sections[0];
    links.forEach(link => { if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    scheduled = false;
  }
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateActiveSection); } }, {passive: true});
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();
  const studentPath = path => ['/final-year-project-help/','/vu-cs619-project-help/','/students/projects/','/projects/intelligent-bug-hunting-platform/'].some(prefix => path.startsWith(prefix));
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href, location.href);
    if (['http:','https:'].includes(url.protocol) && (url.origin !== location.origin || !studentPath(url.pathname))) {
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', link.textContent.trim() + ' (opens in a new tab)');
    }
  });
  const request = document.querySelector('#fyp-request');
  if (!request) return;
  const fileInput = document.querySelector('#fyp-file');
  const shareButton = document.querySelector('#fyp-share-file');
  const status = document.querySelector('#fyp-file-status');
  function selectedFile() { return fileInput.files[0]; }
  fileInput.addEventListener('change', () => {
    const file = selectedFile();
    status.textContent = file ? `${file.name} selected. It has not been uploaded; attach it in WhatsApp or use the sharing menu if available.` : '';
    shareButton.hidden = !(file && navigator.canShare && navigator.canShare({files:[file]}));
  });
  request.addEventListener('submit', event => {
    event.preventDefault(); if (!request.reportValidity()) return;
    const data = new FormData(request);
    const fields = [['Name','name'],['University','university'],['Degree Program','program'],['Project Title','title'],['Project Domain','domain'],['Current Phase','phase'],['Support Required','help'],['Deadline','deadline'],['Project Link','link']];
    const lines = fields.filter(([,key])=>data.get(key)).map(([label,key])=>`${label}: ${String(data.get(key)).trim()}`);
    const file = selectedFile(); if (file) lines.push(`Document to attach in WhatsApp: ${file.name}`);
    const message = ['Hello Saif Way Tech, I need technical guidance for my university project.','',...lines].join('\n');
    const url = `https://wa.me/923146809271?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    status.textContent = file ? `Request prepared. In WhatsApp, attach ${file.name} using the attachment control, then review and send.` : 'Request prepared. Review and send it in WhatsApp.';
  });
  shareButton.addEventListener('click', async () => {
    const file = selectedFile(); if (!file || !navigator.canShare || !navigator.canShare({files:[file]})) return;
    try { await navigator.share({files:[file],title:'Student project brief'}); status.textContent = 'Sharing menu closed. Confirm in WhatsApp whether your document was sent to +92 314 6809271.'; }
    catch(error) { status.textContent = error.name === 'AbortError' ? 'Sharing cancelled. You can still attach the file directly in WhatsApp.' : 'File sharing is unavailable. Attach your document directly in WhatsApp.'; }
  });
})();
