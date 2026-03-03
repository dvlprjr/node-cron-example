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

import cron from "node-cron";

function getNowParts() {
  const tz = "America/Tegucigalpa";
  const now = new Date();

  // Hora (09:42)
  const time = new Intl.DateTimeFormat("es-HN", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  // Fecha con letras
  const formatter = new Intl.DateTimeFormat("es-HN", {
    timeZone: tz,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const parts = formatter.formatToParts(now);

  const weekday =
    parts.find((p) => p.type === "weekday")?.value ?? "";

  const day =
    parts.find((p) => p.type === "day")?.value ?? "";

  const month =
    parts.find((p) => p.type === "month")?.value ?? "";

  const year =
    parts.find((p) => p.type === "year")?.value ?? "";

  // Capitalizamos el día (Martes en vez de martes)
  const weekdayCapitalized =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  const fullDate = `${weekdayCapitalized} ${day} de ${month} del ${year}`;

  return { time, fullDate };
}

// Evita iniciar el cron 2 veces en dev
declare global {
  // eslint-disable-next-line no-var
  var __cron_started__: boolean | undefined;
}

export function startCron() {
  if (globalThis.__cron_started__) return;
  globalThis.__cron_started__ = true;

  const expr = process.env.CRON_EXPR || "*/2 * * * * *"; // cada 2 segundos
/*
        ┌──────── minuto (0 - 59)
        │ ┌────── hora (0 - 23)
        │ │ ┌──── día del mes (1 - 31)
        │ │ │ ┌── mes (1 - 12)
        │ │ │ │ ┌ día de la semana (0 - 7)
        │ │ │ │ │
--      * * * * *
*/
  console.log("[CRON] Iniciado con:", expr);

  cron.schedule(expr, () => {
    const { time, fullDate } = getNowParts();
    console.log(`Hola, son las ${time} y hoy es ${fullDate}`);
  });
}
cron.schedule("*/10 * * * * *", async () => {
  await fetch("http://127.0.0.1:3000/api/cron-insert", {
    method: "POST",
  });

  console.log("Transacción insertada por cron");
});