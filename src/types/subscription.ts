export type SubscriptionType = 'monthly' | 'yearly' | 'onetime';
export type Currency = 'USD' | 'INR';
export type SortField = 'date' | 'amount' | 'name';
export type SortOrder = 'asc' | 'desc';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  type: SubscriptionType;
  startDate: string;
  websiteUrl?: string;
}

export interface SubscriptionAnalytics {
  monthlySpend: number;
  yearlySpend: number;
  subscriptionsByType: Record<SubscriptionType, number>;

export interface SubscriptionFilters {
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface SplitParticipant {
  phoneNumber: string;
  hasPaid: boolean;
}

export interface SplitDetails {
  subscriptionId: string;
  participants: SplitParticipant[];
  message?: string;
  lastReminderSent?: string;
}