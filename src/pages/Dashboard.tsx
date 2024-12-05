import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionForm } from '@/components/SubscriptionForm';
import { SubscriptionList } from '@/components/SubscriptionList';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { CurrencySelect } from '@/components/CurrencySelect';
import { SubscriptionFilters } from '@/components/SubscriptionFilters';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { EditSubscriptionDialog } from '@/components/EditSubscriptionDialog';
import { SplitDialog } from '@/components/SplitDialog';
import type { Subscription } from '@/types/subscription';

export default function Dashboard() {
  const { signOut } = useAuth();
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [splittingSubscription, setSplittingSubscription] = useState<Subscription | null>(null);
  const {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    analytics,
    displayCurrency,
    setDisplayCurrency,
    filters,
    setFilters,
    isLoading,
  } = useSubscriptions();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowAddModal(true)} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
        <div className="flex items-center space-x-4">
          <CurrencySelect
            value={displayCurrency}
            onChange={setDisplayCurrency}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-10 w-10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6 lg:space-y-8">
        <AnalyticsDashboard
          analytics={analytics}
          currency={displayCurrency}
          isLoading={isLoading}
        />
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Subscriptions</h2>
          <SubscriptionFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
        <SubscriptionList
          subscriptions={subscriptions}
          onDelete={deleteSubscription}
          onEdit={(sub) => setEditingSubscription(sub)}
          onSplit={(sub) => setSplittingSubscription(sub)}
          displayCurrency={displayCurrency}
        />
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Subscription</DialogTitle>
          </DialogHeader>
          <SubscriptionForm
            onSubmit={(data) => {
              addSubscription(data);
              setShowAddModal(false);
            }}
            onCancel={() => setShowAddModal(false)}
          />
        </DialogContent>
      </Dialog>

      <EditSubscriptionDialog
        subscription={editingSubscription}
        onClose={() => setEditingSubscription(null)}
        onSubmit={async (data) => {
          if (editingSubscription) {
            await updateSubscription({
              ...data,
              id: editingSubscription.id,
            });
          } else {
            await addSubscription(data);
          }
          setEditingSubscription(null);
        }}
      />
      
      <SplitDialog
        subscription={splittingSubscription}
        onClose={() => setSplittingSubscription(null)}
      />
    </div>
  );
}