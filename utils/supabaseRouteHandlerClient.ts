import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const supabaseRouteHandlerClient = async () => {
    (await cookies()).getAll();
    return createRouteHandlerClient<Database>({ cookies });
};