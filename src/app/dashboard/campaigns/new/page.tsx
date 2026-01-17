
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowLeft, Check, ChevronRight, Mail, LayoutTemplate, Users, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SequenceBuilder } from "@/components/campaigns/sequence-builder";
import { createCampaign } from "@/app/dashboard/campaigns/actions";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sequence: [] as any[]
    });

    const steps = [
        { id: 1, name: "Details", icon: LayoutTemplate },
        { id: 2, name: "Leads", icon: Users },
        { id: 3, name: "Sequence", icon: Mail },
        { id: 4, name: "Review", icon: Play },
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleLaunch = () => {
        startTransition(async () => {
            const result = await createCampaign({
                name: formData.name,
                description: formData.description,
                steps: formData.sequence
            });

            if (result.success) {
                router.push('/dashboard/campaigns');
            } else {
                alert("Failed to create campaign");
            }
        });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/campaigns" className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create New Campaign</h1>
                    <p className="text-gray-400 text-sm">Set up your outreach sequence in 4 steps.</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
                <div className="flex justify-between">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-[#050505] px-4">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                        isCompleted ? "bg-indigo-600 border-indigo-600 text-white" :
                                            isCurrent ? "bg-[#050505] border-indigo-500 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" :
                                                "bg-[#050505] border-white/10 text-gray-500"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                </div>
                                <span
                                    className={cn(
                                        "text-xs font-medium",
                                        isCurrent ? "text-indigo-400" : isCompleted ? "text-white" : "text-gray-500"
                                    )}
                                >
                                    {step.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <GlassCard className="p-8 min-h-[400px]">
                {currentStep === 1 && (
                    <div className="space-y-6 max-w-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. SaaS Founders Q1 Outreach"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Goal: Book demos with CTOs..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
                            />
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white">Import Leads</h3>
                        <p className="text-gray-400 mt-2 max-w-sm mx-auto">
                            You can import leads anytime. For now, let's focus on setting up the campaign structure.
                        </p>
                        <button onClick={handleNext} className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                            Skip this step &rarr;
                        </button>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6">
                        <SequenceBuilder
                            steps={formData.sequence}
                            onStepsChange={(steps) => setFormData({ ...formData, sequence: steps })}
                        />
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-white">Review & Launch</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-xs text-gray-500 uppercase tracking-widest">Campaign</span>
                                <p className="text-white font-medium mt-1">{formData.name}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-xs text-gray-500 uppercase tracking-widest">Steps</span>
                                <p className="text-white font-medium mt-1">{formData.sequence.length} steps configured</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm">
                            <p><strong>Ready to blast off?</strong> launching will save this campaign and you can start adding leads to it immediately.</p>
                        </div>
                    </div>
                )}
            </GlassCard>

            {/* Footer Actions */}
            <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1 || isPending}
                    className={cn(
                        "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                        currentStep === 1 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    Back
                </button>

                {currentStep === 4 ? (
                    <button
                        onClick={handleLaunch}
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Launch Campaign
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="bg-white text-black px-8 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        Next Step
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
