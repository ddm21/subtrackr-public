import { toast } from 'sonner';

export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters except plus sign
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If number doesn't start with +, assume it's an Indian number
  if (!cleaned.startsWith('+')) {
    cleaned = '+91' + cleaned;
  }
  
  // Remove any remaining plus signs except the first one
  cleaned = '+' + cleaned.substring(1).replace(/\+/g, '');
  
  return cleaned;
}

export async function handleWhatsAppRedirect(
  phone: string,
  subscription: { name: string; amount: number },
  splitAmount: number,
  message?: string
): Promise<boolean> {
  console.log('Starting WhatsApp redirect for:', { phone, subscription });
  
  try {
    const whatsappUrl = generateWhatsAppLink(phone, subscription, splitAmount, message);
    console.log('Generated URL:', whatsappUrl);
    
    // Try to open in new tab first
    try {
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.warn('Failed to open in new tab, trying direct navigation');
      window.location.href = whatsappUrl;
    }
    
    return true;
  } catch (error) {
    console.error('WhatsApp redirect error:', error);
    toast.error('Failed to open WhatsApp');
    return false;
  }
}

export function generateWhatsAppLink(
  phone: string,
  subscription: { name: string; amount: number },
  splitAmount: number,
  message?: string
): string {
  const whatsappPhone = formatPhoneNumber(phone);
  console.log('Phone Input:', phone);
  console.log('Formatted Phone:', whatsappPhone);
  
  const defaultMessage = 
    `Payment Reminder: ${subscription.name}\n\n` +
    `Total Amount: $${subscription.amount.toFixed(2)}\n` +
    `Your Share: $${splitAmount.toFixed(2)}\n\n` +
    `Please send your payment when possible. Thank you!`;
    
  const finalMessage = message || defaultMessage;
  
  // Use wa.me format instead of api.whatsapp.com
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\+/g, '')}?text=${encodeURIComponent(finalMessage)}`;
  console.log('Generated WhatsApp URL:', whatsappUrl);
  
  return whatsappUrl;
}