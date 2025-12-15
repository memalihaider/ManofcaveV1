'use client';

import { useCurrencyStore } from "@/stores/currency.store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins } from "lucide-react";

export function CurrencySwitcher() {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrencyStore();

  return (
    <div className="flex items-center gap-2">
      <Coins className="h-4 w-4 text-gray-500" />
      <Select value={selectedCurrency} onValueChange={(value: string) => setSelectedCurrency(value)}>
        <SelectTrigger className="w-24 h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{currency.symbol}</span>
                <span className="text-xs">{currency.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}