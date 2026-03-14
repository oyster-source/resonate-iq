import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("id");

    if (!leadId) {
        return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Mark lead as unsubscribed
    const { error } = await supabase
        .from("leads")
        .update({ is_unsubscribed: true })
        .eq("id", leadId);

    if (error) {
        console.error("Unsubscribe error:", error);
        return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
    }

    // Success response - could be a nice HTML page
    return new NextResponse(`
        <html>
            <head>
                <title>Unsubscribed | ResonateIQ</title>
                <style>
                    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0a0b; color: #fff; margin: 0; }
                    .card { background: #18191b; padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255,255,255,0.1); text-align: center; max-width: 400px; }
                    h1 { color: #818cf8; margin-bottom: 1rem; }
                    p { color: #9ca3af; line-height: 1.5; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Unsubscribed</h1>
                    <p>You have been removed from our outreach lists. You won't receive further automated messages from this campaign.</p>
                </div>
            </body>
        </html>
    `, {
        headers: { "Content-Type": "text/html" }
    });
}
