import { DurableObject } from "cloudflare:workers";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
    },
  });
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function cleanName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

function cleanDepartment(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function cleanEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .slice(0, 160);
}

function cleanMessage(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 1200);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getStore(env) {
  return env.HUB_DATA.getByName("hub-data");
}

function getUserIdFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 3 || parts[0] !== "api" || parts[1] !== "invited-users") return null;
  return parts[2] || null;
}

function isTogglePath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  return parts.length === 4 && parts[0] === "api" && parts[1] === "invited-users" && parts[3] === "toggle";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true });
    }

    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    const store = getStore(env);

    if (request.method === "GET" && url.pathname === "/api/comments") {
      const slug = normalizeSlug(url.searchParams.get("slug"));
      if (!slug) return json({ error: "Missing slug" }, 400);
      const comments = await store.getComments(slug);
      return json({ slug, comments });
    }

    if (request.method === "POST" && url.pathname === "/api/comments") {
      const payload = await request.json().catch(() => null);
      if (!payload) return json({ error: "Invalid JSON" }, 400);

      const slug = normalizeSlug(payload.slug);
      const name = cleanName(payload.name || "Anónimo");
      const message = cleanMessage(payload.message);

      if (!slug || !message) {
        return json({ error: "Missing slug or message" }, 400);
      }

      const comment = await store.addComment({ slug, name: name || "Anónimo", message });
      return json({ ok: true, comment }, 201);
    }

    if (request.method === "GET" && url.pathname === "/api/stats") {
      const slug = normalizeSlug(url.searchParams.get("slug"));
      if (!slug) return json({ error: "Missing slug" }, 400);
      const stats = await store.getStats(slug);
      return json({ slug, stats });
    }

    if (request.method === "POST" && url.pathname === "/api/stats/pdf-click") {
      const payload = await request.json().catch(() => null);
      if (!payload) return json({ error: "Invalid JSON" }, 400);
      const slug = normalizeSlug(payload.slug);
      if (!slug) return json({ error: "Missing slug" }, 400);
      const stats = await store.recordPdfClick(slug);
      return json({ ok: true, stats });
    }

    if (request.method === "GET" && url.pathname === "/api/invited-users") {
      const users = await store.getInvitedUsers();
      return json({ users });
    }

    if (request.method === "POST" && url.pathname === "/api/invited-users") {
      const payload = await request.json().catch(() => null);
      if (!payload) return json({ error: "Invalid JSON" }, 400);

      const name = cleanName(payload.name);
      const department = cleanDepartment(payload.department);
      const email = cleanEmail(payload.email);

      if (!name || !department || !email) {
        return json({ error: "Missing name, department or email" }, 400);
      }
      if (!isValidEmail(email)) {
        return json({ error: "Invalid email" }, 400);
      }

      const user = await store.addInvitedUser({ name, department, email });
      if (!user.ok) return json({ error: user.error }, 409);
      return json({ ok: true, user: user.user }, 201);
    }

    if (request.method === "PUT" && /^\/api\/invited-users\/.+/.test(url.pathname) && !isTogglePath(url.pathname)) {
      const userId = getUserIdFromPath(url.pathname);
      if (!userId) return json({ error: "Missing user id" }, 400);

      const payload = await request.json().catch(() => null);
      if (!payload) return json({ error: "Invalid JSON" }, 400);

      const name = cleanName(payload.name);
      const department = cleanDepartment(payload.department);
      const email = cleanEmail(payload.email);

      if (!name || !department || !email) {
        return json({ error: "Missing name, department or email" }, 400);
      }
      if (!isValidEmail(email)) {
        return json({ error: "Invalid email" }, 400);
      }

      const updated = await store.updateInvitedUser({ id: userId, name, department, email });
      if (!updated.ok) return json({ error: updated.error }, updated.error === "User not found" ? 404 : 409);
      return json({ ok: true, user: updated.user });
    }

    if (request.method === "POST" && isTogglePath(url.pathname)) {
      const userId = getUserIdFromPath(url.pathname);
      if (!userId) return json({ error: "Missing user id" }, 400);
      const toggled = await store.toggleInvitedUser(userId);
      if (!toggled.ok) return json({ error: toggled.error }, 404);
      return json({ ok: true, user: toggled.user });
    }

    return json({ error: "Not found" }, 404);
  },
};

export class HubData extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
  }

  async getComments(slug) {
    return (await this.ctx.storage.get(`comments:${slug}`)) || [];
  }

  async addComment({ slug, name, message }) {
    const key = `comments:${slug}`;
    const comments = (await this.ctx.storage.get(key)) || [];
    const comment = {
      id: crypto.randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    comments.unshift(comment);
    await this.ctx.storage.put(key, comments.slice(0, 200));
    return comment;
  }

  async getStats(slug) {
    return (await this.ctx.storage.get(`stats:${slug}`)) || { pdfViews: 0, updatedAt: null };
  }

  async recordPdfClick(slug) {
    const key = `stats:${slug}`;
    const stats = (await this.ctx.storage.get(key)) || { pdfViews: 0, updatedAt: null };
    stats.pdfViews += 1;
    stats.updatedAt = new Date().toISOString();
    await this.ctx.storage.put(key, stats);
    return stats;
  }

  async getInvitedUsers() {
    const users = (await this.ctx.storage.get("invited-users")) || [];
    return users.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
  }

  async addInvitedUser({ name, department, email }) {
    const users = (await this.ctx.storage.get("invited-users")) || [];
    const exists = users.some((user) => user.email === email);
    if (exists) return { ok: false, error: "Email already exists" };

    const now = new Date().toISOString();
    const user = {
      id: crypto.randomUUID(),
      name,
      department,
      email,
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);
    await this.ctx.storage.put("invited-users", users);
    return { ok: true, user };
  }

  async updateInvitedUser({ id, name, department, email }) {
    const users = (await this.ctx.storage.get("invited-users")) || [];
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return { ok: false, error: "User not found" };
    const duplicate = users.some((user) => user.email === email && user.id !== id);
    if (duplicate) return { ok: false, error: "Email already exists" };

    users[index] = {
      ...users[index],
      name,
      department,
      email,
      updatedAt: new Date().toISOString(),
    };
    await this.ctx.storage.put("invited-users", users);
    return { ok: true, user: users[index] };
  }

  async toggleInvitedUser(id) {
    const users = (await this.ctx.storage.get("invited-users")) || [];
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return { ok: false, error: "User not found" };

    users[index] = {
      ...users[index],
      active: !users[index].active,
      updatedAt: new Date().toISOString(),
    };
    await this.ctx.storage.put("invited-users", users);
    return { ok: true, user: users[index] };
  }
}
