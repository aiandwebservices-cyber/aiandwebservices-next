/**
 * Calendar-based time window helpers for the Colony dashboard.
 *
 * The dashboard's 1d/7d/30d/90d toggles must align to local-calendar day
 * boundaries — at 12:01 AM local time the "1d" window resets to "today since
 * midnight", and the multi-day windows shift by exactly one day. Without this,
 * the windows roll continuously and a chart at 4 PM yesterday looks different
 * from the same chart at 4 PM today even with no new data.
 *
 * Default timezone is America/New_York (operator is in Florida). Override with
 * COLONY_TZ env var if needed.
 */

export type TimeWindow = '1d' | '7d' | '30d' | '90d' | 'all'

const DAY_MS = 86_400_000
const ALL_FLOOR_ISO = '2026-01-01T00:00:00Z'

function tz(): string {
  return process.env.COLONY_TZ || 'America/New_York'
}

/**
 * Returns the UTC `Date` for 00:00:00 in `timeZone` on the calendar day that
 * is `daysAgo` days before today (in `timeZone`). `daysAgo=0` means start of
 * today in that zone.
 */
export function startOfDayInTz(daysAgo = 0, timeZone: string = tz()): Date {
  const now = new Date()
  // Compute the timezone offset (ms) by formatting the same instant as both
  // UTC and local — the difference is the zone offset at this moment, which
  // correctly handles DST.
  const utcMs = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()
  const localMs = new Date(now.toLocaleString('en-US', { timeZone })).getTime()
  const offsetMs = localMs - utcMs
  // Floor "now+offset" to the start of the UTC day, then shift back to actual UTC.
  const localDayStart = Math.floor((now.getTime() + offsetMs) / DAY_MS) * DAY_MS
  return new Date(localDayStart - offsetMs - daysAgo * DAY_MS)
}

/**
 * UTC-day-aligned variant of windowToISO. Required for the Anthropic Admin
 * cost_report API, which rejects same-day ranges and buckets daily by UTC.
 * The returned range is the minimal set of full UTC days that covers the
 * Eastern calendar window — slight over-inclusion at the boundaries (a few
 * Eastern-evening hours from the day before / after) is accepted as the
 * trade-off for UTC-bucketed billing data.
 */
export function windowToUtcDayISO(window: TimeWindow): { start: string; end: string } {
  const now = new Date()
  const tomorrowUtcMidnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) + DAY_MS,
  )
  const end = tomorrowUtcMidnight.toISOString()

  // Anchor the start at the UTC midnight of "Eastern start-of-window" floored down.
  const easternStart = windowToISO(window).start
  if (window === 'all') return { start: ALL_FLOOR_ISO, end }
  const startMs = new Date(easternStart).getTime()
  const startUtcDay = new Date(Math.floor(startMs / DAY_MS) * DAY_MS)
  return { start: startUtcDay.toISOString(), end }
}

/**
 * Calendar window boundaries in ISO. End is "now" so the latest data is
 * always included. Semantics:
 *   1d  → today since local midnight
 *   7d  → today + 6 prior calendar days (last 7 calendar days inclusive)
 *   30d → today + 29 prior calendar days
 *   90d → today + 89 prior calendar days
 *   all → from ALL_FLOOR_ISO
 */
export function windowToISO(window: TimeWindow): { start: string; end: string } {
  const end = new Date().toISOString()
  let start: string
  switch (window) {
    case '1d':
      start = startOfDayInTz(0).toISOString()
      break
    case '7d':
      start = startOfDayInTz(6).toISOString()
      break
    case '30d':
      start = startOfDayInTz(29).toISOString()
      break
    case '90d':
      start = startOfDayInTz(89).toISOString()
      break
    case 'all':
    default:
      start = ALL_FLOOR_ISO
      break
  }
  return { start, end }
}
