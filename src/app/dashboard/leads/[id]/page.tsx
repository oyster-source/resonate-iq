
import { GlassCard } from "@/components/ui/glass-card";
import { Brain, Linkedin, Mail, Shield, User } from "lucide-react";

export default function LeadDossierPage() {
    // Mock Data for UI Dev
    const lead = {
        name: "Jane Doe",
        title: "VP of Sales",
        company: "TechCorp",
        location: "San Francisco, CA",
        image: null,
        linkedin: "linkedin.com/in/janedoe",
        summary: "Senior sales leader focused on scaling outbound teams and improving data hygiene.",
        ai_dossier: {
            disc: "D (Dominance)",
            tone: "Direct & Professional",
            pain_points: [
                "SDR inefficiency and burnout",
                "Low connect rates on cold calls",
                "Unreliable contact data"
            ],
            motivations: [
                "Hitting quarterly revenue targets",
                "Automating repetitive tasks",
                "Being seen as an innovator"
            ],
            ice_breaker: "Saw your post about the shift to AI-led sales—completely agree that the human element is changing, not disappearing."
        },
        draft_email: {
            subject: "Scaling TechCorp's outbound without adding headcount",
            body: "Hi Jane,\n\nSaw your post about the shift to AI-led sales—completely agree that the human element is changing, not disappearing.\n\nKnowing you're focused on scaling revenues while keeping the team lean, I thought you'd be interested in how we're helping teams like yours automate the research phase..."
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">

            {/* Left Column: Profile (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
                <GlassCard className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/5">
                        <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{lead.name}</h2>
                    <p className="text-sm text-gray-400">{lead.title}</p>
                    <p className="text-sm text-gray-500">{lead.company}</p>

                    <div className="mt-6 flex justify-center gap-2">
                        <a href={`https://${lead.linkedin}`} target="_blank" className="p-2 bg-[#0077b5] rounded-lg hover:opacity-90 transition-opacity">
                            <Linkedin className="w-4 h-4 text-white" />
                        </a>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Enrichment Status</h3>
                    <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg w-fit text-sm border border-green-500/20">
                        <Shield className="w-4 h-4" />
                        Verified & Deep-Scanned
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
                                <span className="text-2xl font-bold text-white">{lead.ai_dossier.disc}</span>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-gray-300 border border-white/10">
                                    {lead.ai_dossier.tone}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Pain Points</h3>
                            <ul className="space-y-2">
                                {lead.ai_dossier.pain_points.map((point, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                                        <span className="text-red-400">•</span> {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Motivations</h3>
                            <div className="flex flex-wrap gap-2">
                                {lead.ai_dossier.motivations.map((m, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ice Breaker Strategy</h3>
                            <p className="text-sm text-gray-300 italic">
                                "{lead.ai_dossier.ice_breaker}"
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
                                {lead.draft_email.subject}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Body</label>
                            <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {lead.draft_email.body}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/10 bg-black/20 gap-2 flex">
                        <button className="flex-1 bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                            Approve & Send
                        </button>
                        <button className="flex-1 bg-white/5 text-white font-medium py-2 rounded-lg hover:bg-white/10 transition-colors text-sm border border-white/10">
                            Regenerate
                        </button>
                    </div>
                </GlassCard>
            </div>

        </div>
    );
}
