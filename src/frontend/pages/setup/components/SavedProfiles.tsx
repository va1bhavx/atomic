import { useMemo, useState } from "react";
import { Search, X, MoreVertical } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/web/custom-component/CustomInput";
import type { Environment } from "../../../types/generalTypes";

interface Profile {
  id: number;
  name: string;
  username: string;
  environment: Environment;
  engine: string;
  lastUsed: string;
}

const PROFILES: Profile[] = [
  {
    id: 1,
    name: "ecommerce-prod",
    username: "postgresdb@username.prod.internal.4502",
    environment: "prod",
    engine: "Pg",
    lastUsed: "4m ago",
  },
  {
    id: 2,
    name: "analytics-stage",
    username: "postgresdb@username.stage.internal.45043",
    environment: "stage",
    engine: "Pg",
    lastUsed: "2m ago",
  },
  {
    id: 3,
    name: "billing-mysql",
    username: "mysql@username.internal.4502",
    environment: "prod",
    engine: "My",
    lastUsed: "1hr ago",
  },
  {
    id: 4,
    name: "billing-postgres",
    username: "postgresdb@username.internal.4502",
    environment: "prod",
    engine: "Pg",
    lastUsed: "3d ago",
  },
];

export const SavedProfiles = () => {
  const [query, setQuery] = useState("");

  const filteredProfiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROFILES;
    return PROFILES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.environment.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Search profiles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        startIcon={<Search size={14} />}
        endIcon={
          query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="pointer-events-auto cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          ) : undefined
        }
      />

      {filteredProfiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No profiles match &ldquo;{query}&rdquo;.
          </p>
          <Button
            variant="ghost"
            className="text-xs cursor-pointer"
            onClick={() => setQuery("")}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 mt-1">
          {filteredProfiles.map((profile) => (
            <li
              key={profile.id}
              className="group bg-small-card ring ring-border-primary rounded-md px-4 py-5 flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-6 min-w-0">
                <span className="shrink-0 bg-card-header w-10 h-10 flex items-center justify-center rounded-md shadow-md font-mono text-[11px]">
                  {profile.engine}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-md truncate">{profile.name}</h1>
                    <Badge
                      variant={
                        profile.environment === "prod"
                          ? "destructive"
                          : "secondary"
                      }
                      className="uppercase rounded-sm! shrink-0"
                    >
                      {profile.environment}
                    </Badge>
                  </div>
                  <p
                    className="text-[12px] text-muted-foreground truncate"
                    title={profile.username}
                  >
                    {profile.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <div className="flex flex-col items-end">
                  <span className="text-[12px] text-muted-foreground">
                    {profile.lastUsed}
                  </span>
                  <Button
                    variant="ghost"
                    className="text-xs p-0 h-auto cursor-pointer hover:bg-transparent! hover:text-foreground hover:underline underline-offset-2"
                  >
                    Connect
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="More actions"
                  className="size-7 cursor-pointer text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  // TODO: wire up edit / duplicate / delete actions
                >
                  <MoreVertical size={14} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-border-primary pt-4 flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">
          Keychain/vault · {filteredProfiles.length} of {PROFILES.length}{" "}
          profiles · Community edition
        </span>
      </div>
    </div>
  );
};
