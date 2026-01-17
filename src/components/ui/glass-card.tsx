
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

export function GlassCard({ children, className, intensity = "medium", ...props }: GlassCardProps) {
    const intensityStyles = {
        low: "bg-white/5 dark:bg-black/20 backdrop-blur-sm border-white/10 dark:border-white/5",
        medium: "bg-white/10 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-white/10",
        high: "bg-white/20 dark:bg-black/60 backdrop-blur-lg border-white/30 dark:border-white/20",
    };

    return (
        <div
            className={cn(
                "rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
                intensityStyles[intensity],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
