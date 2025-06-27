import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthClientButton from "./AuthClienButton";

const AuthServerButton = async () => {
    
    const supabase = await createServerComponentClient({cookies});
    const { data: user } = await supabase.auth.getSession();
    const session = user.session;
    //console.log(session);
    
    return <AuthClientButton session={session} />;
};

export default AuthServerButton;