
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, AlertTriangle, Clock, Info } from 'lucide-react';
import Badge from '@/components/ui-custom/Badge';
import { cn } from '@/lib/utils';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'pending';
}

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: 1,
      title: 'New fraud pattern detected',
      description: 'Our system detected a new fraud pattern in recent transactions.',
      time: '10 minutes ago',
      read: false,
      type: 'warning'
    },
    {
      id: 2,
      title: 'Rule update successful',
      description: 'Rule "High Amount Transaction" was updated successfully.',
      time: '1 hour ago',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'Weekly fraud report',
      description: 'Your weekly fraud report is now available.',
      time: '3 hours ago',
      read: true,
      type: 'info'
    },
    {
      id: 4,
      title: 'System maintenance',
      description: 'Scheduled maintenance in 2 days.',
      time: '1 day ago',
      read: true,
      type: 'pending'
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-safe-dark" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-fraud-dark" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Notifications</span>
            <Badge variant="danger" size="sm">
              {notifications.filter(n => !n.read).length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id}
                className={cn(
                  "flex items-start space-x-4 p-4 rounded-lg border",
                  notification.read ? "bg-background" : "bg-muted/30"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "font-medium",
                      !notification.read && "font-semibold"
                    )}>
                      {notification.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {notification.time}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
