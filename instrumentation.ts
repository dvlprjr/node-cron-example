// instrumentation.ts
export async function register() {
  // Solo en runtime de Node (no edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startCron } = await import("./lib/cron");
    startCron();
  }
}