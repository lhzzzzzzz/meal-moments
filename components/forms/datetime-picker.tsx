'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useLocale, useT } from '@/components/i18n/locale-provider'
import {
  buildDatetimeLocal,
  clampDatetimeLocal,
  getMaxTimeForDatePart,
  getTodayDatePart,
  nowInTimezone,
  parseDatePart,
  parseDatetimeLocal,
  toDatePart,
} from '@/lib/shared/formatters/format-datetime-local'
import { cn } from '@/lib/utils'

interface DatetimePickerProps {
  value: string
  onChange: (value: string) => void
  timeZone: string
  disabled?: boolean
  id?: string
  className?: string
}

export function DatetimePicker({
  value,
  onChange,
  timeZone,
  disabled,
  id,
  className,
}: DatetimePickerProps) {
  const { locale } = useLocale()
  const t = useT()
  const [open, setOpen] = useState(false)

  const dateFnsLocale = locale === 'zh' ? zhCN : enUS
  const displayFormat = locale === 'zh' ? 'yyyy年M月d日 HH:mm' : 'MMM d, yyyy HH:mm'

  function formatDisplayValue(val: string): string {
    if (!val) return t('dates.selectDatetime')

    const { datePart, hour, minute } = parseDatetimeLocal(val)
    const date = parseDatePart(datePart)
    date.setHours(hour, minute, 0, 0)

    return format(date, displayFormat, { locale: dateFnsLocale })
  }

  const { datePart, hour, minute } = parseDatetimeLocal(
    value || nowInTimezone(timeZone)
  )

  const selectedDate = useMemo(() => parseDatePart(datePart), [datePart])

  const maxCalendarDate = useMemo(() => {
    const todayPart = getTodayDatePart(timeZone)
    return parseDatePart(todayPart)
  }, [timeZone])

  const maxTime = getMaxTimeForDatePart(datePart, timeZone)

  function emit(nextDatePart: string, nextHour: number, nextMinute: number) {
    const nextValue = clampDatetimeLocal(
      buildDatetimeLocal(nextDatePart, nextHour, nextMinute),
      timeZone
    )
    onChange(nextValue)
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return
    emit(toDatePart(date), hour, minute)
  }

  function handleHourChange(raw: string) {
    const nextHour = raw === '' ? 0 : Number(raw)
    if (Number.isNaN(nextHour)) return

    let nextMinute = minute
    if (maxTime && nextHour > maxTime.hour) {
      emit(datePart, maxTime.hour, maxTime.minute)
      return
    }
    if (maxTime && nextHour === maxTime.hour && nextMinute > maxTime.minute) {
      nextMinute = maxTime.minute
    }

    emit(datePart, nextHour, nextMinute)
  }

  function handleMinuteChange(raw: string) {
    const nextMinute = raw === '' ? 0 : Number(raw)
    if (Number.isNaN(nextMinute)) return

    let nextHour = hour
    if (maxTime) {
      if (
        nextHour > maxTime.hour ||
        (nextHour === maxTime.hour && nextMinute > maxTime.minute)
      ) {
        emit(datePart, maxTime.hour, maxTime.minute)
        return
      }
    }

    emit(datePart, nextHour, nextMinute)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'mt-1.5 h-8 w-full justify-start gap-2 px-2.5 font-normal',
          !value && 'text-muted-foreground',
          className
        )}
      >
        <CalendarIcon className="size-4 text-muted-foreground" />
        {formatDisplayValue(value)}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={{ after: maxCalendarDate }}
          defaultMonth={selectedDate}
          locale={dateFnsLocale}
        />
        <div className="border-t border-border px-3 py-3">
          <Label className="text-xs text-muted-foreground">{t('dates.time')}</Label>
          <div className="mt-1.5 flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={maxTime?.hour ?? 23}
              value={hour}
              onChange={(e) => handleHourChange(e.target.value)}
              className="w-16 text-center tabular-nums"
              aria-label={t('dates.hour')}
            />
            <span className="text-muted-foreground">:</span>
            <Input
              type="number"
              min={0}
              max={
                maxTime && hour === maxTime.hour ? maxTime.minute : 59
              }
              value={minute}
              onChange={(e) => handleMinuteChange(e.target.value)}
              className="w-16 text-center tabular-nums"
              aria-label={t('dates.minute')}
            />
          </div>
        </div>
        <div className="border-t border-border p-2">
          <Button
            type="button"
            size="sm"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            {t('dates.done')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
