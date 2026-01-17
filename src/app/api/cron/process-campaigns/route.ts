
import { processCampaigns } from "@/lib/campaigns/engine";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(request: Request) {
    // Optional: Add a secret key check for security
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Unauthorized', { status: 401 });
    // }

    try {
        const result = await processCampaigns();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
