import { waLink } from './config.js'

// Форма без бэкенда: собираем текст и открываем WhatsApp с готовым сообщением.
// fields — [[подпись, значение], …]; пустые значения пропускаем.
export function composeMessage(fields) {
  return fields
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => (k ? `${k}: ${String(v).trim()}` : String(v).trim()))
    .join('\n')
}

export function sendWhatsApp(text) {
  window.open(waLink(text), '_blank', 'noopener')
}
