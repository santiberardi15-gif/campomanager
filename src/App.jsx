// ════════════════════════════════════════════════════════════════════════════
// CAMPO MANAGER v2 — Supabase backend, multi-user, all fixes
// ════════════════════════════════════════════════════════════════════════════
// SETUP:
// 1. npm install @supabase/supabase-js recharts
// 2. Reemplazá SUPABASE_URL y SUPABASE_KEY abajo con tus credenciales
// 3. Listo, esta app reemplaza tu src/App.tsx completo
// ════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── ⚠️ CONFIGURÁ ACÁ TUS CREDENCIALES DE SUPABASE ──
const SUPABASE_URL = "https://iabyxkvlippfphtxnstx.supabase.co";
const SUPABASE_KEY = "sb_publishable_etH9UCqAo0u9NF9dQoKWag_fBikSSuO";

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🆕 Logo de la marca (María Amelia) incrustado para no depender de archivos externos
const LOGO_URL = "data:image/png;base64,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";

// ════════════════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════════════════
const Ic = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const I = {
  home:()=><Ic d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10"/>,
  map:()=><Ic d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6"/>,
  cow:()=><Ic d="M8 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-2M8 3a2 2 0 014 0M8 3h8"/>,
  wheat:()=><Ic d="M12 2v20M4.93 10.93l14.14-7.07M4.93 17.07l14.14-7.07"/>,
  cloud:()=><Ic d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>,
  box:()=><Ic d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>,
  truck:()=><Ic d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>,
  chart:()=><Ic d="M18 20V10M12 20V4M6 20v-6"/>,
  dollar:()=><Ic d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>,
  calendar:()=><Ic d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>,
  users:()=><Ic d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>,
  settings:()=><Ic d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>,
  plus:()=><Ic d="M12 5v14M5 12h14"/>,
  minus:()=><Ic d="M5 12h14"/>,
  edit:()=><Ic d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>,
  trash:()=><Ic d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>,
  search:()=><Ic d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"/>,
  bell:()=><Ic d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>,
  rain:()=><Ic d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25M8 19v1M8 22v1M12 17v1M12 20v1M16 19v1M16 22v1"/>,
  clipboard:()=><Ic d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6"/>,
  file:()=><Ic d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6"/>,
  x:()=><Ic d="M18 6L6 18M6 6l12 12"/>,
  chevDown:()=><Ic d="M6 9l6 6 6-6"/>,
  menu:()=><Ic d="M3 12h18M3 6h18M3 18h18"/>,
  upload:()=><Ic d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>,
  arrowUp:()=><Ic d="M12 19V5M5 12l7-7 7 7"/>,
  arrowDown:()=><Ic d="M12 5v14M19 12l-7 7-7-7"/>,
  warn:()=><Ic d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>,
  back:()=><Ic d="M19 12H5M12 19l-7-7 7-7"/>,
  save:()=><Ic d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8"/>,
  logout:()=><Ic d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>,
  refresh:()=><Ic d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>,
  check:()=><Ic d="M20 6L9 17l-5-5"/>,
  history:()=><Ic d="M3 3v5h5M3.05 13A9 9 0 1015 3.5M12 7v5l3 2"/>,
  download:()=><Ic d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>,
  folder:()=><Ic d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>,
  image:()=><Ic d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21"/>,
  info:()=><Ic d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01"/>,
};

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════
const CATEGORIAS_STOCK = ["Fertilizante", "Semillas", "Agroquímico", "Veterinario"];
// 🆕 Sociedades (razones sociales) — mismas 3 que en los lotes
const SOCIEDADES = ["M.R.", "D.R.", "J.S."];
const SOC_COLOR = { "M.R.": "#ec4899", "D.R.": "#16a34a", "J.S.": "#ef4444" };
const UNIDADES = ["kg", "ton", "lt", "bolsa", "dosis", "unidad"];
const INSUMOS_PREDEFINIDOS = {
  Fertilizante: ["Urea", "Fosfato Diamónico", "Superfosfato Triple", "Otro"],
  Semillas: ["Soja", "Maíz", "Trigo", "Girasol", "Sorgo", "Otro"],
  Agroquímico: ["Glifosato", "2-4D", "Atrazina", "Endosulfan", "Otro"],
  Veterinario: ["Ivermectina", "Vacuna aftosa", "Vacuna brucelosis", "Otro"],
};
const RAZAS_PREDEFINIDAS = ["Angus", "Hereford", "Holando Argentino", "Speckle Park", "Brangus", "Braford", "Shorthorn", "Otra"];
const BADGE_C = {
  Fertilizante:{bg:"#dbeafe",c:"#1d4ed8"},
  Semillas:{bg:"#dcfce7",c:"#15803d"},
  "Agroquímico":{bg:"#fed7aa",c:"#c2410c"},
  Veterinario:{bg:"#f3e8ff",c:"#7c3aed"},
};
const CULTIVO_C = {Soja:"#16a34a",Maíz:"#ca8a04",Trigo:"#d97706",Girasol:"#ea580c",Sorgo:"#a16207"};
const PRIOR_C = {Alta:"#ef4444",Media:"#f59e0b",Baja:"#6b7280"};
const TIPO_ICON = {"Labor agrícola":"🌱",Mantenimiento:"🔧",Veterinaria:"💉",Administrativa:"📋"};
const MAQTIPO_I = {Tractor:"🚜",Cosechadora:"🌾",Pulverizadora:"💧",Acoplado:"🚛",Sembradora:"🌱",Otro:"⚙️"};

// ════════════════════════════════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════════════════════════════════
const fmt = n => "$ " + Number(n||0).toLocaleString("es-AR", {maximumFractionDigits:0});
const fmtK = n => {
  const v = Number(n||0);
  if (v >= 1e9) return "$ " + (v/1e9).toFixed(1) + "B";
  if (v >= 1e6) return "$ " + (v/1e6).toFixed(0) + "M";
  return fmt(v);
};
const fmtUSD = (n, dolar) => "U$ " + (Number(n||0)/dolar).toLocaleString("es-AR", {maximumFractionDigits:0});
const todayISO = () => new Date().toISOString().split("T")[0];

// Helper para registrar un movimiento en el historial
async function registrarMovimiento(orgId, mov){
  try {
    await sb.from("movimientos").insert({
      org_id: orgId,
      fecha: mov.fecha || todayISO(),
      tipo: mov.tipo,
      descripcion: mov.descripcion,
      campo_origen: mov.campo_origen || null,
      campo_destino: mov.campo_destino || null,
      lote_origen: mov.lote_origen || null,
      lote_destino: mov.lote_destino || null,
      cantidad: mov.cantidad || null,
      unidad: mov.unidad || null,
      monto: mov.monto || null,
      detalles: mov.detalles || {},
    });
  } catch(e) {
    console.error("Error registrando movimiento:", e);
  }
}
const fmtDate = iso => {
  if (!iso) return "";
  if (iso.includes("/")) return iso;
  const [y,m,d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
const parseDate = str => {
  if (!str) return null;
  if (str.includes("-")) return str;
  const [d,m,y] = str.split("/");
  return `${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`;
};

// Compute insumo dropdown options: predefined + existing custom ones from stock, "Otro" last
function getInsumosOpciones(categoria, stockData){
  const predef = (INSUMOS_PREDEFINIDOS[categoria]||[]).filter(p=>p!=="Otro");
  const existentes = [...new Set(stockData.filter(s=>s.categoria===categoria).map(s=>s.nombre))];
  const merged = [...new Set([...predef, ...existentes])];
  return [...merged, "Otro"];
}

// 🆕 Helpers para el stock repartido por sociedad
// Normaliza el objeto cantidades_soc asegurando las 3 claves
function getCantSoc(item){
  const cs = item?.cantidades_soc || {};
  return {
    "M.R.": Number(cs["M.R."]||0),
    "D.R.": Number(cs["D.R."]||0),
    "J.S.": Number(cs["J.S."]||0),
  };
}
// Suma asignada a sociedades (puede ser menor al total si hay "sin asignar")
function sumaSoc(item){
  const cs = getCantSoc(item);
  return cs["M.R."]+cs["D.R."]+cs["J.S."];
}
// Cuánto del total NO está asignado a ninguna sociedad (insumos viejos)
function sinAsignar(item){
  return Math.max(0, Number(item?.cantidad||0) - sumaSoc(item));
}

// Permission helpers based on role
const ROLES = {
  ADMIN: "Administrador",
  EDITOR: "Editor",
  LECTOR: "Lector",
};
const canEdit = rol => rol === ROLES.ADMIN || rol === ROLES.EDITOR;
const canDelete = rol => rol === ROLES.ADMIN;
const canManageUsers = rol => rol === ROLES.ADMIN;
const ROLE_BADGE = {
  Administrador: {bg:"#dcfce7",c:"#15803d"},
  Editor: {bg:"#dbeafe",c:"#1d4ed8"},
  Lector: {bg:"#f3f4f6",c:"#6b7280"},
};

// ════════════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ════════════════════════════════════════════════════════════════════════════
const Badge = ({label,bg,c})=>(
  <span style={{display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:11,
    fontWeight:700,background:bg||"#e8f5e9",color:c||"#2e7d32",whiteSpace:"nowrap"}}>{label}</span>
);

const KPI = ({label,value,sub,color,icon})=>(
  <div style={{background:"#fff",borderRadius:14,padding:"20px 22px",
    boxShadow:"0 1px 4px rgba(0,0,0,0.07)",flex:1,minWidth:140}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <div style={{fontSize:12,color:"#6b7280",marginBottom:6,fontWeight:500}}>{label}</div>
        <div style={{fontSize:24,fontWeight:800,color:color||"#111",lineHeight:1.1}}>{value}</div>
        {sub&&<div style={{fontSize:11,color:"#9ca3af",marginTop:5}}>{sub}</div>}
      </div>
      {icon&&<div style={{color:"#16a34a",opacity:.7}}>{icon}</div>}
    </div>
  </div>
);

const Btn = ({children,variant="primary",onClick,small,full,style:s={},disabled})=>{
  const v={
    primary:{background:"#16a34a",color:"#fff",border:"none"},
    secondary:{background:"#fff",color:"#374151",border:"1.5px solid #e5e7eb"},
    danger:{background:"#fee2e2",color:"#dc2626",border:"none"},
    ghost:{background:"transparent",color:"#6b7280",border:"none"},
  };
  return(
    <button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",gap:6,
      padding:small?"6px 12px":"8px 16px",borderRadius:8,cursor:disabled?"not-allowed":"pointer",
      fontSize:small?12:14,fontWeight:600,transition:"all .15s",opacity:disabled?.5:1,
      width:full?"100%":"auto",justifyContent:full?"center":"flex-start",
      ...v[variant],...s}}>{children}</button>
  );
};

const Modal = ({title,onClose,children,wide})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,
    display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
    <div style={{background:"#fff",borderRadius:16,padding:28,width:"100%",maxWidth:wide?720:520,
      maxHeight:"88vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}
      onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <h3 style={{margin:0,fontSize:18,fontWeight:700}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}}><I.x/></button>
      </div>
      {children}
    </div>
  </div>
);

const Inp = ({label,...p})=>(
  <div style={{marginBottom:13}}>
    {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:4}}>{label}</label>}
    <input style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",
      fontSize:14,outline:"none",boxSizing:"border-box"}} {...p}/>
  </div>
);

const Sel = ({label,children,...p})=>(
  <div style={{marginBottom:13}}>
    {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:4}}>{label}</label>}
    <select style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",
      fontSize:14,background:"#fff",boxSizing:"border-box"}} {...p}>{children}</select>
  </div>
);

const Textarea = ({label,...p})=>(
  <div style={{marginBottom:13}}>
    {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:4}}>{label}</label>}
    <textarea style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",
      fontSize:14,outline:"none",boxSizing:"border-box",minHeight:80,resize:"vertical",fontFamily:"inherit"}} {...p}/>
  </div>
);

