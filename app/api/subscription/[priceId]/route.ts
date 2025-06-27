import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";
import { NextRequest, NextResponse } from "next/server";
import initiStripe from "stripe";


interface Props {
  params: Promise<{
    priceId: string;
  }>;
}
//{ params }: Props
export async function GET(req: NextRequest, { params }: Props) {
    const supabase = await supabaseRouteHandlerClient();
    const{ data } = await supabase.auth.getUser();
    const user = data.user;

    if(!user){
        return NextResponse.json("Unauthorized",{status: 401});
    }

    const {data: stripe_customer_data } = await supabase.from("profile").select("stripe_customer").eq("id",user?.id).single();

    const params_pid = await params;
    const priceId = params_pid.priceId;

    const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
        customer: stripe_customer_data?.stripe_customer!,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{price: priceId, quantity: 1}],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url:`${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancelled`,
    });

    //console.log(stripe_customer_data);
    {/*return NextResponse.json({
        ...user,stripe_customer_data,
    });*/}

    return NextResponse.json({id: session.id})
}