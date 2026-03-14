"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DossierActionsProps {
    leadId: string;
    hasDraft: boolean;
}

export function DossierActions({ leadId, hasDraft }: DossierActionsProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRegenerate = async () => {
        setIsProcessing(true);
        const toastId = toast.loading("Regenerating AI Draft...");

        try {
            const response = await fetch('/api/leads/generate-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId })
            });

            if (!response.ok) {
                const err = await response.json();
                toast.error("Failed to regenerate: " + (err.error || "Unknown error"), { id: toastId });
                return;
            }

            toast.success("New draft generated!", { id: toastId });
            window.location.reload(); // Simple refresh for now
        } catch (error) {
            console.error("Regenerate error:", error);
            toast.error("An error occurred", { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApproveAndSend = async () => {
        setIsProcessing(true);
        const toastId = toast.loading("Sending email...");

        try {
            const response = await fetch('/api/leads/approve-and-send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId })
            });

            if (!response.ok) {
                const err = await response.json();
                toast.error("Failed to send: " + (err.error || "Unknown error"), { id: toastId });
                return;
            }

            toast.success("Email sent successfully!", { id: toastId });
        } catch (error) {
            console.error("Send error:", error);
            toast.error("An error occurred", { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-4 border-t border-white/10 bg-black/20 gap-2 flex">
            <button
                onClick={handleApproveAndSend}
                disabled={isProcessing || !hasDraft}
                className="flex-1 bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
            >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Approve & Send"}
            </button>
            <button
                onClick={handleRegenerate}
                disabled={isProcessing}
                className="flex-1 bg-white/5 text-white font-medium py-2 rounded-lg hover:bg-white/10 transition-colors text-sm border border-white/10 disabled:opacity-50"
            >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Regenerate"}
            </button>
        </div>
    );
}
