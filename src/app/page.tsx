import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-zinc-800">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
            <span className="text-lg font-bold tracking-tight">ResonateIQ</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 backdrop-blur-sm">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
            AI-Powered Sales Intelligence
          </div>

          <h1 className="mb-8 text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Deep Psychological Dossiers <br />
            from just a LinkedIn URL.
          </h1>

          <p className="mb-12 text-lg text-zinc-400 sm:text-xl max-w-2xl mx-auto">
            Transform raw leads into hyper-personalized outreach. Automate your research,
            enrichment, and email sequencing with ResonateIQ.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="h-12 w-full sm:w-auto rounded-full bg-white px-8 flex items-center justify-center text-sm font-semibold text-black hover:bg-zinc-200 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="h-12 w-full sm:w-auto rounded-full border border-white/10 bg-white/5 px-8 flex items-center justify-center text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              Live Demo
            </Link>
          </div>
        </div>

        {/* Feature Grid Mockup */}
        <div className="mt-24 w-full max-w-6xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-2xl backdrop-blur-sm ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-mono text-sm">
              [Dashboard Preview Placeholder]
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-black py-12">
        <div className="container mx-auto px-6 text-center text-sm text-zinc-600">
          <p>© 2024 ResonateIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
