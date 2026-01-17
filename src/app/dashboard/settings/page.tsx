
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { updateProfile } from "./actions";
import { useState } from "react";
import { User, Key, CreditCard, Save, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);

    const handleProfileUpdate = async (formData: FormData) => {
        setIsSaving(true);
        await updateProfile(formData);
        setIsSaving(false);
    };

    const tabs = [
        { id: "general", label: "General", icon: User },
        { id: "keys", label: "API Keys", icon: Key },
        { id: "billing", label: "Billing", icon: CreditCard },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 text-sm">Manage your account and integrations</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                activeTab === tab.id
                                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <GlassCard className="p-8 min-h-[500px] border-indigo-500/20">
                        {activeTab === "general" && (
                            <div className="space-y-6 max-w-lg">
                                <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                                <form action={handleProfileUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                        <input
                                            name="fullName"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Jane Doe"
                                            defaultValue="Jane Doe" // Mock default
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed"
                                            value="jane@example.com"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed manually.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2"
                                    >
                                        {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === "keys" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-6">API Integrations</h2>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#10a37f]/20 flex items-center justify-center">
                                                <div className="w-6 h-6 rounded-full bg-[#10a37f]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">OpenAI</p>
                                                <p className="text-sm text-gray-400">GPT-4o & Fine-tuning</p>
                                            </div>
                                        </div>
                                        <button className="text-sm text-indigo-400 hover:text-indigo-300">Configure</button>
                                    </div>

                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#202124]/50 flex items-center justify-center border border-white/10">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-red-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Google Gemini</p>
                                                <p className="text-sm text-gray-400">1.5 Flash Model</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-400 text-sm">
                                            <Check className="w-4 h-4" /> Connected
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "billing" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-6">Plan & Usage</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/30">
                                        <p className="text-sm text-indigo-300 font-medium mb-1">Current Plan</p>
                                        <h3 className="text-3xl font-bold text-white mb-2">Pro Plan</h3>
                                        <p className="text-gray-400 text-sm mb-6">$49/month • Renews Feb 1, 2026</p>
                                        <button className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors">Manage Subscription</button>
                                    </div>

                                    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                                        <p className="text-sm text-gray-400 font-medium mb-1">Monthly Credits</p>
                                        <div className="flex items-end gap-2 mb-2">
                                            <h3 className="text-3xl font-bold text-white">850</h3>
                                            <span className="text-gray-500 mb-1">/ 1,000</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500">Resets on Feb 1</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
