
import { GlassCard } from "@/components/ui/glass-card";
import { signup } from "../auth/actions";
import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="mt-2 text-gray-400">Join ResonateIQ today</p>
                </div>

                <GlassCard className="p-8 border-indigo-500/20 bg-black/40">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="block w-full rounded-lg bg-white/5 border border-white/10 py-2.5 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                    placeholder="Jane Doe"
                                />
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-lg bg-white/5 border border-white/10 py-2.5 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                    placeholder="you@example.com"
                                />
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full rounded-lg bg-white/5 border border-white/10 py-2.5 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            </div>
                        </div>

                        <button
                            formAction={signup}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-indigo-500/20 hover:shadow-indigo-500/40"
                        >
                            Sign up
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-400">Already have an account? </span>
                        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
