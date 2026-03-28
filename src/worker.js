import { DurableObject } from "cloudflare:workers";

const SESSION_COOKIE = "hub_session_v3";
const ADMIN_SESSION_COOKIE = "admin_session_v1";
const SESSION_MAX_AGE = 60 * 30;
const ADMIN_EMAILS = new Set(["svallejoi@icloud.com"]);
const EXCLUDED_TRACKING_EMAILS = new Set(["svallejo@isaval.es", "svallejoi@icloud.com"]);
const NOTIFICATION_TIMEZONE = "Europe/Madrid";
const DEFAULT_HUB_BASE_URL = "https://repositorio-para-web-pildoras.svallejo-351.workers.dev";
const DEFAULT_INVITED_AVATARS = {
  "svallejo@isaval.es": "/assets/profile/santiago2-360.jpg",
  "lmerelo@isaval.es": "/assets/profile/luis2-360.jpg",
  "jvalencia@isaval.es": "/assets/profile/javi2-360.jpg",
  "ssoriano@isaval.es": "/assets/profile/silvia-soriano-2-320.jpg",
  "jcnunez@isaval.es": "/assets/profile/juan-carlos-nunez-360.jpg",
  "eprieto@isaval.es": "/assets/profile/eva-prieto-360.jpg",
  "mvillaverde@isaval.es": "/assets/profile/marcos-villaverde-360.jpg",
  "dvillafranca@isaval.es": "/assets/profile/david-villafranca-360.jpg",
  "mvallejo@isaval.es": "/assets/profile/maria-vallejo-360.jpg",
  "jcgarrigos@isaval.es": "/assets/profile/jose-carlos-garrigos-360.jpg",
  "lmestre@isaval.es": "/assets/profile/laura-mestre-360.jpg",
  "lcatraux@isaval.es": "/assets/profile/luc-catraux-360.jpg",
  "bgonzalez@isaval.es": "/assets/profile/beatriz-gonzalez-360.jpg",
  "jruano@isaval.es": "/assets/profile/jorge-ruano-360.jpg",
  "dsevilla@isaval.es": "/assets/profile/david-sevilla-360.jpg",
  "shuertas@isaval.es": "/assets/profile/sergio-huertas-360.jpg",
  "josemartinez@isaval.es": "/assets/profile/jose-martinez-360.jpg",
  "mlopez@isaval.es": "/assets/profile/mariangeles-lopez-360.jpg",
};
const PUBLISHED_PILLS = [
  { slug: "tenantflow", lang: "es", type: "executive", title: "TenantFlow", author: "Santiago Vallejo", authorEmail: "svallejo@isaval.es", avatar: "/assets/profile/santiago2-360.jpg", publishedAt: "2026-03-07T23:18:44Z", urlPath: "/projects/tenantflow/es/" },
  { slug: "pildora-1", lang: "es", type: "executive", title: "Algo grande está pasando", author: "Santiago Vallejo", authorEmail: "svallejo@isaval.es", avatar: "/assets/profile/santiago2-360.jpg", publishedAt: "2026-03-11T19:11:50Z", urlPath: "/projects/pildora-1/es/" },
  { slug: "pildora-2", lang: "es", type: "executive", title: "La ventaja no es tener IA", author: "Santiago Vallejo", authorEmail: "svallejo@isaval.es", avatar: "/assets/profile/santiago2-360.jpg", publishedAt: "2026-03-11T19:22:12Z", urlPath: "/projects/pildora-2/es/" },
  { slug: "pildora-3", lang: "es", type: "executive", title: "EL DATO", author: "Santiago Vallejo", authorEmail: "svallejo@isaval.es", avatar: "/assets/profile/santiago2-360.jpg", publishedAt: "2026-03-07T23:07:31Z", urlPath: "/projects/pildora-3/es/" },
  { slug: "pildora-4", lang: "es", type: "executive", title: "Publicación web", author: "Santiago Vallejo", authorEmail: "svallejo@isaval.es", avatar: "/assets/profile/santiago2-360.jpg", publishedAt: "2026-03-07T23:07:31Z", urlPath: "/projects/pildora-4/es/" },
  { slug: "pildora-5", lang: "es", type: "executive", title: "IA y control de gastos", author: "Santiago Vallejo", authorEmail: "svallejo@isaval.es", avatar: "/assets/profile/santiago2-360.jpg", publishedAt: "2026-03-11T23:58:07Z", urlPath: "/projects/pildora-5/es/" },
  { slug: "pildora-6", lang: "es", type: "executive", title: "IA: no va de escribir bonito", author: "Santiago Vallejo", authorEmail: "svallejo@isaval.es", avatar: "/assets/profile/santiago2-360.jpg", publishedAt: "2026-03-17T19:48:13Z", urlPath: "/projects/pildora-6/es/" },
  { slug: "colaborativa-1", lang: "es", type: "collaborative", title: "Del pliego al dato útil", author: "Luis Merelo", authorEmail: "lmerelo@isaval.es", avatar: "/assets/profile/luis2-360.jpg", publishedAt: "2026-03-14T12:33:48Z", urlPath: "/projects/colaborativa-1/es/" },
  { slug: "colaborativa-2", lang: "es", type: "collaborative", title: "De la factura al criterio de gestión", author: "Javier Valencia", authorEmail: "jvalencia@isaval.es", avatar: "/assets/profile/javi2-360.jpg", publishedAt: "2026-03-17T16:48:17Z", urlPath: "/projects/colaborativa-2/es/" },
  { slug: "colaborativa-3", lang: "es", type: "collaborative", title: "De Excel a dashboard OEE", author: "Silvia Soriano", authorEmail: "ssoriano@isaval.es", avatar: "/assets/profile/silvia-soriano-2-320.jpg", publishedAt: "2026-03-17T17:04:26Z", urlPath: "/projects/colaborativa-3/es/" },
  { slug: "colaborativa-4", lang: "es", type: "collaborative", title: "De la factura al criterio de control", author: "Juan Carlos Nuñez", authorEmail: "jcnunez@isaval.es", avatar: "/assets/profile/juan-carlos-nunez-360.jpg", publishedAt: "2026-03-18T20:30:00Z", urlPath: "/projects/colaborativa-4/es/" },
  { slug: "colaborativa-5", lang: "es", type: "collaborative", title: "Del proyecto a la evidencia", author: "Eva Prieto Martínez", authorEmail: "eprieto@isaval.es", avatar: "/assets/profile/eva-prieto-360.jpg", publishedAt: "2026-03-20T18:00:00Z", urlPath: "/projects/colaborativa-5/es/" },
  { slug: "colaborativa-6", lang: "es", type: "collaborative", title: "De la visión manual al pulso diario", author: "Marcos Villaverde Fontán", authorEmail: "mvillaverde@isaval.es", avatar: "/assets/profile/marcos-villaverde-360.jpg", publishedAt: "2026-03-20T19:00:00Z", urlPath: "/projects/colaborativa-6/es/" },
  { slug: "colaborativa-7", lang: "es", type: "collaborative", title: "Del monitoreo a la inteligencia sectorial", author: "David Villafranca Gayo", authorEmail: "dvillafranca@isaval.es", avatar: "/assets/profile/david-villafranca-360.jpg", publishedAt: "2026-03-21T10:00:00Z", urlPath: "/projects/colaborativa-7/es/" },
  { slug: "colaborativa-8", lang: "es", type: "collaborative", title: "De la pregunta estratégica a la respuesta con datos", author: "María Vallejo", authorEmail: "mvallejo@isaval.es", avatar: "/assets/profile/maria-vallejo-360.jpg", publishedAt: "2026-03-23T08:00:00Z", urlPath: "/projects/colaborativa-8/es/" },
  { slug: "colaborativa-9", lang: "es", type: "collaborative", title: "De la ficha de seguridad al documento de transporte", author: "José Carlos Garrigós", authorEmail: "jcgarrigos@isaval.es", avatar: "/assets/profile/jose-carlos-garrigos-360.jpg", publishedAt: "2026-03-24T12:00:00Z", urlPath: "/projects/colaborativa-9/es/" },
  { slug: "colaborativa-10", lang: "es", type: "collaborative", title: "Del pedido disperso al flujo integrado", author: "José Carlos Garrigós", authorEmail: "jcgarrigos@isaval.es", avatar: "/assets/profile/jose-carlos-garrigos-360.jpg", publishedAt: "2026-03-25T08:00:00Z", urlPath: "/projects/colaborativa-10/es/" },
  { slug: "colaborativa-11", lang: "es", type: "collaborative", title: "Del onboarding puntual a una incorporación que permanece", author: "Laura Mestre", authorEmail: "lmestre@isaval.es", avatar: "/assets/profile/laura-mestre-360.jpg", publishedAt: "2026-03-25T09:00:00Z", urlPath: "/projects/colaborativa-11/es/" },
  { slug: "colaborativa-12", lang: "es", type: "collaborative", title: "De la misión comercial a la prospección inteligente de mercados", author: "Luc Catraux", authorEmail: "lcatraux@isaval.es", avatar: "/assets/profile/luc-catraux-360.jpg", publishedAt: "2026-03-26T09:00:00Z", urlPath: "/projects/colaborativa-12/es/" },
  { slug: "colaborativa-13", lang: "es", type: "collaborative", title: "De la incidencia dispersa al SAT con memoria y anticipación", author: "Beatriz González", authorEmail: "bgonzalez@isaval.es", avatar: "/assets/profile/beatriz-gonzalez-360.jpg", publishedAt: "2026-03-26T10:00:00Z", urlPath: "/projects/colaborativa-13/es/" },
  { slug: "colaborativa-14", lang: "es", type: "collaborative", title: "Del ajuste por memoria al ayudante de control de calidad", author: "Jorge Ruano", authorEmail: "jruano@isaval.es", avatar: "/assets/profile/jorge-ruano-360.jpg", publishedAt: "2026-03-26T15:00:00Z", urlPath: "/projects/colaborativa-14/es/" },
  { slug: "colaborativa-15", lang: "es", type: "collaborative", title: "De la coordinación verbal al envasado planificado con inteligencia operativa", author: "David Sevilla", authorEmail: "dsevilla@isaval.es", avatar: "/assets/profile/david-sevilla-360.jpg", publishedAt: "2026-03-26T16:30:00Z", urlPath: "/projects/colaborativa-15/es/" },
  { slug: "colaborativa-16", lang: "es", type: "collaborative", title: "De la evolución de costes al criterio técnico con alertas", author: "Sergio Huertas", authorEmail: "shuertas@isaval.es", avatar: "/assets/profile/sergio-huertas-360.jpg", publishedAt: "2026-03-26T17:15:00Z", urlPath: "/projects/colaborativa-16/es/" },
  { slug: "colaborativa-17", lang: "es", type: "collaborative", title: "Del descuento discrecional al control comercial trazable", author: "José Martínez", authorEmail: "josemartinez@isaval.es", avatar: "/assets/profile/jose-martinez-360.jpg", publishedAt: "2026-03-26T23:55:00Z", urlPath: "/projects/colaborativa-17/es/" },
  { slug: "colaborativa-18", lang: "es", type: "collaborative", title: "Del impago disperso al expediente único con trazabilidad", author: "Mª Ángeles López", authorEmail: "mlopez@isaval.es", avatar: "/assets/profile/mariangeles-lopez-360.jpg", publishedAt: "2026-03-28T09:48:00Z", urlPath: "/projects/colaborativa-18/es/" },
];
const COLLABORATIVE_PILLS = PUBLISHED_PILLS.filter((item) => item.type === "collaborative");

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