const Toast = ({msg,type})=>msg?(
  <div style={{position:"fixed",bottom:24,right:24,zIndex:2000,
    background:type==="error"?"#dc2626":"#16a34a",color:"#fff",
    padding:"12px 20px",borderRadius:10,fontSize:14,fontWeight:600,
    boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>{msg}</div>
):null;

// Role-aware action buttons (visually rendered only if user can do that action)
// These use a global mutable variable set at runtime by the App component
let __currentRole = "Administrador";
const setCurrentRole = r => { __currentRole = r; };
const EditBtn = (props) => canEdit(__currentRole) ? <Btn variant="ghost" small {...props}><I.edit/></Btn> : null;
const DelBtn = (props) => canDelete(__currentRole) ? <Btn variant="ghost" small {...props}><I.trash/></Btn> : null;
const EditOnly = ({children}) => canEdit(__currentRole) ? children : null;
const AdminOnly = ({children}) => canDelete(__currentRole) ? children : null;

const ConfirmModal = ({msg,onConfirm,onCancel})=>(
  <Modal title="Confirmar" onClose={onCancel}>
    <p style={{marginBottom:20,color:"#374151"}}>{msg}</p>
    <div style={{display:"flex",gap:10}}>
      <Btn variant="secondary" onClick={onCancel} full>Cancelar</Btn>
      <Btn variant="danger" onClick={onConfirm} full>Eliminar</Btn>
    </div>
  </Modal>
);

const MapEmbed = ({ubicacion,height=200})=>(
  <iframe
    title="mapa"
    width="100%" height={height}
    style={{border:0,borderRadius:10,display:"block"}}
    loading="lazy"
    src={`https://maps.google.com/maps?q=${encodeURIComponent(ubicacion||"Argentina")}&z=13&output=embed`}
  />
);

const Spinner = ()=>(
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
    <div style={{width:32,height:32,border:"3px solid #e5e7eb",borderTop:"3px solid #16a34a",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// AUTH SCREEN
// ════════════════════════════════════════════════════════════════════════════
function AuthScreen({onAuth}){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [nombre,setNombre]=useState("");
  const [orgNombre,setOrgNombre]=useState("");
  const [orgInvite,setOrgInvite]=useState("");
  const [signupMode,setSignupMode]=useState("nueva");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const submit = async ()=>{
    setError(""); setLoading(true);
    try{
      if(mode==="login"){
        const {error} = await sb.auth.signInWithPassword({email,password});
        if(error) throw error;
        onAuth();
      } else {
        if(!nombre.trim()) throw new Error("Ingresá tu nombre");
        // SIGNUP
        const {data:authData,error:authError} = await sb.auth.signUp({email,password});
        if(authError) throw authError;
        if(!authData.user) throw new Error("No se pudo crear el usuario");

        // Force login to ensure session is set
        const {error:loginErr} = await sb.auth.signInWithPassword({email,password});
        if(loginErr) throw new Error("No se pudo iniciar sesión: " + loginErr.message + ". Asegurate de que 'Confirm email' esté desactivado en Supabase.");

        // Wait for session to propagate
        await new Promise(r=>setTimeout(r,300));

        if(signupMode==="nueva"){
          const {data:newOrgId,error:rpcErr} = await sb.rpc("create_org_and_join",{org_nombre:orgNombre||"Mi Campo",nombre_user:nombre,email_user:email});
          if(rpcErr) throw new Error("Error creando organización: " + rpcErr.message);
          if(!newOrgId) throw new Error("No se pudo crear la organización");
        } else {
          if(!orgInvite || orgInvite.length<10) throw new Error("Código de invitación inválido");
          const {error:joinErr} = await sb.rpc("join_org",{invite_org_id:orgInvite,nombre_user:nombre,email_user:email});
          if(joinErr) throw new Error("Error al unirse: " + joinErr.message);
        }

        onAuth();
      }
    } catch(e){
      setError(e.message||"Error desconocido");
    }
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)",padding:20,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:18,padding:36,width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,0.1)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:72,height:72,borderRadius:16,background:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12,overflow:"hidden",border:"1px solid #f3f4f6"}}><img src={LOGO_URL} alt="María Amelia" style={{width:"100%",height:"100%",objectFit:"contain"}}/></div>
          <h1 style={{margin:0,fontSize:24,fontWeight:800}}>Campo Manager</h1>
          <p style={{color:"#6b7280",marginTop:6,fontSize:14}}>{mode==="login"?"Iniciá sesión":"Creá tu cuenta"}</p>
        </div>

        <Inp label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"/>
        <Inp label="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>

        {mode==="signup"&&(
          <>
            <Inp label="Tu nombre" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Santiago Berardi"/>
            <div style={{display:"flex",gap:8,marginBottom:13}}>
              <button onClick={()=>setSignupMode("nueva")} style={{flex:1,padding:"8px",borderRadius:8,border:"1.5px solid",borderColor:signupMode==="nueva"?"#16a34a":"#e5e7eb",background:signupMode==="nueva"?"#f0fdf4":"#fff",cursor:"pointer",fontSize:13,fontWeight:600,color:signupMode==="nueva"?"#16a34a":"#6b7280"}}>Nuevo campo</button>
              <button onClick={()=>setSignupMode("unirse")} style={{flex:1,padding:"8px",borderRadius:8,border:"1.5px solid",borderColor:signupMode==="unirse"?"#16a34a":"#e5e7eb",background:signupMode==="unirse"?"#f0fdf4":"#fff",cursor:"pointer",fontSize:13,fontWeight:600,color:signupMode==="unirse"?"#16a34a":"#6b7280"}}>Unirme</button>
            </div>
            {signupMode==="nueva"
              ? <Inp label="Nombre del establecimiento" value={orgNombre} onChange={e=>setOrgNombre(e.target.value)} placeholder="Ej: La Esperanza"/>
              : <Inp label="Código de invitación" value={orgInvite} onChange={e=>setOrgInvite(e.target.value)} placeholder="Pegá el código que te pasaron"/>
            }
          </>
        )}

        {error&&<div style={{background:"#fef2f2",color:"#dc2626",padding:"10px 12px",borderRadius:8,fontSize:13,marginBottom:13}}>{error}</div>}

        <Btn variant="primary" full onClick={submit} disabled={loading}>
          {loading?"Procesando...":mode==="login"?"Entrar":"Crear cuenta"}
        </Btn>

        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"#6b7280"}}>
          {mode==="login"?"¿No tenés cuenta?":"¿Ya tenés cuenta?"}{" "}
          <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");}} style={{background:"none",border:"none",color:"#16a34a",fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>
            {mode==="login"?"Crear una":"Iniciar sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAGES
// ════════════════════════════════════════════════════════════════════════════

// ── RESUMEN ─────────────────────────────────────────────────────────────────
function ResumenPage({data,dolar,setPage}){
  const [campoFil,setCampoFil]=useState("Todos");
  const campos = campoFil==="Todos"?data.campos:data.campos.filter(c=>c.nombre===campoFil);
  const animales = campoFil==="Todos"?data.animales:data.animales.filter(a=>a.campo===campoFil);
  const finanzas = campoFil==="Todos"?data.finanzas:data.finanzas.filter(f=>f.campo===campoFil);
  const lluvias  = campoFil==="Todos"?data.lluvias:data.lluvias.filter(l=>l.campo===campoFil);
  const ordenes  = campoFil==="Todos"?data.ordenes:data.ordenes.filter(o=>o.campo===campoFil);

  const totalHa = campos.reduce((s,c)=>s+Number(c.hectareas||0),0);
  const totalCab = animales.reduce((s,a)=>s+Number(a.cabezas||0),0);
  const egresos = finanzas.reduce((s,f)=>s+Number(f.monto||0),0);
  const bajStock = data.stock.filter(s=>Number(s.cantidad)<Number(s.minimo)).length;

  const m = new Date().getMonth();
  const y = new Date().getFullYear();
  const lluviaMes = lluvias.filter(l=>{
    if(!l.fecha) return false;
    const d = new Date(l.fecha);
    return d.getMonth()===m && d.getFullYear()===y;
  }).reduce((s,l)=>s+Number(l.mm||0),0);

  // Build flujo de caja 6 meses
  const meses=[];
  for(let i=5;i>=0;i--){
    const d=new Date(); d.setMonth(d.getMonth()-i);
    meses.push({key:`${d.getFullYear()}-${d.getMonth()}`,label:d.toLocaleDateString("es-AR",{month:"short",year:"2-digit"})});
  }
  const flujo = meses.map(m2=>{
    const eg = finanzas.filter(f=>{
      if(!f.fecha) return false;
      const d=new Date(f.fecha);
      return `${d.getFullYear()}-${d.getMonth()}`===m2.key;
    }).reduce((s,f)=>s+Number(f.monto||0),0);
    return {mes:m2.label,egresos:eg};
  });

  // Build lluvias mensuales
  const meses2=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const lluviaM = meses2.map((mes,idx)=>({
    mes,
    mm:lluvias.filter(l=>{if(!l.fecha)return false;const d=new Date(l.fecha);return d.getMonth()===idx&&d.getFullYear()===y;}).reduce((s,l)=>s+Number(l.mm||0),0)
  }));

  const proxOrdenes = ordenes.filter(o=>o.estado==="Pendiente").sort((a,b)=>(a.fecha||"").localeCompare(b.fecha||"")).slice(0,5);

  return(
    <div>
      <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontSize:13,color:"#6b7280",fontWeight:600}}>Filtrar por campo:</span>
        <select value={campoFil} onChange={e=>setCampoFil(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,background:"#fff"}}>
          <option>Todos</option>
          {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <KPI label="Superficie" value={`${totalHa.toLocaleString("es-AR")} ha`} sub={`${campos.length} campos`} icon={<I.map/>}/>
        <KPI label="Stock animal" value={totalCab} sub={`${animales.length} rodeos`} icon={<I.cow/>}/>
        <KPI label="Lluvia del mes" value={`${lluviaMes} mm`} icon={<I.rain/>}/>
        <KPI label="Gastos totales" value={fmtK(egresos)} sub={fmtUSD(egresos,dolar)} color="#ef4444" icon={<I.arrowDown/>}/>
        <KPI label="Insumos bajo stock" value={bajStock} color={bajStock>0?"#dc2626":"#16a34a"}/>
      </div>

      {bajStock>0&&(
        <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setPage("stock")}>
          <I.warn/><span style={{fontSize:14,color:"#dc2626",fontWeight:600}}>{bajStock} insumo(s) con stock bajo el mínimo — Click para revisar</span>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
          <div style={{fontWeight:700,marginBottom:2}}>Gastos (6 meses)</div>
          <div style={{fontSize:12,color:"#9ca3af",marginBottom:12}}>ARS</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={flujo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="mes" tick={{fontSize:10}}/>
              <YAxis tick={{fontSize:10}} tickFormatter={v=>v>=1e6?(v/1e6)+"M":v}/>
              <Tooltip formatter={v=>fmt(v)}/>
              <Bar dataKey="egresos" fill="#ef4444" radius={[4,4,0,0]} name="Egresos"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
          <div style={{fontWeight:700,marginBottom:2}}>Lluvias {y}</div>
          <div style={{fontSize:12,color:"#9ca3af",marginBottom:12}}>mm mensuales</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={lluviaM}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="mes" tick={{fontSize:10}}/>
              <YAxis tick={{fontSize:10}}/>
              <Tooltip formatter={v=>v+" mm"}/>
              <Bar dataKey="mm" fill="#3b82f6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{fontWeight:700,marginBottom:14}}>Próximas órdenes de trabajo</div>
        {proxOrdenes.length===0
          ?<div style={{textAlign:"center",padding:"20px 0",color:"#9ca3af",fontSize:14}}>Sin órdenes pendientes</div>
          :proxOrdenes.map(o=>(
            <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f3f4f6",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18}}>{TIPO_ICON[o.tipo]||"📋"}</span>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{o.titulo}</div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>📍 {o.campo} · 👤 {o.responsable}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Badge label={o.prioridad} c={PRIOR_C[o.prioridad]} bg={(PRIOR_C[o.prioridad]||"#888")+"22"}/>
                <span style={{fontSize:12,color:"#6b7280"}}>{fmtDate(o.fecha)}</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── HOOK CRUD GENÉRICO ──────────────────────────────────────────────────────
function useEdit(initEmpty, modalReq, clearModal){
  const [editItem,setEditItem]=useState(null);
  const [confirm,setConfirm]=useState(null);
  useEffect(()=>{
    if(modalReq){ setEditItem({...initEmpty,...modalReq.preset}); clearModal(); }
  },[modalReq]); // eslint-disable-line
  return {editItem,setEditItem,confirm,setConfirm};
}

// ── CAMPOS ──────────────────────────────────────────────────────────────────
function CamposPage({data,orgId,toast,reload,modalReq,clearModal}){
  const EMPTY={nombre:"",ubicacion:"",hectareas:"",lotes:"",notas:"",mapa_url:"",lotes_data:[]};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const [detail,setDetail]=useState(null);
  const mapaFileRef = useRef();
  const [uploading,setUploading]=useState(false);

  // Re-sync detail with fresh data
  useEffect(()=>{
    if(detail){
      const fresh = data.campos.find(c=>c.id===detail.id);
      if(fresh) setDetail(fresh);
    }
  },[data.campos]); // eslint-disable-line

  const save = async ()=>{
    if(!editItem.nombre||!editItem.hectareas){toast("Faltan campos","error");return;}
    const row={
      nombre:editItem.nombre,
      ubicacion:editItem.ubicacion,
      hectareas:Number(editItem.hectareas),
      lotes:Number(editItem.lotes||0),
      notas:editItem.notas||"",
      mapa_url:editItem.mapa_url||"",
      lotes_data:editItem.lotes_data||[],
    };
    if(editItem.id){
      const {error}=await sb.from("campos").update(row).eq("id",editItem.id);
      if(error){toast(error.message,"error");return;}
      toast("Campo actualizado");
    } else {
      const {error}=await sb.from("campos").insert({...row,org_id:orgId});
      if(error){toast(error.message,"error");return;}
      toast("Campo agregado");
    }
    setEditItem(null);
    reload();
  };

  const del = async id=>{
    const {error}=await sb.from("campos").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Campo eliminado"); reload();
    if(detail&&detail.id===id) setDetail(null);
  };

  const uploadMapa = async (e,campo)=>{
    const file = e.target.files[0];
    if(!file) return;
    setUploading(true);
    const path = `${orgId}/${campo.id}-${Date.now()}-${file.name}`;
    const {error:upErr} = await sb.storage.from("mapas").upload(path,file);
    if(upErr){toast(upErr.message,"error");setUploading(false);return;}
    const {data:{publicUrl}} = sb.storage.from("mapas").getPublicUrl(path);
    await sb.from("campos").update({mapa_url:publicUrl}).eq("id",campo.id);
    setUploading(false);
    toast("Mapa subido");
    reload();
  };

  const updateLotesData = async (campo,newLotes)=>{
    await sb.from("campos").update({lotes_data:newLotes}).eq("id",campo.id);
    reload();
  };

  if(detail){
    const lluviasCampo=data.lluvias.filter(l=>l.campo===detail.nombre);
    const campanasCampo=data.campanas.filter(c=>c.campo===detail.nombre);
    const ordenesCampo=data.ordenes.filter(o=>o.campo===detail.nombre);
    const animalesCampo=data.animales.filter(a=>a.campo===detail.nombre);
    const acumLluvia=lluviasCampo.reduce((s,l)=>s+Number(l.mm||0),0);

    return(
      <div>
        <div style={{marginBottom:16}}>
          <Btn variant="ghost" onClick={()=>setDetail(null)}><I.back/> Volver a Campos</Btn>
        </div>

        <div style={{background:"#fff",borderRadius:14,padding:24,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div>
              <h2 style={{margin:0,fontSize:22,fontWeight:800}}>{detail.nombre}</h2>
              <div style={{fontSize:14,color:"#6b7280",marginTop:4}}>📍 {detail.ubicacion}</div>
            </div>
            <EditOnly><Btn variant="secondary" small onClick={()=>setEditItem({...detail})}><I.edit/> Editar campo</Btn></EditOnly>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
            <KPI label="Hectáreas" value={Number(detail.hectareas).toLocaleString("es-AR")}/>
            <KPI label="Lotes" value={detail.lotes||0}/>
            <KPI label="Lluvia acumulada" value={`${acumLluvia} mm`} color="#3b82f6"/>
            <KPI label="Campañas" value={campanasCampo.length}/>
            <KPI label="Animales" value={animalesCampo.reduce((s,a)=>s+Number(a.cabezas||0),0)}/>
          </div>
          {detail.notas&&<div style={{background:"#f9fafb",borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:14,color:"#374151"}}>📝 {detail.notas}</div>}
          <MapEmbed ubicacion={detail.ubicacion} height={300}/>
        </div>

        {/* MAPA DE LOTES */}
        <div style={{background:"#fff",borderRadius:14,padding:20,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <div style={{fontWeight:700,fontSize:16}}>Mapa de lotes</div>
            <EditOnly><Btn variant="secondary" small onClick={()=>mapaFileRef.current.click()} disabled={uploading}>
              <I.upload/> {detail.mapa_url?"Cambiar imagen":"Subir imagen"}
            </Btn></EditOnly>
            <input ref={mapaFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>uploadMapa(e,detail)}/>
          </div>
          {detail.mapa_url
            ? <LotesMapa campo={detail} ordenes={ordenesCampo} campanas={campanasCampo} onUpdate={lotes=>updateLotesData(detail,lotes)} orgId={orgId} data={data} reload={reload} toast={toast}/>
            : <div style={{textAlign:"center",padding:"40px 20px",background:"#f9fafb",borderRadius:10,color:"#9ca3af"}}>
                <I.map/><div style={{marginTop:8,fontSize:14}}>Subí una imagen del mapa de lotes</div>
                <div style={{fontSize:12,marginTop:4}}>Después podrás marcar cada lote</div>
              </div>
          }
        </div>

        {campanasCampo.length>0&&(
          <div style={{background:"#fff",borderRadius:14,padding:20,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div style={{fontWeight:700,marginBottom:12}}>Campañas en este campo</div>
            {campanasCampo.map(c=>(
              <div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f3f4f6",flexWrap:"wrap",gap:8}}>
                <div>
                  <span style={{fontWeight:600}}>{c.nombre}</span>
                  <span style={{marginLeft:8}}><Badge label={c.cultivo} bg={(CULTIVO_C[c.cultivo]||"#888")+"22"} c={CULTIVO_C[c.cultivo]}/></span>
                </div>
                <div style={{fontSize:13,color:"#6b7280",display:"flex",alignItems:"center",gap:8}}>
                  {Number(c.hectareas).toLocaleString("es-AR")} ha
                  <Badge label={c.estado} bg={c.estado==="Activa"?"#dcfce7":"#f3f4f6"} c={c.estado==="Activa"?"#15803d":"#6b7280"}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {editItem&&(
          <Modal title={editItem.id?"Editar Campo":"Agregar Campo"} onClose={()=>setEditItem(null)}>
            <Inp label="Nombre" value={editItem.nombre} onChange={e=>setEditItem({...editItem,nombre:e.target.value})}/>
            <Inp label="Ubicación (para Google Maps)" value={editItem.ubicacion} onChange={e=>setEditItem({...editItem,ubicacion:e.target.value})}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Hectáreas" type="number" value={editItem.hectareas} onChange={e=>setEditItem({...editItem,hectareas:e.target.value})}/>
              <Inp label="Cantidad de lotes" type="number" value={editItem.lotes} onChange={e=>setEditItem({...editItem,lotes:e.target.value})}/>
            </div>
            <Textarea label="Notas" value={editItem.notas||""} onChange={e=>setEditItem({...editItem,notas:e.target.value})}/>
            <div style={{display:"flex",gap:10,marginTop:8}}>
              <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
              <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  const totalHa=data.campos.reduce((s,c)=>s+Number(c.hectareas||0),0);

  return(
    <div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <KPI label="Campos activos" value={data.campos.length}/>
        <KPI label="Total de lotes" value={data.campos.reduce((s,c)=>s+Number(c.lotes||0),0)}/>
        <KPI label="Hectáreas" value={totalHa.toLocaleString("es-AR")}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {data.campos.map(c=>(
          <div key={c.id} style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div style={{height:130,overflow:"hidden",cursor:"pointer"}} onClick={()=>setDetail(c)}>
              <MapEmbed ubicacion={c.ubicacion} height={130}/>
            </div>
            <div style={{padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,gap:6}}>
                <div style={{minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:15}}>{c.nombre}</div>
                  <div style={{fontSize:12,color:"#6b7280",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>📍 {c.ubicacion}</div>
                </div>
                <Badge label={`${Number(c.hectareas).toLocaleString("es-AR")} ha`}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                <div style={{textAlign:"center",background:"#f9fafb",borderRadius:8,padding:"6px 0"}}>
                  <div style={{fontSize:10,color:"#9ca3af"}}>Lotes</div>
                  <div style={{fontWeight:700,fontSize:13}}>{c.lotes||0}</div>
                </div>
                <div style={{textAlign:"center",background:"#f9fafb",borderRadius:8,padding:"6px 0"}}>
                  <div style={{fontSize:10,color:"#9ca3af"}}>Ha/lote</div>
                  <div style={{fontWeight:700,fontSize:13}}>{c.lotes?Math.round(c.hectareas/c.lotes):"—"}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <Btn variant="primary" small style={{flex:1,justifyContent:"center"}} onClick={()=>setDetail(c)}>Ver campo →</Btn>
                <EditBtn onClick={()=>setEditItem({...c})}/>
                <DelBtn onClick={()=>setConfirm(c.id)}/>
              </div>
            </div>
          </div>
        ))}
        {canEdit(__currentRole)&&<div onClick={()=>setEditItem({...EMPTY})} style={{background:"#f9fafb",borderRadius:14,border:"2px dashed #d1d5db",minHeight:220,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexDirection:"column",gap:8,color:"#9ca3af"}}>
          <I.plus/><span style={{fontSize:14,fontWeight:600}}>Agregar campo</span>
        </div>}
      </div>

      {editItem&&!detail&&(
        <Modal title={editItem.id?"Editar Campo":"Agregar Campo"} onClose={()=>setEditItem(null)}>
          <Inp label="Nombre" value={editItem.nombre} onChange={e=>setEditItem({...editItem,nombre:e.target.value})}/>
          <Inp label="Ubicación (Google Maps)" value={editItem.ubicacion} onChange={e=>setEditItem({...editItem,ubicacion:e.target.value})}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Hectáreas" type="number" value={editItem.hectareas} onChange={e=>setEditItem({...editItem,hectareas:e.target.value})}/>
            <Inp label="Cantidad de lotes" type="number" value={editItem.lotes} onChange={e=>setEditItem({...editItem,lotes:e.target.value})}/>
          </div>
          <Textarea label="Notas" value={editItem.notas||""} onChange={e=>setEditItem({...editItem,notas:e.target.value})}/>
          {editItem.ubicacion&&<div style={{marginBottom:14}}><MapEmbed ubicacion={editItem.ubicacion} height={140}/></div>}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
      )}
      {confirm&&<ConfirmModal msg="¿Eliminar este campo?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// INSTRUCCIONES DE INSTALACIÓN
// ══════════════════════════════════════════════════════════════════════════
// 1. Ir a https://aistudio.google.com/app/apikey
//    → Crear API key GRATIS (no requiere tarjeta de crédito)
//
// 2. En Vercel → tu proyecto → Settings → Environment Variables
//    → Agregar: VITE_GEMINI_API_KEY = (tu key)
//    → Hacer redeploy
//
// 3. En tu App.jsx, REEMPLAZÁ la función LotesMapa COMPLETA
//    (desde "function LotesMapa" hasta el cierre de su "}" final)
//    por el código de abajo.
// ══════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════════
// LotesMapa — versión corregida
// Reemplaza en tu App.jsx la función LotesMapa completa (de línea ~732 a ~1123,
// desde "function LotesMapa(...)" hasta su "}" final, antes de "// ── ANIMALES ──").
//
// Arregla:
//  1. No se podían dibujar varios lotes seguidos (la closure del handler
//     CREATED quedaba con un campo.lotes_data viejo) → ahora usa un ref
//     siempre sincronizado.
//  2. Al volver a entrar al campo no se veían los polígonos guardados (el
//     useEffect de render salía temprano porque Leaflet aún no había
//     terminado de cargar) → ahora dispara con un flag mapReady.
//  3. Todos los lotes salían verdes → ahora cada lote tiene su color,
//     elegible con un selector de paleta en el modal de edición.
// ════════════════════════════════════════════════════════════════════════════

// Paleta de colores predefinida (definila FUERA de la función, junto al
// resto de constantes, o al inicio del archivo).
// 🆕 Razones sociales: 3 opciones cada una con su color asociado
const COLORES_LOTE = [
  { value: "#ec4899", label: "M.R.", colorLabel: "Rosa" },
  { value: "#16a34a", label: "D.R.", colorLabel: "Verde" },
  { value: "#ef4444", label: "J.S.", colorLabel: "Rojo" },
];

// 🆕 Opciones del campo "Uso"
const USOS_LOTE = ["Ganadero", "Agrícola", "Mixto"];

function LotesMapa({ campo, ordenes, campanas, onUpdate, orgId, data, reload, toast }) {
  const [selected, setSelected] = useState(null);
  const [editLote, setEditLote] = useState(null);
  const [fichaLote, setFichaLote] = useState(null); // 🆕 lote cuya carpeta/ficha está abierta
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [mapMsg, setMapMsg] = useState(null);
  const [mapReady, setMapReady] = useState(false); // 🆕 dispara el re-render cuando leaflet termina de cargar

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const LRef = useRef(null);

  // 🆕 Refs SIEMPRE sincronizados con el último valor. Los handlers de Draw
  // los leen para no caer en closures stale.
  const lotesDataRef = useRef(campo.lotes_data || []);
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => { lotesDataRef.current = campo.lotes_data || []; }, [campo.lotes_data]);
  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

  const lotes = campo.lotes_data || [];

  const showMsg = (msg) => {
    setMapMsg(msg);
    setTimeout(() => setMapMsg(null), 4000);
  };

  // ── Montaje del mapa (corre una sola vez) ────────────────────────────────
  useEffect(() => {
    let mounted = true;
    let mapInstance = null;

    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet-draw");

      // FIX: parchear bug de readableArea en leaflet-draw 1.0.4
      if (L.GeometryUtil && L.GeometryUtil.readableArea) {
        const orig = L.GeometryUtil.readableArea;
        L.GeometryUtil.readableArea = function (area, isMetric, precision) {
          try { return orig.call(this, area, isMetric, precision); }
          catch (e) { return (area / 10000).toFixed(2) + " ha"; }
        };
      }
      const turf = await import("@turf/turf");

      if (!mounted || !mapContainerRef.current) return;
      LRef.current = { L, turf };

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      let center = [-34.6, -63.0];
      let zoom = 6;
      const lotesIniciales = lotesDataRef.current;
      const lotesConCoords = lotesIniciales.filter(l => l.coords && l.coords.length > 0);
      if (lotesConCoords.length > 0) {
        const allPoints = lotesConCoords.flatMap(l => l.coords);
        const avgLat = allPoints.reduce((s, p) => s + p[0], 0) / allPoints.length;
        const avgLng = allPoints.reduce((s, p) => s + p[1], 0) / allPoints.length;
        center = [avgLat, avgLng];
        zoom = 14;
      }

      mapInstance = L.map(mapContainerRef.current).setView(center, zoom);
      mapRef.current = mapInstance;

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics", maxZoom: 19 }
      ).addTo(mapInstance);

      if (L.Draw && L.Draw.Polygon) {
        L.Draw.Polygon.mergeOptions({ maxPoints: 0 });
      }

      const drawnItems = L.featureGroup().addTo(mapInstance);
      drawnItemsRef.current = drawnItems;

      const labelsLayer = L.featureGroup().addTo(mapInstance);
      labelsLayerRef.current = labelsLayer;

      const drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: { color: "#16a34a", weight: 3, fillOpacity: 0.3 },
          },
          rectangle: {
            shapeOptions: { color: "#16a34a", weight: 3, fillOpacity: 0.3 },
          },
          polyline: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: { featureGroup: drawnItems, remove: false },
      });
      mapInstance.addControl(drawControl);

      // Enter para terminar el polígono
      const container = mapInstance.getContainer();
      container.setAttribute("tabindex", "0");
      container.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        const toolbar = drawControl._toolbars && drawControl._toolbars.draw;
        if (!toolbar || !toolbar._activeMode) return;
        const handler = toolbar._activeMode.handler;
        if (!handler || !handler._enabled) return;
        if (typeof handler.completeShape === "function") handler.completeShape();
        else if (typeof handler._finishShape === "function") handler._finishShape();
      });
      mapInstance.on("draw:drawstart", () => container.focus());

      // ── CREATED — usa REFS, no closures viejas ─────────────────────────
      mapInstance.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        const raw = layer.getLatLngs()[0];
        const coords = (Array.isArray(raw[0]) ? raw[0] : raw).map(ll => [ll.lat, ll.lng]);

        const ring = [...coords.map(c => [c[1], c[0]]), [coords[0][1], coords[0][0]]];
        const newPoly = turf.polygon([ring]);

        // ✅ Lee la versión más reciente, no la del primer render
        const currentLotes = lotesDataRef.current;

        const hasOverlap = currentLotes.some(lote => {
          if (!lote.coords || lote.coords.length < 3) return false;
          try {
            const exRing = [...lote.coords.map(c => [c[1], c[0]]), [lote.coords[0][1], lote.coords[0][0]]];
            return turf.booleanIntersects(newPoly, turf.polygon([exRing]));
          } catch { return false; }
        });

        if (hasOverlap) {
          showMsg("⚠️ El lote se superpone con uno ya existente. Dibujalo en un área libre.");
          return;
        }

        const areaM2 = turf.area(newPoly);
        const hectareas = (areaM2 / 10000).toFixed(2);
        const centroid = turf.centroid(newPoly).geometry.coordinates;
        const num = currentLotes.length + 1;

        // 🆕 Color por defecto: primera razón social (M.R. - rosa). Se puede cambiar al editar.
        const color = COLORES_LOTE[0].value;

        onUpdateRef.current([...currentLotes, {
          id: Date.now(),
          numero: num,
          nombre: `Lote ${num}`,
          cultivo: "",
          color,
          hectareas,
          coords,
          centro: [centroid[1], centroid[0]],
        }]);
      });

      // ── EDITED — también usa refs ──────────────────────────────────────
      mapInstance.on(L.Draw.Event.EDITED, (e) => {
        const currentLotes = [...lotesDataRef.current];
        e.layers.eachLayer((layer) => {
          const loteId = layer.options._loteId;
          if (!loteId) return;
          const idx = currentLotes.findIndex(l => l.id === loteId);
          if (idx === -1) return;
          const raw = layer.getLatLngs()[0];
          const coords = (Array.isArray(raw[0]) ? raw[0] : raw).map(ll => [ll.lat, ll.lng]);
          const ring = [...coords.map(c => [c[1], c[0]]), [coords[0][1], coords[0][0]]];
          const poly = turf.polygon([ring]);
          const centroid = turf.centroid(poly).geometry.coordinates;
          currentLotes[idx] = {
            ...currentLotes[idx],
            coords,
            hectareas: (turf.area(poly) / 10000).toFixed(2),
            centro: [centroid[1], centroid[0]],
          };
        });
        onUpdateRef.current(currentLotes);
      });

      // 🆕 Avisar al useEffect de render que Leaflet ya está listo
      setMapReady(true);
    };

    loadLeaflet();
    return () => {
      mounted = false;
      if (mapInstance) mapInstance.remove();
    };
    // eslint-disable-next-line
  }, []);

  // ── Re-render de lotes existentes ─────────────────────────────────────────
  // 🆕 Agregado mapReady a las deps: corre una vez que el mapa ya cargó,
  // así los polígonos guardados aparecen al abrir el campo.
  useEffect(() => {
    if (!mapReady || !LRef.current || !drawnItemsRef.current || !labelsLayerRef.current) return;
    const { L } = LRef.current;
    const drawnItems = drawnItemsRef.current;
    const labelsLayer = labelsLayerRef.current;

    drawnItems.clearLayers();
    labelsLayer.clearLayers();

    lotes.forEach((lote, idx) => {
      if (!lote.coords || lote.coords.length < 3) return;

      // 🆕 Cada lote usa su razón social (color). Si el color guardado ya no está en
      // la paleta nueva (lotes viejos con la paleta de 8), cae a M.R. (rosa).
      const validColor = COLORES_LOTE.find(c => c.value === lote.color);
      const color = validColor ? validColor.value : COLORES_LOTE[0].value;

      const polygon = L.polygon(lote.coords, {
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.4,
        _loteId: lote.id,
      });
      polygon.on("click", () => setSelected(lote));
      polygon.bindTooltip(
        `<b>${lote.nombre || `Lote ${lote.numero}`}</b><br>${lote.hectareas} ha${lote.cultivo ? ` · ${lote.cultivo}` : ""}`
      );
      drawnItems.addLayer(polygon);

      if (lote.centro) {
        // 🆕 Etiqueta tipo "pastilla" mostrando el NOMBRE del lote (no el número)
        const displayName = lote.nombre || `Lote ${lote.numero}`;
        // Calcular ancho aproximado para que el ícono pueda anclarse al centro
        const approxWidth = Math.max(40, displayName.length * 7 + 18);
        const labelIcon = L.divIcon({
          className: "lote-label",
          html: `<div style="background:${color};color:#fff;border-radius:14px;padding:4px 10px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);white-space:nowrap;line-height:1.1">${displayName}</div>`,
          iconSize: [approxWidth, 24],
          iconAnchor: [approxWidth / 2, 12],
        });
        L.marker(lote.centro, { icon: labelIcon })
          .addTo(labelsLayer)
          .on("click", () => setSelected(lote));
      }
    });

    if (lotes.length > 0 && lotes[0].coords && mapRef.current) {
      try { mapRef.current.fitBounds(drawnItems.getBounds(), { padding: [40, 40] }); } catch {}
    }
    // eslint-disable-next-line
  }, [campo.lotes_data, mapReady]);

  // ── Buscar localidad ───────────────────────────────────────────────────────
  const buscarLocalidad = async () => {
    if (!searchQuery || searchQuery.length < 3) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Argentina")}&limit=5`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch { setSearchResults([]); }
    setSearching(false);
  };

  const irALocalidad = (result) => {
    if (!mapRef.current) return;
    mapRef.current.setView([Number(result.lat), Number(result.lon)], 14);
    setSearchResults([]);
    setSearchQuery(result.display_name.split(",")[0]);
  };

  const delLote = (id) => {
    const filtered = lotes.filter(l => l.id !== id).map((l, idx) => ({ ...l, numero: idx + 1 }));
    onUpdate(filtered);
    setSelected(null);
  };

  const saveLote = () => {
    onUpdate(lotes.map(l => l.id === editLote.id ? editLote : l));
    setEditLote(null);
    setSelected(null);
  };

  return (
    <div>
      <EditOnly>
        <div style={{ display: "flex", gap: 8, marginBottom: 10, position: "relative", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarLocalidad()}
              placeholder="Buscar localidad o provincia..."
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, boxSizing: "border-box" }}
            />
            {searchResults.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, marginTop: 4, zIndex: 1000, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", maxHeight: 200, overflowY: "auto" }}>
                {searchResults.map((r, i) => (
                  <div key={i} onClick={() => irALocalidad(r)}
                    style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    📍 {r.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Btn variant="secondary" small onClick={buscarLocalidad} disabled={searching}>
            {searching ? "Buscando..." : "Buscar"}
          </Btn>
        </div>
      </EditOnly>

      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#15803d" }}>
        💡 <b>Cómo usar:</b> 1) Buscá tu localidad arriba o navegá el mapa con el mouse. 2) Usá los botones de la esquina superior derecha del mapa para <b>dibujar el contorno de cada lote</b>. 3) Las hectáreas se calculan solas. Terminá el polígono con <b>doble click</b> o <b>Enter</b>. Podés dibujar varios lotes uno detrás del otro. {lotes.length} lote(s) marcado(s).
      </div>

      {mapMsg && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 13, color: "#dc2626" }}>
          {mapMsg}
        </div>
      )}

      <div ref={mapContainerRef} style={{ width: "100%", height: 500, borderRadius: 10, border: "1px solid #e5e7eb" }} />

      {lotes.length > 0 && (
        <div style={{ marginTop: 14, background: "#f9fafb", borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Lotes del campo ({lotes.length})</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  {["", "#", "Nombre", "Uso", "Hectáreas", ""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "6px 10px", fontSize: 11, fontWeight: 700, color: "#6b7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lotes.map((l, idx) => {
                  const validColor = COLORES_LOTE.find(c => c.value === l.color);
                  const color = validColor ? validColor.value : COLORES_LOTE[0].value;
                  const razonSocial = validColor ? validColor.label : COLORES_LOTE[0].label;
                  return (
                    <tr key={l.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      {/* 🆕 swatch de color */}
                      <td style={{ padding: "6px 10px" }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: color, border: "2px solid #fff", boxShadow: "0 0 0 1px #e5e7eb" }} />
                      </td>
                      <td style={{ padding: "6px 10px", fontWeight: 700, color }}>{l.numero}</td>
                      <td style={{ padding: "6px 10px", fontSize: 13 }}>{l.nombre}</td>
                      <td style={{ padding: "6px 10px", fontSize: 13, color: l.cultivo ? "#111" : "#9ca3af" }}>{l.cultivo || "—"}</td>
                      <td style={{ padding: "6px 10px", fontSize: 13, fontWeight: 600 }}>{l.hectareas} ha</td>
                      <td style={{ padding: "6px 10px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <Btn variant="ghost" small onClick={() => setFichaLote(l)} title="Abrir carpeta del lote"><I.folder /></Btn>
                          <Btn variant="ghost" small onClick={() => setEditLote({ ...l })}><I.edit /></Btn>
                          <Btn variant="ghost" small onClick={() => delLote(l.id)}><I.trash /></Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <Modal title={selected.nombre || `Lote ${selected.numero}`} onClose={() => setSelected(null)}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Uso</div>
            <div style={{ fontWeight: 700 }}>{selected.cultivo || "Sin asignar"}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Hectáreas</div>
            <div style={{ fontWeight: 700 }}>{selected.hectareas} ha</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>Órdenes de trabajo en este lote</div>
            {ordenes.filter(o =>
              o.titulo?.toLowerCase().includes(`lote ${selected.numero}`) ||
              o.titulo?.toLowerCase().includes(selected.nombre?.toLowerCase())
            ).length === 0
              ? <div style={{ fontSize: 13, color: "#9ca3af" }}>Sin órdenes asociadas</div>
              : ordenes.filter(o =>
                  o.titulo?.toLowerCase().includes(`lote ${selected.numero}`) ||
                  o.titulo?.toLowerCase().includes(selected.nombre?.toLowerCase())
                ).map(o => (
                  <div key={o.id} style={{ fontSize: 13, padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                    {TIPO_ICON[o.tipo] || "📋"} {o.titulo} · {fmtDate(o.fecha)}
                  </div>
                ))
            }
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" small onClick={() => setEditLote({ ...selected })}><I.edit /> Editar</Btn>
            <Btn variant="danger" small onClick={() => delLote(selected.id)}><I.trash /> Eliminar</Btn>
          </div>
        </Modal>
      )}

      {editLote && (
        <Modal title="Editar Lote" onClose={() => setEditLote(null)}>
          <Inp label="Nombre del lote" value={editLote.nombre} onChange={e => setEditLote({ ...editLote, nombre: e.target.value })} />

          {/* 🆕 Uso como desplegable con 3 opciones */}
          <Sel label="Uso" value={editLote.cultivo || ""} onChange={e => setEditLote({ ...editLote, cultivo: e.target.value })}>
            <option value="">Seleccionar uso...</option>
            {USOS_LOTE.map(u => <option key={u} value={u}>{u}</option>)}
          </Sel>

          <Inp label="Hectáreas (calculado automáticamente)" type="number" value={editLote.hectareas} onChange={e => setEditLote({ ...editLote, hectareas: e.target.value })} />

          {/* 🆕 Selector de Razón Social (3 opciones: M.R. / D.R. / J.S.) */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: 600 }}>Razón social</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {COLORES_LOTE.map(c => {
                const selectedColor = (editLote.color || COLORES_LOTE[0].value) === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setEditLote({ ...editLote, color: c.value })}
                    title={`${c.label} (${c.colorLabel})`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 10,
                      background: selectedColor ? c.value + "18" : "#fff",
                      border: selectedColor ? `2px solid ${c.value}` : "1.5px solid #e5e7eb",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      color: selectedColor ? c.value : "#374151",
                      transition: "all .1s",
                    }}
                  >
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: c.value,
                      border: "2px solid #fff",
                      boxShadow: "0 0 0 1px #e5e7eb",
                    }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setEditLote(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={saveLote} full><I.save /> Guardar</Btn>
          </div>
        </Modal>
      )}

      {/* 🆕 Carpeta / ficha del lote */}
      {fichaLote && (
        <FichaLote
          lote={fichaLote}
          campo={campo}
          ordenes={ordenes}
          orgId={orgId}
          data={data}
          reload={reload}
          toast={toast}
          onClose={() => setFichaLote(null)}
          onUpdateLote={(updated) => {
            // guardar cambios de notas del lote dentro de lotes_data
            const nuevos = (campo.lotes_data || []).map(l => l.id === updated.id ? updated : l);
            onUpdate(nuevos);
            setFichaLote(updated);
          }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 🆕 FICHA / CARPETA DEL LOTE — Info, Órdenes e Imágenes (NDVI/satelitales)
// ════════════════════════════════════════════════════════════════════════════
function FichaLote({ lote, campo, ordenes, orgId, data, reload, toast, onClose, onUpdateLote }) {
  const [tab, setTab] = useState("info");
  const [notas, setNotas] = useState(lote.notas || "");
  const [savingNotas, setSavingNotas] = useState(false);

  // Imágenes del lote
  const [imagenes, setImagenes] = useState([]);
  const [loadingImgs, setLoadingImgs] = useState(true);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [tipoImg, setTipoImg] = useState("satelital");
  const [tituloImg, setTituloImg] = useState("");
  const [viewerImg, setViewerImg] = useState(null);
  const imgFileRef = useRef();

  const colorInfo = COLORES_LOTE.find(c => c.value === lote.color) || COLORES_LOTE[0];

  // Órdenes asociadas a este lote: por lotes_ids (preferido) o por nombre en el título (fallback)
  const ordenesLote = (ordenes || []).filter(o => {
    const porId = Array.isArray(o.lotes_ids) && o.lotes_ids.includes(lote.id);
    const porNombre = lote.nombre && o.titulo?.toLowerCase().includes(lote.nombre.toLowerCase());
    return porId || porNombre;
  });

  // Cargar imágenes del lote desde la tabla lote_imagenes
  const cargarImagenes = useCallback(async () => {
    setLoadingImgs(true);
    const { data: rows, error } = await sb
      .from("lote_imagenes")
      .select("*")
      .eq("campo_id", campo.id)
      .eq("lote_id", String(lote.id))
      .order("fecha", { ascending: false });
    if (!error && rows) setImagenes(rows);
    setLoadingImgs(false);
  }, [campo.id, lote.id]);

  useEffect(() => { cargarImagenes(); }, [cargarImagenes]);

  // Guardar notas (van dentro de lotes_data del campo)
  const guardarNotas = async () => {
    setSavingNotas(true);
    onUpdateLote({ ...lote, notas });
    setSavingNotas(false);
    if (toast) toast("Notas guardadas");
  };

  // Subir una imagen al bucket "lotes" y registrarla en la tabla
  const subirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      if (toast) toast("La imagen supera los 10 MB", "error");
      return;
    }
    setUploadingImg(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${orgId}/${campo.id}/${lote.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("lotes").upload(path, file);
      if (upErr) { if (toast) toast(upErr.message, "error"); setUploadingImg(false); return; }
      const { data: { publicUrl } } = sb.storage.from("lotes").getPublicUrl(path);
      const { error: insErr } = await sb.from("lote_imagenes").insert({
        org_id: orgId,
        campo_id: campo.id,
        lote_id: String(lote.id),
        tipo: tipoImg,
        titulo: tituloImg || null,
        url: publicUrl,
        storage_path: path,
      });
      if (insErr) { if (toast) toast(insErr.message, "error"); setUploadingImg(false); return; }
      setTituloImg("");
      if (toast) toast("Imagen subida");
      await cargarImagenes();
    } catch (err) {
      if (toast) toast("Error al subir: " + err.message, "error");
    }
    setUploadingImg(false);
    if (imgFileRef.current) imgFileRef.current.value = "";
  };

  // Borrar imagen (de storage y de la tabla)
  const borrarImagen = async (img) => {
    try {
      await sb.storage.from("lotes").remove([img.storage_path]);
      await sb.from("lote_imagenes").delete().eq("id", img.id);
      if (toast) toast("Imagen eliminada");
      await cargarImagenes();
    } catch (err) {
      if (toast) toast("Error al borrar: " + err.message, "error");
    }
  };

  const TIPOS_IMG = [
    { value: "satelital", label: "🛰️ Satelital" },
    { value: "ndvi", label: "🌿 NDVI" },
    { value: "foto", label: "📷 Foto" },
    { value: "otro", label: "📄 Otro" },
  ];

  const tabStyle = (active) => ({
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    color: active ? "#16a34a" : "#6b7280",
    borderBottom: active ? "2px solid #16a34a" : "2px solid transparent",
  });

  return (
    <Modal title={`📁 ${lote.nombre || `Lote ${lote.numero}`}`} onClose={onClose} wide>
      {/* Encabezado con datos rápidos */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16, padding: "12px 14px", background: "#f9fafb", borderRadius: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: colorInfo.value, border: "2px solid #fff", boxShadow: "0 0 0 1px #e5e7eb" }} />
          <div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>Razón social</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{colorInfo.label}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>Uso</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{lote.cultivo || "—"}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>Hectáreas</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{lote.hectareas} ha</div>
        </div>
      </div>

      {/* Pestañas */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e5e7eb", marginBottom: 16 }}>
        <button style={tabStyle(tab === "info")} onClick={() => setTab("info")}><I.info /> Info</button>
        <button style={tabStyle(tab === "ordenes")} onClick={() => setTab("ordenes")}><I.clipboard /> Órdenes ({ordenesLote.length})</button>
        <button style={tabStyle(tab === "imagenes")} onClick={() => setTab("imagenes")}><I.image /> Imágenes ({imagenes.length})</button>
      </div>

      {/* ─── TAB INFO ─── */}
      {tab === "info" && (
        <div>
          <Textarea
            label="Notas y observaciones del lote"
            value={notas}
            onChange={e => setNotas(e.target.value)}
            placeholder="Ej: Lote con buena retención de humedad. Última fertilización en marzo. Problemas de drenaje en la esquina noreste..."
          />
          <EditOnly>
            <Btn variant="primary" small onClick={guardarNotas} disabled={savingNotas}>
              <I.save /> Guardar notas
            </Btn>
          </EditOnly>
        </div>
      )}

      {/* ─── TAB ÓRDENES ─── */}
      {tab === "ordenes" && (
        <div>
          {ordenesLote.length === 0
            ? <div style={{ textAlign: "center", padding: "30px 20px", color: "#9ca3af", fontSize: 13 }}>
                <I.clipboard /><div style={{ marginTop: 8 }}>No hay órdenes asociadas a este lote.</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Las órdenes que asocies a este lote (o cuyo título incluya su nombre) van a aparecer acá.</div>
              </div>
            : ordenesLote.map(o => (
                <div key={o.id} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #f3f4f6", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{TIPO_ICON[o.tipo] || "📋"} {o.titulo}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{o.responsable ? `👤 ${o.responsable} · ` : ""}{fmtDate(o.fecha)}</div>
                  </div>
                  <Badge
                    label={o.estado}
                    bg={o.estado === "Completada" ? "#dcfce7" : "#fef3c7"}
                    c={o.estado === "Completada" ? "#15803d" : "#b45309"}
                  />
                </div>
              ))
          }
        </div>
      )}

      {/* ─── TAB IMÁGENES ─── */}
      {tab === "imagenes" && (
        <div>
          <EditOnly>
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Subir nueva imagen</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <Sel label="Tipo" value={tipoImg} onChange={e => setTipoImg(e.target.value)}>
                    {TIPOS_IMG.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </Sel>
                </div>
                <div style={{ flex: 2, minWidth: 180 }}>
                  <Inp label="Título (opcional)" value={tituloImg} onChange={e => setTituloImg(e.target.value)} placeholder="Ej: NDVI enero 2026" />
                </div>
              </div>
              <input ref={imgFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={subirImagen} />
              <Btn variant="primary" small onClick={() => imgFileRef.current.click()} disabled={uploadingImg}>
                <I.upload /> {uploadingImg ? "Subiendo..." : "Elegir y subir imagen"}
              </Btn>
            </div>
          </EditOnly>

          {loadingImgs
            ? <div style={{ textAlign: "center", padding: 20, color: "#9ca3af", fontSize: 13 }}>Cargando imágenes...</div>
            : imagenes.length === 0
              ? <div style={{ textAlign: "center", padding: "30px 20px", color: "#9ca3af", fontSize: 13 }}>
                  <I.image /><div style={{ marginTop: 8 }}>Todavía no subiste imágenes de este lote.</div>
                </div>
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                  {imagenes.map(img => (
                    <div key={img.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                      <div
                        style={{ width: "100%", height: 110, background: `#f3f4f6 url(${img.url}) center/cover`, cursor: "pointer" }}
                        onClick={() => setViewerImg(img)}
                      />
                      <div style={{ padding: "6px 8px" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {TIPOS_IMG.find(t => t.value === img.tipo)?.label || img.tipo}
                        </div>
                        {img.titulo && <div style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{img.titulo}</div>}
                        <div style={{ fontSize: 10, color: "#9ca3af", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                          <span>{fmtDate(img.fecha)}</span>
                          <AdminOnly>
                            <button onClick={() => borrarImagen(img)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 0 }} title="Eliminar"><I.trash /></button>
                          </AdminOnly>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          }

          {/* Visor de imagen ampliada */}
          {viewerImg && (
            <div
              onClick={() => setViewerImg(null)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            >
              <div style={{ maxWidth: "90%", maxHeight: "90%", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                <img src={viewerImg.url} alt={viewerImg.titulo || ""} style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 8 }} />
                <div style={{ color: "#fff", marginTop: 10, fontSize: 13 }}>
                  {viewerImg.titulo || (TIPOS_IMG.find(t => t.value === viewerImg.tipo)?.label)} · {fmtDate(viewerImg.fecha)}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
                  <a href={viewerImg.url} target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "underline", fontSize: 13 }}>Abrir en pestaña nueva</a>
                  <button onClick={() => setViewerImg(null)} style={{ background: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Cerrar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function AnimalesPage({data,orgId,toast,reload,modalReq,clearModal,dolar}){
  const EMPTY={rodeo:"",campo:"",lote:"",tipo:"vacas",raza:"Angus",razaCustom:"",cabezas:"",costo_por_cabeza:"",costo:0,fecha:todayISO()};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const [search,setSearch]=useState("");
  const [campoFil,setCampoFil]=useState("Todos");
  const [transferItem,setTransferItem]=useState(null);

  const filtered=data.animales.filter(a=>{
    const matchSearch = a.rodeo?.toLowerCase().includes(search.toLowerCase())||a.campo?.toLowerCase().includes(search.toLowerCase())||a.raza?.toLowerCase().includes(search.toLowerCase());
    const matchCampo = campoFil==="Todos"||a.campo===campoFil;
    return matchSearch&&matchCampo;
  });

  const save = async ()=>{
    if(!editItem.rodeo||!editItem.cabezas){toast("Faltan campos","error");return;}
    const cabezas = Number(editItem.cabezas);
    const cpc = Number(editItem.costo_por_cabeza||0);
    const total = cabezas*cpc;
    const raza = editItem.raza==="Otra"?editItem.razaCustom:editItem.raza;
    const row={rodeo:editItem.rodeo,campo:editItem.campo,lote:editItem.lote,tipo:editItem.tipo,raza,cabezas,costo_por_cabeza:cpc,costo:total,fecha:editItem.fecha||todayISO()};

    const isEdit = !!editItem.id_real;
    let oldCosto = 0;
    if(isEdit){
      const old = data.animales.find(a=>a.id===editItem.id_real);
      oldCosto = Number(old?.costo||0);
      const {error}=await sb.from("animales").update(row).eq("id",editItem.id_real);
      if(error){toast(error.message,"error");return;}
      toast("Rodeo actualizado");
    } else {
      const {data:inserted,error}=await sb.from("animales").insert({...row,org_id:orgId}).select().single();
      if(error){toast(error.message,"error");return;}
      toast("Rodeo agregado");
      if(total>0){
        await sb.from("finanzas").insert({org_id:orgId,fecha:row.fecha,tipo:"Egreso",concepto:`Compra ${cabezas} ${row.tipo} - ${row.rodeo}`,categoria:"Compra hacienda",campo:row.campo,monto:total,origen:"animal",origen_id:inserted.id});
      }
    }

    if(isEdit && total!==oldCosto){
      const diff = total-oldCosto;
      if(diff!==0){
        await sb.from("finanzas").insert({org_id:orgId,fecha:todayISO(),tipo:"Egreso",concepto:`Ajuste rodeo ${row.rodeo}`,categoria:"Compra hacienda",campo:row.campo,monto:diff,origen:"animal_ajuste",origen_id:editItem.id_real});
      }
    }

    setEditItem(null); reload();
  };

  const del = async id=>{
    await sb.from("finanzas").delete().eq("origen_id",id).in("origen",["animal","animal_ajuste"]);
    const {error}=await sb.from("animales").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Rodeo eliminado"); reload();
  };

  const transferirRodeo = async ()=>{
    const t = transferItem;
    if(!t.campo_destino){toast("Elegí el campo destino","error");return;}
    if(t.campo_destino===t.original.campo && (t.lote_destino||"")===(t.original.lote||"")){
      toast("El destino es igual al origen","error");return;
    }
    const cabezasMover = Number(t.cabezas_a_mover);
    const cabezasOrig = Number(t.original.cabezas);
    if(!cabezasMover || cabezasMover<=0 || cabezasMover>cabezasOrig){
      toast("Cantidad de cabezas inválida","error");return;
    }
    const cpc = Number(t.original.costo_por_cabeza||0);

    if(cabezasMover===cabezasOrig){
      const {error} = await sb.from("animales").update({
        campo:t.campo_destino,
        lote:t.lote_destino||"",
      }).eq("id",t.original.id);
      if(error){toast(error.message,"error");return;}
      await registrarMovimiento(orgId,{
        tipo:"transfer_rodeo",
        descripcion:`Rodeo "${t.original.rodeo}" (${cabezasMover} ${t.original.tipo}) transferido completo`,
        campo_origen:t.original.campo,
        campo_destino:t.campo_destino,
        lote_origen:t.original.lote||null,
        lote_destino:t.lote_destino||null,
        cantidad:cabezasMover,
        unidad:"cabezas",
        detalles:{rodeo:t.original.rodeo,tipo:t.original.tipo,raza:t.original.raza,parcial:false},
      });
      toast(`Rodeo movido a ${t.campo_destino}`);
    } else {
      const cabezasQuedan = cabezasOrig - cabezasMover;
      const {error:e1} = await sb.from("animales").update({
        cabezas:cabezasQuedan,
        costo:cabezasQuedan*cpc,
      }).eq("id",t.original.id);
      if(e1){toast(e1.message,"error");return;}

      const nuevoRodeo = {
        rodeo:t.original.rodeo,
        campo:t.campo_destino,
        lote:t.lote_destino||"",
        tipo:t.original.tipo,
        raza:t.original.raza,
        cabezas:cabezasMover,
        costo_por_cabeza:cpc,
        costo:cabezasMover*cpc,
        fecha:t.original.fecha,
        org_id:orgId,
      };
      const {error:e2} = await sb.from("animales").insert(nuevoRodeo);
      if(e2){toast(e2.message,"error");return;}
      await registrarMovimiento(orgId,{
        tipo:"transfer_rodeo",
        descripcion:`${cabezasMover} ${t.original.tipo} del rodeo "${t.original.rodeo}" transferidos (parcial)`,
        campo_origen:t.original.campo,
        campo_destino:t.campo_destino,
        lote_origen:t.original.lote||null,
        lote_destino:t.lote_destino||null,
        cantidad:cabezasMover,
        unidad:"cabezas",
        detalles:{rodeo:t.original.rodeo,tipo:t.original.tipo,raza:t.original.raza,parcial:true,quedan_en_origen:cabezasQuedan},
      });
      toast(`${cabezasMover} cab. transferidas a ${t.campo_destino}`);
    }
    setTransferItem(null); reload();
  };

  return(
    <div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <KPI label="Rodeos" value={filtered.length}/>
        <KPI label="Cabezas" value={filtered.reduce((s,a)=>s+Number(a.cabezas||0),0).toLocaleString("es-AR")} color="#16a34a"/>
        <KPI label="Promedio/rodeo" value={filtered.length?Math.round(filtered.reduce((s,a)=>s+Number(a.cabezas||0),0)/filtered.length):0}/>
        <KPI label="Valor total" value={fmtK(filtered.reduce((s,a)=>s+Number(a.costo||0),0))}/>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}><I.search/></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar rodeo, raza..."
              style={{width:"100%",padding:"8px 12px 8px 36px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:14,boxSizing:"border-box"}}/>
          </div>
          <select value={campoFil} onChange={e=>setCampoFil(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,background:"#fff"}}>
            <option>Todos</option>
            {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
              {["Rodeo","Campo","Lote","Tipo","Raza","Cabezas","$/cab","Costo total","Formado","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 12px",fontSize:12,fontWeight:700,color:"#6b7280",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id} style={{borderBottom:"1px solid #f9fafb"}}>
                  <td style={{padding:"12px",fontWeight:600}}>🐄 {a.rodeo}</td>
                  <td style={{padding:"12px",fontSize:13,color:"#6b7280"}}>{a.campo}</td>
                  <td style={{padding:"12px",fontSize:13,color:"#6b7280"}}>{a.lote||"—"}</td>
                  <td style={{padding:"12px",fontSize:13}}>{a.tipo}</td>
                  <td style={{padding:"12px"}}><Badge label={a.raza}/></td>
                  <td style={{padding:"12px",color:"#16a34a",fontWeight:800,fontSize:16}}>{a.cabezas}</td>
                  <td style={{padding:"12px",fontSize:13}}>{fmt(a.costo_por_cabeza||0)}</td>
                  <td style={{padding:"12px",fontSize:13,fontWeight:600}}>{fmtK(a.costo||0)}</td>
                  <td style={{padding:"12px",fontSize:12,color:"#6b7280"}}>{fmtDate(a.fecha)}</td>
                  <td style={{padding:"12px"}}>
                    <div style={{display:"flex",gap:4}}>
                      <EditOnly>
                        <Btn variant="ghost" small onClick={()=>setTransferItem({
                          original:a,
                          campo_destino:"",
                          lote_destino:"",
                          cabezas_a_mover:a.cabezas,
                        })} title="Transferir a otro campo">🔄</Btn>
                      </EditOnly>
                      <EditBtn onClick={()=>{
                        const razaPredef = RAZAS_PREDEFINIDAS.includes(a.raza);
                        setEditItem({...a,id_real:a.id,raza:razaPredef?a.raza:"Otra",razaCustom:razaPredef?"":a.raza});
                      }}/>
                      <DelBtn onClick={()=>setConfirm(a.id)}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editItem&&(()=>{
        const campoSel = data.campos.find(c=>c.nombre===editItem.campo);
        const lotesDelCampo = campoSel?.lotes_data||[];
        const totalCalc = (Number(editItem.cabezas)||0)*(Number(editItem.costo_por_cabeza)||0);
        return(
        <Modal title={editItem.id_real?"Editar Rodeo":"Nuevo Rodeo"} onClose={()=>setEditItem(null)}>
          <Inp label="Nombre del rodeo" value={editItem.rodeo} onChange={e=>setEditItem({...editItem,rodeo:e.target.value})}/>
          <Sel label="Campo" value={editItem.campo} onChange={e=>setEditItem({...editItem,campo:e.target.value,lote:""})}>
            <option value="">Seleccionar...</option>
            {data.campos.map(c=><option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </Sel>
          {lotesDelCampo.length>0 ? (
            <Sel label="Lote / Potrero" value={editItem.lote} onChange={e=>setEditItem({...editItem,lote:e.target.value})}>
              <option value="">Sin asignar</option>
              {lotesDelCampo.map(l=><option key={l.id} value={l.nombre}>{l.nombre||`Lote ${l.numero}`}{l.cultivo?` (${l.cultivo})`:""}</option>)}
            </Sel>
          ):(
            <div style={{marginBottom:13}}>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:4}}>Lote / Potrero</label>
              {!editItem.campo
                ? <div style={{padding:"9px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",background:"#f9fafb",fontSize:13,color:"#9ca3af"}}>Seleccioná un campo primero</div>
                : <>
                    <input style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:14,outline:"none",boxSizing:"border-box"}} value={editItem.lote} onChange={e=>setEditItem({...editItem,lote:e.target.value})} placeholder="Escribir manualmente..."/>
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:4}}>Tip: marcá lotes en el mapa del campo para verlos como opciones</div>
                  </>
              }
            </div>
          )}
          <Sel label="Tipo de animal" value={editItem.tipo} onChange={e=>setEditItem({...editItem,tipo:e.target.value})}>
            {["vacas","novillos","vaquillonas","toros","terneros"].map(t=><option key={t}>{t}</option>)}
          </Sel>
          <Sel label="Raza" value={editItem.raza} onChange={e=>setEditItem({...editItem,raza:e.target.value})}>
            {RAZAS_PREDEFINIDAS.map(r=><option key={r}>{r}</option>)}
          </Sel>
          {editItem.raza==="Otra"&&<Inp label="Especificar raza" value={editItem.razaCustom||""} onChange={e=>setEditItem({...editItem,razaCustom:e.target.value})}/>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Cabezas" type="number" value={editItem.cabezas} onChange={e=>setEditItem({...editItem,cabezas:e.target.value})}/>
            <Inp label="Costo por cabeza (ARS)" type="number" value={editItem.costo_por_cabeza} onChange={e=>setEditItem({...editItem,costo_por_cabeza:e.target.value})}/>
          </div>
          <div style={{background:"#f0fdf4",borderRadius:8,padding:"10px 14px",marginBottom:10,fontSize:13}}>
            Costo total: <b style={{color:"#16a34a"}}>{fmt(totalCalc)}</b>
            <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>USD: <b>{fmtUSD(totalCalc,dolar)}</b></div>
          </div>
          <Inp label="Fecha" type="date" value={editItem.fecha} onChange={e=>setEditItem({...editItem,fecha:e.target.value})}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
        );
      })()}

      {transferItem&&(()=>{
        const campoDestObj = data.campos.find(c=>c.nombre===transferItem.campo_destino);
        const lotesDestino = campoDestObj?.lotes_data||[];
        const camposDisponibles = data.campos.filter(c=>c.nombre!==transferItem.original.campo);
        return(
        <Modal title={`Transferir rodeo "${transferItem.original.rodeo}"`} onClose={()=>setTransferItem(null)}>
          <div style={{background:"#f9fafb",borderRadius:10,padding:12,marginBottom:14,fontSize:13}}>
            <div style={{marginBottom:4}}>📍 <b>Origen:</b> {transferItem.original.campo}{transferItem.original.lote?` · ${transferItem.original.lote}`:""}</div>
            <div>🐄 <b>{transferItem.original.cabezas}</b> {transferItem.original.tipo} ({transferItem.original.raza})</div>
          </div>

          <Sel label="Campo destino" value={transferItem.campo_destino} onChange={e=>setTransferItem({...transferItem,campo_destino:e.target.value,lote_destino:""})}>
            <option value="">Seleccionar...</option>
            {camposDisponibles.map(c=><option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </Sel>

          {transferItem.campo_destino && lotesDestino.length>0 && (
            <Sel label="Lote destino" value={transferItem.lote_destino} onChange={e=>setTransferItem({...transferItem,lote_destino:e.target.value})}>
              <option value="">Sin asignar</option>
              {lotesDestino.map(l=><option key={l.id} value={l.nombre}>{l.nombre||`Lote ${l.numero}`}{l.cultivo?` (${l.cultivo})`:""}</option>)}
            </Sel>
          )}

          <Inp label={`Cabezas a transferir (máximo ${transferItem.original.cabezas})`} type="number" value={transferItem.cabezas_a_mover} onChange={e=>setTransferItem({...transferItem,cabezas_a_mover:e.target.value})}/>

          {Number(transferItem.cabezas_a_mover)<Number(transferItem.original.cabezas) && Number(transferItem.cabezas_a_mover)>0 && (
            <div style={{background:"#fef9c3",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#92400e"}}>
              ℹ️ Se moverán {transferItem.cabezas_a_mover} cab. al campo destino. Quedarán <b>{Number(transferItem.original.cabezas)-Number(transferItem.cabezas_a_mover||0)}</b> cab. en {transferItem.original.campo}.
            </div>
          )}
          {Number(transferItem.cabezas_a_mover)===Number(transferItem.original.cabezas) && (
            <div style={{background:"#dcfce7",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#15803d"}}>
              ✓ Se transferirá el rodeo completo.
            </div>
          )}

          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setTransferItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={transferirRodeo} full>🔄 Transferir</Btn>
          </div>
        </Modal>
        );
      })()}

      {confirm&&<ConfirmModal msg="¿Eliminar este rodeo?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}


// ── STOCK ───────────────────────────────────────────────────────────────────
function StockPage({data,orgId,toast,reload,modalReq,clearModal}){
  const EMPTY={nombre:"",nombreCustom:"",unidad:"kg",categoria:"Fertilizante",cantidad:"",minimo:"",costo_unit:"",ubicacion:"",sociedad:""};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const [comprarItem,setComprarItem]=useState(null);
  const [transferItem,setTransferItem]=useState(null);
  const [search,setSearch]=useState("");
  const [catFilter,setCatFilter]=useState("Todas");
  const [campoFil,setCampoFil]=useState("Todos");
  const [socFil,setSocFil]=useState("Todas"); // 🆕 filtro por sociedad

  const cats=["Todas",...CATEGORIAS_STOCK];

  const filtered=data.stock.filter(s=>{
    const matchCat = catFilter==="Todas"||s.categoria===catFilter;
    const matchSearch = s.nombre?.toLowerCase().includes(search.toLowerCase());
    const matchCampo = campoFil==="Todos"||s.ubicacion===campoFil;
    // 🆕 al filtrar por sociedad, mostrar solo insumos que tengan algo de esa sociedad
    const matchSoc = socFil==="Todas"||getCantSoc(s)[socFil]>0;
    return matchCat&&matchSearch&&matchCampo&&matchSoc;
  });

  const save = async ()=>{
    const nombreFinal = editItem.nombre==="Otro"?editItem.nombreCustom:editItem.nombre;
    if(!nombreFinal){toast("Faltan campos","error");return;}
    const cant = Number(editItem.cantidad||0);

    // 🆕 Armar el reparto por sociedad
    let cantidades_soc;
    if(editItem.id_real){
      // Al editar: respetar el reparto existente, pero si cambió la sociedad/cantidad
      // y había una sola sociedad asignada, reasignar todo a la elegida.
      const prev = getCantSoc(editItem);
      const tieneReparto = (prev["M.R."]+prev["D.R."]+prev["J.S."])>0;
      if(editItem.sociedad){
        // si el usuario eligió una sociedad explícita, todo el total va a esa
        cantidades_soc = {"M.R.":0,"D.R.":0,"J.S.":0, [editItem.sociedad]:cant};
      } else {
        cantidades_soc = tieneReparto ? prev : {};
      }
    } else {
      // Al crear: la cantidad inicial va a la sociedad elegida (si eligió una)
      cantidades_soc = editItem.sociedad
        ? {"M.R.":0,"D.R.":0,"J.S.":0, [editItem.sociedad]:cant}
        : {};
    }

    const row={
      nombre:nombreFinal,
      unidad:editItem.unidad,
      categoria:editItem.categoria,
      cantidad:cant,
      minimo:Number(editItem.minimo||0),
      costo_unit:Number(editItem.costo_unit||0),
      ubicacion:editItem.ubicacion,
      cantidades_soc,
    };
    if(editItem.id_real){
      const {error}=await sb.from("stock").update(row).eq("id",editItem.id_real);
      if(error){toast(error.message,"error");return;}
      toast("Insumo actualizado");
    } else {
      const total = row.cantidad*row.costo_unit;
      const {data:inserted,error}=await sb.from("stock").insert({...row,org_id:orgId}).select().single();
      if(error){toast(error.message,"error");return;}
      if(total>0){
        await sb.from("finanzas").insert({org_id:orgId,fecha:todayISO(),tipo:"Egreso",concepto:`Compra inicial ${row.nombre} (${row.cantidad} ${row.unidad})${editItem.sociedad?` [${editItem.sociedad}]`:""}`,categoria:"Compra insumos",campo:row.ubicacion,monto:total,origen:"stock",origen_id:inserted.id});
      }
      toast("Insumo agregado");
    }
    setEditItem(null); reload();
  };

  const comprar = async ()=>{
    if(!comprarItem.cantidad||!comprarItem.costo_unit){toast("Faltan datos","error");return;}
    if(!comprarItem.sociedad){toast("Elegí la sociedad","error");return;}
    const cantNueva = Number(comprarItem.cantidad);
    const costo = Number(comprarItem.costo_unit);
    const cantActual = Number(comprarItem.item.cantidad);
    const total = cantNueva*costo;
    const newAvg = ((cantActual*Number(comprarItem.item.costo_unit))+(cantNueva*costo))/(cantActual+cantNueva);
    // 🆕 sumar la compra a la sociedad elegida
    const cs = getCantSoc(comprarItem.item);
    cs[comprarItem.sociedad] = Number(cs[comprarItem.sociedad]||0) + cantNueva;
    const fechaCompra = comprarItem.fecha || todayISO();
    await sb.from("stock").update({cantidad:cantActual+cantNueva,costo_unit:newAvg,cantidades_soc:cs}).eq("id",comprarItem.item.id);
    await sb.from("finanzas").insert({org_id:orgId,fecha:fechaCompra,tipo:"Egreso",concepto:`Compra ${comprarItem.item.nombre} (+${cantNueva} ${comprarItem.item.unidad}) [${comprarItem.sociedad}]`,categoria:"Compra insumos",campo:comprarItem.item.ubicacion,monto:total,origen:"stock_compra",origen_id:comprarItem.item.id});
    toast(`+${cantNueva} ${comprarItem.item.unidad} de ${comprarItem.item.nombre} (${comprarItem.sociedad})`);
    setComprarItem(null); reload();
  };

  const transferirInsumo = async ()=>{
    const t = transferItem;
    if(!t.campo_destino){toast("Elegí el campo destino","error");return;}
    if(t.campo_destino===t.item.ubicacion){toast("El destino es igual al origen","error");return;}
    const cantMover = Number(t.cantidad_a_mover);
    const cantOrig = Number(t.item.cantidad);
    if(!cantMover || cantMover<=0 || cantMover>cantOrig){
      toast("Cantidad inválida","error");return;
    }
    const costoUnitOrig = Number(t.item.costo_unit||0);

    if(cantMover===cantOrig){
      const existente = data.stock.find(s=>
        s.id!==t.item.id &&
        s.ubicacion===t.campo_destino &&
        s.nombre===t.item.nombre &&
        s.categoria===t.item.categoria &&
        s.unidad===t.item.unidad
      );
      if(existente){
        const cantDest = Number(existente.cantidad);
        const costoUnitDest = Number(existente.costo_unit||0);
        const nuevoCostoUnit = ((cantDest*costoUnitDest)+(cantMover*costoUnitOrig))/(cantDest+cantMover);
        await sb.from("stock").update({
          cantidad:cantDest+cantMover,
          costo_unit:nuevoCostoUnit,
        }).eq("id",existente.id);
        await sb.from("stock").delete().eq("id",t.item.id);
        await registrarMovimiento(orgId,{
          tipo:"transfer_insumo",
          descripcion:`${cantMover} ${t.item.unidad} de ${t.item.nombre} transferidos (fusión en destino)`,
          campo_origen:t.item.ubicacion,
          campo_destino:t.campo_destino,
          cantidad:cantMover,
          unidad:t.item.unidad,
          detalles:{insumo:t.item.nombre,categoria:t.item.categoria,fusion:true,parcial:false},
        });
        toast(`Movido y fusionado con stock existente en ${t.campo_destino}`);
      } else {
        const {error} = await sb.from("stock").update({ubicacion:t.campo_destino}).eq("id",t.item.id);
        if(error){toast(error.message,"error");return;}
        await registrarMovimiento(orgId,{
          tipo:"transfer_insumo",
          descripcion:`${cantMover} ${t.item.unidad} de ${t.item.nombre} transferidos completos`,
          campo_origen:t.item.ubicacion,
          campo_destino:t.campo_destino,
          cantidad:cantMover,
          unidad:t.item.unidad,
          detalles:{insumo:t.item.nombre,categoria:t.item.categoria,fusion:false,parcial:false},
        });
        toast(`Insumo movido a ${t.campo_destino}`);
      }
    } else {
      const cantQueda = cantOrig - cantMover;
      const {error:e1} = await sb.from("stock").update({cantidad:cantQueda}).eq("id",t.item.id);
      if(e1){toast(e1.message,"error");return;}

      const existente = data.stock.find(s=>
        s.id!==t.item.id &&
        s.ubicacion===t.campo_destino &&
        s.nombre===t.item.nombre &&
        s.categoria===t.item.categoria &&
        s.unidad===t.item.unidad
      );
      if(existente){
        const cantDest = Number(existente.cantidad);
        const costoUnitDest = Number(existente.costo_unit||0);
        const nuevoCostoUnit = ((cantDest*costoUnitDest)+(cantMover*costoUnitOrig))/(cantDest+cantMover);
        await sb.from("stock").update({
          cantidad:cantDest+cantMover,
          costo_unit:nuevoCostoUnit,
        }).eq("id",existente.id);
      } else {
        const nuevoStock = {
          nombre:t.item.nombre,
          unidad:t.item.unidad,
          categoria:t.item.categoria,
          cantidad:cantMover,
          minimo:Number(t.item.minimo||0),
          costo_unit:costoUnitOrig,
          ubicacion:t.campo_destino,
          org_id:orgId,
        };
        const {error:e2} = await sb.from("stock").insert(nuevoStock);
        if(e2){toast(e2.message,"error");return;}
      }
      await registrarMovimiento(orgId,{
        tipo:"transfer_insumo",
        descripcion:`${cantMover} ${t.item.unidad} de ${t.item.nombre} transferidos (parcial)`,
        campo_origen:t.item.ubicacion,
        campo_destino:t.campo_destino,
        cantidad:cantMover,
        unidad:t.item.unidad,
        detalles:{insumo:t.item.nombre,categoria:t.item.categoria,parcial:true,quedan_en_origen:cantQueda},
      });
      toast(`${cantMover} ${t.item.unidad} transferidos a ${t.campo_destino}`);
    }
    setTransferItem(null); reload();
  };

  const del = async id=>{
    await sb.from("finanzas").delete().eq("origen_id",id).in("origen",["stock","stock_compra"]);
    const {error}=await sb.from("stock").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Insumo eliminado"); reload();
  };

  const totalValor=data.stock.reduce((s,i)=>s+(Number(i.cantidad)*Number(i.costo_unit||0)),0);
  const bajStock=data.stock.filter(s=>Number(s.cantidad)<Number(s.minimo)).length;

  return(
    <div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <KPI label="Valor Total Stock" value={fmtK(totalValor)}/>
        <KPI label="Total Insumos" value={data.stock.length}/>
        <KPI label="Bajo Stock" value={bajStock} color={bajStock>0?"#dc2626":"#16a34a"}/>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}><I.search/></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar insumo..."
              style={{width:"100%",padding:"8px 12px 8px 34px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,boxSizing:"border-box"}}/>
          </div>
          <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,background:"#fff"}}>
            {cats.map(c=><option key={c}>{c}</option>)}
          </select>
          <select value={campoFil} onChange={e=>setCampoFil(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,background:"#fff"}}>
            <option>Todos</option>
            {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
          </select>
          <select value={socFil} onChange={e=>setSocFil(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,background:"#fff"}}>
            <option value="Todas">Todas las sociedades</option>
            {SOCIEDADES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
              {["Insumo","Categoría","Cantidad","Costo Unit.","Valor Total","Nivel","Campo","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 12px",fontSize:12,fontWeight:700,color:"#6b7280",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(s=>{
                const min = Math.max(Number(s.minimo),1);
                const pct=Math.min(100,(Number(s.cantidad)/(min*3))*100);
                const bajo=Number(s.cantidad)<Number(s.minimo);
                const bc=BADGE_C[s.categoria]||{};
                return(
                  <tr key={s.id} style={{borderBottom:"1px solid #f9fafb",background:bajo?"#fff5f5":"transparent"}}>
                    <td style={{padding:"12px",fontWeight:600}}>{s.nombre}<div style={{fontSize:11,color:"#9ca3af"}}>{s.unidad}</div></td>
                    <td style={{padding:"12px"}}><Badge label={s.categoria} c={bc.c} bg={bc.bg}/></td>
                    <td style={{padding:"12px",fontSize:13}}>{Number(s.cantidad).toLocaleString("es-AR")}<div style={{fontSize:11,color:bajo?"#ef4444":"#9ca3af"}}>Min: {s.minimo}</div>
                      {/* 🆕 desglose por sociedad */}
                      {(()=>{ const cs=getCantSoc(s); const sa=sinAsignar(s); const partes=SOCIEDADES.filter(soc=>cs[soc]>0); if(partes.length===0&&sa===0) return null; return (
                        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
                          {partes.map(soc=>(
                            <span key={soc} style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:8,background:SOC_COLOR[soc]+"22",color:SOC_COLOR[soc]}}>{soc}: {Number(cs[soc]).toLocaleString("es-AR")}</span>
                          ))}
                          {sa>0&&<span style={{fontSize:10,fontWeight:600,padding:"1px 6px",borderRadius:8,background:"#f3f4f6",color:"#9ca3af"}}>s/asignar: {sa.toLocaleString("es-AR")}</span>}
                        </div>
                      ); })()}
                    </td>
                    <td style={{padding:"12px",fontSize:13}}>{fmt(s.costo_unit)}</td>
                    <td style={{padding:"12px",fontWeight:600,fontSize:13}}>{fmtK(Number(s.cantidad)*Number(s.costo_unit))}</td>
                    <td style={{padding:"12px",minWidth:100}}>
                      <div style={{height:6,background:"#e5e7eb",borderRadius:3}}>
                        <div style={{height:6,width:`${pct}%`,background:bajo?"#ef4444":"#16a34a",borderRadius:3}}/>
                      </div>
                    </td>
                    <td style={{padding:"12px",fontSize:13,color:"#6b7280"}}>{s.ubicacion}</td>
                    <td style={{padding:"12px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <EditOnly><Btn variant="secondary" small onClick={()=>setComprarItem({item:s,cantidad:"",costo_unit:s.costo_unit,sociedad:"",fecha:todayISO()})}>+ Comprar</Btn></EditOnly>
                        <EditOnly>
                          <Btn variant="ghost" small onClick={()=>setTransferItem({
                            item:s,
                            campo_destino:"",
                            cantidad_a_mover:s.cantidad,
                          })} title="Transferir a otro campo">🔄</Btn>
                        </EditOnly>
                        <EditBtn onClick={()=>{
                          const cs=getCantSoc(s);
                          const socs=SOCIEDADES.filter(soc=>cs[soc]>0);
                          const unaSola = socs.length===1 ? socs[0] : "";
                          setEditItem({...s,id_real:s.id,nombre:s.nombre,nombreCustom:"",sociedad:unaSola});
                        }}/>
                        <DelBtn onClick={()=>setConfirm(s.id)}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editItem&&(
        <Modal title={editItem.id_real?"Editar Insumo":"Agregar Insumo"} onClose={()=>setEditItem(null)}>
          <Sel label="Categoría" value={editItem.categoria} onChange={e=>setEditItem({...editItem,categoria:e.target.value,nombre:"",nombreCustom:""})}>
            {CATEGORIAS_STOCK.map(c=><option key={c}>{c}</option>)}
          </Sel>
          {!editItem.id_real ? (
            <>
              <Sel label="Insumo" value={editItem.nombre} onChange={e=>setEditItem({...editItem,nombre:e.target.value})}>
                <option value="">Seleccionar...</option>
                {getInsumosOpciones(editItem.categoria,data.stock).map(i=><option key={i}>{i}</option>)}
              </Sel>
              {editItem.nombre==="Otro"&&<Inp label="Especificar nombre" value={editItem.nombreCustom} onChange={e=>setEditItem({...editItem,nombreCustom:e.target.value})} placeholder="Ej: Roundup, Atrazina..."/>}
            </>
          ):(
            <Inp label="Nombre" value={editItem.nombre} onChange={e=>setEditItem({...editItem,nombre:e.target.value})}/>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Unidad" value={editItem.unidad} onChange={e=>setEditItem({...editItem,unidad:e.target.value})}>
              {UNIDADES.map(u=><option key={u}>{u}</option>)}
            </Sel>
            {data.campos.length===0
              ? <div style={{marginBottom:13}}>
                  <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:4}}>Ubicación (campo)</label>
                  <div style={{padding:"9px 12px",borderRadius:8,border:"1.5px solid #fef3c7",background:"#fffbeb",fontSize:13,color:"#92400e"}}>No hay campos ingresados</div>
                </div>
              : <Sel label="Ubicación (campo)" value={editItem.ubicacion} onChange={e=>setEditItem({...editItem,ubicacion:e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {data.campos.map(c=><option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                </Sel>
            }
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Cantidad" type="number" value={editItem.cantidad} onChange={e=>setEditItem({...editItem,cantidad:e.target.value})}/>
            <Inp label="Stock mínimo" type="number" value={editItem.minimo} onChange={e=>setEditItem({...editItem,minimo:e.target.value})}/>
          </div>
          <Inp label="Costo unitario ($)" type="number" value={editItem.costo_unit} onChange={e=>setEditItem({...editItem,costo_unit:e.target.value})}/>
          {/* 🆕 Sociedad dueña de esta cantidad */}
          <Sel label="Sociedad (razón social)" value={editItem.sociedad||""} onChange={e=>setEditItem({...editItem,sociedad:e.target.value})}>
            <option value="">— Sin asignar —</option>
            {SOCIEDADES.map(s=><option key={s} value={s}>{s}</option>)}
          </Sel>
          {editItem.id_real && editItem.sociedad && (
            <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#92400e"}}>
              ℹ️ Al guardar, toda la cantidad ({Number(editItem.cantidad||0).toLocaleString("es-AR")} {editItem.unidad}) quedará asignada a <b>{editItem.sociedad}</b>.
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
      )}

      {comprarItem&&(
        <Modal title={`Comprar ${comprarItem.item.nombre}`} onClose={()=>setComprarItem(null)}>
          <div style={{background:"#f0fdf4",borderRadius:8,padding:12,marginBottom:14,fontSize:13}}>
            Stock actual: <b>{comprarItem.item.cantidad} {comprarItem.item.unidad}</b>
          </div>
          <Inp label={`Cantidad a agregar (${comprarItem.item.unidad})`} type="number" value={comprarItem.cantidad} onChange={e=>setComprarItem({...comprarItem,cantidad:e.target.value})}/>
          <Inp label="Costo unitario actual ($)" type="number" value={comprarItem.costo_unit} onChange={e=>setComprarItem({...comprarItem,costo_unit:e.target.value})}/>
          {/* 🆕 A qué sociedad entra esta compra */}
          <Sel label="Sociedad que compra" value={comprarItem.sociedad||""} onChange={e=>setComprarItem({...comprarItem,sociedad:e.target.value})}>
            <option value="">Seleccionar...</option>
            {SOCIEDADES.map(s=><option key={s} value={s}>{s}</option>)}
          </Sel>
          {/* 🆕 Fecha de la compra (hoy por defecto, editable) */}
          <Inp label="Fecha de la compra" type="date" value={comprarItem.fecha||todayISO()} onChange={e=>setComprarItem({...comprarItem,fecha:e.target.value})}/>
          <div style={{background:"#fef9c3",borderRadius:8,padding:12,marginBottom:14,fontSize:13}}>
            Total compra: <b>{fmt((Number(comprarItem.cantidad)||0)*(Number(comprarItem.costo_unit)||0))}</b>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setComprarItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={comprar} full><I.plus/> Registrar compra</Btn>
          </div>
        </Modal>
      )}

      {transferItem&&(()=>{
        const camposDisponibles = data.campos.filter(c=>c.nombre!==transferItem.item.ubicacion);
        const cantMover = Number(transferItem.cantidad_a_mover)||0;
        const cantOrig = Number(transferItem.item.cantidad);
        const existeEnDestino = transferItem.campo_destino && data.stock.find(s=>
          s.id!==transferItem.item.id &&
          s.ubicacion===transferItem.campo_destino &&
          s.nombre===transferItem.item.nombre &&
          s.categoria===transferItem.item.categoria &&
          s.unidad===transferItem.item.unidad
        );
        return(
        <Modal title={`Transferir ${transferItem.item.nombre}`} onClose={()=>setTransferItem(null)}>
          <div style={{background:"#f9fafb",borderRadius:10,padding:12,marginBottom:14,fontSize:13}}>
            <div style={{marginBottom:4}}>📍 <b>Origen:</b> {transferItem.item.ubicacion||"Sin asignar"}</div>
            <div>📦 <b>{transferItem.item.cantidad}</b> {transferItem.item.unidad} disponibles</div>
          </div>

          <Sel label="Campo destino" value={transferItem.campo_destino} onChange={e=>setTransferItem({...transferItem,campo_destino:e.target.value})}>
            <option value="">Seleccionar...</option>
            {camposDisponibles.map(c=><option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </Sel>

          <Inp label={`Cantidad a transferir en ${transferItem.item.unidad} (máximo ${cantOrig})`} type="number" value={transferItem.cantidad_a_mover} onChange={e=>setTransferItem({...transferItem,cantidad_a_mover:e.target.value})}/>

          {existeEnDestino && (
            <div style={{background:"#dbeafe",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#1d4ed8"}}>
              ℹ️ Ya hay <b>{existeEnDestino.cantidad} {existeEnDestino.unidad}</b> de {transferItem.item.nombre} en {transferItem.campo_destino}. Se fusionará y el costo unitario se promediará.
            </div>
          )}
          {cantMover>0 && cantMover<cantOrig && (
            <div style={{background:"#fef9c3",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#92400e"}}>
              Quedarán <b>{cantOrig-cantMover} {transferItem.item.unidad}</b> en {transferItem.item.ubicacion}.
            </div>
          )}
          {cantMover===cantOrig && (
            <div style={{background:"#dcfce7",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#15803d"}}>
              ✓ Se transferirá todo el stock disponible.
            </div>
          )}

          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setTransferItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={transferirInsumo} full>🔄 Transferir</Btn>
          </div>
        </Modal>
        );
      })()}

      {confirm&&<ConfirmModal msg="¿Eliminar este insumo?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}


// ── MAQUINARIA ──────────────────────────────────────────────────────────────
function MaquinariaPage({data,orgId,toast,reload,modalReq,clearModal,dolar}){
  const EMPTY={nombre:"",tipo:"Tractor",marca:"",modelo:"",anio:"",color:"",patente:"",valor:"",horas:"",gastos:0,notas:""};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const [expanded,setExpanded]=useState(null);
  const [horasModal,setHorasModal]=useState(null);

  const save = async ()=>{
    if(!editItem.nombre){toast("Faltan campos","error");return;}
    const row={
      nombre:editItem.nombre,tipo:editItem.tipo,marca:editItem.marca,modelo:editItem.modelo,
      anio:Number(editItem.anio||0),color:editItem.color,patente:editItem.patente,
      valor:Number(editItem.valor||0),horas:Number(editItem.horas||0),
      gastos:Number(editItem.gastos||0),notas:editItem.notas||""
    };
    if(editItem.id){
      const {error}=await sb.from("maquinaria").update(row).eq("id",editItem.id);
      if(error){toast(error.message,"error");return;}
      toast("Máquina actualizada");
    } else {
      const {error}=await sb.from("maquinaria").insert({...row,org_id:orgId});
      if(error){toast(error.message,"error");return;}
      toast("Máquina registrada");
    }
    setEditItem(null); reload();
  };

  const del = async id=>{
    // Cascade: also remove related finanzas entries
    await sb.from("finanzas").delete().eq("origen_id",id).eq("origen","maquinaria");
    const {error}=await sb.from("maquinaria").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Máquina eliminada"); reload();
  };

  const sumarHoras = async (maq,delta)=>{
    const nuevas = Math.max(0,Number(maq.horas)+delta);
    await sb.from("maquinaria").update({horas:nuevas}).eq("id",maq.id);
    reload();
  };

  const registrarGasto = async ()=>{
    if(!horasModal.monto){toast("Falta monto","error");return;}
    const monto = Number(horasModal.monto);
    const nuevoGastos = Number(horasModal.maq.gastos)+monto;
    await sb.from("maquinaria").update({gastos:nuevoGastos}).eq("id",horasModal.maq.id);
    await sb.from("finanzas").insert({org_id:orgId,fecha:todayISO(),tipo:"Egreso",concepto:`Gasto ${horasModal.maq.nombre}: ${horasModal.concepto||"mantenimiento"}`,categoria:"Mantenimiento",campo:"",monto,origen:"maquinaria",origen_id:horasModal.maq.id});
    toast("Gasto registrado");
    setHorasModal(null); reload();
  };

  return(
    <div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <KPI label="Valor Total" value={fmtK(data.maquinaria.reduce((s,m)=>s+Number(m.valor||0),0))}/>
        <KPI label="Máquinas" value={data.maquinaria.length}/>
        <KPI label="Gastos Totales" value={fmtK(data.maquinaria.reduce((s,m)=>s+Number(m.gastos||0),0))}/>
        <KPI label="Horas Flota" value={`${data.maquinaria.reduce((s,m)=>s+Number(m.horas||0),0)} hs`}/>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {data.maquinaria.map(m=>(
          <div key={m.id} style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:10,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{MAQTIPO_I[m.tipo]||"⚙️"}</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:16}}>{m.nombre}</span>
                    <Badge label={m.tipo}/>
                  </div>
                  <div style={{fontSize:12,color:"#6b7280"}}>{m.anio} · {m.color} · {m.patente}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                <EditOnly><div style={{display:"flex",alignItems:"center",gap:6,background:"#f9fafb",borderRadius:8,padding:"4px 8px"}}>
                  <button onClick={()=>sumarHoras(m,-1)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:6,width:24,height:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><I.minus size={12}/></button>
                  <span style={{fontWeight:700,fontSize:13,minWidth:48,textAlign:"center"}}>{m.horas} hs</span>
                  <button onClick={()=>sumarHoras(m,1)} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:6,width:24,height:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><I.plus size={12}/></button>
                </div></EditOnly>
                {!canEdit(__currentRole)&&<div style={{display:"flex",alignItems:"center",gap:6,background:"#f9fafb",borderRadius:8,padding:"4px 12px"}}><span style={{fontWeight:700,fontSize:13}}>{m.horas} hs</span></div>}
                <EditOnly><Btn variant="secondary" small onClick={()=>setHorasModal({maq:m,monto:"",concepto:""})}>+ Gasto</Btn></EditOnly>
                <EditBtn onClick={()=>setEditItem({...m})}/>
                <DelBtn onClick={()=>setConfirm(m.id)}/>
                <button onClick={()=>setExpanded(expanded===m.id?null:m.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",transform:expanded===m.id?"rotate(180deg)":"none",transition:"transform .2s"}}><I.chevDown/></button>
              </div>
            </div>
            {expanded===m.id&&(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginTop:16,paddingTop:16,borderTop:"1px solid #f3f4f6"}}>
                  {[
                    ["Valor adquisición",fmt(m.valor),fmtUSD(m.valor,dolar)],
                    ["Horas de uso",`${m.horas} hs`,""],
                    ["Gastos totales",fmt(m.gastos),fmtUSD(m.gastos,dolar)],
                    ["Costo/hora",m.horas>0?fmt(Math.round(Number(m.gastos)/Number(m.horas))):"—",""]
                  ].map(([l,v,usd])=>(
                    <div key={l} style={{background:"#f9fafb",borderRadius:10,padding:14}}>
                      <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>{l}</div>
                      <div style={{fontWeight:700}}>{v}</div>
                      {usd&&<div style={{fontSize:11,color:"#9ca3af"}}>{usd}</div>}
                    </div>
                  ))}
                </div>
                {m.notas&&<div style={{marginTop:12,padding:"10px 14px",background:"#f0fdf4",borderRadius:8,fontSize:13}}>📝 {m.notas}</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      {editItem&&(
        <Modal title={editItem.id?"Editar Máquina":"Agregar Maquinaria"} onClose={()=>setEditItem(null)}>
          <Inp label="Nombre" value={editItem.nombre} onChange={e=>setEditItem({...editItem,nombre:e.target.value})}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Tipo" value={editItem.tipo} onChange={e=>setEditItem({...editItem,tipo:e.target.value})}>
              {["Tractor","Cosechadora","Pulverizadora","Acoplado","Sembradora","Otro"].map(t=><option key={t}>{t}</option>)}
            </Sel>
            <Inp label="Marca" value={editItem.marca} onChange={e=>setEditItem({...editItem,marca:e.target.value})}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Modelo" value={editItem.modelo} onChange={e=>setEditItem({...editItem,modelo:e.target.value})}/>
            <Inp label="Año" type="number" value={editItem.anio} onChange={e=>setEditItem({...editItem,anio:e.target.value})}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Color" value={editItem.color} onChange={e=>setEditItem({...editItem,color:e.target.value})}/>
            <Inp label="Patente" value={editItem.patente} onChange={e=>setEditItem({...editItem,patente:e.target.value})}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Valor ($)" type="number" value={editItem.valor} onChange={e=>setEditItem({...editItem,valor:e.target.value})}/>
            <Inp label="Horas actuales" type="number" value={editItem.horas} onChange={e=>setEditItem({...editItem,horas:e.target.value})}/>
          </div>
          <Textarea label="Notas" value={editItem.notas||""} onChange={e=>setEditItem({...editItem,notas:e.target.value})}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
      )}

      {horasModal&&(
        <Modal title={`Registrar gasto: ${horasModal.maq.nombre}`} onClose={()=>setHorasModal(null)}>
          <Inp label="Concepto" value={horasModal.concepto} onChange={e=>setHorasModal({...horasModal,concepto:e.target.value})} placeholder="Ej: Service, repuestos, combustible..."/>
          <Inp label="Monto ($)" type="number" value={horasModal.monto} onChange={e=>setHorasModal({...horasModal,monto:e.target.value})}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setHorasModal(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={registrarGasto} full><I.save/> Registrar</Btn>
          </div>
        </Modal>
      )}
      {confirm&&<ConfirmModal msg="¿Eliminar esta máquina?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ── LLUVIAS ─────────────────────────────────────────────────────────────────
function LluviasPage({data,orgId,toast,reload,modalReq,clearModal}){
  const EMPTY={campo:"",fecha:todayISO(),mm:"",obs:""};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const [campoFil,setCampoFil]=useState("Todos los campos");

  const filtered=data.lluvias
    .filter(l=>campoFil==="Todos los campos"||l.campo===campoFil)
    .sort((a,b)=>(b.fecha||"").localeCompare(a.fecha||""));

  const acum=filtered.reduce((s,l)=>s+Number(l.mm||0),0);
  const mayor=filtered.length?Math.max(...filtered.map(l=>Number(l.mm||0))):0;
  const m=new Date().getMonth();
  const y=new Date().getFullYear();
  const esteMes = filtered.filter(l=>{
    if(!l.fecha) return false;
    const d=new Date(l.fecha);
    return d.getMonth()===m && d.getFullYear()===y;
  }).reduce((s,l)=>s+Number(l.mm||0),0);

  const meses2=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const lluviaM = meses2.map((mes,idx)=>({
    mes,
    mm:filtered.filter(l=>{if(!l.fecha)return false;const d=new Date(l.fecha);return d.getMonth()===idx&&d.getFullYear()===y;}).reduce((s,l)=>s+Number(l.mm||0),0)
  }));

  const save = async ()=>{
    if(!editItem.campo||!editItem.mm){toast("Faltan campos","error");return;}
    const row={campo:editItem.campo,fecha:editItem.fecha,mm:Number(editItem.mm),obs:editItem.obs||""};
    if(editItem.id){
      const {error}=await sb.from("lluvias").update(row).eq("id",editItem.id);
      if(error){toast(error.message,"error");return;}
      toast("Lluvia actualizada");
    } else {
      const {error}=await sb.from("lluvias").insert({...row,org_id:orgId});
      if(error){toast(error.message,"error");return;}
      toast("Lluvia registrada");
    }
    setEditItem(null); reload();
  };

  const del = async id=>{
    const {error}=await sb.from("lluvias").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Registro eliminado"); reload();
  };

  return(
    <div>
      <div style={{marginBottom:14}}>
        <select value={campoFil} onChange={e=>setCampoFil(e.target.value)} style={{padding:"9px 14px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:14,background:"#fff"}}>
          <option>Todos los campos</option>
          {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <KPI label="Acumulado anual" value={`${acum} mm`} icon={<I.rain/>}/>
        <KPI label="Este mes" value={`${esteMes} mm`} icon={<I.cloud/>}/>
        <KPI label="Mayor evento" value={`${mayor} mm`} icon={<I.warn/>}/>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{fontWeight:700,marginBottom:12}}>Precipitaciones mensuales {y}</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={lluviaM}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
            <XAxis dataKey="mes" tick={{fontSize:11}}/>
            <YAxis tick={{fontSize:10}}/>
            <Tooltip formatter={v=>v+" mm"}/>
            <Bar dataKey="mm" fill="#3b82f6" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{fontWeight:700,marginBottom:14}}>Historial de registros</div>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:"30px 0",color:"#9ca3af",fontSize:14}}>Sin registros</div>
          :<table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
              {["Fecha","Campo","mm","Observaciones","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:12,fontWeight:700,color:"#6b7280"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(l=>(
                <tr key={l.id} style={{borderBottom:"1px solid #f9fafb"}}>
                  <td style={{padding:"10px 12px",fontSize:13}}>{fmtDate(l.fecha)}</td>
                  <td style={{padding:"10px 12px",fontSize:13}}>{l.campo}</td>
                  <td style={{padding:"10px 12px",fontWeight:700,color:"#3b82f6"}}>{l.mm} mm</td>
                  <td style={{padding:"10px 12px",fontSize:13,color:"#6b7280"}}>{l.obs||"—"}</td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",gap:4}}>
                      <EditBtn onClick={()=>setEditItem({...l})}/>
                      <DelBtn onClick={()=>setConfirm(l.id)}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>

      {editItem&&(
        <Modal title={editItem.id?"Editar Lluvia":"Registrar Lluvia"} onClose={()=>setEditItem(null)}>
          <Sel label="Campo" value={editItem.campo} onChange={e=>setEditItem({...editItem,campo:e.target.value})}>
            <option value="">Seleccionar...</option>
            {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
          </Sel>
          <Inp label="Fecha" type="date" value={editItem.fecha} onChange={e=>setEditItem({...editItem,fecha:e.target.value})}/>
          <Inp label="Milímetros (mm)" type="number" value={editItem.mm} onChange={e=>setEditItem({...editItem,mm:e.target.value})}/>
          <Inp label="Observaciones" value={editItem.obs||""} onChange={e=>setEditItem({...editItem,obs:e.target.value})}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
      )}
      {confirm&&<ConfirmModal msg="¿Eliminar este registro?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ── CAMPAÑAS ────────────────────────────────────────────────────────────────
function CampanasPage({data,orgId,toast,reload,modalReq,clearModal}){
  const EMPTY={nombre:"",cultivo:"Soja",campo:"",lotes_ids:[],hectareas:"",rendimiento_obj:"",rendimiento_real:null,estado:"Activa",inicio:todayISO(),fin:null,costos:0,notas:""};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const [tab,setTab]=useState("Activas");
  const [detail,setDetail]=useState(null);

  useEffect(()=>{
    if(detail){
      const fresh = data.campanas.find(c=>c.id===detail.id);
      if(fresh) setDetail(fresh);
    }
  },[data.campanas]); // eslint-disable-line

  const filtered=data.campanas.filter(c=>tab==="Todas"?true:tab==="Activas"?c.estado==="Activa":c.estado==="Cerrada");

  const save = async ()=>{
    if(!editItem.nombre||!editItem.campo){toast("Faltan campos","error");return;}
    const row={
      nombre:editItem.nombre,cultivo:editItem.cultivo,campo:editItem.campo,
      lotes_ids:editItem.lotes_ids||[],
      hectareas:Number(editItem.hectareas||0),rendimiento_obj:Number(editItem.rendimiento_obj||0),
      rendimiento_real:editItem.rendimiento_real?Number(editItem.rendimiento_real):null,
      estado:editItem.estado,inicio:editItem.inicio||todayISO(),fin:editItem.fin||null,
      costos:Number(editItem.costos||0),notas:editItem.notas||""
    };
    if(editItem.id){
      const {error}=await sb.from("campanas").update(row).eq("id",editItem.id);
      if(error){toast(error.message,"error");return;}
      toast("Campaña actualizada");
    } else {
      const {error}=await sb.from("campanas").insert({...row,org_id:orgId});
      if(error){toast(error.message,"error");return;}
      toast("Campaña creada");
    }
    setEditItem(null); reload();
  };

  const del = async id=>{
    const {error}=await sb.from("campanas").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Campaña eliminada"); reload();
    if(detail&&detail.id===id) setDetail(null);
  };

  const activas=data.campanas.filter(c=>c.estado==="Activa");

  if(detail){
    const gastos = data.finanzas.filter(f=>f.concepto?.includes(detail.nombre)||(f.campo===detail.campo&&f.categoria==="Compra insumos"));
    const ordenesC = data.ordenes.filter(o=>o.titulo?.toLowerCase().includes(detail.nombre?.toLowerCase())||o.campo===detail.campo);
    const campoObj = data.campos.find(co=>co.nombre===detail.campo);
    const lotesAsignados = (detail.lotes_ids||[]).map(lid=>{
      const l = (campoObj?.lotes_data||[]).find(x=>x.id===lid);
      return l;
    }).filter(Boolean);

    return(
      <div>
        <div style={{marginBottom:16}}>
          <Btn variant="ghost" onClick={()=>setDetail(null)}><I.back/> Volver a Campañas</Btn>
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:24,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{display:"flex",gap:8,marginBottom:6}}>
                <Badge label={detail.estado} c={detail.estado==="Activa"?"#15803d":"#6b7280"} bg={detail.estado==="Activa"?"#dcfce7":"#f3f4f6"}/>
                <Badge label={detail.cultivo} c={CULTIVO_C[detail.cultivo]} bg={(CULTIVO_C[detail.cultivo]||"#888")+"22"}/>
              </div>
              <h2 style={{margin:0,fontSize:22,fontWeight:800}}>{detail.nombre}</h2>
              <div style={{fontSize:14,color:"#6b7280",marginTop:4}}>📍 {detail.campo} · 📅 {fmtDate(detail.inicio)} → {detail.fin?fmtDate(detail.fin):"en curso"}</div>
            </div>
            <Btn variant="secondary" small onClick={()=>setEditItem({...detail})}><I.edit/> Editar</Btn>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
            <KPI label="Hectáreas" value={Number(detail.hectareas).toLocaleString("es-AR")}/>
            <KPI label="Rend. objetivo" value={detail.rendimiento_obj?`${detail.rendimiento_obj} qq/ha`:"—"}/>
            <KPI label="Rend. real" value={detail.rendimiento_real?`${detail.rendimiento_real} qq/ha`:"—"} color={detail.rendimiento_real?"#16a34a":"#9ca3af"}/>
            <KPI label="Costos totales" value={fmtK(gastos.reduce((s,g)=>s+Number(g.monto||0),0))} color="#ef4444"/>
          </div>
          {lotesAsignados.length>0&&(
            <div style={{background:"#f0fdf4",borderRadius:10,padding:"12px 16px",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:8,color:"#15803d"}}>🗺️ Lotes asignados ({lotesAsignados.length})</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {lotesAsignados.map(l=>(
                  <span key={l.id} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:14,background:(l.color||"#16a34a")+"22",color:l.color||"#16a34a",fontSize:12,fontWeight:600}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:l.color||"#16a34a"}}/>
                    {l.nombre||`Lote ${l.numero}`} ({l.hectareas} ha)
                  </span>
                ))}
              </div>
            </div>
          )}
          {detail.notas&&<div style={{background:"#f9fafb",borderRadius:10,padding:"12px 16px",fontSize:14}}>📝 {detail.notas}</div>}
        </div>

        {ordenesC.length>0&&(
          <div style={{background:"#fff",borderRadius:14,padding:20,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div style={{fontWeight:700,marginBottom:12}}>Órdenes de trabajo relacionadas</div>
            {ordenesC.map(o=>(
              <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f3f4f6",flexWrap:"wrap",gap:8}}>
                <div>
                  <span style={{fontSize:18,marginRight:8}}>{TIPO_ICON[o.tipo]||"📋"}</span>
                  <span style={{fontWeight:600,fontSize:13}}>{o.titulo}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Badge label={o.estado} bg={o.estado==="Completada"?"#dcfce7":"#fef3c7"} c={o.estado==="Completada"?"#15803d":"#92400e"}/>
                  <span style={{fontSize:12,color:"#6b7280"}}>{fmtDate(o.fecha)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {gastos.length>0&&(
          <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            <div style={{fontWeight:700,marginBottom:12}}>Gastos asociados</div>
            {gastos.map(g=>(
              <div key={g.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f3f4f6",fontSize:13}}>
                <span>{g.concepto}</span>
                <span style={{fontWeight:700,color:"#ef4444"}}>-{fmtK(g.monto)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return(
    <div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <KPI label="Campañas activas" value={activas.length}/>
        <KPI label="Ha en producción" value={activas.reduce((s,c)=>s+Number(c.hectareas||0),0).toLocaleString("es-AR")} color="#16a34a"/>
        <KPI label="Cultivos activos" value={[...new Set(activas.map(c=>c.cultivo))].join(", ")||"—"}/>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["Activas","Todas","Cerradas"].map(t=>{
          const n=t==="Activas"?data.campanas.filter(c=>c.estado==="Activa").length:t==="Cerradas"?data.campanas.filter(c=>c.estado==="Cerrada").length:data.campanas.length;
          return(<button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:tab===t?"#16a34a":"#f3f4f6",color:tab===t?"#fff":"#374151"}}>{t} ({n})</button>);
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {filtered.map(c=>{
          const campoObj = data.campos.find(co=>co.nombre===c.campo);
          const lotesAsignados = (c.lotes_ids||[]).map(lid=>{
            const l = (campoObj?.lotes_data||[]).find(x=>x.id===lid);
            return l;
          }).filter(Boolean);
          return(
          <div key={c.id} style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",border:c.estado==="Activa"?"2px solid #bbf7d0":"2px solid transparent"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:6}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Badge label={c.estado} c={c.estado==="Activa"?"#15803d":"#6b7280"} bg={c.estado==="Activa"?"#dcfce7":"#f3f4f6"}/>
                <Badge label={c.cultivo} c={CULTIVO_C[c.cultivo]} bg={(CULTIVO_C[c.cultivo]||"#888")+"22"}/>
              </div>
              <span style={{fontSize:22,fontWeight:900,color:"#16a34a"}}>{Number(c.hectareas).toLocaleString("es-AR")}<span style={{fontSize:12,fontWeight:500,color:"#9ca3af"}}> ha</span></span>
            </div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{c.nombre}</div>
            <div style={{fontSize:13,color:"#6b7280",marginBottom:4}}>📍 {c.campo}</div>
            {lotesAsignados.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                {lotesAsignados.map(l=>(
                  <span key={l.id} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:10,background:(l.color||"#16a34a")+"22",color:l.color||"#16a34a",fontSize:11,fontWeight:600}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:l.color||"#16a34a"}}/>
                    Lote {l.numero}
                  </span>
                ))}
              </div>
            )}
            <div style={{fontSize:12,color:"#9ca3af",marginBottom:12}}>📅 {fmtDate(c.inicio)} → {c.fin?fmtDate(c.fin):"en curso"}</div>
            <div style={{display:"flex",gap:6}}>
              <Btn variant="primary" small style={{flex:1,justifyContent:"center"}} onClick={()=>setDetail(c)}>📊 Ver detalle</Btn>
              <EditBtn onClick={()=>setEditItem({...c})}/>
              <DelBtn onClick={()=>setConfirm(c.id)}/>
            </div>
          </div>
          );
        })}
      </div>

      {editItem&&!detail&&(()=>{
        const campoSel = data.campos.find(c=>c.nombre===editItem.campo);
        const lotesDelCampo = campoSel?.lotes_data||[];
        const toggleLote = id=>{
          const curr = editItem.lotes_ids||[];
          const nuevos = curr.includes(id)?curr.filter(x=>x!==id):[...curr,id];
          const haCalc = nuevos.reduce((s,lid)=>{
            const l = lotesDelCampo.find(x=>x.id===lid);
            return s+(l?Number(l.hectareas||0):0);
          },0);
          setEditItem({...editItem,lotes_ids:nuevos,hectareas:haCalc?haCalc.toFixed(2):editItem.hectareas});
        };
        return(
        <Modal title={editItem.id?"Editar Campaña":"Nueva Campaña"} onClose={()=>setEditItem(null)}>
          <Inp label="Nombre" value={editItem.nombre} onChange={e=>setEditItem({...editItem,nombre:e.target.value})} placeholder="Ej: Soja 26/27"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Cultivo" value={editItem.cultivo} onChange={e=>setEditItem({...editItem,cultivo:e.target.value})}>
              {["Soja","Maíz","Trigo","Girasol","Sorgo"].map(c=><option key={c}>{c}</option>)}
            </Sel>
            <Sel label="Estado" value={editItem.estado} onChange={e=>setEditItem({...editItem,estado:e.target.value})}>
              {["Activa","Cerrada"].map(s=><option key={s}>{s}</option>)}
            </Sel>
          </div>
          <Sel label="Campo" value={editItem.campo} onChange={e=>setEditItem({...editItem,campo:e.target.value,lotes_ids:[]})}>
            <option value="">Seleccionar...</option>
            {data.campos.map(c=><option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </Sel>

          {editItem.campo&&(
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Lotes asignados a la campaña</label>
              {lotesDelCampo.length===0
                ? <div style={{padding:"9px 12px",borderRadius:8,border:"1.5px solid #fef3c7",background:"#fffbeb",fontSize:12,color:"#92400e"}}>Este campo no tiene lotes marcados en el mapa</div>
                : <>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {lotesDelCampo.map(l=>{
                        const sel = (editItem.lotes_ids||[]).includes(l.id);
                        const color = l.color||"#16a34a";
                        return(
                          <button key={l.id} type="button" onClick={()=>toggleLote(l.id)} style={{padding:"6px 12px",borderRadius:20,border:"1.5px solid",borderColor:sel?color:"#e5e7eb",background:sel?color+"22":"#fff",color:sel?color:"#6b7280",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                            <span style={{width:10,height:10,borderRadius:"50%",background:color,display:"inline-block"}}/>
                            {sel?"✓ ":""}{l.nombre||`Lote ${l.numero}`} ({l.hectareas} ha)
                          </button>
                        );
                      })}
                    </div>
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:6}}>💡 Las hectáreas se calculan automáticamente sumando los lotes seleccionados</div>
                  </>
              }
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Hectáreas" type="number" value={editItem.hectareas} onChange={e=>setEditItem({...editItem,hectareas:e.target.value})}/>
            <Inp label="Rend. objetivo (qq/ha)" type="number" value={editItem.rendimiento_obj} onChange={e=>setEditItem({...editItem,rendimiento_obj:e.target.value})}/>
          </div>
          {editItem.estado==="Cerrada"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Rend. real (qq/ha)" type="number" value={editItem.rendimiento_real||""} onChange={e=>setEditItem({...editItem,rendimiento_real:e.target.value})}/>
              <Inp label="Fecha fin" type="date" value={editItem.fin||""} onChange={e=>setEditItem({...editItem,fin:e.target.value})}/>
            </div>
          )}
          <Inp label="Fecha inicio" type="date" value={editItem.inicio} onChange={e=>setEditItem({...editItem,inicio:e.target.value})}/>
          <Textarea label="Notas" value={editItem.notas||""} onChange={e=>setEditItem({...editItem,notas:e.target.value})}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
        );
      })()}
      {confirm&&<ConfirmModal msg="¿Eliminar esta campaña?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}


// ── ÓRDENES DE TRABAJO ──────────────────────────────────────────────────────
function OrdenesPage({data,orgId,toast,reload,modalReq,clearModal}){
  const EMPTY={titulo:"",tipo:"Labor agrícola",campo:"",responsable:"",fecha:todayISO(),prioridad:"Media",estado:"Pendiente",insumos_usados:[],lotes_ids:[],campana_id:null,notas:""};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const [tab,setTab]=useState("Pendientes");

  const filtered = tab==="Pendientes"
    ? data.ordenes.filter(o=>o.estado==="Pendiente")
    : data.ordenes.filter(o=>o.estado==="Completada");

  const save = async ()=>{
    if(!editItem.titulo){toast("Falta título","error");return;}
    const row={
      titulo:editItem.titulo,tipo:editItem.tipo,campo:editItem.campo,responsable:editItem.responsable,
      fecha:editItem.fecha,prioridad:editItem.prioridad,estado:editItem.estado,
      insumos_usados:editItem.insumos_usados||[],
      lotes_ids:editItem.lotes_ids||[],
      campana_id:editItem.campana_id||null,
      notas:editItem.notas||""
    };
    const isEdit = !!editItem.id;
    let oldInsumos = [];
    if(isEdit){
      const old = data.ordenes.find(o=>o.id===editItem.id);
      oldInsumos = old?.insumos_usados||[];
    }

    if(isEdit){
      const {error}=await sb.from("ordenes").update(row).eq("id",editItem.id);
      if(error){toast(error.message,"error");return;}
      // If was completada with insumos applied, recalc stock diff
      const old = data.ordenes.find(o=>o.id===editItem.id);
      if(old?.insumos_aplicados){
        // Revert old, apply new
        for(const oi of oldInsumos){
          const stk = data.stock.find(s=>s.id===oi.stock_id);
          if(stk) await sb.from("stock").update({cantidad:Number(stk.cantidad)+Number(oi.cantidad)}).eq("id",stk.id);
        }
        for(const ni of (row.insumos_usados||[])){
          const stk = data.stock.find(s=>s.id===ni.stock_id);
          if(stk) await sb.from("stock").update({cantidad:Math.max(0,Number(stk.cantidad)-Number(ni.cantidad))}).eq("id",stk.id);
        }
      }
      toast("Orden actualizada");
    } else {
      const {error}=await sb.from("ordenes").insert({...row,org_id:orgId});
      if(error){toast(error.message,"error");return;}
      toast("Orden creada");
    }
    setEditItem(null); reload();
  };

  const completarManual = async (orden)=>{
    // Aplicar consumo de insumos y crear gastos
    for(const ins of (orden.insumos_usados||[])){
      const stk = data.stock.find(s=>s.id===ins.stock_id);
      if(stk){
        await sb.from("stock").update({cantidad:Math.max(0,Number(stk.cantidad)-Number(ins.cantidad))}).eq("id",stk.id);
        const monto = Number(ins.cantidad)*Number(stk.costo_unit||0);
        if(monto>0){
          await sb.from("finanzas").insert({org_id:orgId,fecha:todayISO(),tipo:"Egreso",concepto:`Uso ${stk.nombre} en: ${orden.titulo}`,categoria:"Compra insumos",campo:orden.campo,monto,origen:"orden",origen_id:orden.id});
        }
      }
    }
    await sb.from("ordenes").update({estado:"Completada",insumos_aplicados:true}).eq("id",orden.id);
    toast("Orden completada y stock descontado");
    reload();
  };

  const del = async id=>{
    // Cascade: also remove related finanzas entries
    await sb.from("finanzas").delete().eq("origen_id",id).in("origen",["orden","orden_auto"]);
    const {error}=await sb.from("ordenes").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Orden eliminada"); reload();
  };

  const addInsumo = ()=>{
    setEditItem({...editItem,insumos_usados:[...(editItem.insumos_usados||[]),{stock_id:"",cantidad:""}]});
  };
  const updInsumo = (idx,key,val)=>{
    const lst = [...(editItem.insumos_usados||[])];
    lst[idx] = {...lst[idx],[key]:val};
    setEditItem({...editItem,insumos_usados:lst});
  };
  const delInsumo = idx=>{
    setEditItem({...editItem,insumos_usados:(editItem.insumos_usados||[]).filter((_,i)=>i!==idx)});
  };

  return(
    <div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <KPI label="Pendientes" value={data.ordenes.filter(o=>o.estado==="Pendiente").length} color="#f59e0b"/>
        <KPI label="Completadas" value={data.ordenes.filter(o=>o.estado==="Completada").length} color="#16a34a"/>
        <KPI label="Total" value={data.ordenes.length}/>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["Pendientes","Completadas"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:tab===t?"#16a34a":"#f3f4f6",color:tab===t?"#fff":"#374151"}}>{t}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {filtered.map(o=>{
          const campoObj = data.campos.find(c=>c.nombre===o.campo);
          const lotesNombres = (o.lotes_ids||[]).map(lid=>{
            const l = (campoObj?.lotes_data||[]).find(x=>x.id===lid);
            return l?(l.nombre||`Lote ${l.numero}`):null;
          }).filter(Boolean);
          const campObj = data.campanas.find(c=>c.id===o.campana_id);
          return(
          <div key={o.id} style={{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",border:o.estado==="Pendiente"?"2px solid #fef3c7":"2px solid #dcfce7"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <Badge label={o.prioridad} c={PRIOR_C[o.prioridad]} bg={(PRIOR_C[o.prioridad]||"#888")+"20"}/>
              <span style={{fontSize:18}}>{TIPO_ICON[o.tipo]||"📋"}</span>
            </div>
            <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{o.titulo}</div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>📍 {o.campo} · 👤 {o.responsable}</div>
            {lotesNombres.length>0&&<div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>🗺️ {lotesNombres.join(", ")}</div>}
            {campObj&&<div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>🌱 {campObj.nombre} ({campObj.cultivo})</div>}
            <div style={{fontSize:11,color:"#9ca3af",marginBottom:10}}>📅 {fmtDate(o.fecha)}</div>
            {(o.insumos_usados||[]).length>0&&(
              <div style={{background:"#f9fafb",borderRadius:8,padding:"8px 10px",marginBottom:10,fontSize:11}}>
                <div style={{fontWeight:700,marginBottom:4}}>Insumos:</div>
                {(o.insumos_usados||[]).map((i,idx)=>{
                  const stk = data.stock.find(s=>s.id===i.stock_id);
                  return <div key={idx}>• {stk?.nombre||"?"}: {i.cantidad} {stk?.unidad||""}</div>;
                })}
              </div>
            )}
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {o.estado==="Pendiente"&&canEdit(__currentRole)&&<Btn variant="primary" small onClick={()=>completarManual(o)}><I.check/> Completar</Btn>}
              <EditBtn onClick={()=>setEditItem({...o})}/>
              <DelBtn onClick={()=>setConfirm(o.id)}/>
            </div>
          </div>
          );
        })}
      </div>

      {editItem&&(()=>{
        const campoSel = data.campos.find(c=>c.nombre===editItem.campo);
        const lotesDelCampo = campoSel?.lotes_data||[];
        const campanasActivas = data.campanas.filter(c=>c.estado==="Activa");
        const toggleLote = id=>{
          const curr = editItem.lotes_ids||[];
          setEditItem({...editItem,lotes_ids:curr.includes(id)?curr.filter(x=>x!==id):[...curr,id]});
        };
        return(
        <Modal title={editItem.id?"Editar Orden":"Nueva Orden"} onClose={()=>setEditItem(null)} wide>
          <Inp label="Título" value={editItem.titulo} onChange={e=>setEditItem({...editItem,titulo:e.target.value})}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Tipo" value={editItem.tipo} onChange={e=>setEditItem({...editItem,tipo:e.target.value})}>
              {["Labor agrícola","Mantenimiento","Veterinaria","Administrativa"].map(t=><option key={t}>{t}</option>)}
            </Sel>
            <Sel label="Estado" value={editItem.estado} onChange={e=>setEditItem({...editItem,estado:e.target.value})}>
              {["Pendiente","Completada"].map(s=><option key={s}>{s}</option>)}
            </Sel>
          </div>
          <Sel label="Campo" value={editItem.campo} onChange={e=>setEditItem({...editItem,campo:e.target.value,lotes_ids:[]})}>
            <option value="">Seleccionar...</option>
            {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
          </Sel>

          {editItem.campo&&(
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Lotes afectados</label>
              {lotesDelCampo.length===0
                ? <div style={{padding:"9px 12px",borderRadius:8,border:"1.5px solid #fef3c7",background:"#fffbeb",fontSize:12,color:"#92400e"}}>Este campo no tiene lotes marcados en el mapa</div>
                : <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {lotesDelCampo.map(l=>{
                      const sel = (editItem.lotes_ids||[]).includes(l.id);
                      return(
                        <button key={l.id} type="button" onClick={()=>toggleLote(l.id)} style={{padding:"6px 12px",borderRadius:20,border:"1.5px solid",borderColor:sel?"#16a34a":"#e5e7eb",background:sel?"#f0fdf4":"#fff",color:sel?"#16a34a":"#6b7280",cursor:"pointer",fontSize:12,fontWeight:600}}>
                          {sel?"✓ ":""}{l.nombre||`Lote ${l.numero}`}
                        </button>
                      );
                    })}
                  </div>
              }
            </div>
          )}

          <Sel label="Campaña asociada (opcional)" value={editItem.campana_id||""} onChange={e=>setEditItem({...editItem,campana_id:e.target.value||null})}>
            <option value="">— Ninguna —</option>
            {campanasActivas.map(c=><option key={c.id} value={c.id}>{c.nombre} ({c.cultivo})</option>)}
          </Sel>

          <Sel label="Responsable" value={editItem.responsable} onChange={e=>setEditItem({...editItem,responsable:e.target.value})}>
            <option value="">Seleccionar...</option>
            {data.colaboradores.map(c=><option key={c.id}>{c.nombre}</option>)}
          </Sel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Fecha límite" type="date" value={editItem.fecha} onChange={e=>setEditItem({...editItem,fecha:e.target.value})}/>
            <Sel label="Prioridad" value={editItem.prioridad} onChange={e=>setEditItem({...editItem,prioridad:e.target.value})}>
              {["Alta","Media","Baja"].map(p=><option key={p}>{p}</option>)}
            </Sel>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Insumos a usar</label>
            {(editItem.insumos_usados||[]).map((ins,idx)=>{
              const stk = data.stock.find(s=>s.id===ins.stock_id);
              return(
                <div key={idx} style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
                  <select value={ins.stock_id} onChange={e=>updInsumo(idx,"stock_id",e.target.value)} style={{flex:2,padding:"7px 10px",borderRadius:6,border:"1.5px solid #e5e7eb",fontSize:13}}>
                    <option value="">Insumo...</option>
                    {data.stock.map(s=><option key={s.id} value={s.id}>{s.nombre} ({s.cantidad} {s.unidad})</option>)}
                  </select>
                  <input type="number" value={ins.cantidad} onChange={e=>updInsumo(idx,"cantidad",e.target.value)} placeholder="Cantidad" style={{flex:1,padding:"7px 10px",borderRadius:6,border:"1.5px solid #e5e7eb",fontSize:13}}/>
                  <span style={{fontSize:12,color:"#6b7280",minWidth:30}}>{stk?.unidad||""}</span>
                  <Btn variant="ghost" small onClick={()=>delInsumo(idx)}><I.x/></Btn>
                </div>
              );
            })}
            <Btn variant="secondary" small onClick={addInsumo}><I.plus/> Agregar insumo</Btn>
          </div>
          <Textarea label="Notas" value={editItem.notas||""} onChange={e=>setEditItem({...editItem,notas:e.target.value})}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
        );
      })()}
      {confirm&&<ConfirmModal msg="¿Eliminar esta orden?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ── FINANZAS ────────────────────────────────────────────────────────────────
function FinanzasPage({data,orgId,toast,reload,modalReq,clearModal,dolar}){
  const EMPTY={fecha:todayISO(),concepto:"",categoria:"Otros",campo:"",monto:"",moneda:"ARS",tc:dolar};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const CATS=["Compra insumos","Labores contratadas","Combustible","Sueldos","Fletes","Compra hacienda","Mantenimiento","Servicios","Otros"];

  // 🆕 Filtro por mes calendario (del 1 al último día). Por defecto, mes actual.
  const [mesFil,setMesFil]=useState(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;});

  // Gastos del mes elegido (del día 1 al último día de ese mes)
  const gastosMes = data.finanzas.filter(f=>{
    if(!f.fecha) return false;
    return f.fecha.substring(0,7)===mesFil; // YYYY-MM
  });
  const egresos = gastosMes.reduce((s,f)=>s+Number(f.monto||0),0);

  // USD de un gasto: usa su tc propio si lo tiene, sino el dólar global
  const usdDe = (f)=> Number(f.tc)>0 ? Number(f.monto||0)/Number(f.tc) : Number(f.monto||0)/dolar;
  const egresosUSD = gastosMes.reduce((s,f)=>s+usdDe(f),0);

  const nombreMes = (()=>{
    const [y,m]=mesFil.split("-");
    return new Date(Number(y),Number(m)-1,1).toLocaleDateString("es-AR",{month:"long",year:"numeric"});
  })();

  const save = async ()=>{
    if(!editItem.concepto||!editItem.monto){toast("Faltan campos","error");return;}
    const tc = Number(editItem.tc||0);
    // 🆕 El monto se guarda SIEMPRE en ARS. Si cargó en USD, convierto con el tc.
    let montoARS;
    if(editItem.moneda==="USD"){
      if(!tc){toast("Poné el tipo de cambio de la factura","error");return;}
      montoARS = Number(editItem.monto)*tc;
    } else {
      montoARS = Number(editItem.monto);
    }
    const row={fecha:editItem.fecha,tipo:"Egreso",concepto:editItem.concepto,categoria:editItem.categoria,campo:editItem.campo,monto:montoARS,tc:tc||dolar};
    if(editItem.id){
      const {error}=await sb.from("finanzas").update(row).eq("id",editItem.id);
      if(error){toast(error.message,"error");return;}
      toast("Movimiento actualizado");
    } else {
      const {error}=await sb.from("finanzas").insert({...row,org_id:orgId,origen:"manual"});
      if(error){toast(error.message,"error");return;}
      toast("Egreso registrado");
    }
    setEditItem(null); reload();
  };

  const del = async id=>{
    const {error}=await sb.from("finanzas").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Eliminado"); reload();
  };

  // Build flujo mensual
  const meses=[];
  for(let i=5;i>=0;i--){
    const d=new Date(); d.setMonth(d.getMonth()-i);
    meses.push({key:`${d.getFullYear()}-${d.getMonth()}`,label:d.toLocaleDateString("es-AR",{month:"short",year:"2-digit"})});
  }
  const flujo = meses.map(m2=>({
    mes:m2.label,
    egresos:data.finanzas.filter(f=>{if(!f.fecha)return false;const d=new Date(f.fecha);return `${d.getFullYear()}-${d.getMonth()}`===m2.key;}).reduce((s,f)=>s+Number(f.monto||0),0)
  }));

  return(
    <div>
      {/* 🆕 Selector de mes calendario (del 1 al 1) */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <span style={{fontSize:13,color:"#6b7280",fontWeight:600}}>Mes:</span>
        <input type="month" value={mesFil} onChange={e=>setMesFil(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13}}/>
        <span style={{fontSize:13,color:"#374151",textTransform:"capitalize",fontWeight:600}}>{nombreMes}</span>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <KPI label={`Gastos de ${nombreMes}`} value={fmtK(egresos)} sub={`U$ ${egresosUSD.toLocaleString("es-AR",{maximumFractionDigits:0})}`} color="#ef4444"/>
        <KPI label="Movimientos del mes" value={gastosMes.length}/>
        <KPI label="Dólar sugerido" value={`$ ${dolar.toLocaleString("es-AR")}`} sub="Editable en Config"/>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{fontWeight:700,marginBottom:12}}>Gastos últimos 6 meses</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={flujo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
            <XAxis dataKey="mes" tick={{fontSize:11}}/>
            <YAxis tick={{fontSize:10}} tickFormatter={v=>v>=1e6?(v/1e6)+"M":v}/>
            <Tooltip formatter={v=>fmt(v)}/>
            <Bar dataKey="egresos" fill="#ef4444" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{fontWeight:700,marginBottom:14}}>Movimientos de <span style={{textTransform:"capitalize"}}>{nombreMes}</span></div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
              {["Fecha","Concepto","Categoría","Campo","Monto ARS","Monto USD","T.C.","Origen","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 12px",fontSize:12,fontWeight:700,color:"#6b7280",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {gastosMes.length===0
                ? <tr><td colSpan={9} style={{padding:"24px",textAlign:"center",color:"#9ca3af",fontSize:14}}>Sin movimientos en este mes</td></tr>
                : gastosMes.sort((a,b)=>(b.fecha||"").localeCompare(a.fecha||"")).map(f=>(
                <tr key={f.id} style={{borderBottom:"1px solid #f9fafb"}}>
                  <td style={{padding:"10px",fontSize:13}}>{fmtDate(f.fecha)}</td>
                  <td style={{padding:"10px",fontSize:13,maxWidth:240}}>{f.concepto}</td>
                  <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}>{f.categoria}</td>
                  <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}>{f.campo||"—"}</td>
                  <td style={{padding:"10px",fontWeight:700,color:"#ef4444",whiteSpace:"nowrap"}}>-{fmtK(f.monto)}</td>
                  <td style={{padding:"10px",fontSize:12,color:"#9ca3af",whiteSpace:"nowrap"}}>U$ {usdDe(f).toLocaleString("es-AR",{maximumFractionDigits:0})}</td>
                  <td style={{padding:"10px",fontSize:12,color:"#9ca3af",whiteSpace:"nowrap"}}>{Number(f.tc)>0?`$ ${Number(f.tc).toLocaleString("es-AR")}`:"—"}</td>
                  <td style={{padding:"10px",fontSize:11,color:"#9ca3af"}}>{f.origen||"manual"}</td>
                  <td style={{padding:"10px"}}>
                    <div style={{display:"flex",gap:4}}>
                      <EditBtn onClick={()=>setEditItem({...f,moneda:"ARS",tc:Number(f.tc)>0?f.tc:dolar})}/>
                      <DelBtn onClick={()=>setConfirm(f.id)}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editItem&&(()=>{
        const tc = Number(editItem.tc||0);
        const monto = Number(editItem.monto||0);
        // Previsualización del equivalente
        const equiv = editItem.moneda==="USD"
          ? (tc>0 ? monto*tc : 0)        // ingresó USD -> muestro ARS
          : (tc>0 ? monto/tc : 0);       // ingresó ARS -> muestro USD
        return(
        <Modal title={editItem.id?"Editar Movimiento":"Nuevo Egreso"} onClose={()=>setEditItem(null)}>
          <Inp label="Concepto" value={editItem.concepto} onChange={e=>setEditItem({...editItem,concepto:e.target.value})}/>
          <Sel label="Categoría" value={editItem.categoria} onChange={e=>setEditItem({...editItem,categoria:e.target.value})}>
            {CATS.map(c=><option key={c}>{c}</option>)}
          </Sel>
          <Sel label="Campo" value={editItem.campo} onChange={e=>setEditItem({...editItem,campo:e.target.value})}>
            <option value="">— Ninguno —</option>
            {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
          </Sel>
          <Inp label="Fecha" type="date" value={editItem.fecha} onChange={e=>setEditItem({...editItem,fecha:e.target.value})}/>

          {/* 🆕 Moneda + monto */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Moneda" value={editItem.moneda||"ARS"} onChange={e=>setEditItem({...editItem,moneda:e.target.value})}>
              <option value="ARS">Pesos (ARS)</option>
              <option value="USD">Dólares (USD)</option>
            </Sel>
            <Inp label={editItem.moneda==="USD"?"Monto en USD":"Monto en ARS"} type="number" value={editItem.monto} onChange={e=>setEditItem({...editItem,monto:e.target.value})}/>
          </div>

          {/* 🆕 Tipo de cambio de la factura */}
          <Inp label="Tipo de cambio (de la factura)" type="number" value={editItem.tc} onChange={e=>setEditItem({...editItem,tc:e.target.value})} placeholder={`Sugerido: ${dolar}`}/>

          {monto>0 && tc>0 && (
            <div style={{background:"#f0fdf4",borderRadius:8,padding:10,fontSize:13,marginBottom:10}}>
              {editItem.moneda==="USD"
                ? <>Equivale a <b>{fmt(equiv)}</b> (se guarda en pesos)</>
                : <>Equivale a <b>U$ {equiv.toLocaleString("es-AR",{maximumFractionDigits:0})}</b></>}
            </div>
          )}

          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
        );
      })()}
      {confirm&&<ConfirmModal msg="¿Eliminar este movimiento?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ── DOCUMENTOS ──────────────────────────────────────────────────────────────
function DocumentosPage({data,orgId,toast,reload}){
  const fileRef=useRef();
  const [cat,setCat]=useState("Todos");
  const [catNew,setCatNew]=useState("Contratos");
  const [editDoc,setEditDoc]=useState(null);
  const [confirm,setConfirm]=useState(null);
  const [uploading,setUploading]=useState(false);
  const CATS=["Todos","Contratos","Certificados","Facturas","Remitos","Órdenes de Trabajo","Campos","Campañas","Otros"];

  const filtered=data.documentos.filter(d=>cat==="Todos"||d.tag===cat);

  const handleFiles = async e=>{
    const files=[...e.target.files];
    if(files.length===0)return;
    setUploading(true);
    for(const f of files){
      const path = `${orgId}/${Date.now()}-${f.name}`;
      const {error:upErr} = await sb.storage.from("documentos").upload(path,f);
      if(upErr){toast(upErr.message,"error");continue;}
      const {data:{publicUrl}} = sb.storage.from("documentos").getPublicUrl(path);
      const tipo = f.name.match(/\.(xlsx|xls)$/i)?"Excel":f.name.match(/\.pdf$/i)?"PDF":f.name.match(/\.(jpg|jpeg|png|gif)$/i)?"Imagen":"Archivo";
      await sb.from("documentos").insert({org_id:orgId,nombre:f.name,tipo,size:`${(f.size/1024).toFixed(0)} KB`,fecha:todayISO(),tag:catNew,url:publicUrl});
    }
    toast(`${files.length} archivo(s) subido(s)`);
    setUploading(false);
    e.target.value="";
    reload();
  };

  const saveRename = async ()=>{
    if(!editDoc.nombre){toast("Falta nombre","error");return;}
    await sb.from("documentos").update({nombre:editDoc.nombre,tag:editDoc.tag}).eq("id",editDoc.id);
    toast("Documento actualizado");
    setEditDoc(null); reload();
  };

  const del = async id=>{
    const {error}=await sb.from("documentos").delete().eq("id",id);
    if(error){toast(error.message,"error");return;}
    setConfirm(null); toast("Documento eliminado"); reload();
  };

  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:cat===c?"#16a34a":"#f3f4f6",color:cat===c?"#fff":"#374151"}}>{c}</button>
        ))}
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        {canEdit(__currentRole)&&<div style={{border:"2px dashed #d1d5db",borderRadius:10,padding:"24px 20px",marginBottom:20,textAlign:"center",color:"#9ca3af"}}>
          <I.upload/>
          <div style={{marginTop:8,fontSize:14}}>
            <span onClick={()=>!uploading&&fileRef.current.click()} style={{color:"#16a34a",cursor:"pointer",fontWeight:600,textDecoration:"underline"}}>
              {uploading?"Subiendo...":"Seleccionar archivos"}
            </span>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap",marginTop:10}}>
            <span style={{fontSize:13,color:"#374151"}}>Categoría:</span>
            <select value={catNew} onChange={e=>setCatNew(e.target.value)} style={{padding:"5px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13}}>
              {CATS.filter(c=>c!=="Todos").map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={handleFiles}/>
        </div>}

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
              {["Nombre","Tipo","Tamaño","Fecha","Categoría","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 12px",fontSize:12,fontWeight:700,color:"#6b7280"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(d=>(
                <tr key={d.id} style={{borderBottom:"1px solid #f9fafb"}}>
                  <td style={{padding:"10px",fontSize:13,fontWeight:600}}>{d.tipo==="PDF"?"📄":d.tipo==="Excel"?"📊":d.tipo==="Imagen"?"🖼️":"📁"} {d.nombre}</td>
                  <td style={{padding:"10px"}}><Badge label={d.tipo} c={d.tipo==="PDF"?"#dc2626":d.tipo==="Excel"?"#16a34a":"#374151"} bg={d.tipo==="PDF"?"#fee2e2":d.tipo==="Excel"?"#dcfce7":"#f3f4f6"}/></td>
                  <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}>{d.size}</td>
                  <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}>{fmtDate(d.fecha)}</td>
                  <td style={{padding:"10px"}}><Badge label={d.tag}/></td>
                  <td style={{padding:"10px"}}>
                    <div style={{display:"flex",gap:4}}>
                      {d.url&&<a href={d.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><Btn variant="ghost" small><I.eye/></Btn></a>}
                      <EditBtn onClick={()=>setEditDoc({...d})}/>
                      <DelBtn onClick={()=>setConfirm(d.id)}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editDoc&&(
        <Modal title="Editar documento" onClose={()=>setEditDoc(null)}>
          <Inp label="Nombre del archivo" value={editDoc.nombre} onChange={e=>setEditDoc({...editDoc,nombre:e.target.value})}/>
          <Sel label="Categoría" value={editDoc.tag} onChange={e=>setEditDoc({...editDoc,tag:e.target.value})}>
            {CATS.filter(c=>c!=="Todos").map(c=><option key={c}>{c}</option>)}
          </Sel>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditDoc(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={saveRename} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
      )}
      {confirm&&<ConfirmModal msg="¿Eliminar este documento?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// Add eye icon ref
I.eye = () => <Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6"/>;

// ── COLABORADORES (= MIEMBROS REALES CON ACCESO) ─────────────────────────────
function ColaboradoresPage({data,orgId,toast,reload,miRol,miMiembroId}){
  const [editMiembro,setEditMiembro]=useState(null);
  const [confirm,setConfirm]=useState(null);
  const esAdmin = canManageUsers(miRol);

  const miembros = data.miembros||[];

  const saveRol = async ()=>{
    if(!editMiembro) return;
    await sb.from("miembros").update({rol:editMiembro.rol,nombre:editMiembro.nombre,telefono:editMiembro.telefono}).eq("id",editMiembro.id);
    toast("Colaborador actualizado");
    setEditMiembro(null); reload();
  };

  const quitarAcceso = async id=>{
    if(id===miMiembroId){toast("No podés quitarte el acceso a vos mismo","error");return;}
    await sb.from("miembros").delete().eq("id",id);
    toast("Acceso revocado"); setConfirm(null); reload();
  };

  const copiarCodigo = ()=>{
    navigator.clipboard.writeText(orgId);
    toast("Código copiado");
  };

  return(
    <div>
      <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:14,padding:20,marginBottom:20}}>
        <div style={{fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
          <I.users/> Invitar a tu papá u otros usuarios
        </div>
        <div style={{fontSize:13,color:"#374151",marginBottom:12}}>
          Compartí este <b>código de invitación</b>. Las personas que se registren con este código entrarán como <b>Lectores</b> por defecto. Después podés cambiarles el rol desde acá.
        </div>
        <div style={{background:"#fff",padding:"10px 14px",borderRadius:8,fontFamily:"monospace",fontSize:12,wordBreak:"break-all",border:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:10}}>
          <span style={{flex:1}}>{orgId}</span>
          <Btn variant="secondary" small onClick={copiarCodigo}>Copiar</Btn>
        </div>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <KPI label="Total miembros" value={miembros.length} icon={<I.users/>}/>
        <KPI label="Administradores" value={miembros.filter(m=>m.rol===ROLES.ADMIN).length} color="#15803d"/>
        <KPI label="Editores" value={miembros.filter(m=>m.rol===ROLES.EDITOR).length} color="#1d4ed8"/>
        <KPI label="Lectores" value={miembros.filter(m=>m.rol===ROLES.LECTOR).length} color="#6b7280"/>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{fontWeight:700,marginBottom:14,fontSize:15}}>Personas con acceso</div>
        {miembros.length===0
          ? <div style={{textAlign:"center",padding:"30px 0",color:"#9ca3af",fontSize:14}}>No hay miembros aún</div>
          : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
              {miembros.map(m=>{
                const esYo = m.id===miMiembroId;
                const rb = ROLE_BADGE[m.rol]||{};
                return(
                  <div key={m.id} style={{background:"#f9fafb",borderRadius:12,padding:16,border:esYo?"2px solid #16a34a":"1px solid #e5e7eb"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                      <div style={{width:42,height:42,borderRadius:"50%",background:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16,flexShrink:0}}>
                        {(m.nombre||m.email||"?")[0].toUpperCase()}
                      </div>
                      <div style={{minWidth:0,flex:1}}>
                        <div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {m.nombre||"Sin nombre"}{esYo&&<span style={{fontSize:11,color:"#16a34a",marginLeft:6}}>(vos)</span>}
                        </div>
                        <div style={{fontSize:12,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.email}</div>
                      </div>
                    </div>
                    <div style={{marginBottom:10}}><Badge label={m.rol||"Lector"} bg={rb.bg} c={rb.c}/></div>
                    {m.telefono&&<div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>📱 {m.telefono}</div>}
                    {esAdmin&&!esYo&&(
                      <div style={{display:"flex",gap:6}}>
                        <Btn variant="secondary" small onClick={()=>setEditMiembro({...m})}><I.edit/> Cambiar rol</Btn>
                        <DelBtn onClick={()=>setConfirm(m.id)}/>
                      </div>
                    )}
                    {esYo&&(
                      <div style={{fontSize:11,color:"#9ca3af",fontStyle:"italic"}}>Sos vos — no podés cambiar tu propio rol</div>
                    )}
                  </div>
                );
              })}
            </div>
        }
      </div>

      {!esAdmin&&(
        <div style={{marginTop:20,background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:14,fontSize:13,color:"#92400e"}}>
          ⚠️ Solo los Administradores pueden cambiar roles o quitar miembros.
        </div>
      )}

      {editMiembro&&(
        <Modal title="Editar colaborador" onClose={()=>setEditMiembro(null)}>
          <Inp label="Nombre" value={editMiembro.nombre||""} onChange={e=>setEditMiembro({...editMiembro,nombre:e.target.value})}/>
          <div style={{marginBottom:13}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:4}}>Email</label>
            <div style={{padding:"9px 12px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,background:"#f9fafb",color:"#6b7280"}}>{editMiembro.email}</div>
          </div>
          <Inp label="Teléfono" value={editMiembro.telefono||""} onChange={e=>setEditMiembro({...editMiembro,telefono:e.target.value})}/>
          <Sel label="Rol" value={editMiembro.rol||"Lector"} onChange={e=>setEditMiembro({...editMiembro,rol:e.target.value})}>
            <option value="Administrador">Administrador (todo)</option>
            <option value="Editor">Editor (carga y edita, no borra)</option>
            <option value="Lector">Lector (solo ve)</option>
          </Sel>
          <div style={{background:"#f9fafb",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#6b7280",marginBottom:14}}>
            <b>Permisos por rol:</b><br/>
            • <b>Administrador</b>: todo incluido borrar y gestionar usuarios<br/>
            • <b>Editor</b>: puede cargar y editar pero no borrar<br/>
            • <b>Lector</b>: solo ve los datos
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditMiembro(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={saveRol} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
      )}
      {confirm&&<ConfirmModal msg="¿Quitar el acceso a este colaborador? Ya no podrá entrar a la app." onConfirm={()=>quitarAcceso(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ── CONFIG ──────────────────────────────────────────────────────────────────
function ConfigPage({data,orgId,toast,reload,dolar,setDolar,onLogout,user}){
  const [d,setD]=useState(dolar);
  const guardarDolar = async ()=>{
    await sb.from("config").upsert({org_id:orgId,dolar_oficial:Number(d),ultima_actualizacion:new Date().toISOString()},{onConflict:"org_id"});
    setDolar(Number(d));
    toast("Dólar actualizado");
    reload();
  };

  return(
    <div style={{maxWidth:600}}>
      <div style={{background:"#fff",borderRadius:14,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:16}}>Usuario actual</div>
        <div style={{fontSize:14,color:"#6b7280",marginBottom:4}}>Email: <b style={{color:"#111"}}>{user?.email}</b></div>
        <div style={{fontSize:14,color:"#6b7280",marginBottom:16}}>ID de organización: <code style={{background:"#f3f4f6",padding:"2px 6px",borderRadius:4,fontSize:12}}>{orgId}</code></div>
        <Btn variant="danger" onClick={onLogout}><I.logout/> Cerrar sesión</Btn>
      </div>

      <div style={{background:"#fff",borderRadius:14,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:16}}>Cotización del dólar</div>
        <div style={{fontSize:13,color:"#6b7280",marginBottom:12}}>Se usa para mostrar valores en USD en toda la app.</div>
        <Inp label="Dólar oficial (ARS por USD)" type="number" value={d} onChange={e=>setD(e.target.value)}/>
        <Btn variant="primary" onClick={guardarDolar}>Guardar cotización</Btn>
      </div>

      <div style={{background:"#fee2e2",borderRadius:14,padding:20,border:"1px solid #fecaca"}}>
        <div style={{fontWeight:700,color:"#dc2626",marginBottom:10}}>⚠️ Zona de peligro</div>
        <div style={{fontSize:13,color:"#6b7280",marginBottom:12}}>Esto NO borra los datos de Supabase. Solo cierra sesión.</div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
// HISTORIAL DE MOVIMIENTOS
// ════════════════════════════════════════════════════════════════════════════
function HistorialPage({data,orgId,toast,reload}){
  const [periodo,setPeriodo]=useState("mes"); // mes, trimestre, semestre, ano, custom
  const [mesRef,setMesRef]=useState(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;});
  const [desde,setDesde]=useState("");
  const [hasta,setHasta]=useState("");
  const [tipoFil,setTipoFil]=useState("Todos");
  const [campoFil,setCampoFil]=useState("Todos");

  // Calcular rango de fechas según período
  const rangoFechas = (()=>{
    const [yStr,mStr] = mesRef.split("-");
    const y=Number(yStr); const m=Number(mStr)-1; // 0-indexed
    const fmt = d=>d.toISOString().split("T")[0];
    if(periodo==="custom"){
      return {desde:desde||"1900-01-01", hasta:hasta||"2999-12-31"};
    }
    if(periodo==="mes"){
      const d1=new Date(y,m,1); const d2=new Date(y,m+1,0);
      return {desde:fmt(d1), hasta:fmt(d2)};
    }
    if(periodo==="trimestre"){
      const q=Math.floor(m/3); const d1=new Date(y,q*3,1); const d2=new Date(y,q*3+3,0);
      return {desde:fmt(d1), hasta:fmt(d2)};
    }
    if(periodo==="semestre"){
      const h=m<6?0:6; const d1=new Date(y,h,1); const d2=new Date(y,h+6,0);
      return {desde:fmt(d1), hasta:fmt(d2)};
    }
    if(periodo==="ano"){
      const d1=new Date(y,0,1); const d2=new Date(y,11,31);
      return {desde:fmt(d1), hasta:fmt(d2)};
    }
    return {desde:"1900-01-01", hasta:"2999-12-31"};
  })();

  // Construir lista unificada de eventos
  const eventos = (()=>{
    const evs = [];

    // Movimientos manuales (transferencias)
    (data.movimientos||[]).forEach(m=>{
      evs.push({
        fecha:m.fecha,
        tipo:m.tipo,
        tipo_label: m.tipo==="transfer_rodeo"?"🔄 Transferencia rodeo":m.tipo==="transfer_insumo"?"🔄 Transferencia insumo":m.tipo,
        descripcion:m.descripcion,
        campo: m.campo_origen && m.campo_destino ? `${m.campo_origen} → ${m.campo_destino}` : (m.campo_origen||m.campo_destino||""),
        cantidad: m.cantidad ? `${m.cantidad} ${m.unidad||""}`.trim() : "",
        monto: m.monto||null,
        detalles:m.detalles||{},
      });
    });

    // Finanzas (compras, gastos)
    (data.finanzas||[]).forEach(f=>{
      let icon = "💸";
      if(f.categoria==="Compra insumos") icon="📦";
      else if(f.categoria==="Compra hacienda") icon="🐄";
      else if(f.tipo==="Ingreso") icon="💰";
      evs.push({
        fecha:f.fecha,
        tipo: f.tipo==="Ingreso"?"ingreso":"egreso",
        tipo_label: `${icon} ${f.tipo}`,
        descripcion: f.concepto,
        campo: f.campo||"",
        cantidad: "",
        monto: Number(f.monto||0)*(f.tipo==="Egreso"?-1:1),
        detalles:{categoria:f.categoria,origen:f.origen},
      });
    });

    // Lluvias
    (data.lluvias||[]).forEach(l=>{
      evs.push({
        fecha:l.fecha,
        tipo:"lluvia",
        tipo_label:"🌧️ Lluvia",
        descripcion:`${l.mm} mm registrados${l.observaciones?` — ${l.observaciones}`:""}`,
        campo:l.campo||"",
        cantidad:`${l.mm} mm`,
        monto:null,
        detalles:{mm:Number(l.mm||0)},
      });
    });

    // Órdenes completadas
    (data.ordenes||[]).filter(o=>o.estado==="Completada").forEach(o=>{
      evs.push({
        fecha:o.fecha,
        tipo:"orden_completada",
        tipo_label:`✅ Orden completada`,
        descripcion:`${o.tipo}: ${o.titulo}`,
        campo:o.campo||"",
        cantidad:"",
        monto:null,
        detalles:{responsable:o.responsable,prioridad:o.prioridad,insumos:o.insumos_usados||[]},
      });
    });

    // Campañas iniciadas
    (data.campanas||[]).forEach(c=>{
      if(c.inicio){
        evs.push({
          fecha:c.inicio,
          tipo:"campana_inicio",
          tipo_label:"🌱 Inicio de campaña",
          descripcion:`${c.nombre} (${c.cultivo}) — ${c.hectareas} ha`,
          campo:c.campo||"",
          cantidad:`${c.hectareas} ha`,
          monto:null,
          detalles:{cultivo:c.cultivo,rendimiento_obj:c.rendimiento_obj},
        });
      }
      if(c.fin && c.estado==="Cerrada"){
        evs.push({
          fecha:c.fin,
          tipo:"campana_cierre",
          tipo_label:"🏁 Cierre de campaña",
          descripcion:`${c.nombre} (${c.cultivo}) cerrada${c.rendimiento_real?` — rend. real ${c.rendimiento_real} qq/ha`:""}`,
          campo:c.campo||"",
          cantidad:`${c.hectareas} ha`,
          monto:null,
          detalles:{cultivo:c.cultivo,rendimiento_real:c.rendimiento_real},
        });
      }
    });

    // Alta de rodeos
    (data.animales||[]).forEach(a=>{
      if(a.fecha){
        evs.push({
          fecha:a.fecha,
          tipo:"alta_rodeo",
          tipo_label:"🐄 Alta de rodeo",
          descripcion:`Rodeo "${a.rodeo}" formado con ${a.cabezas} ${a.tipo} (${a.raza})`,
          campo:a.campo||"",
          cantidad:`${a.cabezas} cab.`,
          monto:Number(a.costo||0)*-1,
          detalles:{tipo:a.tipo,raza:a.raza,cabezas:a.cabezas},
        });
      }
    });

    return evs;
  })();

  // Filtrar por rango y filtros
  const eventosFiltrados = eventos
    .filter(e=>e.fecha>=rangoFechas.desde && e.fecha<=rangoFechas.hasta)
    .filter(e=>tipoFil==="Todos" || e.tipo===tipoFil || e.tipo_label.includes(tipoFil))
    .filter(e=>campoFil==="Todos" || (e.campo||"").includes(campoFil))
    .sort((a,b)=>b.fecha.localeCompare(a.fecha));

  // Tipos disponibles para el filtro
  const tiposDisponibles = [...new Set(eventos.map(e=>e.tipo_label))];

  // ── Generadores de descarga ────────────────────────────────────────────────
  const labelPeriodo = (()=>{
    if(periodo==="custom") return `${desde||"inicio"}_a_${hasta||"hoy"}`;
    if(periodo==="mes") return `${mesRef}`;
    if(periodo==="trimestre"){const [y,m]=mesRef.split("-");const q=Math.floor((Number(m)-1)/3)+1;return `${y}_T${q}`;}
    if(periodo==="semestre"){const [y,m]=mesRef.split("-");const s=Number(m)<=6?1:2;return `${y}_S${s}`;}
    if(periodo==="ano") return mesRef.split("-")[0];
    return "historial";
  })();

  const descargarCSV = ()=>{
    const headers = ["Fecha","Tipo","Descripción","Campo","Cantidad","Monto"];
    const rows = eventosFiltrados.map(e=>[
      e.fecha,
      e.tipo_label.replace(/[🔄💸📦🐄💰🌧️✅🌱🏁]/g,"").trim(),
      `"${(e.descripcion||"").replace(/"/g,'""')}"`,
      `"${(e.campo||"").replace(/"/g,'""')}"`,
      e.cantidad||"",
      e.monto!=null?e.monto:"",
    ].join(","));
    const csv = [headers.join(","),...rows].join("\n");
    const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `historial_${labelPeriodo}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const descargarTXT = ()=>{
    let txt = `HISTORIAL DE MOVIMIENTOS\n`;
    txt += `Período: ${rangoFechas.desde} a ${rangoFechas.hasta}\n`;
    txt += `Total de eventos: ${eventosFiltrados.length}\n`;
    txt += `${"=".repeat(70)}\n\n`;

    // Agrupar por mes
    const porMes = {};
    eventosFiltrados.forEach(e=>{
      const ym = e.fecha.substring(0,7);
      (porMes[ym]=porMes[ym]||[]).push(e);
    });

    Object.keys(porMes).sort().reverse().forEach(ym=>{
      const [y,m] = ym.split("-");
      const nombreMes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][Number(m)-1];
      txt += `\n### ${nombreMes} ${y} (${porMes[ym].length} eventos)\n`;
      porMes[ym].forEach(e=>{
        txt += `- [${e.fecha}] ${e.tipo_label} `;
        if(e.campo) txt += `(${e.campo}) `;
        txt += `— ${e.descripcion}`;
        if(e.cantidad) txt += ` [${e.cantidad}]`;
        if(e.monto!=null) txt += ` [${e.monto<0?"-":""}$${Math.abs(e.monto).toLocaleString("es-AR")}]`;
        txt += `\n`;
      });
    });

    // Resumen agregado
    txt += `\n${"=".repeat(70)}\nRESUMEN DEL PERÍODO\n${"=".repeat(70)}\n`;
    const egresoTotal = eventosFiltrados.filter(e=>e.monto<0).reduce((s,e)=>s+Math.abs(e.monto),0);
    const ingresoTotal = eventosFiltrados.filter(e=>e.monto>0).reduce((s,e)=>s+e.monto,0);
    const lluviaTotal = eventosFiltrados.filter(e=>e.tipo==="lluvia").reduce((s,e)=>s+(e.detalles?.mm||0),0);
    const transferRodeos = eventosFiltrados.filter(e=>e.tipo==="transfer_rodeo").length;
    const transferInsumos = eventosFiltrados.filter(e=>e.tipo==="transfer_insumo").length;
    const ordenesComp = eventosFiltrados.filter(e=>e.tipo==="orden_completada").length;

    txt += `- Egresos totales: $${egresoTotal.toLocaleString("es-AR")}\n`;
    txt += `- Ingresos totales: $${ingresoTotal.toLocaleString("es-AR")}\n`;
    txt += `- Balance neto: $${(ingresoTotal-egresoTotal).toLocaleString("es-AR")}\n`;
    txt += `- Lluvia acumulada: ${lluviaTotal} mm\n`;
    txt += `- Transferencias de rodeos: ${transferRodeos}\n`;
    txt += `- Transferencias de insumos: ${transferInsumos}\n`;
    txt += `- Órdenes completadas: ${ordenesComp}\n`;

    const blob = new Blob([txt],{type:"text/plain;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `historial_${labelPeriodo}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const descargarJSON = ()=>{
    const obj = {
      generado: new Date().toISOString(),
      periodo: {desde:rangoFechas.desde, hasta:rangoFechas.hasta, label:labelPeriodo},
      total_eventos: eventosFiltrados.length,
      eventos: eventosFiltrados,
    };
    const blob = new Blob([JSON.stringify(obj,null,2)],{type:"application/json;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `historial_${labelPeriodo}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Total monto
  const totalEgreso = eventosFiltrados.filter(e=>e.monto<0).reduce((s,e)=>s+Math.abs(e.monto),0);
  const totalIngreso = eventosFiltrados.filter(e=>e.monto>0).reduce((s,e)=>s+e.monto,0);

  return(
    <div>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <KPI label="Eventos en período" value={eventosFiltrados.length}/>
        <KPI label="Egresos" value={fmtK(totalEgreso)} color="#ef4444"/>
        <KPI label="Ingresos" value={fmtK(totalIngreso)} color="#16a34a"/>
        <KPI label="Balance" value={fmtK(totalIngreso-totalEgreso)} color={totalIngreso>=totalEgreso?"#16a34a":"#ef4444"}/>
      </div>

      {/* Selector de período */}
      <div style={{background:"#fff",borderRadius:14,padding:16,marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {[
            {id:"mes",label:"Mes"},
            {id:"trimestre",label:"Trimestre"},
            {id:"semestre",label:"Semestre"},
            {id:"ano",label:"Año"},
            {id:"custom",label:"Custom"},
          ].map(p=>(
            <button key={p.id} onClick={()=>setPeriodo(p.id)} style={{padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:periodo===p.id?"#16a34a":"#f3f4f6",color:periodo===p.id?"#fff":"#374151"}}>{p.label}</button>
          ))}
        </div>

        {periodo!=="custom" ? (
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <input type="month" value={mesRef} onChange={e=>setMesRef(e.target.value)} style={{padding:"7px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13}}/>
            <span style={{fontSize:12,color:"#6b7280"}}>
              📅 {rangoFechas.desde} → {rangoFechas.hasta}
            </span>
          </div>
        ):(
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <input type="date" value={desde} onChange={e=>setDesde(e.target.value)} style={{padding:"7px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13}}/>
            <span style={{fontSize:12,color:"#6b7280"}}>a</span>
            <input type="date" value={hasta} onChange={e=>setHasta(e.target.value)} style={{padding:"7px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13}}/>
          </div>
        )}

        <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
          <select value={tipoFil} onChange={e=>setTipoFil(e.target.value)} style={{padding:"7px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,background:"#fff"}}>
            <option value="Todos">Todos los tipos</option>
            {tiposDisponibles.map(t=><option key={t}>{t}</option>)}
          </select>
          <select value={campoFil} onChange={e=>setCampoFil(e.target.value)} style={{padding:"7px 10px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,background:"#fff"}}>
            <option>Todos</option>
            {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
          <Btn variant="primary" small onClick={descargarTXT}><I.download/> Descargar TXT (para IA)</Btn>
          <Btn variant="secondary" small onClick={descargarCSV}><I.download/> Descargar CSV</Btn>
          <Btn variant="secondary" small onClick={descargarJSON}><I.download/> Descargar JSON</Btn>
        </div>
      </div>

      {/* Lista de eventos */}
      <div style={{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
        {eventosFiltrados.length===0
          ? <div style={{textAlign:"center",padding:"40px 20px",color:"#9ca3af"}}>
              <div style={{fontSize:14}}>No hay eventos en este período con los filtros seleccionados</div>
            </div>
          : <div>
              {eventosFiltrados.map((e,i)=>(
                <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:i===eventosFiltrados.length-1?"none":"1px solid #f3f4f6",alignItems:"flex-start",flexWrap:"wrap"}}>
                  <div style={{minWidth:90,fontSize:12,color:"#6b7280",fontWeight:600}}>{fmtDate(e.fecha)}</div>
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{e.tipo_label}</div>
                    <div style={{fontSize:13,color:"#374151"}}>{e.descripcion}</div>
                    {e.campo && <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>📍 {e.campo}</div>}
                  </div>
                  <div style={{textAlign:"right",minWidth:100}}>
                    {e.cantidad && <div style={{fontSize:12,color:"#6b7280"}}>{e.cantidad}</div>}
                    {e.monto!=null && <div style={{fontSize:13,fontWeight:700,color:e.monto>=0?"#16a34a":"#ef4444"}}>
                      {e.monto>=0?"+":"-"}{fmtK(Math.abs(e.monto))}
                    </div>}
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
const NAV=[
  {group:"GESTIÓN",items:[
    {id:"resumen",label:"Resumen",icon:I.home},
    {id:"campos",label:"Campos",icon:I.map},
    {id:"animales",label:"Animales",icon:I.cow},
    {id:"campanas",label:"Campañas",icon:I.wheat},
    {id:"lluvias",label:"Lluvias",icon:I.rain},
    {id:"stock",label:"Stock",icon:I.box},
    {id:"maquinaria",label:"Maquinaria",icon:I.truck},
    {id:"finanzas",label:"Gastos",icon:I.dollar},
  ]},
  {group:"OPERACIONES",items:[
    {id:"ordenes",label:"Órdenes",icon:I.clipboard},
    {id:"documentos",label:"Documentos",icon:I.file},
    {id:"historial",label:"Historial",icon:I.history},
  ]},
  {group:"EQUIPO",items:[
    {id:"colaboradores",label:"Colaboradores",icon:I.users},
  ]},
  {group:"CONFIG",items:[
    {id:"config",label:"Configuración",icon:I.settings},
  ]},
];
const TITLES={resumen:"Resumen Ejecutivo",campos:"Campos",animales:"Animales",campanas:"Campañas",lluvias:"Lluvias",stock:"Stock e Insumos",maquinaria:"Maquinaria",finanzas:"Gastos",ordenes:"Órdenes de Trabajo",documentos:"Documentos",historial:"Historial de Movimientos",colaboradores:"Colaboradores",config:"Configuración"};

const TopActions=({page,onAction,miRol})=>{
  const map={
    campos:"Agregar Campo",animales:"Nuevo Rodeo",campanas:"Nueva Campaña",
    stock:"Agregar Insumo",maquinaria:"Agregar Maquinaria",lluvias:"Registrar Lluvia",
    ordenes:"Nueva Orden",finanzas:"Nuevo Egreso",
  };
  const label=map[page];
  if(!label) return null;
  if(!canEdit(miRol)) return null;
  return <Btn variant="primary" onClick={()=>onAction({preset:{}})}><I.plus/> {label}</Btn>;
};

export default function App(){
  const [session,setSession]=useState(null);
  const [user,setUser]=useState(null);
  const [orgId,setOrgId]=useState(null);
  const [miRol,setMiRol]=useState(null);
  const [miMiembroId,setMiMiembroId]=useState(null);
  const [loadingAuth,setLoadingAuth]=useState(true);
  const [data,setData]=useState({campos:[],stock:[],animales:[],campanas:[],maquinaria:[],lluvias:[],finanzas:[],ordenes:[],documentos:[],colaboradores:[],miembros:[],notificaciones:[],movimientos:[]});
  const [dolar,setDolar]=useState(1420);
  const [page,setPage]=useState("resumen");
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [toastMsg,setToastMsg]=useState(null);
  const [modalReq,setModalReq]=useState(null);
  const [notifOpen,setNotifOpen]=useState(false);

  // AUTH
  useEffect(()=>{
    sb.auth.getSession().then(({data})=>{
      setSession(data.session);
      setUser(data.session?.user||null);
      setLoadingAuth(false);
    });
    const {data:listener} = sb.auth.onAuthStateChange((_e,s)=>{
      setSession(s);
      setUser(s?.user||null);
    });
    return ()=>listener.subscription.unsubscribe();
  },[]);

  // LOAD ORG
  useEffect(()=>{
    if(!user) return;
    (async ()=>{
      const {data:mem}=await sb.from("miembros").select("id,org_id,rol").eq("user_id",user.id).limit(1).maybeSingle();
      if(mem){
        setOrgId(mem.org_id);
        setMiRol(mem.rol);
        setMiMiembroId(mem.id);
      }
    })();
  },[user]);

  // LOAD DATA
  const reload = useCallback(async ()=>{
    if(!orgId) return;
    const tables = ["campos","stock","animales","campanas","maquinaria","lluvias","finanzas","ordenes","documentos","colaboradores","miembros","notificaciones","movimientos"];
    const results = await Promise.all(tables.map(t=>sb.from(t).select("*").eq("org_id",orgId)));
    const newData = {};
    tables.forEach((t,i)=>{newData[t]=results[i].data||[];});
    setData(newData);
    const {data:cfg} = await sb.from("config").select("*").eq("org_id",orgId).maybeSingle();
    if(cfg) setDolar(Number(cfg.dolar_oficial)||1420);

    // Auto-complete orders past deadline
    const today = todayISO();
    const pending = (newData.ordenes||[]).filter(o=>o.estado==="Pendiente"&&o.fecha&&o.fecha<=today&&!o.insumos_aplicados);
    for(const o of pending){
      for(const ins of (o.insumos_usados||[])){
        const stk = newData.stock.find(s=>s.id===ins.stock_id);
        if(stk){
          await sb.from("stock").update({cantidad:Math.max(0,Number(stk.cantidad)-Number(ins.cantidad))}).eq("id",stk.id);
          const monto = Number(ins.cantidad)*Number(stk.costo_unit||0);
          if(monto>0){
            await sb.from("finanzas").insert({org_id:orgId,fecha:today,tipo:"Egreso",concepto:`Auto: ${stk.nombre} usado en "${o.titulo}"`,categoria:"Compra insumos",campo:o.campo,monto,origen:"orden_auto",origen_id:o.id});
          }
        }
      }
      await sb.from("ordenes").update({estado:"Completada",insumos_aplicados:true}).eq("id",o.id);
    }
    if(pending.length>0){
      // Reload after auto-completing
      const results2 = await Promise.all(tables.map(t=>sb.from(t).select("*").eq("org_id",orgId)));
      const newData2 = {};
      tables.forEach((t,i)=>{newData2[t]=results2[i].data||[];});
      setData(newData2);
    }
  },[orgId]);

  useEffect(()=>{reload();},[reload]);

  // Realtime subscriptions
  useEffect(()=>{
    if(!orgId) return;
    const ch = sb.channel("changes")
      .on("postgres_changes",{event:"*",schema:"public"},()=>reload())
      .subscribe();
    return ()=>sb.removeChannel(ch);
  },[orgId,reload]);

  const toast=useCallback((msg,type="success")=>{
    setToastMsg({msg,type});
    setTimeout(()=>setToastMsg(null),3000);
  },[]);

  const handleAction = req=>setModalReq({...req,ts:Date.now()});
  const clearModal = useCallback(()=>setModalReq(null),[]);

  const onLogout = async ()=>{
    await sb.auth.signOut();
    setSession(null);setUser(null);setOrgId(null);
  };

  // Notifications
  const notifsBD = (data.notificaciones||[]).filter(n=>!n.leida).map(n=>({tipo:n.tipo==="nuevo_miembro"?"info":"warn",msg:n.mensaje,page:"colaboradores",id:n.id}));
  const notifs = [
    ...notifsBD,
    ...data.stock.filter(s=>Number(s.cantidad)<Number(s.minimo)).map(s=>({tipo:"warn",msg:`Stock bajo: ${s.nombre} (${s.cantidad} ${s.unidad})`,page:"stock"})),
    ...data.ordenes.filter(o=>o.estado==="Pendiente"&&o.fecha&&o.fecha<=todayISO()).map(o=>({tipo:"warn",msg:`Orden vencida: ${o.titulo}`,page:"ordenes"})),
    ...data.ordenes.filter(o=>{if(o.estado!=="Pendiente"||!o.fecha)return false;const d=new Date(o.fecha);const h=new Date();const diff=(d-h)/(1000*60*60*24);return diff>0&&diff<=3;}).map(o=>({tipo:"info",msg:`Próxima: ${o.titulo} (${fmtDate(o.fecha)})`,page:"ordenes"})),
  ];

  const marcarNotifLeida = async (id)=>{
    if(!id) return;
    await sb.from("notificaciones").update({leida:true}).eq("id",id);
    reload();
  };

  if(loadingAuth) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><Spinner/></div>;
  if(!session) return <AuthScreen onAuth={()=>window.location.reload()}/>;
  if(!orgId) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
    <Spinner/>
    <div>Cargando tu organización...</div>
    <Btn variant="ghost" small onClick={onLogout}>Cerrar sesión</Btn>
  </div>;

  const props={data,orgId,toast,reload,modalReq,clearModal,dolar,setPage,miRol,miMiembroId,user};
  setCurrentRole(miRol||"Lector");
  const PAGES={
    resumen:<ResumenPage {...props}/>,
    campos:<CamposPage {...props}/>,
    animales:<AnimalesPage {...props}/>,
    campanas:<CampanasPage {...props}/>,
    lluvias:<LluviasPage {...props}/>,
    stock:<StockPage {...props}/>,
    maquinaria:<MaquinariaPage {...props}/>,
    finanzas:<FinanzasPage {...props}/>,
    ordenes:<OrdenesPage {...props}/>,
    documentos:<DocumentosPage {...props}/>,
    historial:<HistorialPage {...props}/>,
    colaboradores:<ColaboradoresPage {...props}/>,
    config:<ConfigPage {...props} setDolar={setDolar} onLogout={onLogout} user={user}/>,
  };

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#f5f5f0",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{margin:0;}
        @keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px;}
        button:hover{opacity:.85;}
        input:focus,select:focus,textarea:focus{border-color:#16a34a!important;outline:none;box-shadow:0 0 0 3px #16a34a18;}
      `}</style>

      <div style={{width:sidebarOpen?232:58,minWidth:sidebarOpen?232:58,background:"#fff",borderRight:"1px solid #e5e7eb",display:"flex",flexDirection:"column",transition:"width .25s",overflow:"hidden",boxShadow:"2px 0 8px rgba(0,0,0,0.04)",zIndex:10}}>
        <div style={{padding:"14px 12px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden",border:"1px solid #f3f4f6"}}><img src={LOGO_URL} alt="María Amelia" style={{width:"100%",height:"100%",objectFit:"contain"}}/></div>
          {sidebarOpen&&<div><div style={{fontSize:10,color:"#9ca3af",lineHeight:1}}>Control operativo</div><div style={{fontWeight:800,fontSize:14}}>Campo Manager</div></div>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
          {NAV.map(g=>(
            <div key={g.group}>
              {sidebarOpen&&<div style={{fontSize:10,fontWeight:700,color:"#9ca3af",padding:"10px 14px 3px",letterSpacing:1}}>{g.group}</div>}
              {g.items.map(it=>{
                const active=page===it.id;
                return(
                  <button key={it.id} onClick={()=>{setPage(it.id);setModalReq(null);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:sidebarOpen?"8px 14px":"8px 18px",border:"none",cursor:"pointer",background:active?"#f0fdf4":"transparent",color:active?"#16a34a":"#374151",borderLeft:active?"3px solid #16a34a":"3px solid transparent",justifyContent:sidebarOpen?"flex-start":"center"}}>
                    <div style={{color:active?"#16a34a":"#6b7280",flexShrink:0}}><it.icon/></div>
                    {sidebarOpen&&<span style={{fontSize:13,fontWeight:active?700:500,whiteSpace:"nowrap"}}>{it.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid #f3f4f6",padding:"12px"}}>
          {sidebarOpen&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13,flexShrink:0}}>{user?.email?.[0]?.toUpperCase()}</div>
            <div style={{minWidth:0,flex:1}}>
              <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</div>
              <div style={{fontSize:10,color:"#16a34a",fontWeight:600}}>{miRol||"Cargando..."}</div>
            </div>
          </div>}
          <button onClick={()=>setSidebarOpen(o=>!o)} style={{width:"100%",padding:"7px",borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:"#6b7280",fontSize:12}}>
            <I.menu/>{sidebarOpen&&"Colapsar"}
          </button>
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"0 24px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:8}}>
          <h1 style={{fontSize:18,fontWeight:800}}>{TITLES[page]}</h1>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <TopActions page={page} onAction={handleAction} miRol={miRol}/>
            <div style={{position:"relative"}}>
              <button onClick={()=>setNotifOpen(!notifOpen)} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",position:"relative"}}>
                <I.bell/>
                {notifs.length>0&&<div style={{position:"absolute",top:-2,right:-2,minWidth:14,height:14,padding:"0 3px",background:"#ef4444",borderRadius:7,color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{notifs.length}</div>}
              </button>
              {notifOpen&&(
                <div style={{position:"absolute",right:0,top:32,width:340,maxHeight:420,overflowY:"auto",background:"#fff",borderRadius:10,boxShadow:"0 8px 30px rgba(0,0,0,0.15)",border:"1px solid #e5e7eb",zIndex:100}}>
                  <div style={{padding:14,borderBottom:"1px solid #f3f4f6",fontWeight:700,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>Notificaciones</span>
                    {notifs.length>0&&<span style={{fontSize:11,color:"#6b7280",fontWeight:500}}>{notifs.length}</span>}
                  </div>
                  {notifs.length===0
                    ?<div style={{padding:24,textAlign:"center",color:"#9ca3af",fontSize:13}}>No hay notificaciones</div>
                    :notifs.map((n,i)=>(
                      <div key={i} onClick={()=>{setPage(n.page);setNotifOpen(false);if(n.id)marcarNotifLeida(n.id);}} style={{padding:"10px 14px",borderBottom:"1px solid #f3f4f6",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:16}}>{n.tipo==="info"?"👤":"⚠️"}</span>
                        <span style={{fontSize:13,flex:1}}>{n.msg}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          {miRol===ROLES.LECTOR&&(
            <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13,color:"#92400e",display:"flex",alignItems:"center",gap:8}}>
              👁️ Estás en modo <b>Lector</b>: podés ver todo pero no editar. Si necesitás cargar datos, pedile al administrador que te cambie el rol.
            </div>
          )}
          {miRol===ROLES.EDITOR&&page===page&&false}
          {PAGES[page]}
        </div>
      </div>

      <Toast msg={toastMsg?.msg} type={toastMsg?.type}/>
    </div>
  );
}
