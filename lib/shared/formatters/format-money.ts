export function formatMoney(
  amount: number | null | undefined,
  currency = 'CNY'
): string {
  if (amount === null || amount === undefined) return ''
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatMoneyShort(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return ''
  return `¥${amount.toFixed(2)}`
}
