import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const supabase = await supabaseRouteHandlerClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(requestUrl.origin);
};
