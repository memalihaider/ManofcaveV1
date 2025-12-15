import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to AED (base currency)
}

interface CurrencyState {
  currencies: Currency[];
  selectedCurrency: string;
  setSelectedCurrency: (currencyCode: string) => void;
  getCurrencyByCode: (code: string) => Currency | undefined;
  getSelectedCurrency: () => Currency | undefined;
  convertPrice: (price: number, fromCurrency?: string) => number;
  formatCurrency: (amount: number) => string;
  getCurrencySymbol: () => string;
}

// Currency data with exchange rates (as of December 2025, approximate rates)
const currencies: Currency[] = [
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    rate: 1.0, // Base currency
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 0.27, // 1 AED = 0.27 USD
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.25, // 1 AED = 0.25 EUR
  },
  {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: '₨',
    rate: 75.5, // 1 AED = 75.5 PKR
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    rate: 22.8, // 1 AED = 22.8 INR
  },
];

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currencies,
      selectedCurrency: 'AED',

      setSelectedCurrency: (currencyCode: string) => {
        set({ selectedCurrency: currencyCode });
      },

      getCurrencyByCode: (code: string) => {
        return get().currencies.find(currency => currency.code === code);
      },

      getSelectedCurrency: () => {
        const { selectedCurrency, currencies } = get();
        return currencies.find(currency => currency.code === selectedCurrency);
      },

      convertPrice: (price: number, fromCurrency: string = 'AED') => {
        const { selectedCurrency, currencies } = get();

        // If converting to the same currency, return original price
        if (fromCurrency === selectedCurrency) {
          return price;
        }

        // Convert to AED first (base currency)
        const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
        const toCurrencyData = currencies.find(c => c.code === selectedCurrency);

        if (!fromCurrencyData || !toCurrencyData) {
          return price; // Fallback to original price
        }

        // Convert: price in fromCurrency -> AED -> selectedCurrency
        const priceInAED = price / fromCurrencyData.rate;
        const priceInSelectedCurrency = priceInAED * toCurrencyData.rate;

        return Math.round(priceInSelectedCurrency * 100) / 100; // Round to 2 decimal places
      },

      formatCurrency: (amount: number) => {
        const selectedCurrency = get().getSelectedCurrency();
        if (!selectedCurrency) return `${amount}`;

        return `${selectedCurrency.symbol}${amount.toFixed(2)}`;
      },

      getCurrencySymbol: () => {
        const selectedCurrency = get().getSelectedCurrency();
        return selectedCurrency?.symbol || 'د.إ';
      },
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({ selectedCurrency: state.selectedCurrency }),
    }
  )
);