function parseSlugList(raw) {
  return String(raw || "")
    .split(",")
    .map((item) => normalizeSlug(item))
    .filter(Boolean);
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

function cleanAvatar(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.startsWith("data:image/")) return text.slice(0, 500_000);
  if (text.startsWith("/")) return text.slice(0, 260);
  return "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getHubBaseUrl(env) {
  return String(env.HUB_BASE_URL || DEFAULT_HUB_BASE_URL).replace(/\/+$/, "");
}

function formatDateTime(iso, timeZone = NOTIFICATION_TIMEZONE) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("es-ES", {
    timeZone,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

function getZonedParts(date, timeZone = NOTIFICATION_TIMEZONE) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: String(parts.weekday || "").toLowerCase(),
  };
}

function getLocalDateKey(date, timeZone = NOTIFICATION_TIMEZONE) {
  const parts = getZonedParts(date, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function getLocalWeekStartDateKey(date, timeZone = NOTIFICATION_TIMEZONE) {
  const parts = getZonedParts(date, timeZone);
  const weekdayMap = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
  const offset = weekdayMap[parts.weekday] ?? 0;
  return getLocalDateKey(subtractDays(date, offset), timeZone);
}

function subtractDays(date, days) {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function getCommentIdFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 3 || parts[0] !== "api" || parts[1] !== "comments") return null;
  return parts[2] || null;
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

function buildSessionCookie(request, token, cookieName = SESSION_COOKIE) {
  const secure = shouldUseSecureCookie(request) ? '; Secure' : '';
  return `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

function clearSessionCookie(request, cookieName = SESSION_COOKIE) {
  const secure = shouldUseSecureCookie(request) ? '; Secure' : '';
  return `${cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

function isPublicPath(pathname) {
  return pathname === "/login" || pathname === "/login/" || pathname === "/login/index.html";
}

function isAdminPublicPath(pathname) {
  return pathname === "/admin/login" || pathname === "/admin/login/" || pathname === "/admin/login/index.html";
}

function isAuthApi(pathname) {
  return pathname === "/api/auth/login" || pathname === "/api/auth/logout" || pathname === "/api/auth/session";
}

function isAdminAuthApi(pathname) {
  return pathname === "/api/admin-auth/login" || pathname === "/api/admin-auth/logout" || pathname === "/api/admin-auth/session";
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

function isTrackingExcludedEmail(email) {
  return EXCLUDED_TRACKING_EMAILS.has(String(email || "").toLowerCase());
}

function isAdminPath(pathname) {
  return pathname.startsWith("/admin/");
}

function isAdminApi(pathname) {
  return pathname === "/api/access-dashboard" || pathname.startsWith("/api/invited-users") || pathname.startsWith("/api/admin-notifications");
}

function isPublicApi(pathname) {
  return pathname === "/api/collaborative-podium";
}

function isAdminAssetPath(pathname) {
  return pathname === "/assets/js/access-dashboard.js" || pathname === "/assets/js/invited-users-admin.js";
}

function isAdminMaintenanceApi(pathname) {
  return pathname === "/api/admin-maintenance/purge-excluded-accesses";
}

async function getAuthenticatedSession(request, store) {
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  return store.getSession(token);
}

async function getAdminAuthenticatedSession(request, store) {
  const cookies = parseCookies(request);
  const token = cookies[ADMIN_SESSION_COOKIE];
  if (!token) return null;
  return store.getAdminSession(token);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const store = getStore(env);

    if (url.pathname === "/api/health") {
      return json({ ok: true });
    }

    if (isAdminAuthApi(url.pathname)) {
      return handleAdminAuthApi(request, url, store);
    }

    const adminSession = await getAdminAuthenticatedSession(request, store);

    if (isAdminPublicPath(url.pathname)) {
      if (adminSession) return redirect("/admin/");
      const response = await env.ASSETS.fetch(request);
      return withNoStore(response);
    }

    if (isAdminAssetPath(url.pathname)) {
      if (!adminSession) {
        const next = encodeURIComponent(url.pathname + url.search);
        return redirect(`/admin/login/?next=${next}`);
      }
      const response = await env.ASSETS.fetch(request);
      return withNoStore(response);
    }

    if (isAdminPath(url.pathname) || isAdminApi(url.pathname) || isAdminMaintenanceApi(url.pathname)) {
      if (!adminSession) {
        const next = encodeURIComponent(url.pathname + url.search);
        if (url.pathname.startsWith("/api/")) return json({ error: "Unauthorized" }, 401);
        return redirect(`/admin/login/?next=${next}`);
      }
      if (url.pathname.startsWith("/api/")) {
        if (isAdminMaintenanceApi(url.pathname)) {
          return handleAdminMaintenanceApi(request, url, store);
        }
        return handleApi(request, url, store, adminSession, env);
      }
      const response = await env.ASSETS.fetch(request);
      return withNoStore(response);
    }

    if (isAuthApi(url.pathname)) {
      return handleAuthApi(request, url, store);
    }

    const session = await getAuthenticatedSession(request, store);

    if (isPublicApi(url.pathname)) {
      return handlePublicApi(request, url, store);
    }

    if (url.pathname.startsWith("/api/")) {
      if (!session) return json({ error: "Unauthorized" }, 401);
      return handleApi(request, url, store, session, env);
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

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(handleScheduled(controller, env));
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

async function handleAdminAuthApi(request, url, store) {
  if (request.method === "GET" && url.pathname === "/api/admin-auth/session") {
    const session = await getAdminAuthenticatedSession(request, store);
    return json({ authenticated: Boolean(session), session: session || null });
  }

  if (request.method === "POST" && url.pathname === "/api/admin-auth/login") {
    const payload = await request.json().catch(() => null);
    if (!payload) return json({ error: "Invalid JSON" }, 400);
    const email = cleanEmail(payload.email);
    if (!email || !isValidEmail(email)) return json({ error: "Invalid email" }, 400);
    if (!isAdminEmail(email)) return json({ error: "Unauthorized email" }, 403);

    const result = await store.loginAdminWithEmail(email);
    if (!result.ok) return json({ error: result.error }, 400);

    return json({ ok: true, user: result.user, next: payload.next || "/admin/" }, 200, {
      "set-cookie": buildSessionCookie(request, result.token, ADMIN_SESSION_COOKIE),
    });
  }

  if (request.method === "POST" && url.pathname === "/api/admin-auth/logout") {
    const session = await getAdminAuthenticatedSession(request, store);
    if (session) await store.deleteAdminSession(session.token);
    return json({ ok: true }, 200, { "set-cookie": clearSessionCookie(request, ADMIN_SESSION_COOKIE) });
  }

  return json({ error: "Not found" }, 404);
}

async function handleAdminMaintenanceApi(request, url, store) {
  if (request.method === "POST" && url.pathname === "/api/admin-maintenance/purge-excluded-accesses") {
    const result = await store.purgeExcludedAccesses(Array.from(EXCLUDED_TRACKING_EMAILS));
    return json({ ok: true, result });
  }
  return json({ error: "Not found" }, 404);
}

async function handlePublicApi(request, url, store) {
  if (request.method === "GET" && url.pathname === "/api/collaborative-podium") {
    const lang = url.searchParams.get("lang") === "en" ? "en" : "es";
    const podium = await store.getCollaborativePodium(lang);
    return json(podium);
  }
  return json({ error: "Not found" }, 404);
}

async function handleApi(request, url, store, session, env) {
  if (request.method === "GET" && url.pathname === "/api/recent-comments") {
    const lang = url.searchParams.get("lang") === "en" ? "en" : "es";
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 40)));
    const comments = await store.getRecentComments({ lang, limit, hubBaseUrl: getHubBaseUrl(env) });
    return json({ lang, comments });
  }

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
    const message = cleanMessage(payload.message);

    if (!slug || !message) {
      return json({ error: "Missing slug or message" }, 400);
    }

    const comment = await store.addComment({
      slug,
      userId: session.userId,
      email: session.email,
      name: cleanName(session.name || "Anónimo"),
      message,
    });
    return json({ ok: true, comment }, 201);
  }

  if (request.method === "PUT" && /^\/api\/comments\/.+/.test(url.pathname)) {
    const commentId = getCommentIdFromPath(url.pathname);
    if (!commentId) return json({ error: "Missing comment id" }, 400);
    const payload = await request.json().catch(() => null);
    if (!payload) return json({ error: "Invalid JSON" }, 400);

    const slug = normalizeSlug(payload.slug);
    const message = cleanMessage(payload.message);
    if (!slug || !message) {
      return json({ error: "Missing slug or message" }, 400);
    }

    const updated = await store.updateComment({
      slug,
      commentId,
      userId: session.userId,
      email: session.email,
      message,
    });
    if (!updated.ok) {
      const status = updated.error === "Comment not found" ? 404 : updated.error === "Forbidden" ? 403 : 400;
      return json({ error: updated.error }, status);
    }
    return json({ ok: true, comment: updated.comment });
  }

  if (request.method === "DELETE" && /^\/api\/comments\/.+/.test(url.pathname)) {
    const commentId = getCommentIdFromPath(url.pathname);
    if (!commentId) return json({ error: "Missing comment id" }, 400);
    const payload = await request.json().catch(() => null);
    if (!payload) return json({ error: "Invalid JSON" }, 400);

    const slug = normalizeSlug(payload.slug);
    if (!slug) {
      return json({ error: "Missing slug" }, 400);
    }

    const deleted = await store.deleteComment({
      slug,
      commentId,
      userId: session.userId,
      email: session.email,
    });
    if (!deleted.ok) {
      const status = deleted.error === "Comment not found" ? 404 : deleted.error === "Forbidden" ? 403 : 400;
      return json({ error: deleted.error }, status);
    }
    return json({ ok: true });
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

  if (request.method === "GET" && url.pathname === "/api/admin-notifications/preview") {
    const kind = String(url.searchParams.get("kind") || "").trim().toLowerCase();
    const forceLatest = url.searchParams.get("force_latest") === "1";
    const slugs = parseSlugList(url.searchParams.get("slugs"));
    const now = new Date();
    if (kind === "initial-hub") {
      const preview = await store.buildInitialHubAnnouncement({
        now,
        timeZone: env.NOTIFY_TIMEZONE || NOTIFICATION_TIMEZONE,
        hubBaseUrl: getHubBaseUrl(env),
      });
      return json({ ok: true, kind, preview });
    }
    if (kind === "daily-pills") {
      const preview = await store.buildDailyPublicationNotifications({
        now,
        timeZone: env.NOTIFY_TIMEZONE || NOTIFICATION_TIMEZONE,
        hubBaseUrl: getHubBaseUrl(env),
        forceLatest,
        slugs,
      });
      return json({ ok: true, kind, preview });
    }
    if (kind === "weekly-comments") {
      const preview = await store.buildWeeklyCommentDigests({
        now,
        timeZone: env.NOTIFY_TIMEZONE || NOTIFICATION_TIMEZONE,
        hubBaseUrl: getHubBaseUrl(env),
      });
      return json({ ok: true, kind, preview });
    }
    return json({ error: "Invalid kind" }, 400);
  }

  if (request.method === "GET" && url.pathname === "/api/admin-notifications/status") {
    const status = await store.getNotificationAdminStatus();
    return json({ ok: true, status });
  }

  if (request.method === "POST" && url.pathname === "/api/admin-notifications/send-initial") {
    const preview = await store.buildInitialHubAnnouncement({
      now: new Date(),
      timeZone: env.NOTIFY_TIMEZONE || NOTIFICATION_TIMEZONE,
      hubBaseUrl: getHubBaseUrl(env),
    });

    if (!preview.recipients.length) {
      return json({ error: "No active recipients" }, 400);
    }

    const result = await sendMailViaGraph({
      env,
      senderEmail: cleanEmail(env.NOTIFY_SENDER_EMAIL || "svallejo@isaval.es"),
      to: [cleanEmail(env.NOTIFY_SENDER_EMAIL || "svallejo@isaval.es")],
      bcc: preview.recipients,
      subject: preview.subject,
      html: preview.html,
      text: preview.text,
    });

    if (!result.ok) {
      await store.logNotificationRun({
        kind: "initial-hub",
        status: "error",
        at: new Date().toISOString(),
        detail: result.error,
      });
      return json({ error: result.error }, 500);
    }

    await store.markInitialAnnouncementSent({
      at: new Date().toISOString(),
      recipients: preview.recipients.length,
      pills: preview.pills.length,
    });
    await store.logNotificationRun({
      kind: "initial-hub",
      status: "sent",
      at: new Date().toISOString(),
      detail: `Recipients: ${preview.recipients.length}. Pills: ${preview.pills.length}.`,
    });
    return json({ ok: true, sent: true, recipients: preview.recipients.length, pills: preview.pills.length });
  }

  if (request.method === "POST" && url.pathname === "/api/admin-notifications/mark-sent") {
    const payload = await request.json().catch(() => null);
    if (!payload) return json({ error: "Invalid JSON" }, 400);
    const kind = String(payload.kind || "").trim().toLowerCase();
    const at = new Date().toISOString();

    if (kind === "initial-hub") {
      const recipients = Number(payload.recipients || 0);
      const pills = Number(payload.pills || 0);
      await store.markInitialAnnouncementSent({ at, recipients, pills });
      await store.logNotificationRun({
        kind,
        status: "sent-local",
        at,
        detail: `Recipients: ${recipients}. Pills: ${pills}. Sender: iCloud SMTP.`,
      });
      return json({ ok: true });
    }

    if (kind === "daily-pills") {
      const notificationKeys = Array.isArray(payload.notificationKeys) ? payload.notificationKeys.map(String) : [];
      if (!notificationKeys.length) return json({ error: "Missing notification keys" }, 400);
      await store.markPillsNotified(notificationKeys);
      await store.logNotificationRun({
        kind,
        status: "sent-local",
        at,
        detail: `Pills: ${notificationKeys.length}. Sender: iCloud SMTP.`,
      });
      return json({ ok: true });
    }

    if (kind === "weekly-comments") {
      const commentIds = Array.isArray(payload.commentIds) ? payload.commentIds.map(String) : [];
      if (!commentIds.length) return json({ error: "Missing comment ids" }, 400);
      await store.markCommentsDigested(commentIds);
      await store.logNotificationRun({
        kind,
        status: "sent-local",
        at,
        detail: `Comments: ${commentIds.length}. Sender: iCloud SMTP.`,
      });
      return json({ ok: true });
    }

    return json({ error: "Invalid kind" }, 400);
  }

  if (request.method === "POST" && url.pathname === "/api/invited-users") {
    const payload = await request.json().catch(() => null);
    if (!payload) return json({ error: "Invalid JSON" }, 400);

    const name = cleanName(payload.name);
    const email = cleanEmail(payload.email);
    const department = cleanDepartment(payload.department || "");
    const avatar = cleanAvatar(payload.avatar || "");

    if (!name || !email) {
      return json({ error: "Missing name or email" }, 400);
    }
    if (!isValidEmail(email)) {
      return json({ error: "Invalid email" }, 400);
    }

    const user = await store.addInvitedUser({ name, department, email, avatar });
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
      const avatar = cleanAvatar(item.avatar || "");
      if (!name || !email || !isValidEmail(email)) continue;
      cleaned.push({ name, email, department, avatar });
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
    const avatar = cleanAvatar(payload.avatar || "");

    if (!name || !email) {
      return json({ error: "Missing name or email" }, 400);
    }
    if (!isValidEmail(email)) {
      return json({ error: "Invalid email" }, 400);
    }

    const updated = await store.updateInvitedUser({ id: userId, name, department, email, avatar });
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

async function handleScheduled(controller, env) {
  const store = getStore(env);
  const now = new Date(controller.scheduledTime || Date.now());
  const timeZone = env.NOTIFY_TIMEZONE || NOTIFICATION_TIMEZONE;
  const parts = getZonedParts(now, timeZone);

  if (parts.minute !== 0 || parts.hour !== 8) {
    return;
  }

  if (env.M365_NOTIFICATIONS_ENABLED !== "true") {
    console.log("Notifications skipped: M365_NOTIFICATIONS_ENABLED is not true");
    return;
  }

  const senderEmail = cleanEmail(env.NOTIFY_SENDER_EMAIL || "svallejo@isaval.es");
  const hubBaseUrl = getHubBaseUrl(env);

  await sendDailyPublicationNotifications({ env, store, now, timeZone, hubBaseUrl, senderEmail });

  if (parts.weekday === "mon") {
    await sendWeeklyCommentDigests({ env, store, now, timeZone, hubBaseUrl, senderEmail });
  }
}

async function sendDailyPublicationNotifications({ env, store, now, timeZone, hubBaseUrl, senderEmail }) {
  const preview = await store.buildDailyPublicationNotifications({ now, timeZone, hubBaseUrl });
  if (!preview.recipients.length || !preview.pills.length) {
    await store.logNotificationRun({
      kind: "daily-pills",
      status: "skipped",
      at: new Date().toISOString(),
      detail: !preview.pills.length ? "No pending pills" : "No active recipients",
    });
    return;
  }

  const result = await sendMailViaGraph({
    env,
    senderEmail,
    to: [senderEmail],
    bcc: preview.recipients,
    subject: preview.subject,
    html: preview.html,
    text: preview.text,
  });

  if (!result.ok) {
    await store.logNotificationRun({
      kind: "daily-pills",
      status: "error",
      at: new Date().toISOString(),
      detail: result.error,
    });
    throw new Error(result.error);
  }

  await store.markPillsNotified(preview.pills.map((pill) => pill.notificationKey));
  await store.logNotificationRun({
    kind: "daily-pills",
    status: "sent",
    at: new Date().toISOString(),
    detail: `Recipients: ${preview.recipients.length}. Pills: ${preview.pills.length}.`,
  });
}

async function sendWeeklyCommentDigests({ env, store, now, timeZone, hubBaseUrl, senderEmail }) {
  const digests = await store.buildWeeklyCommentDigests({ now, timeZone, hubBaseUrl });
  if (!digests.length) {
    await store.logNotificationRun({
      kind: "weekly-comments",
      status: "skipped",
      at: new Date().toISOString(),
      detail: "No pending comment digests",
    });
    return;
  }

  const sentCommentIds = [];
  for (const digest of digests) {
    const result = await sendMailViaGraph({
      env,
      senderEmail,
      to: [digest.authorEmail],
      subject: digest.subject,
      html: digest.html,
      text: digest.text,
    });

    if (!result.ok) {
      await store.logNotificationRun({
        kind: "weekly-comments",
        status: "error",
        at: new Date().toISOString(),
        detail: `${digest.authorEmail}: ${result.error}`,
      });
      throw new Error(result.error);
    }

    sentCommentIds.push(...digest.commentIds);
  }

  await store.markCommentsDigested(sentCommentIds);
  await store.logNotificationRun({
    kind: "weekly-comments",
    status: "sent",
    at: new Date().toISOString(),
    detail: `Authors: ${digests.length}. Comments: ${sentCommentIds.length}.`,
  });
}

async function sendMailViaGraph({ env, senderEmail, to = [], bcc = [], subject, html, text }) {
  const tenantId = env.M365_TENANT_ID;
  const clientId = env.M365_CLIENT_ID;
  const clientSecret = env.M365_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    return { ok: false, error: "Missing Microsoft 365 Graph credentials" };
  }

  const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      scope: "https://graph.microsoft.com/.default",
    }),
  });

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text();
    return { ok: false, error: `Graph token request failed (${tokenResponse.status}): ${detail}` };
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return { ok: false, error: "Graph token response did not include access_token" };
  }

  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: html,
        },
        toRecipients: to.map((email) => ({ emailAddress: { address: email } })),
        bccRecipients: bcc.map((email) => ({ emailAddress: { address: email } })),
      },
      saveToSentItems: true,
    }),
  });

  if (response.status !== 202) {
    const detail = await response.text();
    return { ok: false, error: `Graph sendMail failed (${response.status}): ${detail}` };
  }

  return { ok: true };
}

