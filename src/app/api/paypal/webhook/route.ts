import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/paypal";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => { headers[k] = v; });

  const valid = await verifyWebhookSignature(headers, rawBody);
  if (!valid) {
    console.error("PayPal webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event_type || "";
  const resource = event.resource || {};

  switch (eventType) {
    case "BILLING.SUBSCRIPTION.ACTIVATED":
    case "BILLING.SUBSCRIPTION.CREATED": {
      const customId = resource.custom_id || "";
      try {
        const { userId, plan } = JSON.parse(customId);
        if (userId && plan) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan,
              stripeSubId: resource.id || "",
              stripeCustomerId: resource.subscriber?.email_address || "",
            },
          });
        }
      } catch { /* custom_id parse failed */ }
      break;
    }

    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.EXPIRED":
    case "BILLING.SUBSCRIPTION.SUSPENDED": {
      const subId = resource.id;
      if (subId) {
        await prisma.user.updateMany({
          where: { stripeSubId: subId },
          data: { plan: "free", stripeSubId: null },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
