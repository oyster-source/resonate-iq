import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Brain, Linkedin, Mail, Shield, User, MapPin, Building2, ExternalLink } from "lucide-react";
import { DossierActions } from "@/components/leads/dossier-actions";
import { cn } from "@/lib/utils";

interface PageProps {
    params: { id: string };
}

export default async function LeadDossierPage({ params }: PageProps) {
    const supabase = await createClient();
    const leadId = params.id;

    const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

    if (error || !lead) {
        notFound();
    }

    const enrichment = lead.enrichment_data || {};
    const name = enrichment.first_name ? `${enrichment.first_name} ${enrichment.last_name || ''}` : lead.email;
    const title = enrichment.title || "Proprietor / Leader";
    const company = enrichment.company_name || enrichment.company || "Your Company";

    // Derived AI Dossier (or fallbacks)
    const ai_dossier = {
        disc: enrichment.disc_profile || "Analyzing...",
        tone: enrichment.personality_tone || "Professional",
        pain_points: enrichment.pain_points || ["Analyzing market fit...", "Incomplete enrichment data"],
        motivations: enrichment.motivations || ["Scaling operations"],
        ice_breaker: enrichment.ice_breaker || `Saw your work at ${company}—impressive trajectory.`
    };

    const draft = enrichment.email_draft || {
        subject: "Quick question regarding " + company,
        body: `Hi ${enrichment.first_name || 'there'},\n\nI noticed your work at ${company} and wanted to reach out...\n\nBest,\n[Your Name]`
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-fit lg:h-[calc(100vh-8rem)]">

            {/* Left Column: Profile (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
                <GlassCard className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/5 overflow-hidden">
                        {enrichment.avatar_url ? (
                            <img src={enrichment.avatar_url} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-white line-clamp-1">{name}</h2>
                    <p className="text-sm text-gray-400 line-clamp-1">{title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{company}</p>

                    <div className="mt-6 flex justify-center gap-2">
                        {lead.linkedin_url && (
                            <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0077b5] rounded-lg hover:opacity-90 transition-opacity">
                                <Linkedin className="w-4 h-4 text-white" />
                            </a>
                        )}
                        {enrichment.website && (
                            <a href={enrichment.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all border border-white/10">
                                <ExternalLink className="w-4 h-4 text-white" />
                            </a>
                        )}
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Fit Score</h3>
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit text-sm border font-bold",
                        (lead.score || 0) >= 80 ? "text-green-400 bg-green-500/10 border-green-500/20" :
                            (lead.score || 0) >= 50 ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" :
                                "text-red-400 bg-red-500/10 border-red-500/20"
                    )}>
                        <Shield className="w-4 h-4" />
                        {lead.score ? `${lead.score}% Match` : "Not Scored"}
                    </div>
                    {lead.score_reason && (
                        <p className="text-xs text-gray-400 mt-2 italic leading-relaxed">
                            "{lead.score_reason}"
                        </p>
                    )}
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Company Metadata</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            {enrichment.location || "Location Unknown"}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Building2 className="w-3 h-3 text-gray-500" />
                            {enrichment.employee_count || "Size Unknown"}
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Middle Column: The Detective (AI Dossier) (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
                <GlassCard className="p-6 h-full border-indigo-500/30 bg-indigo-500/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-lg font-bold text-white">Psychological Dossier</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">DISC Profile</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-white">{ai_dossier.disc}</span>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-gray-300 border border-white/10">
                                    {ai_dossier.tone}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Pain Points</h3>
                            <ul className="space-y-2">
                                {ai_dossier.pain_points.map((point: string, i: number) => (
                                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                                        <span className="text-red-400">•</span> {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Motivations</h3>
                            <div className="flex flex-wrap gap-2">
                                {ai_dossier.motivations.map((m: string, i: number) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ice Breaker Strategy</h3>
                            <p className="text-sm text-gray-300 italic">
                                "{ai_dossier.ice_breaker}"
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Right Column: Drafted Sequence (4 cols) */}
            <div className="lg:col-span-4 h-full">
                <GlassCard className="p-0 h-full flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-white">Email Draft</span>
                        </div>
                        <span className="text-xs text-gray-500">Step 1 of 3</span>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Subject</label>
                            <div className="text-sm text-white font-medium border-b border-white/10 pb-2">
                                {draft.subject}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Body</label>
                            <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {draft.body}
                            </div>
                        </div>
                    </div>

                    <DossierActions leadId={leadId} hasDraft={!!enrichment.email_draft} />
                </GlassCard>
            </div>

        </div>
    );
}
