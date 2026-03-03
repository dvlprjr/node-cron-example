export async function GET() {
  const tz = "America/Tegucigalpa";
  const now = new Date();

  // Hora 24h
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

  // Capitalizar día
  const weekdayCapitalized =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  const fullDate = `${weekdayCapitalized} ${day} de ${month} del ${year}`;

  return Response.json({
    ok: true,
    msg: `Hola, son las ${time} y hoy es ${fullDate}`,
  });
}