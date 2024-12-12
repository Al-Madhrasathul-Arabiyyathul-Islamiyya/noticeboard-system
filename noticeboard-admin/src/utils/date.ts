// Common format options
const DATE_FORMATS = {
  SHORT_DATE: { month: 'short', day: 'numeric' },
  FULL_DATE: { year: 'numeric', month: 'long', day: 'numeric' },
  TIME: { hour: '2-digit', minute: '2-digit' },
  TIME_WITH_SECONDS: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  DATETIME: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  FULL_DATETIME: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
} as const

/**
 * Format a date using predefined formats
 */
export const formatDate = (
  date: Date | string,
  format: keyof typeof DATE_FORMATS = 'DATETIME',
): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', DATE_FORMATS[format]).format(d)
}

/**
 * Format a date as YYYY-MM-DD string
 */
export const formatAsDate = (date: Date | string): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (date: Date | string): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const d = new Date(date)
  const now = new Date()
  const diff = d.getTime() - now.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (Math.abs(days) > 0) return rtf.format(days, 'day')
  if (Math.abs(hours) > 0) return rtf.format(hours, 'hour')
  if (Math.abs(minutes) > 0) return rtf.format(minutes, 'minute')
  return rtf.format(seconds, 'second')
}

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

/**
 * Format duration in milliseconds to readable string
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)

  return parts.join(' ') || '0s'
}

/**
 * Format time from Date object (e.g., "15:30" or "3:30 PM")
 */
export const formatTime = (date: Date | string, hour12 = true): string => {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  })
}

/**
 * Check if a date is within a given range
 */
export const isWithinRange = (
  date: Date | string,
  start: Date | string,
  end: Date | string,
): boolean => {
  const d = new Date(date).getTime()
  return d >= new Date(start).getTime() && d <= new Date(end).getTime()
}

/**
 * Add time to a date
 */
export const addTime = (
  date: Date | string,
  duration: { days?: number; hours?: number; minutes?: number; seconds?: number },
): Date => {
  const d = new Date(date)
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration

  d.setDate(d.getDate() + days)
  d.setHours(d.getHours() + hours)
  d.setMinutes(d.getMinutes() + minutes)
  d.setSeconds(d.getSeconds() + seconds)

  return d
}

/**
 * Parse any reasonable date string format
 * Returns null if invalid
 */
export const parseDate = (dateString: string): Date | null => {
  const d = new Date(dateString)
  return isNaN(d.getTime()) ? null : d
}
