import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";
import { NextRequest, NextResponse } from "next/server";
import initiStripe from "stripe";


export async function POST(req: NextRequest) {

  const supabase = await supabaseRouteHandlerClient();

  const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);
  const signature = req.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_SIGNING_SECRET as string;

  const reqBuffer = Buffer.from(await req.arrayBuffer());

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, endpointSecret);

    console.log(event);

    switch (event.type) {
      case "customer.subscription.created":
        const customerSubscriptionCreated = event.data.object;
        await supabase.from("profile").update({
          is_subscribed: true,
          interval: customerSubscriptionCreated.items.data[0].plan.interval,
        }).eq("stripe_customer", event.data.object.customer.toString());
        break;

      case "customer.subscription.updated":
        const customerSubscriptionUpdated = event.data.object;

        if (customerSubscriptionUpdated.status === "canceled") {
          await supabase.from("profile").update({
            is_subscribed: false,
            interval: null,
          }).eq("stripe_customer", event.data.object.customer.toString());
          break;
        } else {
          await supabase.from("profile").update({
            is_subscribed: true,
            interval: customerSubscriptionUpdated.items.data[0].plan.interval,
          }).eq("stripe_customer", event.data.object.customer.toString());
          break;
        }

      case "customer.subscription.deleted":
        await supabase.from("profile").update({
          is_subscribed: false,
          interval: null,
        }).eq("stripe_customer", event.data.object.customer.toString());
        break;

      // default:
      //   console.log(`Unhandled event type ${event.type}.`);
    }

    // console.log(event);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(`Webhook Error: ${err.message}`, { status: 401 });
  }
}