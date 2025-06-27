import AuthServerButton from "@/components/auth/AuthServerButton";
import SubscriptionButton from "@/components/checkout/SubscriptionButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Database } from "@/lib/database.types";
import { createServerComponentClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import initiStripe, { Stripe } from "stripe";


interface plan {
            id: string;
            name: string,
            price: string | null;
            interval: Stripe.Price.Recurring.Interval | null;
            currency: string
        }

const getAllplans = async (): Promise<plan[]> => {
    const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);

    const {data:plansList} = await stripe.plans.list();

    const plans = await Promise.all(plansList.map(async (plan) => {
        const product = await stripe.products.retrieve(plan.product as string);
        // console.log(product);

        return {
            id: plan.id,
            name: product.name,
            price: plan.amount_decimal,
            interval: plan.interval,
            currency: plan.currency,
        }
    }));
    
    const sortedPlans = plans.sort((a,b) => parseInt(a.price!) - parseInt(b.price!));

    return sortedPlans;
};

const getProfileData = async (supabase: SupabaseClient<Database>) => {
    const { data: profile } = await supabase.from("profile").select("*").single();
    // console.log(profile);
    return profile;
};


const PricingPage = async () => {
    const supabase = await createServerComponentClient({cookies});
    const {data: user} = await supabase.auth.getSession();


    //const plans = await getAllplans();
    //const profile = await getProfileData(supabase);

    const [plans, profile] = await Promise.all([
        await getAllplans(),
        await getProfileData(supabase),
    ]);

    const showSubscribeButton = !!user.session && !profile?.is_subscribed;
    const showCreateAccountButton = !user.session;
    const showManageSubscriptionButton = !!user.session && profile?.is_subscribed;

    return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
            {/*  <pre>{JSON.stringify(plans,null,2)}</pre> */}
            {plans.map((plan) => (
                <Card className="shadow-md" key={plan.id}>
                <CardHeader>
                    <CardTitle> {plan.name} Plan</CardTitle>
                    <CardDescription> {plan.name} </CardDescription>
                </CardHeader>
                <CardContent>
                    <p> {plan.price} {plan.currency} / {plan.interval} </p>
                </CardContent>
                <CardFooter>
                    {showSubscribeButton && <SubscriptionButton planId = {plan.id} />}
                    {showCreateAccountButton && <AuthServerButton /> }
                    {showManageSubscriptionButton && (
                            <Button>
                                <Link href="/dashboard">Manage Subscription</Link>
                            </Button>)}
                </CardFooter>
            </Card>
            ))}
            

            {/* 
            <Card  className="shadow-md">
                <CardHeader>
                    <CardTitle> Year Plan </CardTitle>
                    <CardDescription> Year </CardDescription>
                </CardHeader>
                <CardContent>
                    <p> 20000 yen / Year </p>
                </CardContent>
                <CardFooter>
                    <Button> Subscribe </Button>
                </CardFooter>
            </Card>
            */}
    
    </div>
    );
};

export default PricingPage;
