
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Clock, Mail, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Variant = {
    id: string;
    name: string;
    subject: string;
    body: string;
};

export type Step = {
    id: string;
    type: "email" | "delay";
    variants?: Variant[];
    delayDays?: number;
};

interface SequenceBuilderProps {
    steps: Step[];
    onStepsChange: (steps: Step[]) => void;
}

export function SequenceBuilder({ steps, onStepsChange }: SequenceBuilderProps) {

    const addStep = (type: "email" | "delay") => {
        const newStep: Step = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            ...(type === "email" ? {
                variants: [{ id: Math.random().toString(36).substr(2, 9), name: "Variant A", subject: "", body: "" }]
            } : {
                delayDays: 2
            })
        };
        onStepsChange([...steps, newStep]);
    };

    const removeStep = (id: string) => {
        onStepsChange(steps.filter(s => s.id !== id));
    };

    const updateStep = (id: string, updates: Partial<Step>) => {
        onStepsChange(steps.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addVariant = (stepId: string) => {
        onStepsChange(steps.map(s => {
            if (s.id === stepId && s.variants) {
                const variantLabel = String.fromCharCode(65 + s.variants.length); // A, B, C...
                return {
                    ...s,
                    variants: [
                        ...s.variants,
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            name: `Variant ${variantLabel}`,
                            subject: "",
                            body: ""
                        }
                    ]
                };
            }
            return s;
        }));
    };

    const updateVariant = (stepId: string, variantId: string, field: keyof Variant, value: string) => {
        onStepsChange(steps.map(s => {
            if (s.id === stepId && s.variants) {
                return {
                    ...s,
                    variants: s.variants.map(v => v.id === variantId ? { ...v, [field]: value } : v)
                };
            }
            return s;
        }));
    };

    const removeVariant = (stepId: string, variantId: string) => {
        onStepsChange(steps.map(s => {
            if (s.id === stepId && s.variants && s.variants.length > 1) {
                return {
                    ...s,
                    variants: s.variants.filter(v => v.id !== variantId)
                };
            }
            return s;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Sequence Steps</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => addStep("email")}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-sm font-medium flex items-center gap-2 transition-colors border border-indigo-500/20"
                    >
                        <Mail className="w-4 h-4" /> Add Email
                    </button>
                    <button
                        onClick={() => addStep("delay")}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-sm font-medium flex items-center gap-2 transition-colors border border-white/10"
                    >
                        <Clock className="w-4 h-4" /> Add Wait
                    </button>
                </div>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:w-0.5 before:bg-white/10 before:left-8 before:-z-10">
                {steps.map((step, index) => (
                    <div key={step.id} className="relative flex gap-4">
                        {/* Connector Icon */}
                        <div className="w-16 flex-shrink-0 flex flex-col items-center pt-6">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-[#050505]",
                                step.type === "email" ? "border-indigo-500 text-indigo-400" : "border-gray-600 text-gray-500"
                            )}>
                                {step.type === "email" ? <Mail className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            {index < steps.length - 1 && <div className="flex-1 w-0.5 bg-white/10 my-2" />}
                        </div>

                        {/* Step Card */}
                        <GlassCard className="flex-1 p-0 overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-white">
                                        Step {index + 1}: {step.type === 'email' ? 'Email' : 'Wait'}
                                    </span>
                                </div>
                                <button onClick={() => removeStep(step.id)} className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors">
                                    <Trash2 className="w-3 h-3" /> Remove
                                </button>
                            </div>

                            <div className="p-4">
                                {step.type === "email" && step.variants && (
                                    <div className="space-y-4">
                                        {/* Variant Tabs */}
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                                            {step.variants.map((variant) => (
                                                <div key={variant.id} className="relative group">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 border border-white/10">
                                                        <span>{variant.name}</span>
                                                        {step.variants!.length > 1 && (
                                                            <button
                                                                onClick={() => removeVariant(step.id, variant.id)}
                                                                className="hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addVariant(step.id)}
                                                className="px-2 py-1 rounded-lg text-xs text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-1 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" /> Add Variant
                                            </button>
                                        </div>

                                        {/* Edit Area (Just showing first variant logic for now to keep it simple, ideally we'd track 'activeVariantId') */}
                                        {step.variants.map((variant, vIndex) => (
                                            <div key={variant.id} className={cn("space-y-3", vIndex !== 0 && "pt-4 border-t border-white/5")}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{variant.name}</span>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={variant.subject}
                                                        onChange={(e) => updateVariant(step.id, variant.id, "subject", e.target.value)}
                                                        placeholder={`Subject for ${variant.name}`}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <textarea
                                                        rows={4}
                                                        value={variant.body}
                                                        onChange={(e) => updateVariant(step.id, variant.id, "body", e.target.value)}
                                                        placeholder={`Hi {{firstName}}, I saw that {{companyName}} is...`}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {step.type === "delay" && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-300">Wait for</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={step.delayDays}
                                            onChange={(e) => updateStep(step.id, { delayDays: parseInt(e.target.value) || 0 })}
                                            className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-center text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-300">days</span>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                ))}
            </div>

            {steps.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500">No steps in sequence. Add an email to start.</p>
                </div>
            )}
        </div>
    );
}
