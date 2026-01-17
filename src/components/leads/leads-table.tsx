
"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { LeadImportModal } from "@/components/leads/lead-import-modal";
import { AddToCampaignModal } from "@/components/leads/add-to-campaign-modal";
import { Building2, Filter, Link as LinkIcon, MoreVertical, Search, Shield, ShieldAlert, ShieldCheck, Mail, CheckSquare, Square, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Lead = {
    id: string;
    // enrichment_data is JSONB, so we need to access fields safely or type it loosely
    enrichment_data: any;
    email: string | null;
    linkedin_url: string;
    status: string;
    campaign_name?: string; // We might join this? or just show "Assigned"
};

type Campaign = {
    id: string;
    name: string;
};

interface LeadsTableProps {
    leads: Lead[];
    activeCampaigns: Campaign[];
}

export function LeadsTable({ leads, activeCampaigns }: LeadsTableProps) {
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isAddToCampaignOpen, setIsAddToCampaignOpen] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

    const toggleSelectAll = () => {
        if (selectedLeads.size === leads.length) {
            setSelectedLeads(new Set());
        } else {
            setSelectedLeads(new Set(leads.map(l => l.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedLeads);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedLeads(newSelected);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Lead Management</h1>
                    <p className="text-gray-400 mt-1">View and manage your prospecting lists.</p>
                </div>
                <div className="flex gap-2">
                    {selectedLeads.size > 0 && (
                        <button
                            onClick={() => setIsAddToCampaignOpen(true)}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20 animate-in fade-in slide-in-from-right-4"
                        >
                            <Play className="w-4 h-4" />
                            Add to Campaign ({selectedLeads.size})
                        </button>
                    )}
                    <button
                        onClick={() => setIsImportOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Building2 className="w-4 h-4" />
                        Import Leads
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search leads by name, company, or email..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Filter className="w-4 h-4" />
                    All Statuses
                </button>
            </div>

            <GlassCard className="overflow-hidden min-h-[400px]">
                {leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Building2 className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white">No leads yet</h3>
                        <p className="text-gray-400 mt-1 max-w-sm">Import your first batch of leads to start outreach.</p>
                        <button
                            onClick={() => setIsImportOpen(true)}
                            className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                            Import Now &rarr;
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-400">
                                    <th className="px-6 py-4 font-medium w-10">
                                        <button onClick={toggleSelectAll} className="flex items-center text-gray-400 hover:text-white">
                                            {selectedLeads.size === leads.length && leads.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 font-medium">Name & Title</th>
                                    <th className="px-6 py-4 font-medium">Company</th>
                                    <th className="px-6 py-4 font-medium">Email Status</th>
                                    <th className="px-6 py-4 font-medium">LinkedIn</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leads.map((lead) => {
                                    const enrichment = lead.enrichment_data || {};
                                    const name = `${enrichment.first_name || ''} ${enrichment.last_name || ''}`.trim() || 'Unknown Lead';
                                    const title = enrichment.title || 'Unknown Title';
                                    const company = enrichment.company || 'Unknown Company';

                                    return (
                                        <tr key={lead.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <button onClick={() => toggleSelect(lead.id)} className={cn("flex items-center", selectedLeads.has(lead.id) ? "text-indigo-400" : "text-gray-600 group-hover:text-gray-400")}>
                                                    {selectedLeads.has(lead.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{name}</p>
                                                    <p className="text-xs text-gray-500">{title}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-400">
                                                        {company.charAt(0)}
                                                    </div>
                                                    <span className="text-gray-300">{company}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {/* Logic for status icon... mocking for now as we don't strictly have email verification status yet */}
                                                    {lead.email ? <ShieldCheck className="w-4 h-4 text-green-400" /> : <ShieldAlert className="w-4 h-4 text-gray-600" />}
                                                    <span className={`text-sm ${lead.email ? "text-gray-300" : "text-gray-600"}`}>
                                                        {lead.email || "No Email"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {lead.linkedin_url && (
                                                    <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                                        <LinkIcon className="w-3 h-3" /> Profile
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-500 hover:text-white transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassCard>

            {isImportOpen && <LeadImportModal onClose={() => setIsImportOpen(false)} />}

            {isAddToCampaignOpen && (
                <AddToCampaignModal
                    onClose={() => setIsAddToCampaignOpen(false)}
                    leadIds={Array.from(selectedLeads)}
                    campaigns={activeCampaigns}
                    onSuccess={() => setSelectedLeads(new Set())}
                />
            )}
        </div>
    );
}
