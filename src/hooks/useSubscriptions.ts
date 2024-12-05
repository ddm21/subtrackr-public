import { useState, useEffect, useCallback } from 'react';
import { loadSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '@/lib/db';
import { convertCurrency } from '@/lib/currency';
import { toast } from 'sonner';
import type {
  Subscription,
  SubscriptionAnalytics,
  Currency,
  SubscriptionFilters,
} from '@/types/subscription';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>('USD');
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics>({
    monthlySpend: 0,
    yearlySpend: 0,
    subscriptionsByType: {
      monthly: 0,
      yearly: 0,
      onetime: 0,
      topup: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SubscriptionFilters>({
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await loadSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    const updateAnalytics = async () => {
      setIsLoading(true);
      let monthlySpend = 0;
      let yearlySpend = 0;
      const subscriptionsByType = {
        monthly: 0,
        yearly: 0,
        onetime: 0
      };

      for (const sub of subscriptions) {
        const amount = await convertCurrency(
          sub.amount,
          sub.currency,
          displayCurrency
        );

        switch (sub.type) {
          case 'monthly':
            monthlySpend += amount;
            yearlySpend += amount * 12;
            break;
          case 'yearly':
            monthlySpend += amount / 12;
            yearlySpend += amount;
            break;
          case 'onetime':
            yearlySpend += amount;
            break;
        }

        subscriptionsByType[sub.type]++;
      }

      setAnalytics({
        monthlySpend: Math.round(monthlySpend * 100) / 100,
        yearlySpend: Math.round(yearlySpend * 100) / 100,
        subscriptionsByType,
      });
      setIsLoading(false);
    };

    updateAnalytics();
  }, [subscriptions, displayCurrency]);

  const addSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<void> => {
    setIsLoading(true);
    try {
      await createSubscription({
        ...subscription,
        startDate: new Date().toISOString(),
      });
      await fetchSubscriptions();
      toast.success('Subscription added successfully');
    } catch (error) {
      console.error('Error adding subscription:', error);
      toast.error('Failed to add subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscriptionHandler = async (subscription: Subscription): Promise<void> => {
    try {
      setIsLoading(true);
      await updateSubscription(subscription);
      await fetchSubscriptions();
      toast.success('Subscription updated successfully');
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubscriptionHandler = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      await deleteSubscription(id);
      await fetchSubscriptions();
      toast.success('Subscription deleted successfully');
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast.error('Failed to delete subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedSubscriptions = () => {
    return [...subscriptions].sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          break;
        case 'amount':
          comparison = b.amount - a.amount;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });
  };

  return {
    subscriptions: getSortedSubscriptions(),
    addSubscription,
    deleteSubscription: deleteSubscriptionHandler,
    updateSubscription: updateSubscriptionHandler,
    displayCurrency,
    setDisplayCurrency,
    filters,
    setFilters,
    analytics,
    isLoading,
  };
}