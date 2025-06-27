"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../ui/button";

const SubscriptionButton = ({planId}: {planId: string}) => {
    const processSubscription = async ()=> {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/${planId}`
        );
        // const json = await response.json();
        //console.log(json);

        const data = await response.json();

        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
        await stripe?.redirectToCheckout({sessionId: data.id});
    };
    
    return ( <Button onClick={async ()=> processSubscription()}> Subscribe to Solution</Button>
    // <div>SubscriptionButton</div>
    );
};

export default SubscriptionButton;