import React from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Database,
  ChevronDown,
  Lock,
  Sun,
  Moon,
  User2Icon,
  FileBarChart,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface DashboardHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function DashboardHeader({
  collapsed,
  setCollapsed,
}: DashboardHeaderProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Parse path for breadcrumbs
  const parts = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = parts
    .filter((part) => part !== "dashboard")
    .map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1).replace("-", " "),
    );

  return (
    <header className="h-14 border-b border-border-primary bg-card flex items-center justify-between px-4 select-none w-full">
      {/* Left section: Toggle, Logo (if collapsed), Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 rounded-[6px]"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeftOpen
              size={18}
              className="text-muted-foreground hover:text-foreground"
            />
          ) : (
            <PanelLeftClose
              size={18}
              className="text-muted-foreground hover:text-foreground"
            />
          )}
        </Button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs font-semibold select-none">
          <span className="text-muted-foreground/80 hover:text-foreground transition-colors cursor-pointer">
            analytics-stage
          </span>
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={item}>
              <ChevronRight size={12} className="text-muted-foreground/40" />
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? "text-foreground font-bold"
                    : "text-muted-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                }
              >
                {item}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right section: Connection Selector, Env Badge, Permissions, Theme, Settings */}
      <div className="flex items-center gap-3">
        {/* Connection Selector */}
        <button className="flex items-center gap-2 border border-border-primary rounded-xl px-3 py-1.5 text-xs font-semibold bg-background hover:bg-accent text-foreground transition-colors shadow-sm cursor-pointer">
          <Database size={13} className="text-muted-foreground" />
          <span>analytics-stage</span>
          <ChevronDown size={13} className="text-muted-foreground" />
        </button>

        {/* Environment Badge */}
        <Badge
          variant="outline"
          className="rounded-[6px] px-4 py-3 border-none ring ring-border-primary"
        >
          <span className="text-[10px] uppercase font-extrabold tracking-wider">
            DEV
          </span>
        </Badge>

        <Badge
          variant="outline"
          className="rounded-[6px] border-none ring ring-border-primary  px-4 py-3"
        >
          <Lock size={10} className="text-muted-foreground/85" />
          Read-only
        </Badge>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-border border-r border-border-primary" />

        {/* Theme Toggle */}

        <Button size="icon" variant="outline" className="rounded-[6px]">
          <FileBarChart size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-[6px]"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        <Button size="icon" variant="outline" className="rounded-[6px]">
          <User2Icon size={16} />
        </Button>
      </div>
    </header>
  );
}
