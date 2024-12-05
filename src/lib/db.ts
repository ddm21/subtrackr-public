import { supabase } from './supabase';
import type { Subscription } from '@/types/subscription';

export async function deleteSubscription(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
}

export async function updateSubscription(subscription: Subscription): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { startDate, websiteUrl, ...rest } = subscription;
  const { error } = await supabase
    .from('subscriptions')
    .update({
      ...rest,
      start_date: startDate,
      website_url: websiteUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscription.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function loadSubscriptions(): Promise<Subscription[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error loading subscriptions:', error);
    throw error;
  }

  return data?.map(sub => ({
    ...sub,
    startDate: sub.start_date,
    websiteUrl: sub.website_url,
  })) || [];
}

export async function createSubscription(subscription: Omit<Subscription, 'id'>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { startDate, websiteUrl, ...rest } = subscription;
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      ...rest,
      user_id: user.id,
      start_date: startDate,
      website_url: websiteUrl,
    });

  if (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
  return;
}