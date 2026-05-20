export const formatCurrency = (amount: number, currency: string = "VND", locale: string = "vi-VN"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};