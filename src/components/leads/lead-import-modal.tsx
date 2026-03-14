
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { X, Upload, Check, FileText, Clipboard, AlertCircle } from "lucide-react";
import { addLeads } from "@/app/dashboard/leads/actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Papa from "papaparse";

export function LeadImportModal({ onClose }: { onClose: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mode, setMode] = useState<"paste" | "csv">("paste");
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvStats, setCsvStats] = useState<{ count: number; columns: string[] } | null>(null);
    const [pasteText, setPasteText] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCsvFile(file);
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                preview: 5, // Just to check columns quickly
                complete: (results) => {
                    setCsvStats({
                        count: 0, // We'll get real count on submit or full parse, but for now let's just show columns
                        columns: results.meta.fields || []
                    });
                    // Do a quick full count estimate if needed, or just parse fully now
                    Papa.parse(file, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (fullResults) => {
                            setCsvStats({
                                count: fullResults.data.length,
                                columns: fullResults.meta.fields || []
                            });
                        }
                    });
                }
            });
        }
    };

    const normalizeData = (data: any[]) => {
        return data.map(row => {
            // Flexible matching for common column names
            const get = (keys: string[]) => {
                const rowKeys = Object.keys(row);
                const matchingKey = rowKeys.find(rk =>
                    keys.some(k => rk.toLowerCase().trim() === k.toLowerCase().trim())
                );
                return matchingKey ? row[matchingKey] : undefined;
            };

            return {
                linkedin_url: get(['linkedin_url', 'linkedin', 'url', 'profile', 'profile_url', 'LinkedIn URL']),
                email: get(['email', 'Email', 'e-mail']),
                first_name: get(['first_name', 'firstName', 'First Name', 'First name']),
                last_name: get(['last_name', 'lastName', 'Last Name', 'Last name']),
                company: get(['company', 'Company', 'company_name']),
                title: get(['title', 'Title', 'Job Title'])
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        let leadsData: any[] = [];

        if (mode === "paste") {
            const urls = pasteText.split('\n').map(u => u.trim()).filter(u => u.length > 0);
            leadsData = urls.map(url => ({ linkedin_url: url }));
        } else if (mode === "csv" && csvFile) {
            await new Promise<void>((resolve) => {
                Papa.parse(csvFile, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        leadsData = normalizeData(results.data as any[]);
                        resolve();
                    }
                });
            });
        }

        formData.append("leads", JSON.stringify(leadsData));

        const result = await addLeads(formData);

        setIsSubmitting(false);
        if (result?.success) {
            onClose();
        } else {
            alert(result?.error || "Failed to import");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <GlassCard className="w-full max-w-lg p-6 relative bg-[#0a0a0a] border-indigo-500/30">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Upload className="w-5 h-5 text-indigo-400" />
                        Import Leads
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Add leads to your campaign for enrichment and outreach.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-white/10">
                    <button
                        onClick={() => setMode("paste")}
                        className={cn(
                            "pb-2 text-sm font-medium transition-colors flex items-center gap-2",
                            mode === "paste" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Clipboard className="w-4 h-4" /> Paste URLs
                    </button>
                    <button
                        onClick={() => setMode("csv")}
                        className={cn(
                            "pb-2 text-sm font-medium transition-colors flex items-center gap-2",
                            mode === "csv" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-white"
                        )}
                    >
                        <FileText className="w-4 h-4" /> Upload CSV
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === "paste" && (
                        <textarea
                            value={pasteText}
                            onChange={(e) => setPasteText(e.target.value)}
                            className="w-full h-48 bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-mono"
                            placeholder={"https://linkedin.com/in/jeff-bezos\nhttps://linkedin.com/in/satya-nadella"}
                            autoFocus
                        />
                    )}

                    {mode === "csv" && (
                        <div className="h-48 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center p-6 text-center hover:bg-white/5 transition-all relative">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {csvFile ? (
                                <div className="space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <p className="font-medium text-white">{csvFile.name}</p>
                                    {csvStats && (
                                        <p className="text-xs text-gray-400">
                                            ~{csvStats.count} leads found
                                            {csvStats.columns.length > 0 && ` • Cols: ${csvStats.columns.slice(0, 3).join(", ")}...`}
                                        </p>
                                    )}
                                    <p className="text-xs text-indigo-400">Click to replace</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium">Click to upload or drag CSV</p>
                                    <p className="text-xs text-gray-500 mt-1">Supports: URL, Email, Name, Company</p>
                                </>
                            )}
                        </div>
                    )}

                    {mode === "paste" && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> One URL per line
                        </div>
                    )}

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
                            disabled={isSubmitting || (mode === "paste" && !pasteText) || (mode === "csv" && !csvFile)}
                            className={cn(
                                "px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20",
                                (isSubmitting || (mode === "paste" && !pasteText) || (mode === "csv" && !csvFile)) && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? "Importing..." : <><Check className="w-4 h-4" /> Import {mode === 'csv' && csvStats ? csvStats.count : ''} Leads</>}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}
