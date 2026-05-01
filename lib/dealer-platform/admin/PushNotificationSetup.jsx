'use client';

import { Bell, BellOff, BellRing, AlertTriangle } from 'lucide-react';
import { usePushNotifications } from '@/lib/dealer-platform/hooks/usePushNotifications';
import { useAdminConfig } from './AdminConfigContext';

export default function PushNotificationSetup({ flash }) {
  const cfg = useAdminConfig();
  const dealerId = cfg.dealerSlug || 'demo';
  const { isSupported, permission, isSubscribed, subscribe, unsubscribe, loading } =
    usePushNotifications(dealerId);

  async function handleEnable() {
    await subscribe();
    flash?.('Push notifications enabled for this device', 'success');
  }

  async function handleDisable() {
    await unsubscribe();
    flash?.('Push notifications disabled');
  }

  if (!isSupported) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {isSubscribed
          ? <BellRing className="w-4 h-4 text-emerald-500" />
          : <Bell className="w-4 h-4 text-stone-400" />}
        <span className="text-sm font-medium">
          Push notifications:{' '}
          {isSubscribed
            ? <span className="text-emerald-600 font-semibold">Enabled ✅</span>
            : <span className="text-stone-500">Not enabled</span>}
        </span>
      </div>

      {permission === 'denied' ? (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">
            Notifications are blocked. Enable them in your browser settings, then reload.
          </p>
        </div>
      ) : isSubscribed ? (
        <button
          onClick={handleDisable}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50 transition disabled:opacity-50">
          <BellOff className="w-3.5 h-3.5" />
          {loading ? 'Disabling…' : 'Disable notifications'}
        </button>
      ) : (
        <button
          onClick={handleEnable}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-white transition disabled:opacity-50"
          style={{ backgroundColor: '#2AA5A0' }}>
          <Bell className="w-3.5 h-3.5" />
          {loading ? 'Enabling…' : 'Enable Notifications'}
        </button>
      )}

      <p className="text-xs text-stone-400">
        You'll get alerts for new leads, appointments, and chat messages on this device.
      </p>
    </div>
  );
}
