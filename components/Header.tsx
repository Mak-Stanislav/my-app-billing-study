import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import AuthServerButton from "./auth/AuthServerButton";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const  Head = async () => {
    const supabase = await createServerComponentClient({cookies});
    const {data: user} = await supabase.auth.getSession();


    return (
    <div className="flex py-4 px-6 border-b border-gray-200">
        <Link href={"/"}>
            <Button variant={"outline"}>Home</Button>
        </Link>

        {user.session &&(
            <Link href={"/dashboard"} className="ml-4">
                <Button variant={"outline"}>Dashboard</Button>
            </Link>
        )}

        <Link href={"/pricing"} className="ml-4">
            <Button variant={"outline"}>Pricing</Button>
        </Link>
        <div className="ml-auto">
            <AuthServerButton />
        </div>              
    </div>
    );
};

export default Head;