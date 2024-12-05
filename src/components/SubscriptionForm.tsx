import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { AmountInput } from '@/components/ui/amount-input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { Subscription, SubscriptionType, Currency } from '@/types/subscription';

interface SubscriptionFormProps {
  editingSubscription?: Subscription;
  onSubmit: (subscription: Omit<Subscription, 'id'>) => void;
  onCancel?: () => void;
}

export function SubscriptionForm({ onSubmit, editingSubscription, onCancel }: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    name: editingSubscription?.name || '',
    amount: editingSubscription?.amount.toString() || '',
    currency: editingSubscription?.currency || 'USD' as Currency,
    type: editingSubscription?.type || 'monthly' as SubscriptionType,
    websiteUrl: editingSubscription?.websiteUrl || '',
    startDate: editingSubscription?.startDate 
      ? new Date(editingSubscription.startDate)
      : new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    
    if (!formData.name.trim()) {
      hasError = true;
      return;
    }

    if (!formData.amount) {
      hasError = true;
      return;
    }

    if (!hasError) {
      try {
        onSubmit({
          ...formData,
          startDate: formData.startDate.toISOString(),
          amount: Number(formData.amount),
        });

        // Only reset form if submission was successful
        setFormData({
          name: '',
          amount: '',
          currency: 'USD',
          type: 'monthly',
          websiteUrl: '',
          startDate: new Date(),
        });
      } catch (error) {
      }
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Netflix, Spotify, etc."
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <AmountInput
              amount={formData.amount}
              currency={formData.currency}
              onAmountChange={(value) => setFormData({ ...formData, amount: value })}
              onCurrencyChange={(currency) => setFormData({ ...formData, currency })}
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? (
                    format(formData.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Subscription Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: SubscriptionType) =>
                setFormData({ ...formData, type: value })
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">Yearly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onetime" id="onetime" />
                <Label htmlFor="onetime">One-time</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="websiteUrl">Dashboard URL (Optional)</Label>
            <Input
              id="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) =>
                setFormData({ ...formData, websiteUrl: e.target.value })
              }
              placeholder="https://example.com/dashboard"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingSubscription ? 'Update Subscription' : 'Add Subscription'}
        </Button>
        {editingSubscription && (
          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </form>
    </Card>
  );
}