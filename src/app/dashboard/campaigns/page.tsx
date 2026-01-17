
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Plus, Search, Filter, MoreVertical, Play, Pause, CheckCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";

export default async function CampaignsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Fetch campaigns
    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Campaigns</h1>
                    <p className="text-gray-400 mt-1">Manage and monitor your outreach sequences.</p>
                </div>
                <Link
                    href="/dashboard/campaigns/new"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4" />
                    New Campaign
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            <GlassCard className="overflow-hidden min-h-[400px]">
                {!campaigns || campaigns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white">No campaigns yet</h3>
                        <p className="text-gray-400 mt-1 max-w-sm">Create your first outreach campaign to start generating leads.</p>
                        <Link
                            href="/dashboard/campaigns/new"
                            className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                            Start a Campaign &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-400">
                                    <th className="px-6 py-4 font-medium">Campaign Name</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Created</th>
                                    <th className="px-6 py-4 font-medium">Sent (Mock)</th>
                                    <th className="px-6 py-4 font-medium">Open Rate (Mock)</th>
                                    <th className="px-6 py-4 font-medium">Reply Rate (Mock)</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-white">{campaign.name}</div>
                                                {campaign.description && (
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{campaign.description}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${campaign.status === "active"
                                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                    : campaign.status === "paused"
                                                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                        : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                                    }`}
                                            >
                                                {campaign.status === "active" && <Play className="w-3 h-3" />}
                                                {campaign.status === "paused" && <Pause className="w-3 h-3" />}
                                                {campaign.status === "completed" && <CheckCircle className="w-3 h-3" />}
                                                {campaign.status === "draft" && <Pause className="w-3 h-3" />}
                                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                                        </td>
                                        {/* Mock Data for stats until we have a real sending engine */}
                                        <td className="px-6 py-4 text-gray-300">0</td>
                                        <td className="px-6 py-4 text-gray-300">0%</td>
                                        <td className="px-6 py-4 text-gray-300">0%</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-500 hover:text-white transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
