import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventName: string = event.meta?.event_name || "";
  const customData = event.meta?.custom_data || {};
  const userId: string = customData.user_id || "";
  const plan: string = customData.plan || "";
  const attrs = event.data?.attributes || {};

  switch (eventName) {
    case "subscription_created":
    case "order_created": {
      if (userId && plan) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeSubId: String(event.data?.id || ""),
            stripeCustomerId: String(attrs.customer_id || ""),
          },
        });
      }
      break;
    }

    case "subscription_updated": {
      const status: string = attrs.status || "";
      const active = status === "active" || status === "on_trial";
      const customerId = String(attrs.customer_id || "");

      if (customerId) {
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: active ? user.plan : "free",
              stripeSubId: String(event.data?.id || ""),
            },
          });
        }
      }
      break;
    }

    case "subscription_cancelled":
    case "subscription_expired": {
      const customerId = String(attrs.customer_id || "");
      if (customerId) {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: "free", stripeSubId: null },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
