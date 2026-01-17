
import { createClient } from "@/lib/supabase/server";
import { LeadsTable } from "@/components/leads/leads-table";

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Leads
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    // Fetch Active Campaigns
    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, name')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    return (
        <LeadsTable
            leads={leads || []}
            activeCampaigns={campaigns || []}
        />
    );
}
