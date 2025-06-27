"use client";

import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";


const AuthClientButton = ({session}:{session: Session | null}) => {
    
    const router = useRouter();
    const supabase = createClientComponentClient();    
    
    const handleSingnIn = async () => {
            //console.log("test");
            await supabase.auth.signInWithOAuth({
                provider:"github",
                options: {
                    redirectTo:`${location.origin}/auth/callback`,
                }
            });
        };
    
    const handleSingnOut = async () => {
            await supabase.auth.signOut();
            router.refresh();
        };
    
    return (
        <>
        {session ? (
            <Button onClick={handleSingnOut}>Logout</Button>
        ) : ( 
            <Button onClick={handleSingnIn}>Login</Button>
        )}            
        </>
    );
};

export default AuthClientButton;