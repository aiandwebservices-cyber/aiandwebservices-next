'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SEED_FALLBACK = {
  rating: 4.9,
  totalReviews: 847,
  reviews: [
    {
      author: 'Mike Johnson',
      rating: 5,
      text: 'Best car-buying experience I\'ve ever had.',
      timeAgo: '3 days ago',
      profilePhoto: '',
      platform: 'google',
    },
    {
      author: 'Sandra Reyes',
      rating: 5,
      text: 'Honest team, no pressure.',
      timeAgo: '1 week ago',
      profilePhoto: '',
      platform: 'google',
    },
  ],
};

const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

export function useReviews(dealerId, options = {}) {
  const { fallback = SEED_FALLBACK, refreshIntervalMs = REFRESH_INTERVAL_MS } = options;

  const [reviews, setReviews] = useState(fallback.reviews || []);
  const [rating, setRating] = useState(fallback.rating || 0);
  const [totalReviews, setTotalReviews] = useState(fallback.totalReviews || 0);
  const [source, setSource] = useState('seed');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const aliveRef = useRef(true);

  const load = useCallback(async () => {
    if (!dealerId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/dealer/${encodeURIComponent(dealerId)}/reviews`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Reviews ${res.status}`);
      const data = await res.json();
      if (!aliveRef.current) return;
      if (!data?.ok) throw new Error(data?.error || 'Reviews API returned ok:false');
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setRating(typeof data.rating === 'number' ? data.rating : 0);
      setTotalReviews(typeof data.totalReviews === 'number' ? data.totalReviews : 0);
      setSource(data.source || 'google');
      setError(null);
    } catch (e) {
      if (!aliveRef.current) return;
      console.warn('[useReviews] falling back to seed:', e.message);
      setReviews(fallback.reviews || []);
      setRating(fallback.rating || 0);
      setTotalReviews(fallback.totalReviews || 0);
      setSource('seed');
      setError(e.message || 'Failed to load reviews');
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, [dealerId, fallback]);

  useEffect(() => {
    aliveRef.current = true;
    setLoading(true);
    load();
    const id = setInterval(load, refreshIntervalMs);
    return () => {
      aliveRef.current = false;
      clearInterval(id);
    };
  }, [load, refreshIntervalMs]);

  return {
    reviews,
    rating,
    totalReviews,
    source,
    loading,
    error,
    refresh: load,
  };
}

export default useReviews;
