import {
  Database,
  Sparkles,
  Shield,
  Bot,
  ArrowLeftRight,
  Users,
  Settings,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { SidebarFooter, SidebarHeader } from "../ui/sidebar";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

interface SidebarItem {
  label: string;
  path: string;
}

interface AtomicSidebarProps {
  collapsed: boolean;
}

export function AtomicSidebar({ collapsed }: AtomicSidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <aside
      className={`
        border-r border-border-primary bg-card flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-13.75" : "w-[220px]"}
      `}
    >
      <SidebarHeader className="border-b border-border-primary flex items-start p-0! m-0! ">
        <div className="flex items-center">
          <div className="flex items-center justify-center ">
            <img
              src="/icons/atomic-logo.webp"
              alt="Atomic Logo"
              width={55}
              height={55}
            />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-foreground">Atomic</h2>
            </div>
          )}
        </div>
      </SidebarHeader>

      <div
        className={`
          flex-1 p-3
          ${collapsed ? "overflow-visible" : "overflow-y-auto"}
        `}
      >
        <SidebarSection
          icon={<Database size={18} />}
          title="Database"
          defaultOpen
          items={[
            { label: "Structure", path: "/dashboard/database/structure" },
            { label: "Preview Data", path: "/dashboard/database/preview" },
            { label: "Dependencies", path: "/dashboard/database/dependencies" },
            { label: "Run Query", path: "/dashboard/database/query" },
            { label: "ER Diagram", path: "/dashboard/database/er-diagram" },
            { label: "Schema", path: "/dashboard/database/schema" },
          ]}
          collapsed={collapsed}
        />

        <SidebarSection
          icon={<Sparkles size={18} />}
          title="Seeder"
          items={[
            { label: "Generate Data", path: "/dashboard/seeder/generate" },
            { label: "Run Seeders", path: "/dashboard/seeder/run" },
          ]}
          collapsed={collapsed}
        />

        <SidebarSection
          icon={<Shield size={18} />}
          title="Audit"
          items={[
            { label: "Logs", path: "/dashboard/audit/logs" },
            { label: "Configure", path: "/dashboard/audit/configure" },
            { label: "Reports", path: "/dashboard/audit/reports" },
          ]}
          collapsed={collapsed}
        />

        <SidebarSection
          icon={<Bot size={18} />}
          title="MCP"
          items={[
            { label: "Chat", path: "/dashboard/mcp/chat" },
            { label: "Agents", path: "/dashboard/mcp/agents" },
            { label: "Tools", path: "/dashboard/mcp/tools" },
          ]}
          collapsed={collapsed}
        />

        <SidebarSection
          icon={<ArrowLeftRight size={18} />}
          title="Migration"
          items={[
            { label: "Source → Target", path: "/dashboard/migration/sync" },
            {
              label: "Schema Compare",
              path: "/dashboard/migration/schema-compare",
            },
            {
              label: "Data Compare",
              path: "/dashboard/migration/data-compare",
            },
          ]}
          collapsed={collapsed}
        />

        <SidebarSection
          icon={<Users size={18} />}
          title="Management"
          items={[
            { label: "Users", path: "/dashboard/management/users" },
            { label: "Roles", path: "/dashboard/management/roles" },
            { label: "Connections", path: "/dashboard/management/connections" },
          ]}
          collapsed={collapsed}
        />
      </div>

      <SidebarFooter className="border-t border-border-primary p-2 flex flex-col gap-1">
        <Button
          variant={"ghost"}
          className={`
           w-full justify-start gap-3 rounded-xl px-2 py-2
           ${collapsed ? "justify-center" : ""}
         `}
        >
          <Settings size={18} />

          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </Button>

        <Button
          variant={"ghost"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`
           w-full justify-start gap-3 rounded-xl px-2 py-2
           ${collapsed ? "justify-center" : ""}
         `}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}

          {!collapsed && (
            <span className="font-medium text-sm">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </Button>
      </SidebarFooter>
    </aside>
  );
}

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  items: SidebarItem[];
  defaultOpen?: boolean;
  collapsed?: boolean;
}

function SidebarSection({
  title,
  icon,
  items,
  defaultOpen,
  collapsed,
}: SidebarSectionProps) {
  return (
    <div className="relative group/section">
      <Collapsible
        open={collapsed ? false : undefined}
        defaultOpen={defaultOpen}
      >
        <CollapsibleTrigger
          className={`
          group
          mb-1
          flex
          items-center
          rounded-xl
          px-2
          py-2
          hover:bg-accent
          w-full
          ${collapsed ? "justify-center" : "justify-between"}
        `}
        >
          <div className="flex items-center gap-3">
            {icon}

            {!collapsed && <span className="font-medium text-sm">{title}</span>}
          </div>

          {!collapsed && (
            <ChevronDown
              size={16}
              className="
                transition-transform
                group-data-[state=open]:rotate-180
              "
            />
          )}
        </CollapsibleTrigger>

        {!collapsed && (
          <CollapsibleContent>
            <div className="ml-7 mb-2 flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    text-muted-foreground
                    transition-colors
                    hover:bg-accent
                    hover:text-foreground
                  "
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  {item.label}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>

      {collapsed && (
        <div className="absolute left-full top-0 pl-2 hidden group-hover/section:block z-50">
          <div className="flex flex-col bg-card border rounded-xl shadow-lg  min-w-[180px]">
            <div className="px-3 py-2 font-semibold text-xs border-b mb-1 text-foreground flex items-center gap-2">
              {icon}
              <p>{title}</p>
            </div>
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  text-muted-foreground
                  transition-colors
                  hover:bg-accent
                  hover:text-foreground
                  whitespace-nowrap
                "
              >
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
