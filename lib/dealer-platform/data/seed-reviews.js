/**
 * Seed reviews — 12 Google-style reviews. Avg 4.3★.
 * Distribution: 5★×5, 4★×3, 3★×2, 2★×1, 1★×1
 */

const TODAY = new Date('2026-05-01T12:00:00Z');
const isoDaysAgo = (d) => new Date(TODAY.getTime() - d * 86400000).toISOString();

export const SEED_REVIEWS = [
  // ── 5★ (5) ──────────────────────────────────────────────────────────────
  {
    id: 'rv1', author: 'Mike J.', rating: 5, platform: 'Google',
    text: 'Best used car experience I\'ve had in Miami, no joke. Carlos made the whole process easy and actually listened to what I wanted. Got my Camry for a great price and they even filled the tank. Will 100% buy here again.',
    date: isoDaysAgo(3), responded: false, response: '',
  },
  {
    id: 'rv2', author: 'Angela T.', rating: 5, platform: 'Google',
    text: 'No pressure at all — which is rare at a car dealership lol. The team was super transparent about the pricing and the Telluride was exactly as advertised. Delivery took less than 2 hours from walking in to driving out. Highly recommend.',
    date: isoDaysAgo(12), responded: true,
    response: "Angela, we're so glad you had a smooth experience! Transparent pricing and fast delivery are exactly what we aim for. Enjoy every mile in that Telluride — it's a beauty!",
  },
  {
    id: 'rv3', author: 'Henry N.', rating: 5, platform: 'Google',
    text: 'I traded in my old F-150 and picked up a GMC Sierra here. Maria in finance got me a way better rate than my bank offered — saved me like $80/mo. The whole deal took about 3 hours. Really happy with how it all went.',
    date: isoDaysAgo(21), responded: true,
    response: "Henry, saving $80/month is a big deal — glad Maria could make that happen! Enjoy the new Sierra and come see us when you're ready for your next upgrade.",
  },
  {
    id: 'rv4', author: 'Danielle R.', rating: 5, platform: 'Google',
    text: 'Bought a 2021 Subaru Outback here last week. James was patient, not pushy, and they gave me a fair trade-in value on my old Fit. Paperwork was organized and quick. Definitely coming back when my daughter is ready for her first car.',
    date: isoDaysAgo(17), responded: true,
    response: "Danielle, we love hearing that! Tell your daughter we'll take great care of her too when that day comes. Enjoy the Outback!",
  },
  {
    id: 'rv5', author: 'Lisa P.', rating: 5, platform: 'Google',
    text: 'No pressure, fair price, and they delivered the CR-V right to my door. Service after the sale has been great too — they actually called to make sure everything was okay. Will buy here again.',
    date: isoDaysAgo(6), responded: false, response: '',
  },

  // ── 4★ (3) ──────────────────────────────────────────────────────────────
  {
    id: 'rv6', author: 'David C.', rating: 4, platform: 'Google',
    text: 'Great selection and pricing. Finance took a bit long but overall happy. The Audi Q5 is exactly what I was looking for and they matched a competitor price without me even having to fight for it.',
    date: isoDaysAgo(14), responded: true,
    response: "Thanks David — appreciate the feedback. We've streamlined our finance team since then. Enjoy the Q5!",
  },
  {
    id: 'rv7', author: 'Patricia V.', rating: 4, platform: 'Google',
    text: 'Bought a BMW 3 Series here. Carlos was helpful and the car is in great shape. Only giving 4 stars because the detailing wasn\'t quite complete when I picked it up — but they offered to fix it and I brought it back the next day no problem.',
    date: isoDaysAgo(26), responded: true,
    response: "Patricia, we appreciate your patience on the detail — that's not our standard and we're glad we could make it right. Enjoy the 3 Series!",
  },
  {
    id: 'rv8', author: 'Kevin W.', rating: 4, platform: 'Google',
    text: 'Good experience overall. The salesman knew his stuff and wasn\'t trying to hide anything. Took about 4 hours total which felt a little long, but the deal was solid. Would recommend to friends.',
    date: isoDaysAgo(45), responded: false, response: '',
  },

  // ── 3★ (2) ──────────────────────────────────────────────────────────────
  {
    id: 'rv9', author: 'Marcus L.', rating: 3, platform: 'Google',
    text: 'Car was nice and the price was fair. But I had to call 3 times to get a callback before my appointment. Once I was there everything was fine. I think they just get busy. Might try them again.',
    date: isoDaysAgo(38), responded: true,
    response: "Marcus, we\'re sorry about the delayed callbacks — that's on us and we've added a dedicated follow-up process since then. Glad the visit itself went smoothly, and we hope to do better next time.",
  },
  {
    id: 'rv10', author: 'Steph M.', rating: 3, platform: 'Google',
    text: 'Decent place. Prices are competitive and the lot looks nice. My only issue was the add-on products felt a bit pushy in the finance office. Not a dealbreaker but just wanted to be honest. Car is great though.',
    date: isoDaysAgo(62), responded: false, response: '',
  },

  // ── 2★ (1) ──────────────────────────────────────────────────────────────
  {
    id: 'rv11', author: 'Derek F.', rating: 2, platform: 'Google',
    text: 'I came in on a Saturday and waited almost 2 hours before anyone really helped me. The car I was interested in ended up being sold already. Just felt disorganized that day. The guys were nice enough but it was frustrating.',
    date: isoDaysAgo(80), responded: true,
    response: "Derek, we sincerely apologize for the wait — Saturdays can get hectic and that's no excuse for leaving you without help. We\'ve since added a weekend greeter to make sure no one falls through the cracks. We hope you\'ll give us another chance.",
  },

  // ── 1★ (1) ──────────────────────────────────────────────────────────────
  {
    id: 'rv12', author: 'Nicole B.', rating: 1, platform: 'Google',
    text: 'Honestly the wait time here is ridiculous. I had an appointment for 10am and didn\'t talk to anyone until almost 11:30. For a scheduled appointment thats not okay. The car was fine but I left feeling like my time wasn\'t respected at all.',
    date: isoDaysAgo(97), responded: false, response: '',
  },
];
