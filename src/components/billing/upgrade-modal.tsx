
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { X, Zap } from "lucide-react";

export function UpgradeModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <GlassCard className="w-full max-w-md p-6 relative bg-[#0a0a0a] border-indigo-500/30">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-indigo-500/40">
                        <Zap className="w-8 h-8 text-indigo-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Out of Credits</h2>
                    <p className="text-gray-400 mb-6">
                        You've used all your credits for this month. Upgrade to Pro to unlock unlimited AI enrichment and email generation.
                    </p>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                        Upgrade to Pro
                    </button>

                    <p className="mt-4 text-xs text-gray-500">
                        Starting at $49/mo. Cancel anytime.
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
