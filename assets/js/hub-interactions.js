(function () {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length < 3 || pathParts[0] !== 'projects') return;

  const slug = pathParts[1];
  const lang = pathParts[2] === 'en' ? 'en' : 'es';
  const main = document.querySelector('main');
  if (!main) return;

  const copy = {
    es: {
      statsTitle: 'Actividad de la píldora',
      pdfViews: 'Aperturas del PDF completo',
      commentsTitle: 'Comentarios',
      commentsEmpty: 'Todavía no hay comentarios en esta píldora.',
      name: 'Nombre',
      message: 'Comentario',
      submit: 'Enviar comentario',
      sending: 'Enviando...',
      posted: 'Comentario publicado.',
      error: 'No se ha podido guardar el comentario.',
    },
    en: {
      statsTitle: 'Pill activity',
      pdfViews: 'Full PDF opens',
      commentsTitle: 'Comments',
      commentsEmpty: 'There are no comments on this pill yet.',
      name: 'Name',
      message: 'Comment',
      submit: 'Post comment',
      sending: 'Sending...',
      posted: 'Comment posted.',
      error: 'The comment could not be saved.',
    },
  }[lang];

  const style = document.createElement('style');
  style.textContent = `
    .hub-panel{margin-top:26px;border:1px solid #d8e0e8;border-radius:12px;background:#fbfdff;padding:16px}
    .hub-panel h2{margin:0 0 12px;color:#0f5f94;font-size:1.08rem}
    .hub-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px}
    .hub-stat{border:1px solid #d8e0e8;border-radius:10px;background:#fff;padding:12px}
    .hub-stat-label{display:block;font-size:.82rem;color:#5c6b79;margin-bottom:6px}
    .hub-stat-value{font-size:1.4rem;font-weight:700;color:#1f2c3a}
    .hub-comments-list{display:grid;gap:10px;margin:12px 0 16px}
    .hub-comment{border:1px solid #d8e0e8;border-radius:10px;background:#fff;padding:12px}
    .hub-comment-head{display:flex;justify-content:space-between;gap:12px;font-size:.86rem;color:#5c6b79;margin-bottom:6px}
    .hub-comment-body{white-space:pre-wrap;color:#1f2c3a;line-height:1.5}
    .hub-empty{color:#5c6b79;font-size:.95rem}
    .hub-form{display:grid;gap:10px}
    .hub-input,.hub-textarea{width:100%;border:1px solid #cfd8e1;border-radius:8px;padding:10px 12px;font:inherit;background:#fff;color:#1f2c3a}
    .hub-textarea{min-height:120px;resize:vertical}
    .hub-submit{justify-self:start;border:1px solid #0f5a8c;border-radius:8px;background:#0f5f94;color:#fff;padding:9px 14px;font:inherit;font-weight:600;cursor:pointer}
    .hub-submit[disabled]{opacity:.65;cursor:wait}
    .hub-status{font-size:.9rem;color:#5c6b79}
  `;
  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.className = 'hub-panel';
  panel.innerHTML = `
    <h2>${copy.statsTitle}</h2>
    <div class="hub-stats">
      <div class="hub-stat">
        <span class="hub-stat-label">${copy.pdfViews}</span>
        <span class="hub-stat-value" data-pdf-count>0</span>
      </div>
    </div>
    <h2>${copy.commentsTitle}</h2>
    <div class="hub-comments-list" data-comments-list></div>
    <p class="hub-empty" data-comments-empty>${copy.commentsEmpty}</p>
    <form class="hub-form" data-comment-form>
      <input class="hub-input" name="name" maxlength="60" placeholder="${copy.name}" />
      <textarea class="hub-textarea" name="message" maxlength="1200" placeholder="${copy.message}" required></textarea>
      <button class="hub-submit" type="submit">${copy.submit}</button>
      <div class="hub-status" data-status></div>
    </form>
  `;
  main.appendChild(panel);

  const countEl = panel.querySelector('[data-pdf-count]');
  const listEl = panel.querySelector('[data-comments-list]');
  const emptyEl = panel.querySelector('[data-comments-empty]');
  const formEl = panel.querySelector('[data-comment-form]');
  const statusEl = panel.querySelector('[data-status]');
  const pdfLink = document.querySelector('.pdf-link');

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB');
  }

  function renderComments(comments) {
    listEl.innerHTML = '';
    emptyEl.style.display = comments.length ? 'none' : '';
    comments.forEach((comment) => {
      const item = document.createElement('article');
      item.className = 'hub-comment';
      const head = document.createElement('div');
      head.className = 'hub-comment-head';
      const name = document.createElement('strong');
      name.textContent = comment.name;
      const date = document.createElement('span');
      date.textContent = formatDate(comment.createdAt);
      head.append(name, date);
      const body = document.createElement('div');
      body.className = 'hub-comment-body';
      body.textContent = comment.message;
      item.append(head, body);
      listEl.appendChild(item);
    });
  }

  async function loadStats() {
    const response = await fetch(`/api/stats?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) return;
    const payload = await response.json();
    countEl.textContent = String(payload.stats?.pdfViews || 0);
  }

  async function loadComments() {
    const response = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) return;
    const payload = await response.json();
    renderComments(payload.comments || []);
  }

  if (pdfLink) {
    pdfLink.addEventListener('click', () => {
      fetch('/api/stats/pdf-click', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).then(loadStats).catch(() => {});
    });
  }

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(formEl);
    const payload = {
      slug,
      name: String(formData.get('name') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };
    if (!payload.message) return;

    const button = formEl.querySelector('button');
    button.disabled = true;
    button.textContent = copy.sending;
    statusEl.textContent = '';

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('request_failed');
      formEl.reset();
      statusEl.textContent = copy.posted;
      await loadComments();
    } catch (error) {
      statusEl.textContent = copy.error;
    } finally {
      button.disabled = false;
      button.textContent = copy.submit;
    }
  });

  loadStats().catch(() => {});
  loadComments().catch(() => {});
})();
