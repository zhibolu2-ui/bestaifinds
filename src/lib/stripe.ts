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
    price: 9.9,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    features: [
      "Unlimited AI tool usage",
      "No daily limits",
      "Ad-free experience",
      "Priority processing",
    ],
  },
  business: {
    name: "Business",
    price: 19.9,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || "",
    features: [
      "Everything in Pro",
      "Batch processing",
      "API access",
      "Priority support",
      "Custom branding",
    ],
  },
} as const;
