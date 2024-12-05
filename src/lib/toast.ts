import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string) => {
    sonnerToast.dismiss();
    sonnerToast.success(message, {
      className: 'group toast-success',
      dismissible: true,
    });
  },
  error: (message: string) => {
    sonnerToast.dismiss();
    sonnerToast.error(message, {
      className: 'group toast-error',
      dismissible: true,
    });
  },
  info: (message: string) => {
    sonnerToast.dismiss();
    sonnerToast.info(message, {
      className: 'group toast-info',
      dismissible: true,
    });
  },
  dismiss: () => {
    sonnerToast.dismiss();
  },
};