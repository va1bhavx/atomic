import { useEffect, useState } from "react";
import { Download, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

export function WebGuard() {
  // Detect OS from UserAgent
  const getOS = () => {
    if (typeof window === "undefined") return "Windows";
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) return "macOS";
    if (userAgent.includes("linux")) return "Linux";
    return "Windows";
  };

  const activeOS = getOS();

  // Define download assets paths
  const downloadLinks: Record<string, string> = {
    Windows: "/downloads/atomic-setup.exe",
    macOS: "/downloads/atomic-setup.dmg",
    Linux: "/downloads/atomic-setup.AppImage",
  };

  const binaryNames: Record<string, string> = {
    Windows: "atomic-setup.exe",
    macOS: "atomic-setup.dmg",
    Linux: "atomic-setup.AppImage",
  };

  const platformIds: Record<string, string> = {
    Windows: "win32-x64",
    macOS: "darwin-universal",
    Linux: "linux-x86_64",
  };

  const downloadUrl = downloadLinks[activeOS];

  // Reveal terminal lines sequentially, then start the cursor blink
  const totalLines = 5;
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= totalLines) return;
    const t = setTimeout(() => setVisibleLines((n) => n + 1), 420);
    return () => clearTimeout(t);
  }, [visibleLines]);

  const specs = [
    {
      key: "KEYCHAIN",
      value:
        "Credentials stored via native macOS Keychain / Windows DPAPI, never in plaintext.",
    },
    {
      key: "SEED ENGINE",
      value:
        "Runs local mock seeders with no network bandwidth caps or proxy limits.",
    },
    {
      key: "SCHEMA SCAN",
      value:
        "Introspects SQLite files and localhost endpoints directly, no relay required.",
    },
  ];

  return (
    <div className="atomic-guard min-h-screen w-full bg-background text-[#EDEEF0] flex flex-col font-sans">
      <style>{`
        @keyframes atomic-blink { 50% { opacity: 0; } }
        @keyframes atomic-line-in {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .atomic-cursor { animation: atomic-blink 1s step-end infinite; }
        .atomic-line { animation: atomic-line-in 0.25s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .atomic-cursor, .atomic-line { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className="px-6 md:px-10 py-4 flex items-center gap-3  ">
        <img src="/icons/atomic-logo.webp" alt="" className="w-15 h-15" />
        <span className="font-semibold tracking-tight text-lg text-white/90">
          Atomic
        </span>
        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono text-white/40 border border-white/10">
          web
        </span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-10 py-12 md:py-16">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Left: copy + CTAs + spec sheet */}
          <div className="order-2 md:order-1 space-y-8">
            <div className="space-y-4">
              <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                Browser session detected
              </p>
              <h1 className="text-3xl md:text-[2.5rem] font-bold tracking-tight leading-[1.1] text-white">
                This runs better as a native app.
              </h1>
              <p className="text-[15px] text-white/50 leading-relaxed max-w-md">
                Atomic connects directly to local databases, runs seeds at
                native speed, and keeps every credential in your OS keychain —
                none of which a browser tab can do.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={downloadUrl} download>
                <Button className="w-full sm:w-auto gap-2 rounded-lg font-semibold bg-primary text-white hover:bg-amber-300 h-11 px-6">
                  <Download size={16} /> Download for {activeOS}
                </Button>
              </a>
              <a
                href="https://github.com/codethat/atomic"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto gap-2 rounded-lg font-medium h-11 px-6 border-white/15 text-white/80 hover:bg-white/5 hover:text-white"
                >
                  Documentation <ArrowRight size={14} />
                </Button>
              </a>
            </div>

            {/* Spec sheet, not icon cards */}
            <dl className="border-t border-white/[0.06] pt-5 space-y-4">
              {specs.map((s) => (
                <div key={s.key} className="flex gap-4">
                  <dt className="shrink-0 w-[104px] font-mono text-[10px] tracking-wider text-white/35 pt-0.5">
                    {s.key}
                  </dt>
                  <dd className="text-[13px] text-white/55 leading-relaxed">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: terminal signature element */}
          <div className="order-1 md:order-2">
            <div className="rounded-xl border border-white/[0.08] bg-[#0E0F12] shadow-2xl shadow-black/40 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="ml-2 font-mono text-[11px] text-white/30">
                  install.sh
                </span>
              </div>

              <div className="p-5 font-mono text-[12.5px] leading-[1.9] min-h-[220px]">
                {visibleLines > 0 && (
                  <div className="atomic-line text-white/80">
                    <span className="text-emerald-400/80">$</span> curl -sSL
                    get.atomic.dev | sh
                  </div>
                )}
                {visibleLines > 1 && (
                  <div className="atomic-line text-white/40">
                    → detecting platform...
                  </div>
                )}
                {visibleLines > 2 && (
                  <div className="atomic-line text-white/60">
                    → platform:{" "}
                    <span className="text-white/85">
                      {platformIds[activeOS]}
                    </span>
                  </div>
                )}
                {visibleLines > 3 && (
                  <div className="atomic-line text-white/60">
                    → resolving binary:{" "}
                    <span className="text-white/85">
                      {binaryNames[activeOS]}
                    </span>
                  </div>
                )}
                {visibleLines > 4 && (
                  <div className="atomic-line text-emerald-400/90">
                    ✓ ready to install
                    <span className="atomic-cursor text-white/60">▍</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-1">
              <span className="font-mono text-[10px] text-white/25 tracking-wide">
                windows (x64) · macos (universal) · linux (appimage)
              </span>
              <a
                href="https://github.com/codethat/atomic/releases"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] text-white/35 hover:text-white/60 flex items-center gap-0.5"
              >
                all releases <ArrowUpRight size={10} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
