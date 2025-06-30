import React from 'react';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import {YouTubeEmbed} from "@next/third-parties/google"
import { extractYouTubeVideoId } from '@/utils/extractYoutubeVideoId';
import { supabaseServer } from '@/utils/supabaseSever';
import { NextRequest } from 'next/server';

const getDetailSolution = async (id: number, supabase: SupabaseClient<Database>) => {
    const { data: solution } = await supabase.from("solutions").select("*").eq("id", id).single();
    return solution;
};

const getPremiumContent = async (id: number, supabase: SupabaseClient<Database>) => {
    const { data: content } = await supabase.from("premium_content").select("report_url").eq("id", id).single();
    return content;
};

interface Props {
  params: Promise<{
    id: number;
  }>;
}

const SolutionDetailPage = async ({ params }: Props) => {
    //{ params }: { params: { id: number } }
    const supabase = await supabaseServer();
    const { id } = await params;

    // const solution = await getDetailSolution(id, supabase);
    // const content = await getPremiumContent(id, supabase);
    const [solution, content] = await Promise.all([
        await getDetailSolution(id, supabase),
        await getPremiumContent(id, supabase),
    
    ]);
    
    console.log(solution);
    console.log(content);
    
    const videoId = extractYouTubeVideoId(content?.report_url!) as string;

    return (
        <div className="w-full max-w-3xl mx-auto my-16 px-8">
            <h1 className="text-3xl mb-6">{solution?.name}</h1>
            <p className="mb-8">{solution?.description}</p>
            <YouTubeEmbed height={400} videoid = {videoId} />
            
        </div>
    );
};

export default SolutionDetailPage;
