import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SubscriptionForm } from "@/components/SubscriptionForm"
import type { Subscription } from "@/types/subscription"

interface EditSubscriptionDialogProps {
  subscription: Subscription | null
  onClose: () => void
  onSubmit: (subscription: Omit<Subscription, "id">) => void
}

export function EditSubscriptionDialog({
  subscription,
  onClose,
  onSubmit,
}: EditSubscriptionDialogProps) {
  return (
    <Dialog open={!!subscription} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        {subscription && (
          <SubscriptionForm
            editingSubscription={subscription}
            onSubmit={(data) => {
              onSubmit(data)
              onClose()
            }}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}