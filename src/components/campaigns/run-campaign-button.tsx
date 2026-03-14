"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RunCampaignButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRun = async () => {
        setIsLoading(true);
        const toastId = toast.loading("Running campaign execution...");

        try {
            const response = await fetch('/api/campaigns/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}) // Run all campaigns
            });

            if (!response.ok) {
                const err = await response.json();
                toast.error("Execution failed: " + (err.error || "Unknown"), { id: toastId });
                return;
            }

            const data = await response.json();
            toast.success(`Processed ${data.processed} leads`, { id: toastId });
            router.refresh();
        } catch (error) {
            console.error("Execution error:", error);
            toast.error("Execution error", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleRun}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run Execution (Dev)
        </button>
    );
}
