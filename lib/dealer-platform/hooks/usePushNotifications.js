'use client';

// Run once to generate VAPID keys:
//   npx web-push generate-vapid-keys
// Add to .env.local:
//   NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
//   VAPID_PRIVATE_KEY=...

import { useState, useEffect, useRef } from 'react';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export function usePushNotifications(dealerId) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const registrationRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    if (!supported) return;

    setPermission(Notification.permission);

    navigator.serviceWorker.ready.then(reg => {
      registrationRef.current = reg;
      return reg.pushManager.getSubscription();
    }).then(sub => {
      setIsSubscribed(!!sub);
    }).catch(() => {});
  }, []);

  async function requestPermission() {
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }

  async function subscribe() {
    setLoading(true);
    try {
      let perm = permission;
      if (perm !== 'granted') {
        perm = await requestPermission();
      }
      if (perm !== 'granted') return;

      const reg = registrationRef.current ?? await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.warn('[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY not set');
        return;
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await fetch(`/api/dealer/${dealerId}/push-subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });

      setIsSubscribed(true);
    } catch (err) {
      console.warn('[push] subscribe failed:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      const reg = registrationRef.current ?? await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch(`/api/dealer/${dealerId}/push-subscribe`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      console.warn('[push] unsubscribe failed:', err.message);
    } finally {
      setLoading(false);
    }
  }

  return { isSupported, permission, isSubscribed, subscribe, unsubscribe, loading };
}
