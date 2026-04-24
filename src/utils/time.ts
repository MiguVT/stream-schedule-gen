export function getFlag(timezone: string): string {
  const timezoneToFlag: Record<string, string> = {
    'UTC': '🌐',
    'Europe/London': '🇬🇧',
    'Europe/Madrid': '🇪🇸',
    'Europe/Paris': '🇫🇷',
    'Europe/Berlin': '🇩🇪',
    'Europe/Rome': '🇮🇹',
    'Europe/Amsterdam': '🇳🇱',
    'Europe/Brussels': '🇧🇪',
    'Europe/Warsaw': '🇵🇱',
    'Europe/Prague': '🇨🇿',
    'Europe/Vienna': '🇦🇹',
    'Europe/Zurich': '🇨🇭',
    'Europe/Stockholm': '🇸🇪',
    'Europe/Oslo': '🇳🇴',
    'Europe/Copenhagen': '🇩🇰',
    'Europe/Helsinki': '🇫🇮',
    'Europe/Budapest': '🇭🇺',
    'Europe/Bucharest': '🇷🇴',
    'Europe/Athens': '🇬🇷',
    'Europe/Istanbul': '🇹🇷',
    'Europe/Moscow': '🇷🇺',
    'America/New_York': '🇺🇸',
    'America/Chicago': '🇺🇸',
    'America/Denver': '🇺🇸',
    'America/Los_Angeles': '🇺🇸',
    'America/Anchorage': '🇺🇸',
    'America/Phoenix': '🇺🇸',
    'America/Argentina/Buenos_Aires': '🇦🇷',
    'America/Sao_Paulo': '🇧🇷',
    'America/Mexico_City': '🇲🇽',
    'America/Bogota': '🇨🇴',
    'America/Lima': '🇵🇪',
    'America/Santiago': '🇨🇱',
    'America/Buenos_Aires': '🇦🇷',
    'America/Montevideo': '🇺🇾',
    'America/Cordoba': '🇦🇷',
    'America/Caracas': '🇻🇪',
    'America/Belize': '🇧🇿',
    'America/Guatemala': '🇬🇹',
    'America/Managua': '🇳🇮',
    'America/El_Salvador': '🇸🇻',
    'America/Honduras': '🇭🇳',
    'Asia/Tokyo': '🇯🇵',
    'Asia/Seoul': '🇰🇷',
    'Asia/Shanghai': '🇨🇳',
    'Asia/Hong_Kong': '🇭🇰',
    'Asia/Singapore': '🇸🇬',
    'Asia/Bangkok': '🇹🇭',
    'Asia/Jakarta': '🇮🇩',
    'Asia/Manila': '🇵🇭',
    'Asia/Kolkata': '🇮🇳',
    'Asia/Dubai': '🇦🇪',
    'Asia/Riyadh': '🇸🇦',
    'Asia/Tehran': '🇮🇷',
    'Asia/Jerusalem': '🇮🇱',
    'Asia/Karachi': '🇵🇰',
    'Australia/Sydney': '🇦🇺',
    'Australia/Melbourne': '🇦🇺',
    'Australia/Brisbane': '🇦🇺',
    'Australia/Perth': '🇦🇺',
    'Pacific/Auckland': '🇳🇿',
    'Africa/Cairo': '🇪🇬',
    'Africa/Johannesburg': '🇿🇦',
    'Africa/Lagos': '🇳🇬',
    'Africa/Nairobi': '🇰🇪',
  }

  return timezoneToFlag[timezone] || '🌍'
}

export function formatTimeForZones(
  time: string,
  zones: Array<{ timezone: string; label: string }>,
  show12HourFormat: boolean = false
): Array<{ timezone: string; label: string; formatted: string; flag: string }> {
  const [hours, minutes] = time.split(':').map(Number)
  const baseDate = new Date()
  baseDate.setHours(hours, minutes, 0, 0)

  return zones.map((zone) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: show12HourFormat,
      }
      const formatter = new Intl.DateTimeFormat('en-US', {
        ...options,
        timeZone: zone.timezone,
      })
      const formatted = formatter.format(baseDate)
      return {
        timezone: zone.timezone,
        label: zone.label,
        formatted,
        flag: getFlag(zone.timezone),
      }
    } catch (e) {
      return {
        timezone: zone.timezone,
        label: zone.label,
        formatted: time,
        flag: getFlag(zone.timezone),
      }
    }
  })
}

export const MAJOR_TIMEZONES: Array<{ timezone: string; label: string; flag: string }> = [
  { timezone: 'UTC', label: 'UTC', flag: '🌐' },
  { timezone: 'Europe/London', label: 'London', flag: '🇬🇧' },
  { timezone: 'Europe/Madrid', label: 'Madrid', flag: '🇪🇸' },
  { timezone: 'Europe/Paris', label: 'Paris', flag: '🇫🇷' },
  { timezone: 'Europe/Berlin', label: 'Berlin', flag: '🇩🇪' },
  { timezone: 'Europe/Rome', label: 'Rome', flag: '🇮🇹' },
  { timezone: 'Europe/Amsterdam', label: 'Amsterdam', flag: '🇳🇱' },
  { timezone: 'Europe/Warsaw', label: 'Warsaw', flag: '🇵🇱' },
  { timezone: 'Europe/Istanbul', label: 'Istanbul', flag: '🇹🇷' },
  { timezone: 'Europe/Moscow', label: 'Moscow', flag: '🇷🇺' },
  { timezone: 'America/New_York', label: 'New York', flag: '🇺🇸' },
  { timezone: 'America/Chicago', label: 'Chicago', flag: '🇺🇸' },
  { timezone: 'America/Denver', label: 'Denver', flag: '🇺🇸' },
  { timezone: 'America/Los_Angeles', label: 'Los Angeles', flag: '🇺🇸' },
  { timezone: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires', flag: '🇦🇷' },
  { timezone: 'America/Sao_Paulo', label: 'São Paulo', flag: '🇧🇷' },
  { timezone: 'America/Mexico_City', label: 'Mexico City', flag: '🇲🇽' },
  { timezone: 'America/Bogota', label: 'Bogotá', flag: '🇨🇴' },
  { timezone: 'America/Lima', label: 'Lima', flag: '🇵🇪' },
  { timezone: 'America/Santiago', label: 'Santiago', flag: '🇨🇱' },
  { timezone: 'Asia/Tokyo', label: 'Tokyo', flag: '🇯🇵' },
  { timezone: 'Asia/Seoul', label: 'Seoul', flag: '🇰🇷' },
  { timezone: 'Asia/Shanghai', label: 'Shanghai', flag: '🇨🇳' },
  { timezone: 'Asia/Hong_Kong', label: 'Hong Kong', flag: '🇭🇰' },
  { timezone: 'Asia/Singapore', label: 'Singapore', flag: '🇸🇬' },
  { timezone: 'Asia/Bangkok', label: 'Bangkok', flag: '🇹🇭' },
  { timezone: 'Asia/Kolkata', label: 'Kolkata', flag: '🇮🇳' },
  { timezone: 'Asia/Dubai', label: 'Dubai', flag: '🇦🇪' },
  { timezone: 'Australia/Sydney', label: 'Sydney', flag: '🇦🇺' },
  { timezone: 'Pacific/Auckland', label: 'Auckland', flag: '🇳🇿' },
  { timezone: 'Africa/Cairo', label: 'Cairo', flag: '🇪🇬' },
  { timezone: 'Africa/Johannesburg', label: 'Johannesburg', flag: '🇿🇦' },
]
