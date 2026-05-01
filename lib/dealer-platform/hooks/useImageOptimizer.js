'use client';
import { useState, useCallback } from 'react';

export function useImageOptimizer() {
  const [state, setState] = useState({ total: 0, done: 0, active: false, warning: null });

  const startBatch = useCallback((count) => {
    setState({ total: count, done: 0, active: true, warning: null });
  }, []);

  const completeOne = useCallback((opts = {}) => {
    setState((s) => {
      const done = s.done + 1;
      return {
        ...s,
        done,
        active: done < s.total,
        warning: opts.warning || s.warning,
      };
    });
  }, []);

  const setWarning = useCallback((warning) => {
    setState((s) => ({ ...s, warning }));
  }, []);

  const reset = useCallback(() => {
    setState({ total: 0, done: 0, active: false, warning: null });
  }, []);

  const progressPct = state.total > 0 ? Math.round((state.done / state.total) * 100) : 0;

  return { ...state, progressPct, startBatch, completeOne, setWarning, reset };
}
