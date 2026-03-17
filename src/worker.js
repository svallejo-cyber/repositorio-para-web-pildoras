import { DurableObject } from "cloudflare:workers";

const SESSION_COOKIE = "hub_session_v3";
const SESSION_MAX_AGE = 60 * 30;
const ADMIN_EMAILS = new Set(["svallejo@isaval.es"]);

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function redirect(location, status = 302, headers = {}) {
  return new Response(null, {
    status,
    headers: {
      location,
      ...headers,
    },
  });
}

function withNoStore(response) {
  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
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

function parseCookies(request) {
  const raw = request.headers.get("cookie") || "";
  const out = {};
  raw.split(";").forEach((entry) => {
    const [key, ...rest] = entry.split("=");
    if (!key) return;
    out[key.trim()] = decodeURIComponent(rest.join("=").trim());
  });
  return out;
}

function shouldUseSecureCookie(request) {
  const url = new URL(request.url);
  return url.protocol === "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1";
}

function buildSessionCookie(request, token) {
  const secure = shouldUseSecureCookie(request) ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

function clearSessionCookie(request) {
  const secure = shouldUseSecureCookie(request) ? '; Secure' : '';
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

function isPublicPath(pathname) {
  return pathname === "/login" || pathname === "/login/" || pathname === "/login/index.html";
}

function isAuthApi(pathname) {
  return pathname === "/api/auth/login" || pathname === "/api/auth/logout" || pathname === "/api/auth/session";
}

function isTrackablePath(pathname) {
  if (pathname.startsWith("/assets/")) return false;
  if (pathname.startsWith("/api/")) return false;
  return pathname.endsWith("/") || pathname.endsWith(".html") || pathname.endsWith(".pdf") || !pathname.includes(".");
}

function inferLanguage(pathname) {
  if (pathname.includes("/en/") || pathname === "/en/" || pathname.startsWith("/en")) return "en";
  return "es";
}

function isAdminEmail(email) {
  return ADMIN_EMAILS.has(String(email || "").toLowerCase());
}

function isAdminPath(pathname) {
  return pathname.startsWith("/admin/");
}

function isAdminApi(pathname) {
  return pathname === "/api/access-dashboard" || pathname.startsWith("/api/invited-users");
}

async function getAuthenticatedSession(request, store) {
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  return store.getSession(token);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const store = getStore(env);

    if (url.pathname === "/api/health") {
      return json({ ok: true });
    }

    if (isAuthApi(url.pathname)) {
      return handleAuthApi(request, url, store);
    }

    const session = await getAuthenticatedSession(request, store);

    if (url.pathname.startsWith("/api/")) {
      if (!session) return json({ error: "Unauthorized" }, 401);
      if (isAdminApi(url.pathname) && !isAdminEmail(session.email)) {
        return json({ error: "Forbidden" }, 403);
      }
      return handleApi(request, url, store, session);
    }

    if (isPublicPath(url.pathname)) {
      if (session) return redirect("/");
      const response = await env.ASSETS.fetch(request);
      return withNoStore(response);
    }

    if (!session) {
      const next = encodeURIComponent(url.pathname + url.search);
      return redirect(`/login/?next=${next}`);
    }

    if (isAdminPath(url.pathname) && !isAdminEmail(session.email)) {
      return redirect('/');
    }

    if (request.method === "GET" && isTrackablePath(url.pathname)) {
      await store.recordPageView({
        userId: session.userId,
        email: session.email,
        name: session.name,
        path: url.pathname,
        language: inferLanguage(url.pathname),
      });
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleAuthApi(request, url, store) {
  if (request.method === "GET" && url.pathname === "/api/auth/session") {
    const session = await getAuthenticatedSession(request, store);
    return json({ authenticated: Boolean(session), session: session || null });
  }

  if (request.method === "POST" && url.pathname === "/api/auth/login") {
    const payload = await request.json().catch(() => null);
    if (!payload) return json({ error: "Invalid JSON" }, 400);
    const email = cleanEmail(payload.email);
    if (!email || !isValidEmail(email)) return json({ error: "Invalid email" }, 400);

    const result = await store.loginWithEmail(email);
    if (!result.ok) return json({ error: result.error }, result.error === "Unauthorized email" ? 403 : 400);

    return json({ ok: true, user: result.user, next: payload.next || "/" }, 200, {
      "set-cookie": buildSessionCookie(request, result.token),
    });
  }

  if (request.method === "POST" && url.pathname === "/api/auth/logout") {
    const session = await getAuthenticatedSession(request, store);
    if (session) await store.deleteSession(session.token);
    return json({ ok: true }, 200, { "set-cookie": clearSessionCookie(request) });
  }

  return json({ error: "Not found" }, 404);
}

async function handleApi(request, url, store, session) {
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
    const name = cleanName(payload.name || session.name || "Anónimo");
    const message = cleanMessage(payload.message);

    if (!slug || !message) {
      return json({ error: "Missing slug or message" }, 400);
    }

    const comment = await store.addComment({ slug, name, message });
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
    await store.recordPageView({
      userId: session.userId,
      email: session.email,
      name: session.name,
      path: `pdf:${slug}`,
      language: inferLanguage(new URL(request.url).pathname),
      type: "pdf-open",
    });
    return json({ ok: true, stats });
  }

  if (request.method === "GET" && url.pathname === "/api/invited-users") {
    const users = await store.getInvitedUsers();
    return json({ users });
  }

  if (request.method === "GET" && url.pathname === "/api/access-dashboard") {
    const dashboard = await store.getAccessDashboard();
    return json(dashboard);
  }

  if (request.method === "POST" && url.pathname === "/api/invited-users") {
    const payload = await request.json().catch(() => null);
    if (!payload) return json({ error: "Invalid JSON" }, 400);

    const name = cleanName(payload.name);
    const email = cleanEmail(payload.email);
    const department = cleanDepartment(payload.department || "");

    if (!name || !email) {
      return json({ error: "Missing name or email" }, 400);
    }
    if (!isValidEmail(email)) {
      return json({ error: "Invalid email" }, 400);
    }

    const user = await store.addInvitedUser({ name, department, email });
    if (!user.ok) return json({ error: user.error }, 409);
    return json({ ok: true, user: user.user }, 201);
  }

  if (request.method === "POST" && url.pathname === "/api/invited-users/import") {
    const payload = await request.json().catch(() => null);
    if (!payload || !Array.isArray(payload.users)) return json({ error: "Invalid JSON" }, 400);

    const cleaned = [];
    for (const item of payload.users) {
      const name = cleanName(item.name || item.displayName || item["Display Name"] || "");
      const email = cleanEmail(item.email || item["E-mail Address"] || item.emailAddress || "");
      const department = cleanDepartment(item.department || "");
      if (!name || !email || !isValidEmail(email)) continue;
      cleaned.push({ name, email, department });
    }

    const result = await store.importInvitedUsers(cleaned);
    return json({ ok: true, result });
  }

  if (request.method === "PUT" && /^\/api\/invited-users\/.+/.test(url.pathname) && !isTogglePath(url.pathname)) {
    const userId = getUserIdFromPath(url.pathname);
    if (!userId) return json({ error: "Missing user id" }, 400);

    const payload = await request.json().catch(() => null);
    if (!payload) return json({ error: "Invalid JSON" }, 400);

    const name = cleanName(payload.name);
    const email = cleanEmail(payload.email);
    const department = cleanDepartment(payload.department || "");

    if (!name || !email) {
      return json({ error: "Missing name or email" }, 400);
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
}

function ensureUserMetrics(user) {
  return {
    accessCount: 0,
    firstAccessAt: null,
    lastAccessAt: null,
    lastPath: null,
    lastLanguage: null,
    ...user,
  };
}

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
    return users.map(ensureUserMetrics).sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
  }

  async getInvitedUserByEmail(email) {
    const users = await this.getInvitedUsers();
    return users.find((user) => user.email === email) || null;
  }

  async saveInvitedUsers(users) {
    await this.ctx.storage.put("invited-users", users);
  }

  async addInvitedUser({ name, department, email }) {
    const users = await this.getInvitedUsers();
    const exists = users.some((user) => user.email === email);
    if (exists) return { ok: false, error: "Email already exists" };

    const now = new Date().toISOString();
    const user = ensureUserMetrics({
      id: crypto.randomUUID(),
      name,
      department: department || "",
      email,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    users.push(user);
    await this.saveInvitedUsers(users);
    return { ok: true, user };
  }

  async importInvitedUsers(items) {
    const users = await this.getInvitedUsers();
    const emails = new Set(users.map((user) => user.email));
    let added = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    for (const item of items) {
      if (emails.has(item.email)) {
        skipped += 1;
        continue;
      }
      const user = ensureUserMetrics({
        id: crypto.randomUUID(),
        name: item.name,
        department: item.department || "",
        email: item.email,
        active: true,
        createdAt: now,
        updatedAt: now,
      });
      users.push(user);
      emails.add(item.email);
      added += 1;
    }

    await this.saveInvitedUsers(users);
    return { added, skipped, total: users.length };
  }

  async updateInvitedUser({ id, name, department, email }) {
    const users = await this.getInvitedUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return { ok: false, error: "User not found" };
    const duplicate = users.some((user) => user.email === email && user.id !== id);
    if (duplicate) return { ok: false, error: "Email already exists" };

    users[index] = {
      ...users[index],
      name,
      department: department || "",
      email,
      updatedAt: new Date().toISOString(),
    };
    await this.saveInvitedUsers(users);
    return { ok: true, user: users[index] };
  }

  async toggleInvitedUser(id) {
    const users = await this.getInvitedUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return { ok: false, error: "User not found" };

    users[index] = {
      ...users[index],
      active: !users[index].active,
      updatedAt: new Date().toISOString(),
    };
    await this.saveInvitedUsers(users);
    return { ok: true, user: users[index] };
  }

  async loginWithEmail(email) {
    const users = await this.getInvitedUsers();
    const index = users.findIndex((user) => user.email === email && user.active);
    if (index === -1) return { ok: false, error: "Unauthorized email" };

    const now = new Date().toISOString();
    const user = users[index];
    users[index] = {
      ...user,
      accessCount: (user.accessCount || 0) + 1,
      firstAccessAt: user.firstAccessAt || now,
      lastAccessAt: now,
      updatedAt: now,
    };
    await this.saveInvitedUsers(users);

    const token = crypto.randomUUID();
    const session = {
      token,
      userId: users[index].id,
      email: users[index].email,
      name: users[index].name,
      createdAt: now,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
    };
    await this.ctx.storage.put(`session:${token}`, session);
    await this.appendAccessEvent({
      type: "login",
      userId: session.userId,
      email: session.email,
      name: session.name,
      path: "/login",
      language: "es",
      at: now,
    });
    return { ok: true, token, user: users[index] };
  }

  async getSession(token) {
    const session = await this.ctx.storage.get(`session:${token}`);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await this.ctx.storage.delete(`session:${token}`);
      return null;
    }
    const user = await this.getInvitedUserByEmail(session.email);
    if (!user || !user.active) {
      await this.ctx.storage.delete(`session:${token}`);
      return null;
    }
    return { ...session, userId: user.id, email: user.email, name: user.name };
  }

  async deleteSession(token) {
    await this.ctx.storage.delete(`session:${token}`);
  }

  async recordPageView({ userId, email, name, path, language, type = "page-view" }) {
    const users = await this.getInvitedUsers();
    const index = users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        lastAccessAt: new Date().toISOString(),
        lastPath: path,
        lastLanguage: language,
        updatedAt: new Date().toISOString(),
      };
      await this.saveInvitedUsers(users);
    }
    await this.appendAccessEvent({ type, userId, email, name, path, language, at: new Date().toISOString() });
  }

  async appendAccessEvent(event) {
    const events = (await this.ctx.storage.get("access-events")) || [];
    events.unshift({ id: crypto.randomUUID(), ...event });
    await this.ctx.storage.put("access-events", events.slice(0, 500));
  }

  async getAccessDashboard() {
    const users = await this.getInvitedUsers();
    const events = (await this.ctx.storage.get("access-events")) || [];
    const sorted = [...users].sort((a, b) => {
      const ad = a.lastAccessAt ? new Date(a.lastAccessAt).getTime() : 0;
      const bd = b.lastAccessAt ? new Date(b.lastAccessAt).getTime() : 0;
      return bd - ad;
    });
    return {
      summary: {
        totalUsers: users.length,
        activeUsers: users.filter((user) => user.active).length,
        usersWithAccess: users.filter((user) => (user.accessCount || 0) > 0).length,
        totalAccesses: users.reduce((sum, user) => sum + (user.accessCount || 0), 0),
      },
      users: sorted,
      recentEvents: events.slice(0, 80),
    };
  }
}
