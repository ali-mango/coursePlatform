// src/app/api/paymongo/checkout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function paymongoPost(path: string, body: unknown) {
  const key = process.env.PAYMONGO_SECRET_KEY!;
  const auth = Buffer.from(`${key}:`).toString("base64");

  const res = await fetch(`https://api.paymongo.com/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    const msg = json?.errors?.[0]?.detail || "PayMongo error";
    throw new Error(msg);
  }
  return json;
}

export async function POST(req: Request) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const supabase = await createSupabaseServer();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", appUrl));
    }

    const form = await req.formData();
    const courseId = String(form.get("courseId") || "");
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("id,slug,title,description,is_free,price_php")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.is_free) {
      return NextResponse.redirect(new URL(`/courses/${course.slug}`, appUrl));
    }

    // Create/ensure pending purchase
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from("purchases")
      .upsert(
        { user_id: user.id, course_id: course.id, status: "pending" },
        { onConflict: "user_id,course_id" }
      )
      .select("id")
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: purchaseError?.message || "Failed to create purchase" },
        { status: 500 }
      );
    }

    const successUrl = `${appUrl}/courses/${course.slug}?paid=1`;
    const cancelUrl = `${appUrl}/courses/${course.slug}?cancelled=1`;

    const amount = Number(course.price_php) * 100; // centavos

    const checkout = await paymongoPost("checkout_sessions", {
      data: {
        attributes: {
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          line_items: [
            {
              name: course.title,
              description: course.description,
              quantity: 1,
              amount,
              currency: "PHP",
            },
          ],
          payment_method_types: ["card","qrph"], // add gcash/paymaya later
          success_url: successUrl,
          cancel_url: cancelUrl,
          reference_number: purchase.id,
        },
      },
    });

    const checkoutId = checkout.data.id as string;
    const checkoutUrl = checkout.data.attributes.checkout_url as string;

    const { error: updateErr } = await supabaseAdmin
      .from("purchases")
      .update({ paymongo_checkout_id: checkoutId, paymongo_reference: purchase.id })
      .eq("id", purchase.id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.redirect(checkoutUrl);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}