export function formatMoney(
  amount: number | null | undefined,
  currency = 'AUD'
): string {
  if (amount === null || amount === undefined) return ''
  const locale = currency === 'CNY' ? 'zh-CN' : 'en-AU'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatMoneyShort(
  amount: number | null | undefined,
  currency = 'AUD'
): string {
  return formatMoney(amount, currency)
}
