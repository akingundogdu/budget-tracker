export function formatCurrency(amount, currency) {
  const value = amount * currency.rate;
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
} 