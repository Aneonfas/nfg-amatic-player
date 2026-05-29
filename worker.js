const PLAYER_VERSION = "0.1.4-beta.1";
const RUNTIME_VERSION = "0.1.11";
const RELEASE_URL = "https://github.com/Aneonfas/nfg-amatic-player/releases/tag/player-0.1.4-beta.1";
const SETUP_URL = "https://github.com/Aneonfas/nfg-amatic-player/releases/download/player-0.1.4-beta.1/NFG_A-Matic_Player_Setup_0.1.4-beta.1_win-x64.exe";
const ZIP_URL = "https://github.com/Aneonfas/nfg-amatic-player/releases/download/player-0.1.4-beta.1/NFG_A-Matic_Player_0.1.4-beta.1_win-x64.zip";
const REPO_URL = "https://github.com/Aneonfas/nfg-amatic-player";
const PACKAGE_REPO_URL = "https://github.com/Aneonfas/nfg-amatic-packages";
const STATIC_BASE = "https://raw.githubusercontent.com/Aneonfas/nfg-amatic-player/main";

const STATIC_ROUTES = {
  "/": "index.html",
  "/index.html": "index.html",
  "/foxhole-clicker": "foxhole-clicker/index.html",
  "/foxhole-clicker/": "foxhole-clicker/index.html",
  "/foxhole-clicker/index.html": "foxhole-clicker/index.html",
  "/packages": "packages/index.html",
  "/packages/": "packages/index.html",
  "/packages/index.html": "packages/index.html",
  "/support": "support/index.html",
  "/support/": "support/index.html",
  "/support/index.html": "support/index.html",
  "/assets/site.css": "assets/site.css",
  "/assets/site.js": "assets/site.js",
  "/robots.txt": "robots.txt",
  "/sitemap.xml": "sitemap.xml",
  "/favicon.ico": "favicon.ico",
};

const ASSET_PREFIXES = ["/assets/brand/", "/assets/foxhole-helper/"];

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = normalizePath(url.pathname);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "GET, HEAD" },
    });
  }

  if (path === "/download" || path === "/download/" || path === "/download/installer") {
    return Response.redirect(SETUP_URL, 302);
  }

  if (path === "/download/portable" || path === "/download/zip") {
    return Response.redirect(ZIP_URL, 302);
  }

  if (path === "/release" || path === "/releases" || path === "/releases/") {
    return Response.redirect(RELEASE_URL, 302);
  }

  if (path === "/github") {
    return Response.redirect(REPO_URL, 302);
  }

  if (path === "/catalog") {
    return Response.redirect(`${PACKAGE_REPO_URL}/blob/main/catalog.json`, 302);
  }

  if (path === "/health") {
    return json({
      ok: true,
      playerVersion: PLAYER_VERSION,
      runtimeVersion: RUNTIME_VERSION,
      release: RELEASE_URL,
    });
  }

  const staticPath = resolveStaticPath(path);
  if (staticPath) {
    return serveStatic(staticPath, request.method);
  }

  return new Response("Not found", {
    status: 404,
    headers: responseHeaders("text/plain; charset=utf-8", 60),
  });
}

function normalizePath(pathname) {
  if (!pathname || pathname === "") return "/";
  return pathname.replace(/\/{2,}/g, "/");
}

function resolveStaticPath(path) {
  if (STATIC_ROUTES[path]) return STATIC_ROUTES[path];
  if (path.includes("..")) return null;

  if (ASSET_PREFIXES.some(prefix => path.startsWith(prefix))) {
    return path.slice(1);
  }

  return null;
}

async function serveStatic(staticPath, method) {
  const upstreamUrl = `${STATIC_BASE}/${staticPath}`;
  const upstreamResponse = await fetch(upstreamUrl, {
    headers: { "user-agent": "nfg-amatic-site-worker" },
    cf: { cacheEverything: true, cacheTtl: cacheTtlFor(staticPath) },
  });

  if (!upstreamResponse.ok) {
    return new Response("Not found", {
      status: 404,
      headers: responseHeaders("text/plain; charset=utf-8", 60),
    });
  }

  return new Response(method === "HEAD" ? null : upstreamResponse.body, {
    status: 200,
    headers: responseHeaders(contentTypeFor(staticPath), cacheTtlFor(staticPath)),
  });
}

function json(value) {
  return new Response(JSON.stringify(value), {
    headers: responseHeaders("application/json; charset=utf-8", 60),
  });
}

function responseHeaders(contentType, cacheTtl) {
  return {
    "content-type": contentType,
    "cache-control": cacheTtl > 60 ? `public, max-age=${cacheTtl}` : "no-cache",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
  };
}

function cacheTtlFor(path) {
  if (path.endsWith(".html") || path === "robots.txt" || path === "sitemap.xml") return 300;
  return 86400;
}

function contentTypeFor(path) {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (path.endsWith(".xml")) return "application/xml; charset=utf-8";
  if (path.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (path.endsWith(".ico")) return "image/x-icon";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}
