import AuthClientButton from "./AuthClienButton";
import { supabaseServer } from "@/utils/supabaseSever";

const AuthServerButton = async () => {
    
    const supabase = await supabaseServer();
    const { data: user } = await supabase.auth.getSession();
    const session = user.session;
    //console.log(session);
    
    return <AuthClientButton session={session} />;
};

export default AuthServerButton;