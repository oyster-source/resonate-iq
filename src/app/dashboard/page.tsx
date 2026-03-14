import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowUpRight, Plus, Target, Users, Zap, Mail, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Stats
    const { count: activeCampaigns } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'active');

    const { count: leadsEnriched } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .not('enrichment_data', 'is', null);

    // Fetch Recent Activity (Email Logs)
    const { data: recentLogs } = await supabase
        .from('email_logs')
        .select(`
            id,
            status,
            created_at,
            subject,
            leads ( email )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    const stats = [
        { name: "Active Campaigns", value: activeCampaigns?.toString() || "0", change: "Live", icon: Target, color: "text-blue-400" },
        { name: "Leads Enriched", value: leadsEnriched?.toString() || "0", change: "+0", icon: Users, color: "text-purple-400" },
        { name: "Credits Remaining", value: "850", change: "-150", icon: Zap, color: "text-yellow-400" },
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
                    <p className="text-gray-400 mt-1">Welcome back to Command Center.</p>
                </div>
                <Link href="/dashboard/campaigns" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
                    <Plus className="w-4 h-4" />
                    New Campaign
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <GlassCard key={stat.name} className="p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon className="w-24 h-24" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-indigo-400 flex items-center font-medium">
                                {stat.change}
                            </span>
                            <span className="text-gray-500 ml-2">status</span>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Recent Activity Section */}
            <section>
                <h2 className="text-lg font-semibold text-white mb-4">Recent Outreach Activity</h2>
                <GlassCard className="divide-y divide-white/5 min-h-[100px]">
                    {(!recentLogs || recentLogs.length === 0) ? (
                        <div className="p-10 text-center text-gray-500">
                            No recent activity found. Start a campaign to see results here.
                        </div>
                    ) : (
                        recentLogs.map((log: any) => (
                            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white line-clamp-1">
                                            {log.status === 'sent' ? 'Email Sent' : 'Delivery Failed'}: {log.subject || 'No Subject'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })} • {log.leads?.email || 'Unknown Lead'}
                                        </p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border",
                                    log.status === 'sent' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                    {log.status === 'sent' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                    {log.status.toUpperCase()}
                                </div>
                            </div>
                        ))
                    )}
                </GlassCard>
            </section>
        </div>
    );
}
