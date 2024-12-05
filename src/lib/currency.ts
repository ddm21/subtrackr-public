const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export type Currency = 'USD' | 'INR';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
};

let exchangeRates: Record<Currency, number> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function fetchExchangeRates(): Promise<Record<Currency, number>> {
  const now = Date.now();
  if (exchangeRates && now - lastFetchTime < CACHE_DURATION) {
    return exchangeRates;
  }

  try {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    exchangeRates = {
      USD: 1,
      INR: data.rates.INR,
    };
    lastFetchTime = now;
    return exchangeRates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return { USD: 1, INR: 83 }; // Fallback rate
  }
}

export async function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): Promise<number> {
  if (from === to) return amount;
  
  const rates = await fetchExchangeRates();
  // Convert to USD first
  const usdAmount = from === 'USD' ? amount : amount / rates.INR;
  // Then convert to target currency
  const convertedAmount = to === 'USD' ? usdAmount : usdAmount * rates.INR;
  
  return Math.round(convertedAmount * 100) / 100;
}