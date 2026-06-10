// Script para crear un nuevo cliente en Campo Manager
//
// Uso:
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   CLIENTE_EMAIL=cliente@ejemplo.com CLIENTE_NOMBRE="Nombre" CAMPO_NOMBRE="Campo" \
//   node crear-cliente.js
//
// La service_role key NUNCA debe escribirse en el código ni commitearse.
// Pasala por variable de entorno (o un archivo .env que esté en .gitignore).

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ── DATOS DEL NUEVO CLIENTE (por variables de entorno) ───
const CLIENTE_EMAIL  = process.env.CLIENTE_EMAIL;
const CLIENTE_NOMBRE = process.env.CLIENTE_NOMBRE;
const CAMPO_NOMBRE   = process.env.CAMPO_NOMBRE;
// ─────────────────────────────────────────────────────────

// Validar configuración antes de tocar la base
const faltantes = Object.entries({
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY,
  CLIENTE_EMAIL,
  CLIENTE_NOMBRE,
  CAMPO_NOMBRE,
}).filter(([, v]) => !v).map(([k]) => k);

if (faltantes.length) {
  console.error(
    "\n❌ Faltan variables de entorno: " + faltantes.join(", ") +
    "\n   Ejemplo de uso:\n" +
    '   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJ... \\\n' +
    '   CLIENTE_EMAIL=cliente@ejemplo.com CLIENTE_NOMBRE="Nombre" CAMPO_NOMBRE="Campo" \\\n' +
    "   node crear-cliente.js\n"
  );
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function crearCliente() {
  console.log(`\n🌱 Creando cliente: ${CLIENTE_NOMBRE} (${CLIENTE_EMAIL})`);

  // 1. Crear org
  console.log("1. Creando organización...");
  const { data: org, error: orgErr } = await sb
    .from("organizaciones")
    .insert({ nombre: CAMPO_NOMBRE })
    .select()
    .single();
  if (orgErr) throw new Error("Error creando org: " + orgErr.message);
  console.log(`   ✅ Org creada: ${org.id}`);

  // 2. Invitar usuario (le manda el mail automático)
  console.log("2. Invitando usuario...");
  const { data: inviteData, error: inviteErr } = await sb.auth.admin.inviteUserByEmail(
    CLIENTE_EMAIL,
    { data: { org_id: org.id, nombre: CLIENTE_NOMBRE } }
  );
  if (inviteErr) throw new Error("Error invitando usuario: " + inviteErr.message);
  const userId = inviteData.user.id;
  console.log(`   ✅ Invitación enviada a ${CLIENTE_EMAIL}`);

  // 3. Crear miembro en la org
  console.log("3. Asignando al campo...");
  const { error: miembroErr } = await sb
    .from("miembros")
    .insert({
      org_id: org.id,
      user_id: userId,
      nombre: CLIENTE_NOMBRE,
      email: CLIENTE_EMAIL,
      rol: "administrador"
    });
  if (miembroErr) throw new Error("Error creando miembro: " + miembroErr.message);
  console.log(`   ✅ Miembro asignado como administrador`);

  console.log(`\n✅ Listo! ${CLIENTE_NOMBRE} va a recibir un mail para entrar a su campo.\n`);
}

crearCliente().catch(e => {
  console.error("\n❌ Error:", e.message);
  process.exit(1);
});
