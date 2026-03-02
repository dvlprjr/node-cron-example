// lib/cron.ts
import cron from "node-cron"

let started = false

export function startCronJobs() {
  if (started) return
  started = true

  // PARA PRUEBA: cada minuto
  // Luego lo cambias a diario 00:05 -> "5 0 * * *"
  const expression = "* * * * *"

  cron.schedule(
    expression,
    async () => {
      try {
        // OJO: en prod usarías tu dominio real, aquí local:
        const baseUrl = process.env.CRON_BASE_URL || "http://localhost:3000"

        const res = await fetch(`${baseUrl}/api/jobs/acreditar-quincena`, {
          method: "POST",
          headers: { "content-type": "application/json" },
        })

        const data = await res.json()
        console.log("[CRON] acreditar-quincena:", data)
      } catch (e) {
        console.error("[CRON] Error:", e)
      }
    },
    { timezone: "America/Tegucigalpa" },
  )

  console.log("[CRON] Iniciado con:", expression)
}