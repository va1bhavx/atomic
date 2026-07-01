import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import LandingPage from "./pages/landing";
import SetupPage from "./pages/setup";
import DatabaseStructurePage from "./pages/database/database-structure";
import PlaceholderPage from "./pages/placeholder";
import { isElectron } from "./utils/isElectron";
import { WebGuard } from "./components/layout/web-guard";

function DashboardLayoutWrapper() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

function App() {
  const isWebProduction = !isElectron() && import.meta.env.PROD;

  if (isWebProduction) {
    return <WebGuard />;
  }

  return (
    <Routes>
      {/* Full Page Layouts */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/preview/webguard" element={<WebGuard />} />

      {/* Dashboard Layouts nested under /dashboard */}
      <Route path="/dashboard" element={<DashboardLayoutWrapper />}>
        {/* Support both /dashboard/structure and /dashboard/database/structure */}
        <Route path="structure" element={<DatabaseStructurePage />} />
        <Route path="database/structure" element={<DatabaseStructurePage />} />

        <Route path="database/preview" element={<PlaceholderPage />} />
        <Route path="database/dependencies" element={<PlaceholderPage />} />
        <Route path="database/query" element={<PlaceholderPage />} />
        <Route path="database/er-diagram" element={<PlaceholderPage />} />
        <Route path="database/schema" element={<PlaceholderPage />} />

        <Route path="seeder/generate" element={<PlaceholderPage />} />
        <Route path="seeder/run" element={<PlaceholderPage />} />

        <Route path="audit/logs" element={<PlaceholderPage />} />
        <Route path="audit/configure" element={<PlaceholderPage />} />
        <Route path="audit/reports" element={<PlaceholderPage />} />

        <Route path="mcp/chat" element={<PlaceholderPage />} />
        <Route path="mcp/agents" element={<PlaceholderPage />} />
        <Route path="mcp/tools" element={<PlaceholderPage />} />

        <Route path="migration/sync" element={<PlaceholderPage />} />
        <Route path="migration/schema-compare" element={<PlaceholderPage />} />
        <Route path="migration/data-compare" element={<PlaceholderPage />} />

        <Route path="management/users" element={<PlaceholderPage />} />
        <Route path="management/roles" element={<PlaceholderPage />} />
        <Route path="management/connections" element={<PlaceholderPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
