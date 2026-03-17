(function () {
  const form = document.getElementById('invite-form');
  const idInput = document.getElementById('user-id');
  const nameInput = document.getElementById('name');
  const departmentInput = document.getElementById('department');
  const emailInput = document.getElementById('email');
  const formMessage = document.getElementById('form-message');
  const tableMessage = document.getElementById('table-message');
  const body = document.getElementById('users-body');
  const searchInput = document.getElementById('search');
  const resetButton = document.getElementById('reset-form');
  const exportButton = document.getElementById('export-csv');
  const totalCount = document.getElementById('total-count');
  const activeCount = document.getElementById('active-count');
  const inactiveCount = document.getElementById('inactive-count');

  let users = [];
  let filteredUsers = [];

  function setMessage(el, text, type) {
    el.textContent = text || '';
    el.className = 'message' + (type ? ' ' + type : '');
  }

  function resetForm() {
    idInput.value = '';
    form.reset();
    setMessage(formMessage, '', '');
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    const rows = [
      ['Nombre', 'Departamento', 'Email', 'Estado', 'Creado', 'Actualizado'],
      ...filteredUsers.map((user) => [
        user.name,
        user.department,
        user.email,
        user.active ? 'Activo' : 'Inactivo',
        user.createdAt || '',
        user.updatedAt || '',
      ]),
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hub_invitados.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function render() {
    const q = searchInput.value.trim().toLowerCase();
    filteredUsers = users.filter((user) => {
      const haystack = [user.name, user.department, user.email].join(' ').toLowerCase();
      return !q || haystack.includes(q);
    });

    totalCount.textContent = String(users.length);
    activeCount.textContent = String(users.filter((user) => user.active).length);
    inactiveCount.textContent = String(users.filter((user) => !user.active).length);

    body.innerHTML = '';
    if (!filteredUsers.length) {
      setMessage(tableMessage, 'No hay usuarios que coincidan con la búsqueda.', '');
      return;
    }
    setMessage(tableMessage, '', '');

    filteredUsers.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.department}</td>
        <td>${user.email}</td>
        <td><span class="status ${user.active ? 'active' : 'inactive'}">${user.active ? 'Activo' : 'Inactivo'}</span></td>
        <td>
          <div class="row-actions">
            <button class="mini" data-edit="${user.id}">Editar</button>
            <button class="mini" data-toggle="${user.id}">${user.active ? 'Desactivar' : 'Activar'}</button>
          </div>
        </td>
      `;
      body.appendChild(tr);
    });
  }

  async function loadUsers() {
    const response = await fetch('/api/invited-users');
    if (!response.ok) throw new Error('load_failed');
    const payload = await response.json();
    users = payload.users || [];
    render();
  }

  async function saveUser(payload, id) {
    const response = await fetch(id ? `/api/invited-users/${id}` : '/api/invited-users', {
      method: id ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'save_failed');
  }

  async function toggleUser(id) {
    const response = await fetch(`/api/invited-users/${id}/toggle`, { method: 'POST' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'toggle_failed');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      name: nameInput.value.trim(),
      department: departmentInput.value.trim(),
      email: emailInput.value.trim(),
    };
    try {
      await saveUser(payload, idInput.value || null);
      setMessage(formMessage, idInput.value ? 'Usuario actualizado.' : 'Usuario creado.', 'ok');
      resetForm();
      await loadUsers();
    } catch (error) {
      setMessage(formMessage, error.message === 'Email already exists' ? 'Ese email ya existe.' : 'No se ha podido guardar el usuario.', 'error');
    }
  });

  body.addEventListener('click', async (event) => {
    const editId = event.target.getAttribute('data-edit');
    const toggleId = event.target.getAttribute('data-toggle');

    if (editId) {
      const user = users.find((item) => item.id === editId);
      if (!user) return;
      idInput.value = user.id;
      nameInput.value = user.name;
      departmentInput.value = user.department;
      emailInput.value = user.email;
      setMessage(formMessage, 'Editando usuario seleccionado.', '');
      return;
    }

    if (toggleId) {
      try {
        await toggleUser(toggleId);
        await loadUsers();
      } catch (error) {
        setMessage(tableMessage, 'No se ha podido cambiar el estado del usuario.', 'error');
      }
    }
  });

  searchInput.addEventListener('input', render);
  resetButton.addEventListener('click', resetForm);
  exportButton.addEventListener('click', exportCsv);

  loadUsers().catch(() => setMessage(tableMessage, 'No se ha podido cargar la lista de invitados.', 'error'));
})();
