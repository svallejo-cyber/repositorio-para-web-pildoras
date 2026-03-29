(function () {
  const STYLE_ID = 'demo-project-status-strip-style';
  const STATUS_CLASS = {
    idea: 'demo-status-badge-idea',
    in_progress: 'demo-status-badge-progress',
    working: 'demo-status-badge-working'
  };

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .demo-status-strip {
        margin: 0 0 24px;
        border: 1px solid #d8e0e8;
        border-radius: 18px;
        background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
        padding: 18px 20px;
      }
      .demo-status-strip[data-variant="home"] {
        margin-bottom: 28px;
        padding: 20px 22px;
        background: linear-gradient(180deg, #f8fbfe 0%, #edf5fb 100%);
        border-color: #cfddea;
      }
      .demo-status-strip-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      .demo-status-strip-eyebrow {
        display: block;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: #31516a;
        margin-bottom: 6px;
      }
      .demo-status-strip h3 {
        margin: 0 0 6px;
        color: #10314d;
        font-size: 22px;
        line-height: 1.15;
      }
      .demo-status-strip p {
        margin: 0;
        color: #32485b;
      }
      .demo-status-strip-links {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .demo-status-strip-links a {
        text-decoration: none;
        border-radius: 10px;
        padding: 10px 13px;
        font-size: 14px;
        font-weight: 700;
        border: 1px solid #0f5a8c;
        color: #fff;
        background: #0f5f94;
        display: inline-block;
      }
      .demo-status-strip-links a.secondary {
        background: #fff;
        color: #10314d;
        border-color: #cad8e5;
      }
      .demo-status-strip-chips {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      .demo-status-chip,
      .demo-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 999px;
        padding: 6px 11px;
        font-size: 12px;
        font-weight: 700;
        border: 1px solid transparent;
      }
      .demo-status-badge-idea { background: #eef2f6; color: #52606c; border-color: #cfd8e3; }
      .demo-status-badge-progress { background: #fff1d6; color: #8a5a00; border-color: #f0d28d; }
      .demo-status-badge-working { background: #e5f6ec; color: #0f6b3c; border-color: #9fd0b0; }
      .demo-status-strip-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }
      .demo-status-strip-item {
        border: 1px solid #d8e0e8;
        border-radius: 14px;
        background: #fff;
        padding: 14px;
        display: grid;
        gap: 8px;
      }
      .demo-status-strip-item strong {
        color: #10314d;
        font-size: 15px;
        line-height: 1.35;
      }
      .demo-status-strip-item p {
        font-size: 13px;
        color: #5c6b79;
      }
      .demo-status-strip-item a {
        text-decoration: none;
        font-weight: 700;
        color: #0f5f94;
        font-size: 13px;
      }
      .demo-status-strip-note {
        font-size: 13px;
        color: #5c6b79;
      }
      @media (max-width: 900px) {
        .demo-status-strip-list { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  function badgeClass(status) {
    return STATUS_CLASS[status] || STATUS_CLASS.idea;
  }

  function formatUpdatedAt(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function renderItem(pill) {
    return `
      <article class="demo-status-strip-item">
        <div><span class="demo-status-badge ${badgeClass(pill.status)}">${pill.statusLabel}</span></div>
        <strong>${pill.title}</strong>
        <p>${pill.author} · ${pill.statusHelper}</p>
        <a href="${pill.demoUrl}">Abrir píldora</a>
      </article>
    `;
  }

  function render(root, data) {
    const counts = data.counts || { idea: 0, in_progress: 0, working: 0 };
    const target = data.target || 20;
    const working = (data.thermometer && data.thermometer.workingCount) || counts.working || 0;
    const updatedAt = formatUpdatedAt(data.updatedAt);
    const pills = Array.isArray(data.pills) ? data.pills : [];
    const highlight = pills.filter((pill) => pill.status === 'working').slice(0, 3);
    const fallback = pills.slice(0, 3);
    const visible = (highlight.length ? highlight : fallback).slice(0, 3);
    const variant = root.dataset.projectStatusVariant || 'compact';

    root.className = 'demo-status-strip';
    root.dataset.variant = variant;
    root.innerHTML = `
      <div class="demo-status-strip-head">
        <div>
          <span class="demo-status-strip-eyebrow">Estado visible</span>
          <h3>${variant === 'home' ? 'El estado de cada proyecto ya se ve en toda la demo.' : 'Los estados de proyecto ya son visibles aquí también.'}</h3>
          <p>${variant === 'home' ? 'Cada píldora ejecutiva muestra su badge y solo WORKING empuja el termómetro del Hub.' : 'IDEA, IN PROGRESS y WORKING quedan visibles también en esta sección. Solo WORKING suma en el termómetro.'}</p>
        </div>
        <div class="demo-status-strip-links">
          <a href="/demo/termometro-ai/">Ver termómetro</a>
          <a class="secondary" href="/demo/pildoras-ejecutivas/">Abrir ejecutivas</a>
        </div>
      </div>
      <div class="demo-status-strip-chips">
        <span class="demo-status-chip demo-status-badge-idea">IDEA · ${counts.idea || 0}</span>
        <span class="demo-status-chip demo-status-badge-progress">IN PROGRESS · ${counts.in_progress || 0}</span>
        <span class="demo-status-chip demo-status-badge-working">WORKING · ${working} / ${target}</span>
      </div>
      ${visible.length ? `<div class="demo-status-strip-list">${visible.map(renderItem).join('')}</div>` : ''}
      <div class="demo-status-strip-note">${updatedAt ? `Actualizado: ${updatedAt}` : 'Aún no hay actualización registrada.'}</div>
    `;
  }

  async function load() {
    injectStyles();
    const roots = Array.from(document.querySelectorAll('[data-project-status-strip]'));
    if (!roots.length) return;
    try {
      const response = await fetch('/api/demo/thermometer', { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) throw new Error('status ' + response.status);
      const data = await response.json();
      roots.forEach((root) => render(root, data));
    } catch (error) {
      roots.forEach((root) => {
        root.className = 'demo-status-strip';
        root.innerHTML = '<p>No se ha podido cargar el estado de proyectos en esta sección.</p>';
      });
      console.error(error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load, { once: true });
  } else {
    load();
  }
})();
