import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import initiStripe from "stripe";

export async function POST(req: NextRequest) {

    const supabase = await createRouteHandlerClient({ cookies });
    const query = req.nextUrl.searchParams.get("API_ROUTE_SECRET");

    if(query !== process.env.API_ROUTE_SECRET) {
        return NextResponse.json({
            message: "You are not authorized to use this API",
        });
    }

    const data = await req.json();
    const { id, email } = data.record;

    //console.log(id, email);

    const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);
    const customer = await stripe.customers.create({
        email,
    });

    const { error } = await supabase
        .from("profile")
        .update({
            stripe_customer: customer.id,
        })
        .eq("id", id);

    //console.log(id, customer.id);
    //console.log(error?.message);

    return NextResponse.json({
        message: `stripe customer created ${customer.id}`,
    });
}