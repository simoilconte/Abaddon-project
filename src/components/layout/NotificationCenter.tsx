'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  autoClose?: boolean;
  duration?: number;
}

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const notificationStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulated notifications for demo
  useEffect(() => {
    const demoNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Nuovo ticket assegnato',
        message: 'Ti è stato assegnato il ticket #1234 - Problema sistema',
        timestamp: Date.now(),
        autoClose: true,
        duration: 5000,
      },
      {
        id: '2',
        type: 'warning',
        title: 'SLA in scadenza',
        message: 'Il ticket #1230 scadrà tra 2 ore',
        timestamp: Date.now() - 60000,
        autoClose: false,
      },
    ];

    setNotifications(demoNotifications);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoClose && notification.duration) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const Icon = notificationIcons[notification.type];
        
        return (
          <div
            key={notification.id}
            className={cn(
              'p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full',
              notificationStyles[notification.type]
            )}
          >
            <div className="flex items-start space-x-3">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">
                  {notification.title}
                </h4>
                <p className="text-sm mt-1 opacity-90">
                  {notification.message}
                </p>
                <p className="text-xs mt-2 opacity-75">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="h-6 w-6 p-0 hover:bg-black/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}