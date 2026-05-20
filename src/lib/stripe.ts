import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

export const PLANS = {
  pro: {
    name: "Pro",
    monthly: {
      price: 9.9,
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID || "",
    },
    yearly: {
      price: 6.9,
      priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    },
  },
  business: {
    name: "Business",
    monthly: {
      price: 19.9,
      priceId: process.env.STRIPE_BIZ_MONTHLY_PRICE_ID || process.env.STRIPE_BUSINESS_PRICE_ID || "",
    },
    yearly: {
      price: 13.9,
      priceId: process.env.STRIPE_BIZ_YEARLY_PRICE_ID || "",
    },
  },
} as const;
