(function () {
  const summaryEl = document.getElementById('summary');
  const usersBody = document.getElementById('users-body');
  const eventsBody = document.getElementById('events-body');
  const statusEl = document.getElementById('status');

  function fmtDate(value) {
    if (!value) return '-';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString('es-ES');
  }

  function stat(label, value) {
    return `<div class="stat"><small>${label}</small><strong>${value}</strong></div>`;
  }

  async function load() {
    const response = await fetch('/api/access-dashboard');
    if (!response.ok) throw new Error('load_failed');
    const data = await response.json();

    summaryEl.innerHTML = [
      stat('Usuarios totales', data.summary.totalUsers || 0),
      stat('Usuarios activos', data.summary.activeUsers || 0),
      stat('Usuarios con accesos', data.summary.usersWithAccess || 0),
      stat('Accesos acumulados', data.summary.totalAccesses || 0),
    ].join('');

    usersBody.innerHTML = '';
    (data.users || []).forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.accessCount || 0}</td>
        <td>${fmtDate(user.lastAccessAt)}</td>
        <td class="muted">${user.lastPath || '-'}</td>
        <td>${user.lastLanguage || '-'}</td>
      `;
      usersBody.appendChild(tr);
    });

    eventsBody.innerHTML = '';
    (data.recentEvents || []).forEach((event) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${fmtDate(event.at)}</td>
        <td>${event.name || event.email || '-'}</td>
        <td>${event.type || '-'}</td>
        <td class="muted">${event.path || '-'}</td>
        <td>${event.language || '-'}</td>
      `;
      eventsBody.appendChild(tr);
    });

    statusEl.textContent = `Actualizado: ${fmtDate(new Date().toISOString())}`;
  }

  load().catch(() => {
    statusEl.textContent = 'No se ha podido cargar el dashboard de accesos.';
  });
})();
