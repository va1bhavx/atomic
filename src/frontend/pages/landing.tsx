import { Link } from "react-router-dom";
import { Database, Plus, ArrowRight, Shield, Activity, Zap } from "lucide-react";
import { Button } from "../components/ui/button";

const MOCK_CONNECTIONS = [
  {
    id: "1",
    name: "Production PostgreSQL",
    type: "PostgreSQL",
    host: "db.atomic.internal",
    status: "online",
  },
  {
    id: "2",
    name: "Staging MySQL",
    type: "MySQL",
    host: "staging-mysql.atomic.internal",
    status: "online",
  },
  {
    id: "3",
    name: "Analytics SQLite",
    type: "SQLite",
    host: "local-file://analytics.db",
    status: "offline",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary/20">
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-600" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {/* Logo and Hero Header */}
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-card border shadow-md mb-2">
            <img src="/icons/atomic-logo.webp" alt="Atomic Logo" className="w-14 h-14" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            Atomic Database Workspace
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Design schema, generate mock data, migration comparison, and automate database workflows with AI assistance.
          </p>
        </div>

        {/* Action / Grid Section */}
        <div className="grid gap-6 md:grid-cols-3 w-full mb-10">
          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <h3 className="font-semibold text-lg">Secure By Design</h3>
              <p className="text-sm text-muted-foreground">
                Local-first operations. Credentials are encrypted and kept offline on your device.
              </p>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <h3 className="font-semibold text-lg">AI Seeding & MCP</h3>
              <p className="text-sm text-muted-foreground">
                Populate schemas in seconds with LLM seeders or inspect with MCP agents.
              </p>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Activity size={20} />
              </div>
              <h3 className="font-semibold text-lg">Schema Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Compare databases, generate migration scripts, and audit schemas effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Saved Connections Section */}
        <div className="w-full bg-card border rounded-2xl p-6 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Saved Connections</h2>
              <p className="text-sm text-muted-foreground">Select a connection to launch workspace</p>
            </div>
            <Link to="/setup">
              <Button size="sm" className="gap-2 rounded-xl">
                <Plus size={16} /> New Connection
              </Button>
            </Link>
          </div>

          <div className="divide-y">
            {MOCK_CONNECTIONS.map((conn) => (
              <div
                key={conn.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Database size={18} />
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {conn.name}
                      <span
                        className={`w-2 h-2 rounded-full ${
                          conn.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">{conn.host} • {conn.type}</div>
                  </div>
                </div>

                <Link to="/dashboard/structure">
                  <Button variant="ghost" size="sm" className="gap-1 rounded-xl">
                    Connect <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground bg-card">
        Atomic Database Studio • Version 1.0.0 (Beta) • Local Only
      </footer>
    </div>
  );
}
