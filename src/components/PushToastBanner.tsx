import {BellRing, X} from 'lucide-react';
import type {PushNotificationItem} from '../types/clinic';

interface PushToastBannerProps {
  notification: PushNotificationItem | null;
  onDismiss: () => void;
}

export function PushToastBanner({notification, onDismiss}: PushToastBannerProps) {
  if (!notification) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-print-hide="true"
      className="fixed bottom-20 left-4 sm:bottom-4 sm:left-4 z-50 w-[min(360px,calc(100vw-2rem))] bg-[#141414] text-white rounded-2xl border-2 border-[#DBBD43] shadow-lg p-4 transition-transform duration-200 print:hidden"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#DBBD43]/20 flex items-center justify-center shrink-0 mt-0.5">
          <BellRing className="w-4 h-4 text-[#DBBD43]" aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs font-bold text-[#DBBD43]">
              Confirmação Push · {notification.timestamp}
            </p>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Fechar notificação"
              className="text-[#CFCAC0] hover:text-[#DBBD43] p-1 -mr-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm font-bold text-white leading-snug mb-1">
            {notification.title}
          </p>
          <p className="text-xs text-[#DDD8C8] leading-relaxed">{notification.body}</p>
        </div>
      </div>
    </div>
  );
}
