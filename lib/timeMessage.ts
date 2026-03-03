export function getTimeMessage() {
  const tz = "America/Tegucigalpa";
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("es-HN", {
    timeZone: tz,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const parts = formatter.formatToParts(now);

  const weekday = capitalize(
    parts.find(p => p.type === "weekday")?.value || ""
  );

  const day = parts.find(p => p.type === "day")?.value || "";
  const month = parts.find(p => p.type === "month")?.value || "";
  const year = parts.find(p => p.type === "year")?.value || "";

  const time = new Intl.DateTimeFormat("es-HN", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  return `Hola, son las ${time} y hoy es ${weekday} ${day} de ${month} del ${year}`;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}