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
};

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════
const CATEGORIAS_STOCK = ["Fertilizante", "Semillas", "Agroquímico", "Veterinario"];
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
          <div style={{width:56,height:56,borderRadius:14,background:"#16a34a",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:12}}>🌾</div>
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
            ? <LotesMapa campo={detail} ordenes={ordenesCampo} campanas={campanasCampo} onUpdate={lotes=>updateLotesData(detail,lotes)}/>
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
const COLORES_LOTE = [
  { value: "#16a34a", label: "Verde" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#f97316", label: "Naranja" },
  { value: "#ef4444", label: "Rojo" },
  { value: "#a855f7", label: "Púrpura" },
  { value: "#eab308", label: "Amarillo" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#ec4899", label: "Rosa" },
];

function LotesMapa({ campo, ordenes, campanas, onUpdate }) {
  const [selected, setSelected] = useState(null);
  const [editLote, setEditLote] = useState(null);
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

        // 🆕 Color cíclico de la paleta según el índice
        const color = COLORES_LOTE[currentLotes.length % COLORES_LOTE.length].value;

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

      // 🆕 Cada lote usa su propio color (fallback al color cíclico si no lo tiene)
      const color = lote.color || COLORES_LOTE[idx % COLORES_LOTE.length].value;

      const polygon = L.polygon(lote.coords, {
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.4,
        _loteId: lote.id,
      });
      polygon.on("click", () => setSelected(lote));
      polygon.bindTooltip(
        `<b>Lote ${lote.numero}</b> — ${lote.nombre}<br>${lote.hectareas} ha${lote.cultivo ? ` · ${lote.cultivo}` : ""}`
      );
      drawnItems.addLayer(polygon);

      if (lote.centro) {
        const labelIcon = L.divIcon({
          className: "lote-label",
          html: `<div style="background:${color};color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${lote.numero}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
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
                  {["", "#", "Nombre", "Cultivo", "Hectáreas", ""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "6px 10px", fontSize: 11, fontWeight: 700, color: "#6b7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lotes.map((l, idx) => {
                  const color = l.color || COLORES_LOTE[idx % COLORES_LOTE.length].value;
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
        <Modal title={`Lote ${selected.numero} — ${selected.nombre}`} onClose={() => setSelected(null)}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Cultivo / Uso</div>
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
          <Inp label="Cultivo / Uso" value={editLote.cultivo} onChange={e => setEditLote({ ...editLote, cultivo: e.target.value })} placeholder="Ej: Soja, Maíz, Pastoreo" />
          <Inp label="Hectáreas (calculado automáticamente)" type="number" value={editLote.hectareas} onChange={e => setEditLote({ ...editLote, hectareas: e.target.value })} />

          {/* 🆕 Selector de color */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: 600 }}>Color del lote</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COLORES_LOTE.map(c => {
                const selectedColor = (editLote.color || COLORES_LOTE[0].value) === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setEditLote({ ...editLote, color: c.value })}
                    title={c.label}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: c.value,
                      border: selectedColor ? "3px solid #111" : "2px solid #e5e7eb",
                      cursor: "pointer",
                      padding: 0,
                      transition: "transform .1s",
                      transform: selectedColor ? "scale(1.1)" : "scale(1)",
                    }}
                  />
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
    </div>
  );
}
// ── ANIMALES ────────────────────────────────────────────────────────────────
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
      // Auto-create finanza
      if(total>0){
        await sb.from("finanzas").insert({org_id:orgId,fecha:row.fecha,tipo:"Egreso",concepto:`Compra ${cabezas} ${row.tipo} - ${row.rodeo}`,categoria:"Compra hacienda",campo:row.campo,monto:total,origen:"animal",origen_id:inserted.id});
      }
    }

    if(isEdit && total!==oldCosto){
      // Update related finanza
      const diff = total-oldCosto;
      if(diff!==0){
        await sb.from("finanzas").insert({org_id:orgId,fecha:todayISO(),tipo:"Egreso",concepto:`Ajuste rodeo ${row.rodeo}`,categoria:"Compra hacienda",campo:row.campo,monto:diff,origen:"animal_ajuste",origen_id:editItem.id_real});
      }
    }

    setEditItem(null); reload();
  };

  const del = async id=>{
    // Cascade: also remove related finanzas entries
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
    // Mover el rodeo completo: solo cambiar campo y lote
    const {error} = await sb.from("animales").update({
      campo:t.campo_destino,
      lote:t.lote_destino||"",
    }).eq("id",t.original.id);
    if(error){toast(error.message,"error");return;}
    toast(`Rodeo movido a ${t.campo_destino}`);
  } else {
    // Partir: reducir el origen e insertar uno nuevo en el destino
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
                      <EditOnly><Btn variant="secondary" small onClick={()=>setComprarItem({item:s,cantidad:"",costo_unit:s.costo_unit})}>+ Comprar</Btn></EditOnly>
                      <EditOnly><Btn variant="ghost" small onClick={()=>setTransferItem({
                        item:s,
                        campo_destino:"",
                        cantidad_a_mover:s.cantidad,
                      })} title="Transferir a otro campo">🔄</Btn></EditOnly>
                      <EditBtn onClick={()=>setEditItem({...s,id_real:s.id,nombre:s.nombre,nombreCustom:""})}/>
                      <DelBtn onClick={()=>setConfirm(s.id)}/>
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
              {lotesDelCampo.map(l=><option key={l.id} value={l.nombre}>Lote {l.numero} — {l.nombre}{l.cultivo?` (${l.cultivo})`:""}</option>)}
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
      {confirm&&<ConfirmModal msg="¿Eliminar este rodeo?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

// ── STOCK ───────────────────────────────────────────────────────────────────
function StockPage({data,orgId,toast,reload,modalReq,clearModal}){
  const EMPTY={nombre:"",nombreCustom:"",unidad:"kg",categoria:"Fertilizante",cantidad:"",minimo:"",costo_unit:"",ubicacion:""};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const [comprarItem,setComprarItem]=useState(null);
  const [search,setSearch]=useState("");
  const [catFilter,setCatFilter]=useState("Todas");
  const [campoFil,setCampoFil]=useState("Todos");

  const cats=["Todas",...CATEGORIAS_STOCK];

  const filtered=data.stock.filter(s=>{
    const matchCat = catFilter==="Todas"||s.categoria===catFilter;
    const matchSearch = s.nombre?.toLowerCase().includes(search.toLowerCase());
    const matchCampo = campoFil==="Todos"||s.ubicacion===campoFil;
    return matchCat&&matchSearch&&matchCampo;
  });

  const save = async ()=>{
    const nombreFinal = editItem.nombre==="Otro"?editItem.nombreCustom:editItem.nombre;
    if(!nombreFinal){toast("Faltan campos","error");return;}
    const row={
      nombre:nombreFinal,
      unidad:editItem.unidad,
      categoria:editItem.categoria,
      cantidad:Number(editItem.cantidad||0),
      minimo:Number(editItem.minimo||0),
      costo_unit:Number(editItem.costo_unit||0),
      ubicacion:editItem.ubicacion,
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
        await sb.from("finanzas").insert({org_id:orgId,fecha:todayISO(),tipo:"Egreso",concepto:`Compra inicial ${row.nombre} (${row.cantidad} ${row.unidad})`,categoria:"Compra insumos",campo:row.ubicacion,monto:total,origen:"stock",origen_id:inserted.id});
      }
      toast("Insumo agregado");
    }
    setEditItem(null); reload();
  };

  const comprar = async ()=>{
    if(!comprarItem.cantidad||!comprarItem.costo_unit){toast("Faltan datos","error");return;}
    const cantNueva = Number(comprarItem.cantidad);
    const costo = Number(comprarItem.costo_unit);
    const cantActual = Number(comprarItem.item.cantidad);
    const total = cantNueva*costo;
    // Weighted average cost
    const newAvg = ((cantActual*Number(comprarItem.item.costo_unit))+(cantNueva*costo))/(cantActual+cantNueva);
    await sb.from("stock").update({cantidad:cantActual+cantNueva,costo_unit:newAvg}).eq("id",comprarItem.item.id);
    await sb.from("finanzas").insert({org_id:orgId,fecha:todayISO(),tipo:"Egreso",concepto:`Compra ${comprarItem.item.nombre} (+${cantNueva} ${comprarItem.item.unidad})`,categoria:"Compra insumos",campo:comprarItem.item.ubicacion,monto:total,origen:"stock_compra",origen_id:comprarItem.item.id});
    toast(`+${cantNueva} ${comprarItem.item.unidad} de ${comprarItem.item.nombre}`);
    setComprarItem(null); reload();
  };

  const del = async id=>{
    // Cascade: also remove related finanzas entries (stock initial + stock_compra)
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
                    <td style={{padding:"12px",fontSize:13}}>{Number(s.cantidad).toLocaleString("es-AR")}<div style={{fontSize:11,color:bajo?"#ef4444":"#9ca3af"}}>Min: {s.minimo}</div></td>
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
                      <EditOnly><Btn variant="secondary" small onClick={()=>setComprarItem({item:s,cantidad:"",costo_unit:s.costo_unit})}>+ Comprar</Btn></EditOnly>
                      <EditOnly><Btn variant="ghost" small onClick={()=>setTransferItem({
                        item:s,
                        campo_destino:"",
                        cantidad_a_mover:s.cantidad,
                      })} title="Transferir a otro campo">🔄</Btn></EditOnly>
                      <EditBtn onClick={()=>setEditItem({...s,id_real:s.id,nombre:s.nombre,nombreCustom:""})}/>
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
          <div style={{background:"#fef9c3",borderRadius:8,padding:12,marginBottom:14,fontSize:13}}>
            Total compra: <b>{fmt((Number(comprarItem.cantidad)||0)*(Number(comprarItem.costo_unit)||0))}</b>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setComprarItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={comprar} full><I.plus/> Registrar compra</Btn>
          </div>
        </Modal>
      )}
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
  const EMPTY={nombre:"",cultivo:"Soja",campo:"",hectareas:"",rendimiento_obj:"",rendimiento_real:null,estado:"Activa",inicio:todayISO(),fin:null,costos:0,notas:""};
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
        {filtered.map(c=>(
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
            <div style={{fontSize:12,color:"#9ca3af",marginBottom:12}}>📅 {fmtDate(c.inicio)} → {c.fin?fmtDate(c.fin):"en curso"}</div>
            <div style={{display:"flex",gap:6}}>
              <Btn variant="primary" small style={{flex:1,justifyContent:"center"}} onClick={()=>setDetail(c)}>📊 Ver detalle</Btn>
              <EditBtn onClick={()=>setEditItem({...c})}/>
              <DelBtn onClick={()=>setConfirm(c.id)}/>
            </div>
          </div>
        ))}
      </div>

      {editItem&&!detail&&(
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
          <Sel label="Campo" value={editItem.campo} onChange={e=>setEditItem({...editItem,campo:e.target.value})}>
            <option value="">Seleccionar...</option>
            {data.campos.map(c=><option key={c.id} value={c.nombre}>{c.nombre}</option>)}
          </Sel>
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
      )}
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
            return l?`Lote ${l.numero}`:null;
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
                          {sel?"✓ ":""}Lote {l.numero} — {l.nombre}
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
  const EMPTY={fecha:todayISO(),concepto:"",categoria:"Otros",campo:"",monto:""};
  const {editItem,setEditItem,confirm,setConfirm}=useEdit(EMPTY,modalReq,clearModal);
  const egresos=data.finanzas.reduce((s,f)=>s+Number(f.monto||0),0);
  const CATS=["Compra insumos","Labores contratadas","Combustible","Sueldos","Fletes","Compra hacienda","Mantenimiento","Servicios","Otros"];

  const save = async ()=>{
    if(!editItem.concepto||!editItem.monto){toast("Faltan campos","error");return;}
    const row={fecha:editItem.fecha,tipo:"Egreso",concepto:editItem.concepto,categoria:editItem.categoria,campo:editItem.campo,monto:Number(editItem.monto)};
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
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <KPI label="Gastos totales" value={fmtK(egresos)} sub={fmtUSD(egresos,dolar)} color="#ef4444"/>
        <KPI label="Movimientos" value={data.finanzas.length}/>
        <KPI label="Dólar oficial" value={`$ ${dolar.toLocaleString("es-AR")}`} sub="Editable en Config"/>
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
        <div style={{fontWeight:700,marginBottom:14}}>Movimientos</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
              {["Fecha","Concepto","Categoría","Campo","Monto ARS","Monto USD","Origen","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 12px",fontSize:12,fontWeight:700,color:"#6b7280",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {data.finanzas.sort((a,b)=>(b.fecha||"").localeCompare(a.fecha||"")).map(f=>(
                <tr key={f.id} style={{borderBottom:"1px solid #f9fafb"}}>
                  <td style={{padding:"10px",fontSize:13}}>{fmtDate(f.fecha)}</td>
                  <td style={{padding:"10px",fontSize:13,maxWidth:240}}>{f.concepto}</td>
                  <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}>{f.categoria}</td>
                  <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}>{f.campo||"—"}</td>
                  <td style={{padding:"10px",fontWeight:700,color:"#ef4444",whiteSpace:"nowrap"}}>-{fmtK(f.monto)}</td>
                  <td style={{padding:"10px",fontSize:12,color:"#9ca3af",whiteSpace:"nowrap"}}>{fmtUSD(f.monto,dolar)}</td>
                  <td style={{padding:"10px",fontSize:11,color:"#9ca3af"}}>{f.origen||"manual"}</td>
                  <td style={{padding:"10px"}}>
                    <div style={{display:"flex",gap:4}}>
                      <EditBtn onClick={()=>setEditItem({...f})}/>
                      <DelBtn onClick={()=>setConfirm(f.id)}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editItem&&(
        <Modal title={editItem.id?"Editar Movimiento":"Nuevo Egreso"} onClose={()=>setEditItem(null)}>
          <Inp label="Concepto" value={editItem.concepto} onChange={e=>setEditItem({...editItem,concepto:e.target.value})}/>
          <Sel label="Categoría" value={editItem.categoria} onChange={e=>setEditItem({...editItem,categoria:e.target.value})}>
            {CATS.map(c=><option key={c}>{c}</option>)}
          </Sel>
          <Sel label="Campo" value={editItem.campo} onChange={e=>setEditItem({...editItem,campo:e.target.value})}>
            <option value="">— Ninguno —</option>
            {data.campos.map(c=><option key={c.id}>{c.nombre}</option>)}
          </Sel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Inp label="Fecha" type="date" value={editItem.fecha} onChange={e=>setEditItem({...editItem,fecha:e.target.value})}/>
            <Inp label="Monto ($)" type="number" value={editItem.monto} onChange={e=>setEditItem({...editItem,monto:e.target.value})}/>
          </div>
          {editItem.monto&&<div style={{background:"#f0fdf4",borderRadius:8,padding:10,fontSize:13,marginBottom:10}}>USD: <b>{fmtUSD(editItem.monto,dolar)}</b></div>}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setEditItem(null)} full>Cancelar</Btn>
            <Btn variant="primary" onClick={save} full><I.save/> Guardar</Btn>
          </div>
        </Modal>
      )}
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
  ]},
  {group:"EQUIPO",items:[
    {id:"colaboradores",label:"Colaboradores",icon:I.users},
  ]},
  {group:"CONFIG",items:[
    {id:"config",label:"Configuración",icon:I.settings},
  ]},
];
const TITLES={resumen:"Resumen Ejecutivo",campos:"Campos",animales:"Animales",campanas:"Campañas",lluvias:"Lluvias",stock:"Stock e Insumos",maquinaria:"Maquinaria",finanzas:"Gastos",ordenes:"Órdenes de Trabajo",documentos:"Documentos",colaboradores:"Colaboradores",config:"Configuración"};

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
  const [data,setData]=useState({campos:[],stock:[],animales:[],campanas:[],maquinaria:[],lluvias:[],finanzas:[],ordenes:[],documentos:[],colaboradores:[],miembros:[],notificaciones:[]});
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
    const tables = ["campos","stock","animales","campanas","maquinaria","lluvias","finanzas","ordenes","documentos","colaboradores","miembros","notificaciones"];
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
          <div style={{width:36,height:36,borderRadius:10,background:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:18,flexShrink:0}}>🌾</div>
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
