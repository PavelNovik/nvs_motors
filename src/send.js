// Форма без бэкенда: собираем текст заявки для ссылки wa.me (см. Booking.jsx).
// fields — [[подпись, значение], …]; пустые значения пропускаем.
export function composeMessage(fields) {
  return fields
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => (k ? `${k}: ${String(v).trim()}` : String(v).trim()))
    .join('\n')
}
