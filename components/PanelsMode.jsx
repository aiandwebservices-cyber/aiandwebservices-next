'use client';
import { useEffect } from 'react';

export default function PanelsMode() {
  useEffect(() => {
    document.body.classList.add('panels-mode');
    return () => document.body.classList.remove('panels-mode');
  }, []);
  return null;
}
