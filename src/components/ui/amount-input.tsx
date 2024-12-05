import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCY_SYMBOLS, type Currency } from '@/lib/currency';

interface AmountInputProps {
  amount: string;
  currency: Currency;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (currency: Currency) => void;
}

export function AmountInput({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
}: AmountInputProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {CURRENCY_SYMBOLS[currency]}
          </div>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="pl-7"
            placeholder="0.00"
          />
        </div>
      </div>
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="INR">INR</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}