
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowUpRight, Plus, Target, Users, Zap } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { name: "Active Campaigns", value: "3", change: "+1", icon: Target, color: "text-blue-400" },
        { name: "Leads Enriched", value: "1,204", change: "+12%", icon: Users, color: "text-purple-400" },
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
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
                    <Plus className="w-4 h-4" />
                    New Campaign
                </button>
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
                            <span className="text-green-400 flex items-center font-medium">
                                {stat.change} <ArrowUpRight className="w-3 h-3 ml-1" />
                            </span>
                            <span className="text-gray-500 ml-2">from last week</span>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Recent Activity Mockup */}
            <section>
                <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                <GlassCard className="divide-y divide-white/5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-mono">
                                    LD
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Enriched Lead: CEO at Acme Corp</p>
                                    <p className="text-xs text-gray-500">2 minutes ago • Automated via Detective</p>
                                </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                                Success
                            </span>
                        </div>
                    ))}
                </GlassCard>
            </section>
        </div>
    );
}