function ensureUserMetrics(user) {
  const fallbackAvatar = DEFAULT_INVITED_AVATARS[cleanEmail(user?.email)] || "";
  return {
    accessCount: 0,
    firstAccessAt: null,
    lastAccessAt: null,
    lastPath: null,
    lastLanguage: null,
    ...user,
    avatar: cleanAvatar(user?.avatar) || fallbackAvatar,
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

  async addComment({ slug, userId, email, name, message }) {
    const key = `comments:${slug}`;
    const comments = (await this.ctx.storage.get(key)) || [];
    const comment = {
      id: crypto.randomUUID(),
      userId: userId || null,
      email: email || null,
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    comments.unshift(comment);
    await this.ctx.storage.put(key, comments.slice(0, 200));
    return comment;
  }

  async updateComment({ slug, commentId, userId, email, message }) {
    const key = `comments:${slug}`;
    const comments = (await this.ctx.storage.get(key)) || [];
    const index = comments.findIndex((comment) => comment.id === commentId);
    if (index === -1) return { ok: false, error: "Comment not found" };

    const target = comments[index];
    const matchesUserId = target.userId && userId && target.userId === userId;
    const matchesEmail = target.email && email && String(target.email).toLowerCase() === String(email).toLowerCase();
    if (!matchesUserId && !matchesEmail) return { ok: false, error: "Forbidden" };

    comments[index] = {
      ...target,
      message,
      updatedAt: new Date().toISOString(),
    };
    await this.ctx.storage.put(key, comments);
    return { ok: true, comment: comments[index] };
  }

  async deleteComment({ slug, commentId, userId, email }) {
    const key = `comments:${slug}`;
    const comments = (await this.ctx.storage.get(key)) || [];
    const index = comments.findIndex((comment) => comment.id === commentId);
    if (index === -1) return { ok: false, error: "Comment not found" };

    const target = comments[index];
    const matchesUserId = target.userId && userId && target.userId === userId;
    const matchesEmail = target.email && email && String(target.email).toLowerCase() === String(email).toLowerCase();
    if (!matchesUserId && !matchesEmail) return { ok: false, error: "Forbidden" };

    comments.splice(index, 1);
    await this.ctx.storage.put(key, comments);
    return { ok: true };
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

  async addInvitedUser({ name, department, email, avatar }) {
    const users = await this.getInvitedUsers();
    const exists = users.some((user) => user.email === email);
    if (exists) return { ok: false, error: "Email already exists" };

    const now = new Date().toISOString();
    const user = ensureUserMetrics({
      id: crypto.randomUUID(),
      name,
      department: department || "",
      email,
      avatar: cleanAvatar(avatar || ""),
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
        avatar: cleanAvatar(item.avatar || ""),
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

  async updateInvitedUser({ id, name, department, email, avatar }) {
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
      avatar: cleanAvatar(avatar || ""),
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
    users[index] = isTrackingExcludedEmail(email)
      ? { ...user, updatedAt: now }
      : {
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
    if (!isTrackingExcludedEmail(session.email)) {
      await this.appendAccessEvent({
        type: "login",
        userId: session.userId,
        email: session.email,
        name: session.name,
        path: "/login",
        language: "es",
        at: now,
      });
    }
    return { ok: true, token, user: users[index] };
  }

  async loginAdminWithEmail(email) {
    const now = new Date().toISOString();
    const token = crypto.randomUUID();
    const session = {
      token,
      email,
      name: email,
      createdAt: now,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
    };
    await this.ctx.storage.put(`admin-session:${token}`, session);
    return { ok: true, token, user: { email, name: email } };
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

  async getAdminSession(token) {
    const session = await this.ctx.storage.get(`admin-session:${token}`);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await this.ctx.storage.delete(`admin-session:${token}`);
      return null;
    }
    if (!isAdminEmail(session.email)) {
      await this.ctx.storage.delete(`admin-session:${token}`);
      return null;
    }
    return session;
  }

  async deleteAdminSession(token) {
    await this.ctx.storage.delete(`admin-session:${token}`);
  }

  async recordPageView({ userId, email, name, path, language, type = "page-view" }) {
    if (isTrackingExcludedEmail(email)) {
      return;
    }
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

  async getCollaborativePodium(lang = "es") {
    const items = COLLABORATIVE_PILLS.filter((item) => item.lang === lang);
    const byAuthor = new Map();
    for (const item of items) {
      const current = byAuthor.get(item.author) || {
        author: item.author,
        avatar: item.avatar,
        count: 0,
        latestPublishedAt: item.publishedAt,
        latestTitle: item.title,
        slugs: [],
      };
      current.count += 1;
      current.slugs.push(item.slug);
      if (new Date(item.publishedAt).getTime() >= new Date(current.latestPublishedAt).getTime()) {
        current.latestPublishedAt = item.publishedAt;
        current.latestTitle = item.title;
        current.avatar = item.avatar || current.avatar;
      }
      byAuthor.set(item.author, current);
    }
    const ranking = Array.from(byAuthor.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      const at = new Date(a.latestPublishedAt).getTime();
      const bt = new Date(b.latestPublishedAt).getTime();
      if (bt !== at) return bt - at;
      return a.author.localeCompare(b.author, "es", { sensitivity: "base" });
    });
    return {
      lang,
      updatedAt: new Date().toISOString(),
      ranking,
      podium: ranking.slice(0, 3),
      commentMotors: await this.getCommentMotors(),
    };
  }

  async getNotificationState() {
    return (await this.ctx.storage.get("notification-state")) || { notifiedPills: {}, digestedComments: {}, runs: [], initialAnnouncement: null };
  }

  async saveNotificationState(state) {
    await this.ctx.storage.put("notification-state", state);
  }

  async markPillsNotified(keys) {
    const state = await this.getNotificationState();
    const now = new Date().toISOString();
    for (const key of keys) {
      state.notifiedPills[key] = now;
    }
    await this.saveNotificationState(state);
  }

  async markCommentsDigested(commentIds) {
    const state = await this.getNotificationState();
    const now = new Date().toISOString();
    for (const commentId of commentIds) {
      state.digestedComments[commentId] = now;
    }
    await this.saveNotificationState(state);
  }

  async logNotificationRun(entry) {
    const state = await this.getNotificationState();
    const runs = Array.isArray(state.runs) ? state.runs : [];
    runs.unshift({ id: crypto.randomUUID(), ...entry });
    state.runs = runs.slice(0, 100);
    await this.saveNotificationState(state);
  }

  async markInitialAnnouncementSent(payload) {
    const state = await this.getNotificationState();
    state.initialAnnouncement = payload;
    await this.saveNotificationState(state);
  }

  async getNotificationAdminStatus() {
    const state = await this.getNotificationState();
    return {
      initialAnnouncement: state.initialAnnouncement || null,
      recentRuns: Array.isArray(state.runs) ? state.runs.slice(0, 20) : [],
    };
  }

  async getActiveRecipientEmails() {
    const users = await this.getInvitedUsers();
    return users
      .filter((user) => user.active)
      .map((user) => cleanEmail(user.email))
      .filter(Boolean)
      .filter((email, index, all) => all.indexOf(email) === index);
  }

  async buildDailyPublicationNotifications({ now, timeZone, hubBaseUrl, forceLatest = false, slugs = [] }) {
    const state = await this.getNotificationState();
    const todayKey = getLocalDateKey(now, timeZone);
    const publishedEsPills = PUBLISHED_PILLS.filter((pill) => pill.lang === "es");
    const slugSet = new Set((slugs || []).map((item) => normalizeSlug(item)).filter(Boolean));
    const pendingPills = publishedEsPills.filter((pill) => {
      if (pill.lang !== "es") return false;
      const publishedDate = new Date(pill.publishedAt);
      const publishedKey = getLocalDateKey(publishedDate, timeZone);
      const notificationKey = `${pill.slug}:${pill.lang}`;
      return publishedKey < todayKey && !state.notifiedPills[notificationKey];
    });
    const selectedPills = slugSet.size
      ? publishedEsPills.filter((pill) => slugSet.has(pill.slug))
      : (forceLatest
        ? publishedEsPills.slice().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 1)
        : pendingPills);
    const pills = selectedPills
      .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
      .map((pill) => ({
        ...pill,
        notificationKey: `${pill.slug}:${pill.lang}`,
        publishedLabel: formatDateTime(pill.publishedAt, timeZone),
        absoluteUrl: `${hubBaseUrl}${pill.urlPath}`,
      }));

    const recipients = await this.getActiveRecipientEmails();
    const subject = pills.length === 1
      ? `Nueva píldora en el Hub IA Isaval · ${pills[0].title}`
      : `Nuevas píldoras en el Hub IA Isaval · ${pills.length} publicaciones`;

    const htmlItems = pills.map((pill) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #d9e3ec;">
          <div style="font:600 15px Arial,sans-serif;color:#1f2c3a;">${escapeHtml(pill.title)}</div>
          <div style="font:13px Arial,sans-serif;color:#5c6b79;margin-top:4px;">${escapeHtml(pill.author)} · ${pill.type === "collaborative" ? "Píldora colaborativa" : "Píldora ejecutiva"} · Publicada el ${escapeHtml(pill.publishedLabel)}</div>
          <div style="margin-top:8px;"><a href="${escapeHtml(pill.absoluteUrl)}" style="color:#0f5f94;font:600 13px Arial,sans-serif;text-decoration:none;">Abrir en el Hub</a></div>
        </td>
      </tr>`).join("");

    const html = `
      <div style="background:#f4f7fa;padding:32px 20px;">
        <table role="presentation" style="max-width:720px;width:100%;margin:0 auto;background:#ffffff;border:1px solid #d8e0e8;border-radius:14px;padding:0;border-collapse:separate;">
          <tr><td bgcolor="#10314d" style="padding:26px 28px;background-color:#10314d;background-image:linear-gradient(110deg,#10314d 0%,#0f5f94 56%,#1577af 100%);color:#ffffff;border-radius:14px 14px 0 0;">
            <div style="font:700 12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:.9;">Hub IA Isaval</div>
            <div style="font:700 34px Georgia,serif;line-height:1.15;margin-top:8px;">Nueva publicación interna</div>
            <div style="font:400 17px Arial,sans-serif;line-height:1.5;margin-top:10px;opacity:.95;">Se han incorporado nuevas piezas al repositorio interno de píldoras sobre IA.</div>
          </td></tr>
          <tr><td style="padding:26px 28px;">
            <table role="presentation" style="width:100%;border-collapse:collapse;">${htmlItems}</table>
            <p style="font:14px Arial,sans-serif;color:#5c6b79;line-height:1.6;margin:18px 0 0;">Acceso directo al Hub: <a href="${escapeHtml(hubBaseUrl)}" style="color:#0f5f94;text-decoration:none;">${escapeHtml(hubBaseUrl)}</a></p>
            <p style="font:14px Arial,sans-serif;color:#5c6b79;line-height:1.6;margin:12px 0 0;">Este aviso se genera automáticamente a las 08:00 del día siguiente a cada publicación.</p>
          </td></tr>
        </table>
      </div>`;

    const textLines = [
      "Equipo,",
      "",
      "Se han incorporado nuevas piezas al Hub IA Isaval:",
      "",
      ...pills.flatMap((pill) => [
        `- ${pill.title}`,
        `  ${pill.author} · ${pill.type === "collaborative" ? "Píldora colaborativa" : "Píldora ejecutiva"} · ${pill.publishedLabel}`,
        `  ${pill.absoluteUrl}`,
      ]),
      "",
      `Acceso al Hub: ${hubBaseUrl}`,
    ];

    return { kind: "daily-pills", recipients, pills, subject, html, text: textLines.join("\n") };
  }

  async buildInitialHubAnnouncement({ now, timeZone, hubBaseUrl }) {
    const pills = PUBLISHED_PILLS
      .filter((pill) => pill.lang === "es")
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "executive" ? -1 : 1;
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      })
      .map((pill, index, all) => {
        const withinTypeIndex = all.filter((candidate) => candidate.type === pill.type && new Date(candidate.publishedAt).getTime() <= new Date(pill.publishedAt).getTime()).length;
        return {
          ...pill,
          publishedLabel: formatDateTime(pill.publishedAt, timeZone),
          absoluteUrl: `${hubBaseUrl}${pill.urlPath}`,
          ordinal: withinTypeIndex,
        };
      });

    const executive = pills.filter((pill) => pill.type === "executive");
    const collaborative = pills.filter((pill) => pill.type === "collaborative");
    const recipients = await this.getActiveRecipientEmails();
    const subject = "Hub IA Isaval · Píldoras ya publicadas";

    const executiveHtml = executive.map((pill, index) => `
      <tr>
        <td style="padding:14px 0;border-top:1px solid #dfe6ed;">
          <div style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1f2c3a;">${index + 1}. ${escapeHtml(pill.title)}</div>
          <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#536271;margin-top:6px;">${escapeHtml(this.getInitialDescription(pill.slug))}</div>
          <div style="margin-top:8px;"><a href="${escapeHtml(pill.absoluteUrl)}" style="font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#0f5f94;text-decoration:none;">Abrir en el Hub</a></div>
        </td>
      </tr>`).join("");

    const collaborativeHtml = collaborative.map((pill) => `
      <tr>
        <td style="padding:14px 0;border-top:1px solid #dfe6ed;">
          <div style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1f2c3a;">${escapeHtml(pill.author)} · ${escapeHtml(pill.title)}</div>
          <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#536271;margin-top:6px;">${escapeHtml(this.getInitialDescription(pill.slug))}</div>
          <div style="margin-top:8px;"><a href="${escapeHtml(pill.absoluteUrl)}" style="font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#0f5f94;text-decoration:none;">Abrir en el Hub</a></div>
        </td>
      </tr>`).join("");

    const html = `<!doctype html>
<html lang="es"><body style="margin:0;padding:0;background:#f3f6f9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="720" cellpadding="0" cellspacing="0" style="width:720px;max-width:720px;background:#ffffff;border:1px solid #d8e0e8;border-radius:14px;overflow:hidden;">
        <tr><td bgcolor="#10314d" style="padding:28px 32px;background-color:#10314d;background-image:linear-gradient(110deg,#10314d 0%,#0f5f94 56%,#1577af 100%);color:#ffffff;">
          <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;opacity:.9;">Hub IA Isaval</div>
          <div style="font-family:Georgia,serif;font-size:42px;line-height:1.1;font-weight:700;margin-top:10px;">Píldoras ya publicadas</div>
          <div style="font-family:Arial,sans-serif;font-size:18px;line-height:1.5;margin-top:12px;max-width:560px;opacity:.95;">Reunimos en un solo envío todas las piezas disponibles hasta ahora para que podáis localizarlas y entrar directamente en las que más os interesen.</div>
        </td></tr>
        <tr><td style="padding:28px 32px 8px 32px;"><div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#425466;">Equipo,<br><br>Comparto en un único envío las píldoras que ya están disponibles en el Hub interno de IA de Isaval.<br><br>La idea es sencilla: que tengáis localizadas, en un solo correo, todas las piezas publicadas hasta ahora y podáis entrar directamente en aquellas que más os interesen.</div></td></tr>
        <tr><td style="padding:0 32px 24px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #d6e4ef;background:#f3f8fd;border-radius:10px;">
            <tr><td style="padding:14px 16px;">
              <div style="font-family:Arial,sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:#2e5875;margin-bottom:6px;">Acceso al Hub</div>
              <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;"><a href="${escapeHtml(hubBaseUrl)}" style="color:#0f5f94;text-decoration:none;font-weight:600;">${escapeHtml(hubBaseUrl.replace(/^https?:\/\//, ""))}</a></div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 10px 32px;"><div style="font-family:Arial,sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:#2e5875;margin-bottom:10px;">Píldoras ejecutivas</div></td></tr>
        <tr><td style="padding:0 32px 0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${executiveHtml}</table></td></tr>
        <tr><td style="padding:26px 32px 10px 32px;"><div style="font-family:Arial,sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:#2e5875;margin-bottom:10px;">Píldoras colaborativas del equipo</div></td></tr>
        <tr><td style="padding:0 32px 8px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${collaborativeHtml}</table></td></tr>
        <tr><td style="padding:24px 32px 32px 32px;"><div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#536271;">A partir de aquí, los siguientes avisos se limitarán a comunicar únicamente las nuevas píldoras que se vayan incorporando al repositorio.<br><br>Un saludo,<br>Santiago Vallejo</div></td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const text = [
      "Equipo,",
      "",
      "Comparto en un único envío las píldoras que ya están disponibles en el Hub interno de IA de Isaval.",
      "",
      "Acceso al Hub:",
      hubBaseUrl,
      "",
      "Píldoras ejecutivas",
      ...executive.flatMap((pill, index) => [
        `${index + 1}. ${pill.title}`,
        `   ${this.getInitialDescription(pill.slug)}`,
        `   ${pill.absoluteUrl}`,
      ]),
      "",
      "Píldoras colaborativas del equipo",
      ...collaborative.flatMap((pill) => [
        `${pill.author} · ${pill.title}`,
        `   ${this.getInitialDescription(pill.slug)}`,
        `   ${pill.absoluteUrl}`,
      ]),
      "",
      "A partir de aquí, los siguientes avisos se limitarán a comunicar únicamente las nuevas píldoras que se vayan incorporando al repositorio.",
      "",
      "Un saludo,",
      "Santiago Vallejo",
    ].join("\n");

    return { kind: "initial-hub", recipients, pills, subject, html, text };
  }

  getInitialDescription(slug) {
    const descriptions = {
      tenantflow: "Caso práctico de construcción de una aplicación funcional con ayuda de Codex.",
      "pildora-1": "Punto de partida del proyecto: por qué la IA exige ya una lectura estratégica.",
      "pildora-2": "La ventaja estructural está en convertir datos propios en decisiones y aprendizaje.",
      "pildora-3": "Por qué sin dato correcto, cuidado y gobernado no hay IA con valor sostenido.",
      "pildora-4": "Cómo convertir reflexión propia en una pieza web publicable dentro del Hub.",
      "pildora-5": "Primer caso real de aplicación operativa de IA en Pinturas Isaval.",
      "pildora-6": "Por qué el verdadero impacto de la IA no está en redactar mejor, sino en cambiar cómo se trabaja.",
      "colaborativa-1": "Lectura asistida de licitaciones orientada a oportunidad comercial.",
      "colaborativa-2": "Uso de IA para transformar documentación financiera en lectura útil para decisión.",
      "colaborativa-3": "Caso práctico de visualización operativa y mejora de lectura productiva.",
      "colaborativa-4": "Revisión de tarifas de transporte para convertir la factura en un criterio de control más útil y escalable.",
      "colaborativa-5": "Repositorio vivo de casos de éxito para convertir la experiencia acumulada en marketing, ventas y conocimiento reutilizable.",
      "colaborativa-6": "Cuadro de mando operativo para leer carga, rendimiento, ocupación y capacidad diaria en almacén con mayor anticipación.",
      "colaborativa-7": "Sistema de clipping estructurado para convertir actualidad sectorial en inteligencia útil para dirección y activación comercial.",
      "colaborativa-8": "Herramientas navegables para responder preguntas estratégicas con datos consolidados sobre red comercial y competencia.",
      "colaborativa-9": "Automatización documental para convertir datos regulatorios de fichas de seguridad en documentos de transporte marítimo y aéreo desde el ERP.",
      "colaborativa-10": "Automatización del flujo de exportación para transformar pedidos heterogéneos en entradas ERP y documentos comerciales y logísticos conectados.",
      "colaborativa-11": "Onboarding estructurado para convertir información dispersa de incorporación en una experiencia homogénea, accesible y mantenible en el tiempo.",
      "colaborativa-12": "Herramienta de inteligencia de mercado para seleccionar países objetivo con mejor base comparativa antes de activar misiones y prospección internacional.",
      "colaborativa-13": "Digitalización del SAT para estructurar incidencias, ganar trazabilidad y preparar una capa de IA orientada a alertas, patrones y respuesta técnica homogénea.",
      "colaborativa-14": "Ayudante de control de calidad para convertir histórico de fabricaciones en recomendaciones de ajuste más rápidas, homogéneas y fiables.",
      "colaborativa-15": "Planificación operativa inteligente para ordenar lotes, tareas y prioridades de envasado a partir de datos reales de planta y aprendizaje progresivo.",
      "colaborativa-16": "Aplicación de evolución de costes para formular con más trazabilidad, detectar desviaciones antes y convertir histórico técnico en criterio económico usable.",
      "colaborativa-17": "Control automático de descuentos en apertura de clientes para proteger margen, homogeneizar criterio comercial y dejar trazabilidad auditable por tipología.",
      "colaborativa-18": "Expediente único de impagados para centralizar devoluciones, documentos y actuaciones con apertura inicial automática y trazabilidad completa del caso.",
    };
    return descriptions[slug] || "";
  }

  async buildWeeklyCommentDigests({ now, timeZone, hubBaseUrl }) {
    const state = await this.getNotificationState();
    const currentWeekStartKey = getLocalWeekStartDateKey(now, timeZone);
    const entries = await this.ctx.storage.list({ prefix: "comments:" });
    const byAuthor = new Map();

    for (const [key, comments] of entries) {
      const slug = String(key).replace(/^comments:/, "");
      const pill = PUBLISHED_PILLS.find((item) => item.slug === slug && item.lang === "es");
      if (!pill?.authorEmail) continue;

      for (const comment of comments || []) {
        if (!comment?.id || state.digestedComments[comment.id]) continue;
        const createdAt = comment.createdAt ? new Date(comment.createdAt) : null;
        if (!createdAt) continue;
        if (getLocalDateKey(createdAt, timeZone) >= currentWeekStartKey) continue;

        const authorKey = cleanEmail(pill.authorEmail);
        const bucket = byAuthor.get(authorKey) || {
          author: pill.author,
          authorEmail: authorKey,
          items: [],
          commentIds: [],
        };
        bucket.items.push({
          slug,
          pillTitle: pill.title,
          pillUrl: `${hubBaseUrl}${pill.urlPath}`,
          commenterName: comment.name || comment.email || "Comentario sin firma",
          commenterEmail: comment.email || null,
          message: comment.message || "",
          createdAt: comment.createdAt,
          createdLabel: formatDateTime(comment.createdAt, timeZone),
        });
        bucket.commentIds.push(comment.id);
        byAuthor.set(authorKey, bucket);
      }
    }

    return Array.from(byAuthor.values())
      .map((digest) => {
        digest.items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const grouped = digest.items.reduce((acc, item) => {
          const group = acc.get(item.slug) || { title: item.pillTitle, url: item.pillUrl, comments: [] };
          group.comments.push(item);
          acc.set(item.slug, group);
          return acc;
        }, new Map());

        const groups = Array.from(grouped.values());
        const htmlGroups = groups.map((group) => {
          const commentsHtml = group.comments.map((item) => `
            <li style="margin:0 0 12px 0;">
              <div style="font:600 14px Arial,sans-serif;color:#1f2c3a;">${escapeHtml(item.commenterName)} · ${escapeHtml(item.createdLabel)}</div>
              <div style="font:14px Arial,sans-serif;color:#455463;line-height:1.6;margin-top:4px;">${escapeHtml(item.message)}</div>
            </li>`).join("");
          return `
            <div style="margin:0 0 18px 0;padding:16px;border:1px solid #d8e0e8;border-radius:12px;background:#fbfdff;">
              <div style="font:700 16px Arial,sans-serif;color:#1f2c3a;">${escapeHtml(group.title)}</div>
              <div style="margin-top:6px;"><a href="${escapeHtml(group.url)}" style="color:#0f5f94;font:600 13px Arial,sans-serif;text-decoration:none;">Abrir píldora</a></div>
              <ul style="padding-left:18px;margin:14px 0 0;">${commentsHtml}</ul>
            </div>`;
        }).join("");

        const html = `
          <div style="background:#f4f7fa;padding:32px 20px;">
            <table role="presentation" style="max-width:720px;width:100%;margin:0 auto;background:#ffffff;border:1px solid #d8e0e8;border-radius:14px;border-collapse:separate;">
              <tr><td bgcolor="#10314d" style="padding:26px 28px;background-color:#10314d;background-image:linear-gradient(110deg,#10314d 0%,#0f5f94 56%,#1577af 100%);color:#ffffff;border-radius:14px 14px 0 0;">
                <div style="font:700 12px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:.9;">Hub IA Isaval</div>
                <div style="font:700 34px Georgia,serif;line-height:1.15;margin-top:8px;">Resumen semanal de comentarios</div>
                <div style="font:400 17px Arial,sans-serif;line-height:1.5;margin-top:10px;opacity:.95;">Comentarios nuevos registrados en tus píldoras durante la semana cerrada.</div>
              </td></tr>
              <tr><td style="padding:26px 28px;">${htmlGroups}
                <p style="font:14px Arial,sans-serif;color:#5c6b79;line-height:1.6;margin:18px 0 0;">Acceso al Hub: <a href="${escapeHtml(hubBaseUrl)}" style="color:#0f5f94;text-decoration:none;">${escapeHtml(hubBaseUrl)}</a></p>
              </td></tr>
            </table>
          </div>`;

        const text = [
          `${digest.author},`,
          "",
          "Estos son los comentarios nuevos registrados en tus píldoras:",
          "",
          ...groups.flatMap((group) => [
            group.title,
            ...group.comments.flatMap((item) => [
              `- ${item.commenterName} · ${item.createdLabel}`,
              `  ${item.message}`,
            ]),
            `  ${group.url}`,
            "",
          ]),
          `Acceso al Hub: ${hubBaseUrl}`,
        ].join("\n");

        return {
          ...digest,
          subject: `Resumen semanal · Comentarios en tus píldoras del Hub IA`,
          html,
          text,
        };
      })
      .sort((a, b) => a.author.localeCompare(b.author, "es", { sensitivity: "base" }));
  }

  async getCommentMotors() {
    const entries = await this.ctx.storage.list({ prefix: "comments:" });
    const byUser = new Map();

    for (const [, comments] of entries) {
      for (const comment of comments || []) {
        const email = String(comment.email || "").toLowerCase();
        if (!email || isTrackingExcludedEmail(email)) continue;
        const key = comment.userId || email;
        const current = byUser.get(key) || {
          userId: comment.userId || null,
          email,
          name: comment.name || email,
          count: 0,
          latestCommentAt: comment.updatedAt || comment.createdAt || null,
        };
        current.count += 1;
        const currentTime = current.latestCommentAt ? new Date(current.latestCommentAt).getTime() : 0;
        const commentTime = (comment.updatedAt || comment.createdAt) ? new Date(comment.updatedAt || comment.createdAt).getTime() : 0;
        if (commentTime >= currentTime) {
          current.latestCommentAt = comment.updatedAt || comment.createdAt || current.latestCommentAt;
          current.name = comment.name || current.name;
          current.email = email || current.email;
        }
        byUser.set(key, current);
      }
    }

    return Array.from(byUser.values())
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        const at = a.latestCommentAt ? new Date(a.latestCommentAt).getTime() : 0;
        const bt = b.latestCommentAt ? new Date(b.latestCommentAt).getTime() : 0;
        if (bt !== at) return bt - at;
        return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
      })
      .slice(0, 3);
  }

  async getRecentComments({ lang = "es", limit = 40, hubBaseUrl }) {
    const entries = await this.ctx.storage.list({ prefix: "comments:" });
    const pillsBySlug = new Map(PUBLISHED_PILLS.filter((pill) => pill.lang === "es").map((pill) => [pill.slug, pill]));
    const items = [];

    for (const [key, comments] of entries) {
      const slug = String(key).replace(/^comments:/, "");
      const pill = pillsBySlug.get(slug);
      if (!pill) continue;

      for (const comment of comments || []) {
        const timestamp = comment.updatedAt || comment.createdAt || null;
        if (!timestamp) continue;
        items.push({
          id: comment.id,
          slug,
          pillTitle: pill.title,
          pillType: pill.type,
          pillAuthor: pill.author,
          pillUrl: `${hubBaseUrl}/projects/${slug}/${lang}/`,
          commenterName: comment.name || comment.email || "Comentario sin firma",
          commenterEmail: comment.email || null,
          message: comment.message || "",
          createdAt: comment.createdAt || null,
          updatedAt: comment.updatedAt || null,
          timestamp,
        });
      }
    }

    return items
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async getAccessDashboard() {
    await this.purgeExcludedAccesses(Array.from(EXCLUDED_TRACKING_EMAILS));
    const users = (await this.getInvitedUsers()).filter((user) => !isTrackingExcludedEmail(user.email));
    const events = ((await this.ctx.storage.get("access-events")) || []).filter((event) => !isTrackingExcludedEmail(event.email));
    const sorted = [...users].sort((a, b) => {
      const ad = a.lastAccessAt ? new Date(a.lastAccessAt).getTime() : 0;
      const bd = b.lastAccessAt ? new Date(b.lastAccessAt).getTime() : 0;
      return bd - ad;
    });
    const totalUsers = users.length;
    const usersWithAccess = users.filter((user) => (user.accessCount || 0) > 0).length;
    const usersWithoutAccess = Math.max(totalUsers - usersWithAccess, 0);
    const accessBuckets = [
      { key: "0", label: "0 accesos", count: users.filter((user) => (user.accessCount || 0) === 0).length },
      { key: "1", label: "1 acceso", count: users.filter((user) => (user.accessCount || 0) === 1).length },
      { key: "2-3", label: "2-3 accesos", count: users.filter((user) => (user.accessCount || 0) >= 2 && (user.accessCount || 0) <= 3).length },
      { key: "4-7", label: "4-7 accesos", count: users.filter((user) => (user.accessCount || 0) >= 4 && (user.accessCount || 0) <= 7).length },
      { key: "8+", label: "8 o más", count: users.filter((user) => (user.accessCount || 0) >= 8).length },
    ].map((bucket) => ({
      ...bucket,
      percentage: totalUsers ? Number(((bucket.count / totalUsers) * 100).toFixed(1)) : 0,
    }));

    const eventsByDayMap = new Map();
    const pageViewCount = events.filter((event) => event.type === "page-view").length;
    const pdfOpenCount = events.filter((event) => event.type === "pdf-open").length;
    const loginCount = events.filter((event) => event.type === "login").length;
    for (let offset = 13; offset >= 0; offset -= 1) {
      const date = subtractDays(new Date(), offset);
      const key = getLocalDateKey(date, NOTIFICATION_TIMEZONE);
      eventsByDayMap.set(key, { dateKey: key, label: key.slice(5), count: 0 });
    }
    for (const event of events) {
      const key = getLocalDateKey(new Date(event.at || Date.now()), NOTIFICATION_TIMEZONE);
      if (eventsByDayMap.has(key)) {
        eventsByDayMap.get(key).count += 1;
      }
    }

    return {
      summary: {
        totalUsers,
        activeUsers: users.filter((user) => user.active).length,
        usersWithAccess,
        usersWithoutAccess,
        totalAccesses: users.reduce((sum, user) => sum + (user.accessCount || 0), 0),
        adoptionRate: totalUsers ? Number(((usersWithAccess / totalUsers) * 100).toFixed(1)) : 0,
        inactivityRate: totalUsers ? Number(((usersWithoutAccess / totalUsers) * 100).toFixed(1)) : 0,
        pageViewCount,
        pdfOpenCount,
        loginCount,
      },
      accessBuckets,
      activityByDay: Array.from(eventsByDayMap.values()),
      users: sorted,
      recentEvents: events.slice(0, 80),
    };
  }

  async purgeExcludedAccesses(emails) {
    const excluded = new Set(emails.map((value) => String(value || "").toLowerCase()));
    const users = await this.getInvitedUsers();
    let resetUsers = 0;
    for (let i = 0; i < users.length; i += 1) {
      if (!excluded.has(users[i].email)) continue;
      users[i] = {
        ...users[i],
        accessCount: 0,
        firstAccessAt: null,
        lastAccessAt: null,
        lastPath: null,
        lastLanguage: null,
        updatedAt: new Date().toISOString(),
      };
      resetUsers += 1;
    }
    await this.saveInvitedUsers(users);

    const events = (await this.ctx.storage.get("access-events")) || [];
    const filteredEvents = events.filter((event) => !excluded.has(String(event.email || "").toLowerCase()));
    await this.ctx.storage.put("access-events", filteredEvents);

    return {
      resetUsers,
      removedEvents: events.length - filteredEvents.length,
      excluded: Array.from(excluded),
    };
  }
}
