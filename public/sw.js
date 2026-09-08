// ════════════════════════════════════════════════════════════════════════════
// Campo Manager — service worker
// Guarda la app en el teléfono/navegador para que abra al instante, incluso
// con señal mala. OJO: guarda la APP, no los datos. Los datos del campo
// siguen viniendo de Supabase y necesitan señal.
// ════════════════════════════════════════════════════════════════════════════
// OJO con { ignoreVary: true } en cada caches.match: el servidor manda
// "Vary: Origin", y sin esa opcion la copia guardada NUNCA coincide con el
// pedido y la app no abre sin señal aunque los archivos esten guardados.
const VERSION = "cm-v3";
const SHELL   = "shell-" + VERSION;
const ASSETS  = "assets-" + VERSION;

// Lee el index.html, saca de ahí los archivos .js y .css que la app necesita
// para arrancar, y los guarda. Esto se hace ya en la primera visita: si no,
// la app quedaría guardada pero sin sus piezas, y sin señal no abriría.
async function guardarTodo() {
  try {
    const cacheShell = await caches.open(SHELL);
    await cacheShell.addAll(["/", "/index.html", "/manifest.json", "/icon.png"]).catch(() => {});

    const res  = await fetch("/index.html", { cache: "no-cache" });
    const html = await res.text();
    const urls = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(m => m[1]);

    if (urls.length) {
      const cacheAssets = await caches.open(ASSETS);
      await Promise.all([...new Set(urls)].map(u => cacheAssets.add(u).catch(() => {})));
    }
  } catch (e) {
    // Si falla, no rompemos la instalación: la app sigue andando con señal.
  }
}

self.addEventListener("install", e => {
  e.waitUntil(guardarTodo().then(() => self.skipWaiting()));
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
          // Al volver a haber señal, refrescamos las piezas por si hubo deploy.
          e.waitUntil(guardarTodo());
          return r;
        })
        .catch(() => caches.match("/index.html", {ignoreVary:true}).then(hit => hit || Response.error()))
    );
    return;
  }

  // Los archivos de /assets/ llevan un hash en el nombre: si el nombre es el
  // mismo, el contenido es el mismo. Se sirven de la copia sin consultar la red.
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      caches.match(req, { ignoreVary: true }).then(hit => hit || fetch(req).then(r => {
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
  e.respondWith(caches.match(req, { ignoreVary: true }).then(hit => hit || fetch(req)));
});
