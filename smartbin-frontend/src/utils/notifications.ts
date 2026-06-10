import { toast } from 'sonner';

type AlertLevel = 'warning' | 'critical';

/** Request browser notification permission on app load. */
export const requestNotificationPermission = async (): Promise<void> => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
};

/** Show a Sonner toast + optionally a browser push notification. */
export const notify = {
  success: (message: string) => toast.success(message),

  error: (message: string) => toast.error(message),

  info: (message: string) => toast.info(message),

  binAlert: (binName: string, fillPercentage: number, level: AlertLevel) => {
    const isWarning = level === 'warning';
    const title = isWarning ? '⚠️ Bin Almost Full' : '🚨 Bin Full';
    const body = `${binName} is at ${fillPercentage}% capacity`;

    // Sonner toast
    if (isWarning) {
      toast.warning(body, { description: 'Consider scheduling a collection soon.' });
    } else {
      toast.error(body, { description: 'Immediate collection required!' });
    }

    // Browser Notifications API (shows even when tab is in background)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/bin.svg',
        tag: `bin-alert-${level}`, // prevents duplicate notifications
      });
    }
  },
};
