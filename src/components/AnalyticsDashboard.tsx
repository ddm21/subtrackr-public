import { BarChart, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCY_SYMBOLS } from '@/lib/currency';
import type { SubscriptionAnalytics, Currency } from '@/types/subscription';

interface AnalyticsDashboardProps {
  analytics: SubscriptionAnalytics;
  currency: Currency;
  isLoading?: boolean;
}

export function AnalyticsDashboard({ analytics, currency, isLoading }: AnalyticsDashboardProps) {
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Monthly Spend
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl font-bold">
                {currencySymbol}{analytics.monthlySpend.toFixed(2)}
              </h3>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <BarChart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Yearly Estimate
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl font-bold">
                {currencySymbol}{analytics.yearlySpend.toFixed(2)}
              </h3>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}