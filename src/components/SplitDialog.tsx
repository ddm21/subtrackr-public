import { useState, useRef, useEffect } from 'react';
import { useSplitDialog } from '@/hooks/useSplitDialog';
import { calculateSplitAmounts, validateSplitAmounts, resetSplitCalculation } from '@/lib/split';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { handleWhatsAppRedirect, formatPhoneNumber } from '@/lib/whatsapp';
import { Users, Send, Copy, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Subscription, SplitParticipant } from '@/types/subscription';

interface SplitDialogProps {
  subscription: Subscription | null;
  onClose: () => void;
}

export function SplitDialog({ subscription, onClose }: SplitDialogProps) {
  const {
    participants,
    addParticipant,
    removeParticipant,
    updateParticipant,
    resetParticipants,
  } = useSplitDialog(subscription);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const amountRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [splitAmounts, setSplitAmounts] = useState<number[]>([]);

  // Reset calculation when subscription changes
  useEffect(() => {
    if (subscription) {
      const result = calculateSplitAmounts(subscription.amount, participants.length);
      setSplitAmounts(result.isValid ? result.amounts : []);
      if (!result.isValid && result.error) {
        toast.error(result.error);
      }
    } else {
      const { amounts } = resetSplitCalculation();
      setSplitAmounts(amounts);
    }
  }, [subscription]);

  useEffect(() => {
    // Initialize refs array when participants change
    amountRefs.current = amountRefs.current.slice(0, participants.length);
    
    // Recalculate split amounts when participants change
    if (subscription) {
      const result = calculateSplitAmounts(subscription.amount, participants.length);
      setSplitAmounts(result.isValid ? result.amounts : []);
      if (!result.isValid && result.error) {
        toast.error(result.error);
      }
    }
  }, [participants.length, subscription]);

  const validateParticipants = () => {
    const errors = [];
    
    if (!subscription) {
      errors.push('No subscription selected');
      return errors;
    }

    if (participants.length === 0) {
      errors.push('Add at least one friend to split with');
    }
    
    // Validate total split amount matches subscription amount
    if (!validateSplitAmounts(subscription.amount, splitAmounts)) {
      errors.push('Split amounts do not match the total subscription amount');
    }

    participants.forEach((participant, index) => {
      if (!participant.phoneNumber) {
        errors.push(`Enter phone number for Friend ${index + 1}`);
      }
      if (!splitAmounts[index] || splitAmounts[index] <= 0) {
        errors.push(`Enter valid amount for Friend ${index + 1}`);
      }
    });
    
    return errors;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Split details copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSendInvites = async () => {
    if (!subscription) return;
    
    const errors = validateParticipants();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }
    
    setIsLoading(true);
    try {
      const clipboardText = `🔄 Split Details for ${subscription.name}\n\n` +
        participants.map((p, i) => 
          `👤 Friend ${i + 1}\n` +
          `📱 Phone: ${p.phoneNumber}\n` +
          `💰 Amount: $${splitAmounts[i]?.toFixed(2) || '0.00'}\n`
        ).join('\n\n');

      await copyToClipboard(clipboardText);
      
      // Store all WhatsApp URLs first
      const whatsappUrls = participants.map((participant, index) => ({
        phone: participant.phoneNumber,
        amount: splitAmounts[index],
      }));
      
      // Show instructions toast
      toast.info(
        'Multiple chat windows will open. Please keep your browser unblocked and send messages to each friend.',
        { duration: 5000 }
      );
      
      // Wait for user to acknowledge
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Open chats sequentially with longer delays
      for (const { phone, amount } of whatsappUrls) {
        const success = await handleWhatsAppRedirect(
          phone,
          subscription,
          amount,
          messageRef.current?.value
        );
        
        if (!success) {
          toast.error(`Failed to send request to ${phone}`);
          continue;
        }
        
        // Longer delay between redirects to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      toast.success('All split requests have been initiated!');
      resetParticipants();
      onClose();
    } catch (error) {
      console.error('Error sending split requests:', error);
      toast.error('Failed to send split requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscription) return null;

  return (
    <Dialog 
      open={!!subscription}
      onOpenChange={() => {
        resetParticipants();
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Split with Friends
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="space-y-2">
                <Label>Friend {index + 1}</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="tel"
                      value={participant.phoneNumber}
                      onChange={(e) => updateParticipant(index, e.target.value)}
                      placeholder="+91XXXXXXXXXX"
                      className="font-mono"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      ref={el => amountRefs.current[index] = el}
                      value={splitAmounts[index]?.toFixed(2) || '0.00'}
                      onChange={(e) => {
                        const newAmount = parseFloat(e.target.value);
                        if (!isNaN(newAmount)) {
                          const newAmounts = [...splitAmounts];
                          newAmounts[index] = newAmount;
                          setSplitAmounts(newAmounts);
                        }
                      }}
                      placeholder="Amount"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParticipant(index)}
                    disabled={participants.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {participants.length < 5 && (
            <Button
              type="button"
              variant="outline"
              onClick={addParticipant}
              className="w-full"
            >
              Add Another Friend
            </Button>
          )}

          <div className="space-y-2">
            <Label>Custom Message (Optional)</Label>
            <Textarea
              ref={messageRef}
              placeholder="Add a personal message..."
              className="h-24"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendInvites} 
            className="gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Split Requests
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}