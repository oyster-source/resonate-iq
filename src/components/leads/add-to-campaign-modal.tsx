
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { addLeadsToCampaign } from "@/app/dashboard/campaigns/actions-leads";

interface AddToCampaignModalProps {
    onClose: () => void;
    leadIds: string[];
    campaigns: { id: string; name: string }[];
    onSuccess?: () => void;
}

export function AddToCampaignModal({ onClose, leadIds, campaigns, onSuccess }: AddToCampaignModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampaignId) return;

        setIsSubmitting(true);
        const result = await addLeadsToCampaign(selectedCampaignId, leadIds);
        setIsSubmitting(false);

        if (result?.error) {
            alert(result.error);
        } else {
            if (onSuccess) onSuccess();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <GlassCard className="w-full max-w-md p-6 relative bg-[#0a0a0a] border-indigo-500/30">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Add to Campaign</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Add {leadIds.length} lead{leadIds.length !== 1 ? 's' : ''} to a sequence.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Select Campaign</label>
                            <select
                                value={selectedCampaignId}
                                onChange={(e) => setSelectedCampaignId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                required
                            >
                                <option value="" className="bg-gray-900 text-gray-400">Select a campaign...</option>
                                {campaigns.map(c => (
                                    <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {campaigns.length === 0 && (
                                <p className="text-xs text-yellow-500 mt-2">
                                    No active campaigns found. Please create one first.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedCampaignId}
                            className={cn(
                                "px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20",
                                (isSubmitting || !selectedCampaignId) && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add to Campaign"}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
