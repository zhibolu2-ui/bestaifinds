import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PLANS, createSubscription } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { plan, billing = "monthly" } = await req.json();
    if (plan !== "pro" && plan !== "business") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const period = billing === "yearly" ? "yearly" : "monthly";
    const planConfig = PLANS[plan as keyof typeof PLANS];
    const planId = planConfig[period].planId;

    if (!planId) {
      return NextResponse.json({ error: "Payment not configured yet" }, { status: 500 });
    }

    const url = await createSubscription(planId, user.email!, user.id, plan);
    if (!url) {
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("PayPal checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
