// // lib/store.ts
// export type Tx = {
//   id: number
//   personaId: number
//   fecha: string // YYYY-MM-DD
//   descripcion: string
//   monto: number
// }

// let nextId = 1
// const transacciones: Tx[] = []

// export function listTx() {
//   return transacciones
// }

// export function existsAcreditacion(personaId: number, fecha: string) {
//   // anti-duplicado simple: misma persona + misma fecha + misma descripcion
//   return transacciones.some(
//     (t) =>
//       t.personaId === personaId &&
//       t.fecha === fecha &&
//       t.descripcion === "Deduccion de planilla",
//   )
// }

// export function addAcreditacion(personaId: number, fecha: string, monto: number) {
//   const tx: Tx = {
//     id: nextId++,
//     personaId,
//     fecha,
//     descripcion: "Deduccion de planilla",
//     monto,
//   }
//   transacciones.push(tx)
//   return tx
// }