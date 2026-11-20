// Transforma a data do servidor em algo como "Há 15 minutos".
export function tempoDecorrido(dataIso: string) {
  const segundos = Math.max(
    0,
    Math.floor((Date.now() - new Date(dataIso).getTime()) / 1000),
  );

  if (segundos < 60) return "Agora mesmo";

  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) {
    return `Há ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;
  }

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Há ${horas} ${horas === 1 ? "hora" : "horas"}`;

  const dias = Math.floor(horas / 24);
  return `Há ${dias} ${dias === 1 ? "dia" : "dias"}`;
}
