import {
  lemonSqueezySetup,
  createCheckout,
  type NewCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

let _initialized = false;

function ensureSetup() {
  if (!_initialized) {
    const key = process.env.LEMONSQUEEZY_API_KEY;
    if (!key) throw new Error("LEMONSQUEEZY_API_KEY is not set");
    lemonSqueezySetup({ apiKey: key });
    _initialized = true;
  }
}

export const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || "";

export const PLANS = {
  pro: {
    name: "Pro",
    monthly: {
      price: 9.9,
      variantId: process.env.LS_PRO_MONTHLY_VARIANT_ID || "",
    },
    yearly: {
      price: 6.9,
      variantId: process.env.LS_PRO_YEARLY_VARIANT_ID || "",
    },
  },
  business: {
    name: "Business",
    monthly: {
      price: 19.9,
      variantId: process.env.LS_BIZ_MONTHLY_VARIANT_ID || "",
    },
    yearly: {
      price: 13.9,
      variantId: process.env.LS_BIZ_YEARLY_VARIANT_ID || "",
    },
  },
} as const;

export async function createLSCheckout(
  variantId: string,
  userEmail: string,
  userId: string,
  plan: string,
) {
  ensureSetup();

  const checkoutData: NewCheckout = {
    productOptions: { redirectUrl: `${process.env.NEXTAUTH_URL}/pricing?success=true` },
    checkoutData: {
      email: userEmail,
      custom: { user_id: userId, plan },
    },
  };

  const { data, error } = await createCheckout(STORE_ID, variantId, checkoutData);
  if (error) throw new Error(`LemonSqueezy checkout error: ${JSON.stringify(error)}`);
  return data?.data?.attributes?.url || null;
}
