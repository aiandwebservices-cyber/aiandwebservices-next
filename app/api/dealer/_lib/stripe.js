import Stripe from 'stripe';

let _stripe = null;

export function getStripe() {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  _stripe = new Stripe(key);
  return _stripe;
}

export const SUBSCRIPTION_PRICE_ENV = {
  growth: 'STRIPE_PRICE_GROWTH',
  professional: 'STRIPE_PRICE_PROFESSIONAL',
  enterprise: 'STRIPE_PRICE_ENTERPRISE',
};

export const PLATFORM_PLANS = ['growth', 'professional', 'enterprise'];

export function dollarsToCents(dollars) {
  const n = Number(dollars);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

export function getOrigin(req) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

export async function createCheckoutSession(params) {
  const stripe = getStripe();
  return stripe.checkout.sessions.create(params);
}

export async function findOrCreateCustomerByEmail(email) {
  const stripe = getStripe();
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0];
  return stripe.customers.create({ email });
}

export function constructWebhookEvent(rawBody, signature) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
