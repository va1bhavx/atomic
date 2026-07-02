import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import LandingPage from "./pages/landing";
import SetupPage from "./pages/setup/setup";
import DatabaseStructurePage from "./pages/database/database-structure";
import PlaceholderPage from "./pages/placeholder";
import { isElectron } from "./utils/isElectron";
import { WebGuard } from "./components/layout/web-guard";
import { useQuery } from "@tanstack/react-query";
import { authStorage } from "./services/auth-storage";
import { SplashScreen } from "./components/layout/SplashScreen";

function DashboardLayoutWrapper() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

function ProtectedRoute() {
  const { data: token, isLoading } = useQuery({
    queryKey: ["authToken"],
    queryFn: async () => {
      const [tokenResult] = await Promise.all([
        authStorage.getToken(),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]);
      return tokenResult;
    },
    staleTime: Infinity,
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!token) {
    return <Navigate to="/setup" replace />;
  }

  return <Outlet />;
}

function App() {
  const isWebProduction = !isElectron() && import.meta.env.PROD;

  if (isWebProduction) {
    return <WebGuard />;
  }

  return (
    <Routes>
      {/* Full Page Layouts */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/preview/webguard" element={<WebGuard />} />

      {/* Dashboard Layouts nested under /dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayoutWrapper />}>
          <Route
            index
            element={<Navigate to="/database/structure" replace />}
          />
          <Route
            path="database/structure"
            element={<DatabaseStructurePage />}
          />

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
          <Route
            path="migration/schema-compare"
            element={<PlaceholderPage />}
          />
          <Route path="migration/data-compare" element={<PlaceholderPage />} />

          <Route path="management/users" element={<PlaceholderPage />} />
          <Route path="management/roles" element={<PlaceholderPage />} />
          <Route path="management/connections" element={<PlaceholderPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/database/structure" replace />} />
    </Routes>
  );
}

export default App;
