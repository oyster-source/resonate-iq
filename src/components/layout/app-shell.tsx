
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    Send,
    LayoutDashboard,
    Settings,
    Menu,
    X,
    Search,
    Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();

    const navigation = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Campaigns", href: "/dashboard/campaigns", icon: Send },
        { name: "Leads", href: "/dashboard/leads", icon: Users },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-black/95 border-r border-white/10 transition-transform duration-300 md:relative md:translate-x-0",
                    !isSidebarOpen && "-translate-x-full md:hidden"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        ResonateIQ
                    </span>
                </div>

                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden text-gray-400 hover:text-white"
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="relative hidden sm:block">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
                            />
                        </div>
                        <button className="text-gray-400 hover:text-white relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold ring-2 ring-white/20">
                            JD
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
