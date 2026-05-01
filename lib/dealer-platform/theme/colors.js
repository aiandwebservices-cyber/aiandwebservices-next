/**
 * Dealer-platform color tokens.
 * Light + dark CSS variable palettes used by ThemeProvider.
 * Per-dealer brand colors (primary, accent) come from config.colors and override these.
 */

export const THEMES = {
  light: {
    '--bg-app':         '#FAFAF7',
    '--bg-card':        '#FFFFFF',
    '--bg-elevated':    '#F5F5F0',
    '--bg-input':       '#FFFFFF',
    '--text-primary':   '#1C1917',
    '--text-secondary': '#57534E',
    '--text-muted':     '#A8A29E',
    '--border':         '#E7E5E4',
    '--border-strong':  '#D6D3D1',
    '--table-header':   '#F5F5F0',
    '--table-hover':    '#FAFAF8',
    '--table-stripe':   '#FDFCFB',
  },
  dark: {
    '--bg-app':         '#0F0F0F',
    '--bg-card':        '#1A1A1A',
    '--bg-elevated':    '#252525',
    '--bg-input':       '#1F1F1F',
    '--text-primary':   '#F5F5F0',
    '--text-secondary': '#A8A29E',
    '--text-muted':     '#78716C',
    '--border':         '#2A2A2A',
    '--border-strong':  '#3A3A3A',
    '--table-header':   '#1F1F1F',
    '--table-hover':    '#1A1A1A',
    '--table-stripe':   '#151515',
  },
};

// Customer-site (dossier/HUD) palette — used by example005-style hero
export const CUSTOMER_THEMES = {
  dark: {
    '--c-bg':     '#08080A',
    '--c-bg2':    '#0E0E12',
    '--c-panel':  '#13131A',
    '--c-rule':   '#1F1F2A',
    '--c-rule2':  '#2A2A38',
    '--c-ink':    '#F2F2EC',
    '--c-inkDim': 'rgba(242,242,236,0.55)',
    '--c-inkLow': 'rgba(242,242,236,0.32)',
    '--c-cyan':   '#5BE3FF',
    '--c-shadow': '0 0 0 transparent',
    '--c-glass':  'rgba(8,8,10,0.78)',
  },
  light: {
    '--c-bg':     '#FFFFFF',
    '--c-bg2':    '#F5F5F5',
    '--c-panel':  '#FAFAFA',
    '--c-rule':   '#E5E5E5',
    '--c-rule2':  '#D0D0D0',
    '--c-ink':    '#1A1A1A',
    '--c-inkDim': 'rgba(26,26,26,0.65)',
    '--c-inkLow': 'rgba(26,26,26,0.40)',
    '--c-cyan':   '#0077A5',
    '--c-shadow': '0 1px 3px rgba(0,0,0,0.08), 0 6px 16px rgba(0,0,0,0.06)',
    '--c-glass':  'rgba(255,255,255,0.85)',
  },
};

// Status badge color map — distinct per family per audit feedback
export const STATUS_COLORS = {
  // Inventory
  'Available':      { bg: '#E8F2EC', fg: '#256B40', dot: '#2F7A4A' },
  'Featured':       { bg: '#F5E9C4', fg: '#7A5A0F', dot: '#D4AF37', isStar: true },
  'On Sale':        { bg: '#FCE5E5', fg: '#9B1C1C', dot: '#C53030' },
  'Just Arrived':   { bg: '#E0F2FE', fg: '#0369A1', dot: '#0284C7' },
  'Price Drop':     { bg: '#FFEDD5', fg: '#9A3412', dot: '#EA580C' },
  'Pending':        { bg: '#FEF3C7', fg: '#92400E', dot: '#D97706' },
  'Sold':           { bg: '#E7E5E4', fg: '#57534E', dot: '#A8A29E' },
  'Reserved':       { bg: 'transparent', fg: '#7A5A0F', dot: '#D4AF37', border: '#D4AF37' },
  // Lead pipeline
  'New':            { bg: '#FBE6E6', fg: '#A12B2B', dot: '#C33B3B', pulse: true },
  'Contacted':      { bg: '#FEF9C3', fg: '#854D0E', dot: '#CA8A04' },
  'Appointment Set':{ bg: '#E0E7FF', fg: '#3730A3', dot: '#4F46E5' },
  'Showed':         { bg: '#F3E8FF', fg: '#6B21A8', dot: '#9333EA' },
  'Lost':           { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E', strike: true },
  // Deal pipeline
  'New Deal':       { bg: '#DBEAFE', fg: '#1E40AF', dot: '#2563EB' },
  'Working':        { bg: '#BFDBFE', fg: '#1D4ED8', dot: '#3B82F6' },
  'Approved':       { bg: '#D1FAE5', fg: '#065F46', dot: '#059669' },
  'Delivered':      { bg: '#CCFBF1', fg: '#115E59', dot: '#0D9488' },
  // Appointments
  'Confirmed':      { bg: '#E0F2FE', fg: '#0369A1', dot: '#0284C7' },
  'In Progress':    { bg: '#CFFAFE', fg: '#155E75', dot: '#0891B2' },
  'Completed':      { bg: '#D1FAE5', fg: '#065F46', dot: '#059669' },
  'No-Show':        { bg: '#FECDD3', fg: '#9F1239', dot: '#BE123C' },
  'Cancelled':      { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E' },
  // Reservations
  'Expired':        { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E' },
  'Released':       { bg: '#E7E5E4', fg: '#78716C', dot: '#A8A29E' },
};

// Lead source border map — colored left border distinguishes from status pills
export const LEAD_SOURCE_BORDERS = {
  'Get E-Price':     '#D4AF37',
  'Build Your Deal': '#D4AF37',
  'Pre-Approval':    '#2563EB',
  'Inventory Alert': '#2563EB',
  'Test Drive':      '#10B981',
  'Reserve':         '#10B981',
  'Chat':            '#9333EA',
  'Phone Call':      '#9333EA',
  'Trade-In':        '#EA580C',
  'Service':         '#EA580C',
  'Contact':         '#78716C',
};
