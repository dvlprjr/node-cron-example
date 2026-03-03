import { getConnection } from "@/lib/db";
import sql from "mssql";

export async function POST() {
  try {
    const pool = await getConnection();

    const personaId = 1; // demo
    const monto = 100;

    const tx = new sql.Transaction(pool);
    await tx.begin();

    try {
      const req = new sql.Request(tx);

      // Declara inputs UNA SOLA VEZ
      req.input("PersonaId", sql.Int, personaId);
      req.input("Monto", sql.Decimal(18, 2), monto);

      // 1) Lee correlativo real desde Transaccion
      const maxRes = await req.query(`
        SELECT ISNULL(MAX(TransaccionNumero), 0) AS MaxNum
        FROM dbo.Transaccion
        WHERE PersonaId = @PersonaId
      `);

      const nextNumero = (maxRes.recordset[0]?.MaxNum ?? 0) + 1;

      // 2) Insertar transacción (usa nextNumero como parámetro NUEVO)
      req.input("NextNumero", sql.Int, nextNumero);

      // Si NO quieres manejar TransaccionId todavía, ponlo por MAX+1 (demo)
      const idRes = await req.query(`
        SELECT ISNULL(MAX(TransaccionId), 0) + 1 AS NextId
        FROM dbo.Transaccion
      `);
      const nextId = idRes.recordset[0].NextId;

      req.input("NextId", sql.BigInt, nextId);

      await req.query(`
        INSERT INTO dbo.Transaccion
          (TransaccionId, PersonaId, TransaccionNumero, Tipo, Monto, Descripcion)
        VALUES
          (@NextId, @PersonaId, @NextNumero, 'CRON_DEMO', @Monto, 'Insertado por cron')
      `);

      await tx.commit();

      return Response.json({ ok: true, nextNumero, nextId });
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  } catch (error: any) {
    console.error("[cron-insert] error:", error);
    return Response.json({ ok: false, error: String(error?.message || error) }, { status: 500 });
  }
}