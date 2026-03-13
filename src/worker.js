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

function cleanMessage(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 1200);
}

function getStore(env) {
  return env.HUB_DATA.getByName("hub-data");
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
}
