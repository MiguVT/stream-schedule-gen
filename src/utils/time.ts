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
  zones: Array<{ timezone: string; label: string }>
): Array<{ timezone: string; label: string; formatted: string; flag: string }> {
  const [hours, minutes] = time.split(':').map(Number)
  const baseDate = new Date()
  baseDate.setHours(hours, minutes, 0, 0)

  return zones.map((zone) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
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

export const MAJOR_TIMEZONES: Array<{ timezone: string; label: string }> = [
  { timezone: 'UTC', label: 'UTC' },
  { timezone: 'Europe/London', label: 'London' },
  { timezone: 'Europe/Madrid', label: 'Madrid' },
  { timezone: 'Europe/Paris', label: 'Paris' },
  { timezone: 'Europe/Berlin', label: 'Berlin' },
  { timezone: 'Europe/Rome', label: 'Rome' },
  { timezone: 'Europe/Amsterdam', label: 'Amsterdam' },
  { timezone: 'Europe/Warsaw', label: 'Warsaw' },
  { timezone: 'Europe/Istanbul', label: 'Istanbul' },
  { timezone: 'Europe/Moscow', label: 'Moscow' },
  { timezone: 'America/New_York', label: 'New York (EST)' },
  { timezone: 'America/Chicago', label: 'Chicago (CST)' },
  { timezone: 'America/Denver', label: 'Denver (MST)' },
  { timezone: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { timezone: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires' },
  { timezone: 'America/Sao_Paulo', label: 'São Paulo' },
  { timezone: 'America/Mexico_City', label: 'Mexico City' },
  { timezone: 'America/Bogota', label: 'Bogotá' },
  { timezone: 'America/Lima', label: 'Lima' },
  { timezone: 'America/Santiago', label: 'Santiago' },
  { timezone: 'Asia/Tokyo', label: 'Tokyo' },
  { timezone: 'Asia/Seoul', label: 'Seoul' },
  { timezone: 'Asia/Shanghai', label: 'Shanghai' },
  { timezone: 'Asia/Hong_Kong', label: 'Hong Kong' },
  { timezone: 'Asia/Singapore', label: 'Singapore' },
  { timezone: 'Asia/Bangkok', label: 'Bangkok' },
  { timezone: 'Asia/Kolkata', label: 'Kolkata' },
  { timezone: 'Asia/Dubai', label: 'Dubai' },
  { timezone: 'Australia/Sydney', label: 'Sydney' },
  { timezone: 'Pacific/Auckland', label: 'Auckland' },
  { timezone: 'Africa/Cairo', label: 'Cairo' },
  { timezone: 'Africa/Johannesburg', label: 'Johannesburg' },
]
