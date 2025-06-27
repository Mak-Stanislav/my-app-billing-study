import React from 'react';
import { createServerComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import {YouTubeEmbed} from "@next/third-parties/google"
import { extractYouTubeVideoId } from '@/utils/extractYoutubeVideoId';

const getDetailSolution = async (id: number, supabase: SupabaseClient<Database>) => {
    //const { data: solutions, error } = await supabase.from("solutions").select("*");
    const { data: solution } = await supabase.from("solutions").select("*").eq("id", id).single();
    return solution;
};

const getPremiumContent = async (id: number, supabase: SupabaseClient<Database>) => {
    //const { data: solutions, error } = await supabase.from("solutions").select("*");
    const { data: content } = await supabase.from("premium_content").select("report_url").eq("id", id).single();
    return content;
};


const SolutionDetailPage = async ({params}: {params: {id: number;};}) => {
    const supabase = await createServerComponentClient<Database>({ cookies });
    const [solution, content] = await Promise.all([
        await getDetailSolution(params.id, supabase),
        await getPremiumContent(params.id, supabase),
    ]);
    
    const vidoeId = extractYouTubeVideoId(content?.report_url as string) as string;
    //console.log(content);

    return (
        <div className="w-full max-w-3xl mx-auto my-16 px-8">
            <h1 className="text-3xl mb-6">{solution?.name}</h1>
            <p className="mb-8">{solution?.description}</p>
            <YouTubeEmbed height={400} videoid = {vidoeId} />
            
        </div>
    );
};

export default SolutionDetailPage;
