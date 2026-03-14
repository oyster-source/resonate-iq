
"use client";

import { useTransition, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { sendTestEmail, runCampaignProcessor } from "./actions";
import { Mail, Send, Play, Terminal } from "lucide-react";

export default function EmailTestPage() {
    const [isPending, startTransition] = useTransition();
    const [logs, setLogs] = useState<string[]>([]);
    const [lastResult, setLastResult] = useState<any>(null);

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            addLog("Sending test email...");
            const result = await sendTestEmail(formData);
            if (result.error) {
                addLog(`❌ Error: ${result.error}`);
            } else {
                addLog(`✅ Email sent successfully! ID: ${result.data?.id}`);
            }
        });
    };

    const handleRunEngine = () => {
        startTransition(async () => {
            addLog("Running campaign engine...");
            const result = await runCampaignProcessor();
            if (result.error) {
                addLog(`❌ Engine Error: ${result.error}`);
            } else {
                setLastResult(result);
                addLog(`✅ Engine finished. Processed: ${result.processed}`);
                if (result.details && result.details.length > 0) {
                    result.details.forEach((d: any) => {
                        addLog(`  - ${d.action}: ${d.lead || d.subject}`);
                    });
                } else if (result.success && !result.processed) {
                    addLog("  - No actions pending.");
                }
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Mail className="w-8 h-8 text-indigo-400" />
                    Email Test Lab
                </h1>
                <p className="text-gray-400 mt-1">Send a test email using Resend to verify your configuration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Actions */}
                <div className="space-y-8">
                    <GlassCard className="p-6 border-indigo-500/20">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Send className="w-4 h-4 text-indigo-400" /> Single Test Send
                        </h2>
                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="to" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Recipient
                                </label>
                                <input
                                    type="email"
                                    name="to"
                                    required
                                    placeholder="you@example.com"
                                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 py-2 px-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    defaultValue="Test from ResonateIQ"
                                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 py-2 px-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={3}
                                    required
                                    defaultValue="Hello! This is a test email sent from the ResonateIQ dashboard."
                                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 py-2 px-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                            >
                                {isPending ? "Starting..." : "Send Test Email"}
                            </button>
                        </form>
                    </GlassCard>

                    <GlassCard className="p-6 border-green-500/20">
                        <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            <Play className="w-4 h-4 text-green-400" /> Campaign Engine
                        </h2>
                        <p className="text-gray-400 mb-4 text-xs">
                            Manually trigger the background job to process due steps.
                        </p>
                        <button
                            onClick={handleRunEngine}
                            disabled={isPending}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                        >
                            Run Campaign Engine Now
                        </button>
                    </GlassCard>
                </div>

                {/* Right Column: Logs */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-white">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-gray-400" /> Output Log
                        </h2>
                        <button onClick={() => setLogs([])} className="text-xs text-gray-500 hover:text-white">
                            Clear
                        </button>
                    </div>

                    <div className="bg-black/40 rounded-lg border border-white/10 p-4 h-[500px] overflow-y-auto font-mono text-sm">
                        {logs.length === 0 ? (
                            <div className="text-gray-600 italic text-center mt-20">No commands executed yet.</div>
                        ) : (
                            <div className="space-y-2">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-gray-300 border-b border-white/5 pb-1 last:border-0 break-words">
                                        <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                        {log}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

