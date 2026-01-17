
"use client";

import { useTransition } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { sendTestEmail, runCampaignProcessor } from "./actions";
import { Mail, Send } from "lucide-react";

export default function EmailTestPage() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await sendTestEmail(formData);
            if (result.error) {
                alert(`Error: ${result.error}`);
            } else {
                alert("Email sent successfully!");
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Mail className="w-8 h-8 text-indigo-400" />
                    Email Test Lab
                </h1>
                <p className="text-gray-400 mt-1">Send a test email using Resend to verify your configuration.</p>
            </div>

            <GlassCard className="p-8 border-indigo-500/20">
                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="to" className="block text-sm font-medium text-gray-300">
                            Recipient Email (To)
                        </label>
                        <input
                            type="email"
                            name="to"
                            id="to"
                            required
                            placeholder="you@example.com"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 py-2.5 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            id="subject"
                            required
                            defaultValue="Test from ResonateIQ"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 py-2.5 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                            Message
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            rows={4}
                            required
                            defaultValue="Hello! This is a test email sent from the ResonateIQ dashboard."
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 py-2.5 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Test Email</>}
                    </button>
                </form>
            </GlassCard>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-sm">
                <strong>Note:</strong> Ensure you have verified the &quot;From&quot; domain in Resend or use &apos;onboarding@resend.dev&apos; for testing.
            </div>

            <GlassCard className="p-8 border-green-500/20">
                <h2 className="text-xl font-bold text-white mb-2">Manual Campaign Trigger</h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Manually run the campaign engine to process due steps.
                    This bypasses Cron job limitations on free plans.
                </p>
                <form action={async () => {
                    const result = await runCampaignProcessor();
                    if (result.error) alert(result.error);
                    else alert(`Processed ${result.processed} actions.`);
                }}>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-green-500/20 disabled:opacity-50"
                    >
                        Run Campaign Engine Now
                    </button>
                </form>
            </GlassCard>
        </div>
    );
}
