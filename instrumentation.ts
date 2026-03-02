// instrumentation.ts
export async function register() {
  // Garantiza que corra solo en runtime Node
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startCronJobs } = await import("./lib/cron")
    startCronJobs()
  }
}