import { NextResponse } from "next/server"

export const dynamic = "force-dynamic" // evita caché en dev

export async function GET() {
  console.log("✅ HIT /api/jobs/acreditar-quincena", new Date().toISOString())
  return NextResponse.json({ ok: true, ts: new Date().toISOString() })
}