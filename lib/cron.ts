// // lib/cron.ts
// import cron from "node-cron"

// let started = false

// export function startCronJobs() {
//   if (started) return
//   started = true

//   // PARA PRUEBA: cada minuto
//   // Luego lo cambias a diario 00:05 -> "5 0 * * *"
//   const expression = "* * * * *"

//   cron.schedule(
//     expression,
//     async () => {
//       try {
//         // OJO: en prod usarías tu dominio real, aquí local:
//         const baseUrl = process.env.CRON_BASE_URL || "http://localhost:3001"

//         const res = await fetch(`${baseUrl}/api/jobs/acreditar-quincena`, {
//           method: "POST",
//           headers: { "content-type": "application/json" },
//         })

//         const data = await res.json()
//         console.log("[CRON] acreditar-quincena:", data)
//       } catch (e) {
//         console.error("[CRON] Error:", e)
//       }
//     },
//     { timezone: "America/Tegucigalpa" },
//   )

//   console.log("[CRON] Iniciado con:", expression)
// }

// lib/cron.ts
import cron from "node-cron";

function getNowParts() {
  const tz = "America/Tegucigalpa";

  const now = new Date();

  const time = new Intl.DateTimeFormat("es-HN", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const date = new Intl.DateTimeFormat("es-HN", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);

  // En es-HN normalmente sale dd/mm/aaaa; lo pasamos a dd-mm-aaaa
  const dateDash = date.replaceAll("/", "-");

  return { time, dateDash };
}

// Evita iniciar el cron 2 veces en dev (Fast Refresh / Turbopack)
declare global {
  // eslint-disable-next-line no-var
  var __cron_started__: boolean | undefined;
}

export function startCron() {
  if (globalThis.__cron_started__) return;
  globalThis.__cron_started__ = true;

  const expr = process.env.CRON_EXPR || "*/1 * * * *"; // cada 1 minuto
  console.log("[CRON] Iniciado con:", expr);

  cron.schedule(expr, () => {
    const { time, dateDash } = getNowParts();
    console.log(`Hola, son las: ${time} y hoy es: ${dateDash}`);
  });
}