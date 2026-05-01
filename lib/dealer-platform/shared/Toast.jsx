'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({ flash: () => {} });

/**
 * ToastProvider — wraps the app and exposes flash() globally via useToast().
 *
 * Signature:
 *   flash(msg)                                — default 2.4s neutral toast
 *   flash(msg, 'error')                       — back-compat string tone
 *   flash(msg, { tone, duration, undo })      — full control
 *     tones:   'default' | 'error' | 'destructive'
 *     destructive defaults duration to 5s and accepts an undo() callback
 *     that renders an "Undo" button on the toast.
 */
export function ToastProvider({ children, primaryColor = '#D4AF37' }) {
  const [toast, setToast] = useState(null);

  const flash = useCallback((msg, opts = {}) => {
    const cfg = typeof opts === 'string' ? { tone: opts } : opts;
    const { tone = 'default', duration, undo } = cfg;
    const ms = duration ?? (tone === 'destructive' ? 5000 : 2400);
    const id = Date.now() + Math.random();
    setToast({ msg, tone, undo, id });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), ms);
  }, []);

  return (
    <ToastContext.Provider value={{ flash }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 anim-slide no-print">
          <div
            className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-3 text-sm text-white ${
              toast.tone === 'error'       ? 'bg-red-700'
              : toast.tone === 'destructive' ? 'bg-stone-800'
              : 'bg-stone-900'
            }`}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor:
                  toast.tone === 'error'        ? '#FBBF24' :
                  toast.tone === 'destructive' ? '#F87171' :
                  primaryColor,
              }}
            />
            <span>{toast.msg}</span>
            {toast.undo && (
              <button
                onClick={() => { toast.undo(); setToast(null); }}
                className="ml-2 px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-amber-200 font-bold text-xs uppercase tracking-wider transition"
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export default ToastProvider;
