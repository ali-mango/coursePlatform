import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

function parseSig(header: string) {
  const parts = header.split(",").map((p) => p.trim());
  const out: Record<string, string> = {};
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (k && v !== undefined) out[k] = v;
  }
  return out;
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export async function POST(req: Request) {
 console.log("PAYMONGO WEBHOOK HIT"); 
  const sigHeader =
    req.headers.get("paymongo-signature") || req.headers.get("Paymongo-Signature");

  const rawBody = await req.text();

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  if (!sigHeader) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const { t, te, li } = parseSig(sigHeader);
  if (!t) return NextResponse.json({ error: "Invalid signature header" }, { status: 400 });

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex");

  const livemode = Boolean(payload?.data?.attributes?.livemode);
  const provided = livemode ? li : te;

  if (!provided || !safeEqual(expected, provided)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const eventType = payload?.data?.attributes?.type;
  if (eventType !== "checkout_session.payment.paid") {
    return NextResponse.json({ received: true, ignored: eventType });
  }

  const dataObj = payload?.data?.attributes?.data;

  const checkoutId =
    dataObj?.id ||
    dataObj?.attributes?.checkout_session_id ||
    dataObj?.attributes?.checkout_session?.id ||
    payload?.data?.attributes?.checkout_session_id;

  const referenceNumber =
    dataObj?.attributes?.reference_number ||
    dataObj?.attributes?.checkout_session?.reference_number ||
    payload?.data?.attributes?.reference_number;

  if (checkoutId) {
    const { data: purchase } = await supabaseAdmin
      .from("purchases")
      .select("id,status")
      .eq("paymongo_checkout_id", checkoutId)
      .maybeSingle();

    if (purchase && purchase.status !== "paid") {
      await supabaseAdmin.from("purchases").update({ status: "paid" }).eq("id", purchase.id);
      return NextResponse.json({ received: true, updated: "by_checkout_id" });
    }
  }

  if (referenceNumber) {
    const { data: purchase } = await supabaseAdmin
      .from("purchases")
      .select("id,status")
      .eq("id", referenceNumber)
      .maybeSingle();

    if (purchase && purchase.status !== "paid") {
      await supabaseAdmin.from("purchases").update({ status: "paid" }).eq("id", purchase.id);
      return NextResponse.json({ received: true, updated: "by_reference_number" });
    }
  }

  return NextResponse.json({
    received: true,
    updated: false,
    checkoutId: checkoutId || null,
    referenceNumber: referenceNumber || null,
  });
}