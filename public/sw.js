// ════════════════════════════════════════════════════════════════════════════
// Campo Manager — service worker
// Guarda la app en el teléfono/navegador para que abra al instante, incluso
// con señal mala. OJO: guarda la APP, no los datos. Los datos del campo
// siguen viniendo de Supabase y necesitan señal.
// ════════════════════════════════════════════════════════════════════════════
const VERSION = "cm-v1";
const SHELL   = "shell-" + VERSION;
const ASSETS  = "assets-" + VERSION;

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => c.addAll(["/", "/index.html", "/manifest.json", "/icon.png"]))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => !k.endsWith(VERSION)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch { return; }

  // Todo lo que no sea de este dominio (Supabase, mapas satelitales, clima)
  // pasa derecho a la red. Nunca se guarda una copia de los datos.
  if (url.origin !== self.location.origin) return;

  // Navegación: primero la red, así un deploy nuevo se ve enseguida.
  // Si no hay señal, se usa la copia guardada.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(r => {
          const copia = r.clone();
          caches.open(SHELL).then(c => c.put("/index.html", copia)).catch(() => {});
          return r;
        })
        .catch(() => caches.match("/index.html").then(hit => hit || Response.error()))
    );
    return;
  }

  // Los archivos de /assets/ llevan un hash en el nombre: si el nombre es el
  // mismo, el contenido es el mismo. Se sirven de la copia sin consultar la red.
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(r => {
        if (r && r.ok) {
          const copia = r.clone();
          caches.open(ASSETS).then(c => c.put(req, copia)).catch(() => {});
        }
        return r;
      }))
    );
    return;
  }

  // Resto (icono, manifest): copia si hay, si no la red.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
