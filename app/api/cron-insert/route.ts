import { getConnection } from "@/lib/db";
import sql from "mssql";

export async function POST() {
  try {
    const pool = await getConnection();

    const personaId = 1; // para demo
    const monto = 100;

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const request = new sql.Request(transaction);

    // Obtener número actual
    const result = await request
      .input("PersonaId", sql.Int, personaId)
      .query(`
        SELECT NextTransaccionNumero 
        FROM PersonaContador 
        WHERE PersonaId = @PersonaId
      `);

    const numero = result.recordset[0].NextTransaccionNumero;

    // Insertar transacción
    await request
      .input("Numero", sql.Int, numero)
      .input("Monto", sql.Decimal(18, 2), monto)
      .query(`
        INSERT INTO Transaccion
        (PersonaId, TransaccionNumero, Tipo, Monto, Descripcion)
        VALUES
        (@PersonaId, @Numero, 'CRON_DEMO', @Monto, 'Insertado por cron')
      `);

    // Actualizar contador
    await request.query(`
      UPDATE PersonaContador
      SET NextTransaccionNumero = NextTransaccionNumero + 1
      WHERE PersonaId = @PersonaId
    `);

    await transaction.commit();

    return Response.json({ ok: true, numero });

  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  }
}