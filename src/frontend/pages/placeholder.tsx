import { useLocation } from "react-router-dom";
import { Info, HelpCircle, RefreshCw, LayoutGrid } from "lucide-react";
import { Button } from "../components/ui/button";

export default function PlaceholderPage() {
  const location = useLocation();
  const rawPath = location.pathname;

  // Format path to a clean title
  const parts = rawPath.split("/").filter(Boolean);
  const section = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "Dashboard";
  const page = parts[1]
    ? parts[1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Overview";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{section}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{page}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">{page}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            This module provides interface controls for {page.toLowerCase()} workflows, schemas, and configurations inside your database cluster.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl">
            <RefreshCw size={14} /> Refresh Data
          </Button>
          <Button size="sm" className="gap-2 rounded-xl">
            <HelpCircle size={14} /> Documentation
          </Button>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</h3>
          <p className="mt-2 text-2xl font-bold text-emerald-500">Connected</p>
          <p className="text-xs text-muted-foreground mt-1">SSL Encrypted Socket</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Workspace</h3>
          <p className="mt-2 text-2xl font-bold truncate">Production DB</p>
          <p className="text-xs text-muted-foreground mt-1">PostgreSQL v16.2</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requests Audited</h3>
          <p className="mt-2 text-2xl font-bold">1,842</p>
          <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Sync</h3>
          <p className="mt-2 text-2xl font-bold">3m ago</p>
          <p className="text-xs text-muted-foreground mt-1">Schema compare verified</p>
        </div>
      </div>

      {/* Main Content Area Box */}
      <div className="border bg-card rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-2">
          <LayoutGrid size={32} />
        </div>
        <h3 className="text-xl font-bold tracking-tight">{page} Workspace</h3>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm">
          The interactive visual designer and management controls for <span className="font-semibold">{page.toLowerCase()}</span> are being loaded. Connect to a database connection to begin.
        </p>
        <div className="inline-flex items-center gap-2 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full border">
          <Info size={14} />
          <span>Active Route: {rawPath}</span>
        </div>
      </div>
    </div>
  );
}
