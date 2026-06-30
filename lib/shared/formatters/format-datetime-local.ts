/** 将 Date / ISO 字符串格式化为 datetime-local 输入值（指定 IANA 时区） */
export function toDatetimeLocalValue(
  dateInput: Date | string,
  timeZone: string
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (Number.isNaN(date.getTime())) return ''

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''

  let hour = pick('hour')
  if (hour === '24') hour = '00'

  return `${pick('year')}-${pick('month')}-${pick('day')}T${hour}:${pick('minute')}`
}

/** 将 datetime-local 值（按指定时区理解）转为 UTC ISO 字符串存入数据库 */
export function fromDatetimeLocalValue(value: string, timeZone: string): string {
  if (!value) return value

  const [datePart, timePart] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)

  let timestamp = Date.UTC(year, month - 1, day, hour, minute)

  for (let i = 0; i < 5; i++) {
    const formatted = toDatetimeLocalValue(new Date(timestamp), timeZone)
    if (formatted === value) {
      return new Date(timestamp).toISOString()
    }

    const [fDate, fTime] = formatted.split('T')
    const [fy, fm, fd] = fDate.split('-').map(Number)
    const [fh, fn] = fTime.split(':').map(Number)

    const target = Date.UTC(year, month - 1, day, hour, minute)
    const actual = Date.UTC(fy, fm - 1, fd, fh, fn)
    timestamp += target - actual
  }

  return new Date(timestamp).toISOString()
}

export function nowInTimezone(timeZone: string): string {
  return toDatetimeLocalValue(new Date(), timeZone)
}

/** datetime-local 值是否晚于当前时刻（按指定时区理解） */
export function isFutureDatetimeLocal(value: string, timeZone: string): boolean {
  if (!value) return false
  return new Date(fromDatetimeLocalValue(value, timeZone)).getTime() > Date.now()
}

export function parseDatetimeLocal(value: string) {
  const [datePart = '', timePart = '00:00'] = value.split('T')
  const [hour = 0, minute = 0] = timePart.split(':').map(Number)
  return { datePart, hour, minute }
}

export function buildDatetimeLocal(
  datePart: string,
  hour: number,
  minute: number
): string {
  const safeHour = String(Math.min(23, Math.max(0, hour))).padStart(2, '0')
  const safeMinute = String(Math.min(59, Math.max(0, minute))).padStart(2, '0')
  return `${datePart}T${safeHour}:${safeMinute}`
}

export function parseDatePart(datePart: string): Date {
  const [year, month, day] = datePart.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toDatePart(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** 将 datetime-local 限制在时区下的当前时刻之前 */
export function clampDatetimeLocal(value: string, timeZone: string): string {
  if (!value) return value
  if (isFutureDatetimeLocal(value, timeZone)) {
    return nowInTimezone(timeZone)
  }
  return value
}

export function getTodayDatePart(timeZone: string): string {
  return nowInTimezone(timeZone).split('T')[0]
}

export function getMaxTimeForDatePart(
  datePart: string,
  timeZone: string
): { hour: number; minute: number } | null {
  const todayPart = getTodayDatePart(timeZone)
  if (datePart !== todayPart) return null
  const { hour, minute } = parseDatetimeLocal(nowInTimezone(timeZone))
  return { hour, minute }
}
