const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("PayPal credentials not configured");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

export const PLANS = {
  pro: {
    name: "Pro Plan",
    monthly: { price: "9.99", planId: process.env.PAYPAL_PRO_MONTHLY_PLAN_ID || "" },
    yearly: { price: "83.00", planId: process.env.PAYPAL_PRO_YEARLY_PLAN_ID || "" },
  },
  business: {
    name: "Business Plan",
    monthly: { price: "20.00", planId: process.env.PAYPAL_BIZ_MONTHLY_PLAN_ID || "" },
    yearly: { price: "167.00", planId: process.env.PAYPAL_BIZ_YEARLY_PLAN_ID || "" },
  },
} as const;

export async function createSubscription(
  planId: string,
  email: string,
  userId: string,
  plan: string,
) {
  const token = await getAccessToken();
  const returnUrl = `${process.env.NEXTAUTH_URL}/pricing?success=true`;
  const cancelUrl = `${process.env.NEXTAUTH_URL}/pricing?canceled=true`;

  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: { email_address: email },
      custom_id: JSON.stringify({ userId, plan }),
      application_context: {
        brand_name: "BestAIFinds",
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: "SUBSCRIBE_NOW",
      },
    }),
  });

  const data = await res.json();
  const approvalLink = data.links?.find((l: { rel: string }) => l.rel === "approve");
  return approvalLink?.href || null;
}

export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });

  const data = await res.json();
  return data.verification_status === "SUCCESS";
}
