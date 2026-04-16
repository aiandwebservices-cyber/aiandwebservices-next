const KEYS = {
  source:   'mrs_utm_source',
  medium:   'mrs_utm_medium',
  campaign: 'mrs_utm_campaign',
} as const;

export function captureUTMs(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const src  = params.get('utm_source');
  const med  = params.get('utm_medium');
  const camp = params.get('utm_campaign');

  const anyInUrl = src !== null || med !== null || camp !== null;

  if (anyInUrl) {
    // URL wins — overwrite all three
    sessionStorage.setItem(KEYS.source,   src  ?? '');
    sessionStorage.setItem(KEYS.medium,   med  ?? '');
    sessionStorage.setItem(KEYS.campaign, camp ?? '');
    return;
  }

  const hasStored =
    sessionStorage.getItem(KEYS.source)   !== null ||
    sessionStorage.getItem(KEYS.medium)   !== null ||
    sessionStorage.getItem(KEYS.campaign) !== null;

  if (!hasStored) {
    // No URL params, nothing stored — mark as direct
    sessionStorage.setItem(KEYS.source,   'direct');
    sessionStorage.setItem(KEYS.medium,   '');
    sessionStorage.setItem(KEYS.campaign, '');
  }
  // else: existing session values stand, do nothing
}

export function getUTMs(): { utm_source: string; utm_medium: string; utm_campaign: string } {
  if (typeof window === 'undefined') {
    return { utm_source: '', utm_medium: '', utm_campaign: '' };
  }
  return {
    utm_source:   sessionStorage.getItem(KEYS.source)   ?? '',
    utm_medium:   sessionStorage.getItem(KEYS.medium)   ?? '',
    utm_campaign: sessionStorage.getItem(KEYS.campaign) ?? '',
  };
}
