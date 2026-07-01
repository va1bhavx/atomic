import { useState } from "react";
import { AtomicSidebar } from "./sidebar";
import { DashboardHeader } from "./header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AtomicSidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1800px] ">{children}</div>
        </main>
      </div>
    </div>
  );
}
