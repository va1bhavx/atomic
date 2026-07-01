import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const DB_TYPES = [
  { id: "postgres", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  { id: "sqlite", label: "SQLite" },
  { id: "mongodb", label: "MongoDB" },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const [dbType, setDbType] = useState("postgres");
  const [formData, setFormData] = useState({
    name: "",
    host: "localhost",
    port: "5432",
    username: "postgres",
    password: "",
    database: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In actual implementation, we would test & save connection in electron store
    console.log("Saving connection:", { dbType, ...formData });
    navigate("/dashboard/structure");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary/20">
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-600" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
        {/* Back Link */}
        <div className="w-full mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to connections
          </Link>
        </div>

        {/* Title */}
        <div className="w-full space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">New Connection</h1>
          <p className="text-sm text-muted-foreground">
            Configure host, database name, and credentials to establish a secure database connection.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full bg-card border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Connection Name */}
            <div className="space-y-2">
              <label htmlFor="conn-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Connection Name
              </label>
              <Input
                id="conn-name"
                type="text"
                placeholder="My PostgreSQL Database"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-xl border bg-background"
              />
            </div>

            {/* DB Types Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Database Engine
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DB_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setDbType(type.id);
                      // Update default port based on engine
                      const portMap: Record<string, string> = {
                        postgres: "5432",
                        mysql: "3306",
                        sqlite: "",
                        mongodb: "27017",
                      };
                      setFormData((prev) => ({
                        ...prev,
                        port: portMap[type.id] || "",
                      }));
                    }}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all
                      ${dbType === type.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card hover:bg-accent hover:text-foreground"
                      }
                    `}
                  >
                    {type.label}
                    {dbType === type.id && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditionally render fields (SQLite only needs file path) */}
            {dbType === "sqlite" ? (
              <div className="space-y-2">
                <label htmlFor="sqlite-path" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Database File Path
                </label>
                <div className="flex gap-2">
                  <Input
                    id="sqlite-path"
                    type="text"
                    placeholder="/path/to/database.db"
                    value={formData.database}
                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                    required
                    className="rounded-xl border bg-background flex-1"
                  />
                  <Button type="button" variant="outline" className="rounded-xl">
                    Browse
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Host & Port */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-2">
                    <label htmlFor="host" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Host
                    </label>
                    <Input
                      id="host"
                      type="text"
                      value={formData.host}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      required
                      className="rounded-xl border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="port" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Port
                    </label>
                    <Input
                      id="port"
                      type="text"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      required
                      className="rounded-xl border bg-background"
                    />
                  </div>
                </div>

                {/* Database Name */}
                <div className="space-y-2">
                  <label htmlFor="database" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Database Name
                  </label>
                  <Input
                    id="database"
                    type="text"
                    placeholder="atomic_db"
                    value={formData.database}
                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                    required
                    className="rounded-xl border bg-background"
                  />
                </div>

                {/* Username & Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="rounded-xl border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="rounded-xl border bg-background"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-xl gap-2">
                <Database size={16} /> Save & Connect
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground bg-card">
        Atomic Database Studio • Credentials are encrypted locally
      </footer>
    </div>
  );
}
