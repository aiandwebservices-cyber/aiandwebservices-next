'use client';
import { useEffect } from 'react';

export default function AllowScroll() {
  useEffect(() => {
    document.body.classList.add('allow-scroll');
    return () => document.body.classList.remove('allow-scroll');
  }, []);
  return null;
}
