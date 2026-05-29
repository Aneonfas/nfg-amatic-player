const PLAYER_VERSION = "0.1.4-beta.1";
const RUNTIME_VERSION = "0.1.11";
const PACKAGE_VERSION = "0.4.5";
const RELEASE_TAG = "player-0.1.4-beta.1";
const SETUP_FILE = "NFG_A-Matic_Player_Setup_0.1.4-beta.1_win-x64.exe";
const ZIP_FILE = "NFG_A-Matic_Player_0.1.4-beta.1_win-x64.zip";
const INSTALLER_SHA256 = "1F73BAEFC8AC0E5B8A0C3B8002D7378A2AEE3ACB255D030E78CDE24F71321A4D";
const ZIP_SHA256 = "AD7331E06A339BE03A43E685612E5543A3E5A5F0C6146CECEC90C67560C15597";
const REPO_URL = "https://github.com/Aneonfas/nfg-amatic-player";
const PACKAGE_REPO_URL = "https://github.com/Aneonfas/nfg-amatic-packages";
const RELEASE_URL = `${REPO_URL}/releases/tag/${RELEASE_TAG}`;
const DOWNLOAD_BASE = `${REPO_URL}/releases/download/${RELEASE_TAG}`;
const SETUP_URL = `${DOWNLOAD_BASE}/${SETUP_FILE}`;
const ZIP_URL = `${DOWNLOAD_BASE}/${ZIP_FILE}`;
const SHOT_BASE = "https://raw.githubusercontent.com/Aneonfas/nfg-amatic-player/main/assets/foxhole-helper";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = normalizePath(url.pathname);

  if (["/download", "/download/installer", "/download/windows"].includes(path)) return Response.redirect(SETUP_URL, 302);
  if (["/download/portable", "/download/zip"].includes(path)) return Response.redirect(ZIP_URL, 302);
  if (path === "/github") return Response.redirect(REPO_URL, 302);
  if (["/release", "/releases"].includes(path)) return Response.redirect(RELEASE_URL, 302);
  if (path === "/support") return Response.redirect(`${REPO_URL}/issues`, 302);
  if (path === "/catalog") return Response.redirect(`${PACKAGE_REPO_URL}/blob/main/catalog.json`, 302);
  if (path.startsWith("/assets/foxhole-helper/")) return Response.redirect(`${SHOT_BASE}/${encodeURIComponent(path.split("/").pop())}`, 302);
  if (path === "/robots.txt") return text("User-agent: *\nAllow: /\nSitemap: https://nfg-system.online/sitemap.xml\n");
  if (path === "/sitemap.xml") return xml(sitemap());
  if (path === "/favicon.ico" || path === "/favicon.svg") return svg(favicon());
  if (path === "/health") return json({ ok: true, playerVersion: PLAYER_VERSION, runtimeVersion: RUNTIME_VERSION, release: RELEASE_URL });
  if (path === "/" || path === "/foxhole-clicker" || path === "/packages") return html(page(path));

  return html(page("/"), 404);
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function baseHeaders(contentType, cacheControl = "public, max-age=180") {
  return {
    "content-type": contentType,
    "cache-control": cacheControl,
    "content-security-policy": "default-src 'none'; img-src 'self' https://raw.githubusercontent.com data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  };
}

function html(body, status = 200) {
  return new Response(body, { status, headers: baseHeaders("text/html; charset=utf-8") });
}

function text(body) {
  return new Response(body, { headers: baseHeaders("text/plain; charset=utf-8", "public, max-age=3600") });
}

function xml(body) {
  return new Response(body, { headers: baseHeaders("application/xml; charset=utf-8", "public, max-age=3600") });
}

function json(body) {
  return new Response(JSON.stringify(body), { headers: baseHeaders("application/json; charset=utf-8", "no-store") });
}

function svg(body) {
  return new Response(body, { headers: baseHeaders("image/svg+xml; charset=utf-8", "public, max-age=86400") });
}

function page(path) {
  const isPackages = path === "/packages";
  const title = isPackages ? "NFG A-Matic packages" : "NFG A-Matic Player";
  const description = isPackages
    ? "Official package catalog for NFG A-Matic Player."
    : "Windows beta runtime for installing and running screen-aware automation packages.";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="https://nfg-system.online${isPackages ? "/packages/" : "/"}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#f7f4ee">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NFG A-Matic">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${SHOT_BASE}/foxhole-helper-active-hold.jpg">
<style>
:root{color-scheme:light;--bg:#f7f4ee;--paper:#fffdf8;--ink:#171717;--muted:#676159;--line:#ded7ca;--teal:#10766f;--amber:#c47b20;--red:#b73d2f;--shadow:0 18px 54px rgba(31,27,21,.12)}
*{box-sizing:border-box}html{background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:16px;letter-spacing:0;scroll-behavior:smooth}body{margin:0;min-width:320px;overflow-x:hidden}a{color:inherit;text-decoration:none}img{display:block;max-width:100%}figure{margin:0}.container{width:min(1120px,calc(100% - 32px));max-width:calc(100vw - 32px);margin:0 auto}
.nav{position:sticky;top:0;z-index:10;border-bottom:1px solid rgba(222,215,202,.8);background:rgba(247,244,238,.92);backdrop-filter:blur(18px)}.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:68px}.brand{display:inline-flex;align-items:center;gap:12px;font-weight:800;white-space:nowrap}.mark{display:grid;width:38px;height:38px;place-items:center;border-radius:8px;background:var(--ink);color:#fffdf8;font-weight:900}.nav-links{display:flex;align-items:center;gap:18px;color:var(--muted);font-size:.94rem}.nav-links a:hover{color:var(--ink)}
.hero{padding:56px 0 42px}.hero-grid{display:grid;grid-template-columns:minmax(0,.92fr) minmax(420px,1.08fr);align-items:center;gap:46px}.hero-grid>*,.download-grid>*,.grid2>*,.grid3>*{min-width:0}.kicker{display:inline-flex;align-items:center;min-height:28px;margin-bottom:16px;border:1px solid var(--line);border-radius:8px;padding:4px 10px;background:var(--paper);color:#0b514c;font-size:.84rem;font-weight:700}h1,h2,h3,p{margin-top:0}h1{margin-bottom:18px;font-size:3.8rem;line-height:.98;letter-spacing:0}h2{margin-bottom:16px;font-size:2rem;line-height:1.12;letter-spacing:0}h3{margin-bottom:10px;font-size:1.05rem;line-height:1.25;letter-spacing:0}.lead{max-width:620px;margin-bottom:26px;color:var(--muted);font-size:1.2rem;line-height:1.55;overflow-wrap:break-word}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;border:1px solid var(--line);border-radius:8px;padding:0 18px;background:var(--paper);font-weight:800;line-height:1.2;text-align:center;box-shadow:0 1px 0 rgba(31,27,21,.04)}.btn-primary{border-color:var(--teal);background:var(--teal);color:white}.btn:hover{transform:translateY(-1px)}.badges{display:flex;flex-wrap:wrap;gap:8px}.pill{display:inline-flex;align-items:center;min-height:30px;border:1px solid var(--line);border-radius:8px;padding:4px 10px;background:rgba(255,253,248,.76);color:var(--muted);font-size:.84rem;font-weight:700}.pill.good{border-color:rgba(16,118,111,.28);color:#0b514c}.pill.warn{border-color:rgba(196,123,32,.32);color:#8a5015}.hero-media{overflow:hidden;border:1px solid var(--line);border-radius:8px;background:#111;box-shadow:var(--shadow)}.hero-media img,.shot img{width:100%;aspect-ratio:16/9;object-fit:cover;background:#151515}
section{padding:42px 0}.section-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:22px}.section-copy{max-width:560px;color:var(--muted);line-height:1.6;overflow-wrap:break-word}.grid3,.grid2{display:grid;gap:16px}.grid3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid2{grid-template-columns:repeat(2,minmax(0,1fr))}.card,.panel,.spec,.shot{border:1px solid var(--line);border-radius:8px;background:var(--paper);box-shadow:0 1px 0 rgba(31,27,21,.04)}.card,.panel{padding:20px}.card p,.panel p{margin-bottom:0;color:var(--muted);line-height:1.55}.check-list{display:grid;gap:12px;margin:0;padding:0;list-style:none}.check-list li{display:grid;grid-template-columns:18px 1fr;gap:10px;align-items:start;color:var(--muted);line-height:1.45}.dot{width:10px;height:10px;margin-top:7px;border-radius:50%;background:var(--teal)}.dot.warn{background:var(--amber)}.dot.bad{background:var(--red)}
.download-band{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:#ebe4d8}.download-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(360px,1.1fr);gap:28px;align-items:start}.steps{margin:0;padding-left:20px;color:var(--muted);line-height:1.7}.spec{overflow:hidden}.spec-row{display:grid;grid-template-columns:150px 1fr;gap:16px;padding:14px 16px;border-bottom:1px solid var(--line)}.spec-row:last-child{border-bottom:0}.spec-label{color:var(--muted);font-size:.9rem;font-weight:700}.spec-value{min-width:0;overflow-wrap:anywhere;font-weight:800}.hash{font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;font-size:.82rem;line-height:1.45}.screens{padding-bottom:62px}.shot{overflow:hidden}.shot-body{padding:14px 16px 16px}.shot-body p{margin-bottom:0;color:var(--muted);line-height:1.45}.footer{border-top:1px solid var(--line);padding:24px 0;color:var(--muted);font-size:.92rem}.footer-inner{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}.footer a{color:var(--ink);font-weight:700}
@media (max-width:900px){.nav-inner{align-items:flex-start;flex-direction:column;padding:14px 0}.nav-links{flex-wrap:wrap;gap:10px 14px}.hero-grid,.download-grid,.grid2,.grid3{grid-template-columns:1fr}.hero-grid{gap:28px}.section-head{align-items:flex-start;flex-direction:column;gap:8px}h1{font-size:2.7rem}}@media (max-width:520px){.container{width:min(100% - 20px,1120px);max-width:calc(100vw - 20px)}.hero{padding-top:34px}h1{font-size:2.25rem}h2{font-size:1.55rem}.lead{font-size:1.05rem}.badges{max-width:100%}.actions,.actions .btn{width:100%}.pill{max-width:100%}.spec-row{grid-template-columns:1fr;gap:4px}}
</style>
</head>
<body>
<header class="nav"><div class="container nav-inner"><a class="brand" href="/" aria-label="NFG A-Matic Player home"><span class="mark">N</span><span>NFG A-Matic Player</span></a><nav class="nav-links" aria-label="Main navigation"><a href="/#download">Download</a><a href="/packages/">Packages</a><a href="/releases">Release</a><a href="/support">Support</a></nav></div></header>
<main>
<section class="hero"><div class="container hero-grid"><div><span class="kicker">Windows x64 beta</span><h1>NFG A-Matic Player</h1><p class="lead">A focused Windows runtime for installing and running screen-aware automation packages. The current public package is Foxhole Helper.</p><div class="actions"><a class="btn btn-primary" href="/download">Download installer</a><a class="btn" href="${RELEASE_URL}">GitHub release</a><a class="btn" href="/download/portable">Portable ZIP</a></div><div class="badges"><span class="pill good">Player ${PLAYER_VERSION}</span><span class="pill good">Runtime/Core ${RUNTIME_VERSION}</span><span class="pill warn">Unsigned beta</span></div></div><figure class="hero-media" aria-label="Foxhole Helper active hold screenshot"><img src="${SHOT_BASE}/foxhole-helper-active-hold.jpg" alt="Foxhole Helper active hold status inside the game"></figure></div></section>
<section id="how"><div class="container"><div class="section-head"><div><span class="kicker">Runtime flow</span><h2>Install package, enable, run</h2></div><p class="section-copy">The Player keeps the package flow simple: install from the official catalog, enable the package, and run it while the target application is in a supported window mode.</p></div><div class="grid3"><article class="card"><h3>Official catalog</h3><p>Packages are installed from the NFG A-Matic package catalog, with manual import still available in the Player.</p></article><article class="card"><h3>Local runtime</h3><p>Automation runs locally on Windows and uses the packaged runtime assets shipped with the selected package.</p></article><article class="card"><h3>Focused beta</h3><p>The first public package is intentionally narrow: Foxhole Helper ${PACKAGE_VERSION} for selected supported actions.</p></article></div></div></section>
<section id="packages"><div class="container grid2"><div class="panel"><h2>Current package</h2><ul class="check-list"><li><span class="dot"></span><span>Foxhole Helper ${PACKAGE_VERSION}</span></li><li><span class="dot"></span><span>Timed LMB hold for supported Foxhole work actions.</span></li><li><span class="dot"></span><span>Designed for windowed or borderless Foxhole.</span></li><li><span class="dot warn"></span><span>Beta coverage: not every resolution or action state is supported yet.</span></li></ul></div><div class="panel"><h2>What it does not do</h2><ul class="check-list"><li><span class="dot bad"></span><span>No movement, aiming, targeting, or gameplay decisions.</span></li><li><span class="dot bad"></span><span>No generic rapid-clicker mode.</span></li><li><span class="dot bad"></span><span>No account, marketplace, or auto-updater flow in this beta.</span></li><li><span class="dot bad"></span><span>No code signing yet, so Windows warnings can still appear.</span></li></ul></div></div></section>
<section id="download" class="download-band"><div class="container download-grid"><div><span class="kicker">Recommended download</span><h2>Install the Player</h2><ol class="steps"><li>Download the Windows installer.</li><li>Run it and keep the default per-user install location.</li><li>Start NFG A-Matic Player.</li><li>Install Foxhole Helper from the catalog, or import a package manually.</li></ol><div class="actions" style="margin-top:22px;margin-bottom:0"><a class="btn btn-primary" href="/download">Download installer</a><a class="btn" href="/download/portable">Portable ZIP</a></div></div><div class="spec" aria-label="Release details"><div class="spec-row"><div class="spec-label">Player</div><div class="spec-value">${PLAYER_VERSION}</div></div><div class="spec-row"><div class="spec-label">Runtime/Core</div><div class="spec-value">${RUNTIME_VERSION}</div></div><div class="spec-row"><div class="spec-label">Installer</div><div class="spec-value">${SETUP_FILE}</div></div><div class="spec-row"><div class="spec-label">Installer SHA256</div><div class="spec-value hash">${INSTALLER_SHA256}</div></div><div class="spec-row"><div class="spec-label">Portable SHA256</div><div class="spec-value hash">${ZIP_SHA256}</div></div><div class="spec-row"><div class="spec-label">Status</div><div class="spec-value">Beta, not Authenticode-signed</div></div></div></div></section>
<section class="screens"><div class="container"><div class="section-head"><div><span class="kicker">Screens</span><h2>Foxhole Helper in use</h2></div></div><div class="grid3"><article class="shot"><img src="${SHOT_BASE}/foxhole-helper-progress-bar.jpg" alt="Foxhole Helper timer progress before active hold"><div class="shot-body"><h3>Timer</h3><p>Progress is visible before the hold begins.</p></div></article><article class="shot"><img src="${SHOT_BASE}/foxhole-helper-active-hold.jpg" alt="Foxhole Helper active hold status"><div class="shot-body"><h3>Active hold</h3><p>The overlay shows when the supported action state is active.</p></div></article><article class="shot"><img src="${SHOT_BASE}/player-catalog-foxhole-helper.jpg" alt="Foxhole Helper package in the Player catalog"><div class="shot-body"><h3>Catalog</h3><p>The package is available through the official catalog flow.</p></div></article></div></div></section>
</main>
<footer class="footer"><div class="container footer-inner"><div>NFG A-Matic Player ${PLAYER_VERSION} - Runtime/Core ${RUNTIME_VERSION}</div><div><a href="${REPO_URL}">GitHub</a> - <a href="${PACKAGE_REPO_URL}">Package catalog</a> - <a href="/support">Support</a></div></div></footer>
</body>
</html>`;
}

function sitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://nfg-system.online/</loc></url><url><loc>https://nfg-system.online/packages/</loc></url><url><loc>https://nfg-system.online/download</loc></url></urlset>`;
}

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#171717"/><path d="M18 46V18h8l13 16V18h7v28h-8L25 30v16z" fill="#fffdf8"/><path d="M18 52h28" stroke="#10766f" stroke-width="5" stroke-linecap="round"/></svg>`;
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
