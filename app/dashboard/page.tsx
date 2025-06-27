import SubscriptionManagementButton from "@/components/checkout/SubscriptionManagementButton";
import { Database } from "@/lib/database.types";
import { createServerComponentClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import React from "react";

const getProfileData = async (supabase: SupabaseClient<Database>) => {
    const { data: profile } = await supabase.from("profile").select("*").single();
    // console.log(profile);
    return profile;
};

const Dashboard = async () => {

    const supabase = await createServerComponentClient({cookies});
    const profile = await getProfileData(supabase);

    return (
        <div className="w-full max-w-3xl mx-auto py-16 px-8">
            <h1 className="text-3xl mb-6">User Subscription Management Dashboard</h1>
            <div>
                <div className="mb-3">
                    {profile?.is_subscribed? `Solution Subscribed: ${profile.interval}`:"No Subscription"}
                </div>
                <SubscriptionManagementButton />
            </div>
        </div>
    );
};
export default Dashboard;