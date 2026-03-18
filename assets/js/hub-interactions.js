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
      signedAs: 'Comentas como',
      message: 'Comentario',
      submit: 'Enviar comentario',
      save: 'Guardar cambios',
      edit: 'Editar',
      remove: 'Eliminar',
      cancel: 'Cancelar',
      confirmDelete: '¿Quieres eliminar este comentario?',
      sending: 'Enviando...',
      posted: 'Comentario publicado.',
      updated: 'Comentario actualizado.',
      deleted: 'Comentario eliminado.',
      error: 'No se ha podido guardar el comentario.',
    },
    en: {
      statsTitle: 'Pill activity',
      pdfViews: 'Full PDF opens',
      commentsTitle: 'Comments',
      commentsEmpty: 'There are no comments on this pill yet.',
      signedAs: 'Signed in as',
      message: 'Comment',
      submit: 'Post comment',
      save: 'Save changes',
      edit: 'Edit',
      remove: 'Delete',
      cancel: 'Cancel',
      confirmDelete: 'Do you want to delete this comment?',
      sending: 'Sending...',
      posted: 'Comment posted.',
      updated: 'Comment updated.',
      deleted: 'Comment deleted.',
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
    .hub-comment-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .hub-comment-body{white-space:pre-wrap;color:#1f2c3a;line-height:1.5}
    .hub-empty{color:#5c6b79;font-size:.95rem}
    .hub-form{display:grid;gap:10px}
    .hub-signed{font-size:.92rem;color:#5c6b79;background:#fff;border:1px solid #d8e0e8;border-radius:8px;padding:10px 12px}
    .hub-textarea{width:100%;border:1px solid #cfd8e1;border-radius:8px;padding:10px 12px;font:inherit;background:#fff;color:#1f2c3a}
    .hub-textarea{min-height:120px;resize:vertical}
    .hub-submit{justify-self:start;border:1px solid #0f5a8c;border-radius:8px;background:#0f5f94;color:#fff;padding:9px 14px;font:inherit;font-weight:600;cursor:pointer}
    .hub-secondary{justify-self:start;border:1px solid #cfd8e1;border-radius:8px;background:#fff;color:#1f2c3a;padding:9px 14px;font:inherit;font-weight:600;cursor:pointer}
    .hub-actions{display:flex;gap:10px;flex-wrap:wrap}
    .hub-submit[disabled]{opacity:.65;cursor:wait}
    .hub-status{font-size:.9rem;color:#5c6b79}
    .hub-edit{border:1px solid #d8e0e8;background:#fff;border-radius:8px;padding:5px 9px;font:inherit;font-size:.82rem;font-weight:600;color:#1f2c3a;cursor:pointer}
    .hub-delete{border-color:#e6c8c8;color:#8d2b2b}
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
      <div class="hub-signed" data-signed-as></div>
      <textarea class="hub-textarea" name="message" maxlength="1200" placeholder="${copy.message}" lang="${lang}" spellcheck="true" autocapitalize="sentences" required></textarea>
      <div class="hub-actions">
        <button class="hub-submit" type="submit">${copy.submit}</button>
        <button class="hub-secondary" type="button" data-cancel-edit hidden>${copy.cancel}</button>
      </div>
      <div class="hub-status" data-status></div>
    </form>
  `;
  main.appendChild(panel);

  const countEl = panel.querySelector('[data-pdf-count]');
  const listEl = panel.querySelector('[data-comments-list]');
  const emptyEl = panel.querySelector('[data-comments-empty]');
  const formEl = panel.querySelector('[data-comment-form]');
  const statusEl = panel.querySelector('[data-status]');
  const signedAsEl = panel.querySelector('[data-signed-as]');
  const messageEl = formEl.querySelector('textarea[name="message"]');
  const submitEl = formEl.querySelector('.hub-submit');
  const cancelEditEl = formEl.querySelector('[data-cancel-edit]');
  const pdfLink = document.querySelector('.pdf-link');
  let currentSession = null;
  let editingCommentId = null;

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB');
  }

  function canEdit(comment) {
    if (!currentSession) return false;
    if (comment.userId && currentSession.userId && comment.userId === currentSession.userId) return true;
    if (comment.email && currentSession.email && comment.email.toLowerCase() === currentSession.email.toLowerCase()) return true;
    return false;
  }

  function resetEditor() {
    editingCommentId = null;
    formEl.reset();
    submitEl.textContent = copy.submit;
    cancelEditEl.hidden = true;
    statusEl.textContent = '';
  }

  function renderComments(comments) {
    listEl.innerHTML = '';
    emptyEl.style.display = comments.length ? 'none' : '';
    comments.forEach((comment) => {
      const item = document.createElement('article');
      item.className = 'hub-comment';
      const head = document.createElement('div');
      head.className = 'hub-comment-head';
      const meta = document.createElement('div');
      meta.className = 'hub-comment-meta';
      const name = document.createElement('strong');
      name.textContent = comment.name;
      const date = document.createElement('span');
      date.textContent = formatDate(comment.updatedAt || comment.createdAt);
      meta.append(name, date);
      head.append(meta);
      if (canEdit(comment)) {
        const actions = document.createElement('div');
        actions.className = 'hub-comment-meta';
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'hub-edit';
        edit.textContent = copy.edit;
        edit.dataset.editComment = comment.id;
        edit.dataset.editMessage = comment.message;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'hub-edit hub-delete';
        remove.textContent = copy.remove;
        remove.dataset.deleteComment = comment.id;
        actions.append(edit, remove);
        head.append(actions);
      }
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

  async function loadSession() {
    const response = await fetch('/api/auth/session', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('session_failed');
    const payload = await response.json();
    currentSession = payload?.session || null;
    const name = payload?.session?.name || payload?.session?.email || '';
    signedAsEl.textContent = `${copy.signedAs}: ${name}`;
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
      message: String(formData.get('message') || '').trim(),
    };
    if (!payload.message) return;

    submitEl.disabled = true;
    cancelEditEl.disabled = true;
    submitEl.textContent = copy.sending;
    statusEl.textContent = '';
    const wasEditing = Boolean(editingCommentId);

    try {
      const response = await fetch(editingCommentId ? `/api/comments/${editingCommentId}` : '/api/comments', {
        method: editingCommentId ? 'PUT' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('request_failed');
      resetEditor();
      statusEl.textContent = wasEditing ? copy.updated : copy.posted;
      await loadComments();
    } catch (error) {
      statusEl.textContent = copy.error;
    } finally {
      submitEl.disabled = false;
      cancelEditEl.disabled = false;
      if (!editingCommentId) submitEl.textContent = copy.submit;
    }
  });

  listEl.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-edit-comment]');
    if (trigger) {
      editingCommentId = trigger.dataset.editComment;
      messageEl.value = trigger.dataset.editMessage || '';
      submitEl.textContent = copy.save;
      cancelEditEl.hidden = false;
      statusEl.textContent = '';
      messageEl.focus();
      return;
    }

    const deleteTrigger = event.target.closest('[data-delete-comment]');
    if (!deleteTrigger) return;
    if (!window.confirm(copy.confirmDelete)) return;

    fetch(`/api/comments/${deleteTrigger.dataset.deleteComment}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('request_failed');
        if (editingCommentId === deleteTrigger.dataset.deleteComment) resetEditor();
        statusEl.textContent = copy.deleted;
        await loadComments();
      })
      .catch(() => {
        statusEl.textContent = copy.error;
      });
  });

  cancelEditEl.addEventListener('click', () => {
    resetEditor();
  });

  loadSession()
    .then(() => loadComments())
    .catch(() => {
      signedAsEl.textContent = '';
      loadComments().catch(() => {});
    });
  loadStats().catch(() => {});
})();
