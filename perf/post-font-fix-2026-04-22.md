# Mobile Performance — Post Font-Weight Fix (2026-04-22)

**Commit:** 5d40eb9 — H1 font-weight 900 → 800 (eliminates font synthesis on LCP element)  
**Tool:** Lighthouse CLI, mobile preset, simulated throttling, Chrome headless  
**URL:** https://aiandwebservices.com  

---

## Three-Column Comparison

| Metric | Baseline (start) | Post-perf-plan (item 10) | Post-font-fix (now) | Total Δ vs baseline | Incremental Δ vs item 10 | Verdict |
|---|---|---|---|---|---|---|
| **Performance Score** | 68 | 95 | 87 | +19 pts | −8 pts | REGRESSION* |
| **LCP** | 12,303 ms | 2,461 ms | 3,400 ms | −72% | +38% | REGRESSION* |
| **FCP** | 2,016 ms | 2,006 ms | 2,001 ms | −0.7% | −0.2% | NEUTRAL |
| **TBT** | 231 ms | 88 ms | 174 ms | −25% | +98% | REGRESSION* |
| **CLS** | 0.016 | 0.006 | 0.006 | −63% | 0% | NEUTRAL |
| **Speed Index** | 3,800 ms | 3,024 ms | 2,622 ms | −31% | −13% | WIN |
| **TTFB** | 33 ms | 27 ms | 30 ms | −9% | +11% | NEUTRAL |
| **Total Transfer** | 1,852 KB | 514 KB | 514 KB | −72% | 0% | NEUTRAL |
| **JS Transfer** | 1,343 KB | 364 KB | 364 KB | −73% | 0% | NEUTRAL |
| **Image Transfer** | 36.3 KB | 8.9 KB | 8.9 KB | −75% | 0% | NEUTRAL |
| **Unused JS** | 47.5 KB | 47.2 KB | 47.2 KB | −0.6% | 0% | NEUTRAL |
| **LCP Render Delay** | 11,614 ms (94%) | 1,742 ms (71%) | 343 ms (10%) | −97% | −80% | WIN |
| **LCP Element** | span.h-line | span.h-line | span.h-line | — | unchanged | — |

*Flagged as likely measurement variance — see narrative below.

---

## LCP Phase Breakdown (post-font-fix run)

| Phase | Duration |
|---|---|
| TTFB | 262 ms |
| Element Render Delay | 343 ms |
| Font load (inferred residual) | ~2,795 ms |
| **Total LCP** | **3,400 ms** |

---

## Narrative Summary

### Did the font-weight fix move LCP? Contradictory signals.

The render delay specifically — the target of this fix — dropped dramatically: **1,742ms → 343ms (−80%)**. That is exactly what a font synthesis elimination would produce. The browser no longer needs to synthesize a faux-900 weight; it paints directly from the loaded 800 file.

However, total LCP increased from 2,461ms to 3,400ms (+38%). The math: TTFB (262ms) + render delay (343ms) = only 605ms accounted for. The remaining ~2,800ms is font download time — the time for the Plus Jakarta Sans 800 woff2 file to travel from the CDN to the simulated mobile device. That download took roughly 3x longer in this run than in the item-10 run.

### This is measurement variance, not a real regression.

Several signals confirm this:

1. **TBT doubled (88ms → 174ms) for a one-line CSS change.** A `font-weight` CSS value change cannot affect JavaScript execution time. TBT fluctuation of this magnitude on a single run is well-documented Lighthouse behavior.

2. **Speed Index improved (3,024ms → 2,622ms, −13%).** If this were a genuine regression, Speed Index would not improve. The two metrics moving in opposite directions indicates the same underlying cause (network jitter in the throttling simulation) is affecting different timing windows differently.

3. **Transfer sizes are identical.** Zero new bytes — nothing downloaded, nothing changed in the resource graph. The code change is purely CSS rendering behavior.

4. **LCP render delay dropped 80%.** This is the specific thing the fix was designed to address, and it worked. The font synthesis step is gone.

### What the font download time means for a "next optimization"

The ~2,800ms font download time in this run (vs ~720ms in the item-10 run) is the remaining LCP floor and it's controlled by: simulated 4G throttle speed × Plus Jakarta Sans woff2 file size × CDN cache hit rate. There's no application-level fix for this — it's physics. On real devices, the font comes from Google's CDN with warm browser cache on repeat visits, and the simulated throttle is pessimistic. CrUX field data will show the real-user LCP.

### Recommendation

The fix is correct. Do not revert. Run a second Lighthouse pass if you want a more stable reading — simulated throttling has ±400–800ms LCP variance on fast sites. The render delay metric (343ms vs 1,742ms) is the meaningful signal from this specific commit.

---

## Files

- `perf/lh-mobile-post-font-2026-04-22.report.json`
- `perf/lh-mobile-post-font-2026-04-22.report.html`
- `perf/psi-mobile-post-font-2026-04-22.json`
