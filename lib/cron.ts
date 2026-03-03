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

  const time = new Intl.DateTimeFormat("es-HN", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const formatter = new Intl.DateTimeFormat("es-HN", {
    timeZone: tz,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const parts = formatter.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  const weekdayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const fullDate = `${weekdayCapitalized} ${day} de ${month} del ${year}`;

  return { time, fullDate };
}

declare global {
  // eslint-disable-next-line no-var
  var __cron_started__: boolean | undefined;
}

export function startCron() {
  if (globalThis.__cron_started__) return;
  globalThis.__cron_started__ = true;

  const exprLog = process.env.CRON_EXPR || "*/2 * * * * *"; // demo log
  const exprInsert = process.env.CRON_INSERT_EXPR || "*/1 * * * * *"; // cada 10s

  const baseUrl = process.env.CRON_BASE_URL || "http://127.0.0.1:3001";

  console.log("[CRON] Iniciado. log:", exprLog, "| insert:", exprInsert, "| baseUrl:", baseUrl);

  // 1) Solo logs
  cron.schedule(exprLog, () => {
    const { time, fullDate } = getNowParts();
    console.log(`Hola, son las ${time} y hoy es ${fullDate}`);
  });

  // 2) Insert real
  cron.schedule(exprInsert, async () => {
    try {
      const response = await fetch(`${baseUrl}/api/cron-insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const text = await response.text();

      // console.log("[CRON] insert status:", response.status, response.statusText);
      // console.log("[CRON] insert content-type:", response.headers.get("content-type"));
      // console.log("[CRON] insert body:", text.slice(0, 300));

      // Si quieres, intenta parsear JSON solo si parece JSON
      if (response.headers.get("content-type")?.includes("application/json")) {
        const data = JSON.parse(text);
        if (!data.ok) console.error("[CRON] insert FAIL:", data);
        else console.log("[CRON] insert OK:", data);
      }
    } catch (error) {
      console.error("[CRON] Error al insertar:", error);
    }
  });
}