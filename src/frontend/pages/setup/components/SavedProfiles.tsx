import { useMemo, useState } from "react";
import { MoreVertical, Search, X } from "lucide-react";
import { Input } from "../../../components/web/custom-component/CustomInput";
import { useSavedProfiles } from "../../../hooks/useDatabaseAPI";
import { ErrorPage } from "../../../components/web/error-page";
import { Button } from "../../../components/ui/button";
import type { SavedProfiles as SavedProfilesType } from "../../../types/databaseTypes";
import { Badge } from "../../../components/ui/badge";
import { DATABASES, ENVIRONMENTS } from "../../../types/generalTypes";
import { timeAgo } from "../../../utils/timeAgo";

export const SavedProfiles = () => {
  const [query, setQuery] = useState("");

  const { data: profiles, isLoading, isError, refetch } = useSavedProfiles();

  const filteredProfiles: SavedProfilesType[] = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = profiles?.results ?? [];

    if (!q) return list;

    return list.filter(
      (p) =>
        p.dbName.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.environment.toLowerCase().includes(q) ||
        p.profileName.toLowerCase().includes(q),
    );
  }, [query, profiles]);

  if (isError)
    return (
      <ErrorPage
        action={
          <Button
            onClick={() => refetch()}
            variant={"default"}
            className="text-white"
          >
            Retry
          </Button>
        }
      />
    );

  console.log(filteredProfiles, "filteredProfiles");

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Search profiles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        startIcon={<Search size={14} />}
        className="rounded-xs"
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

      {isLoading ? (
        <ul className="flex flex-col gap-3 mt-1 animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <li
              key={idx}
              className="bg-small-card ring ring-border-primary rounded-md px-4 py-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-6 min-w-0">
                <div className="shrink-0 bg-gray-700 w-10 h-10 rounded-md" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-600 rounded" />
                  <div className="h-3 w-40 bg-gray-600 rounded" />
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2 shrink-0">
                <div className="h-3 w-14 bg-gray-600 rounded" />
                <div className="h-4 w-10 bg-gray-600 rounded" />
              </div>
            </li>
          ))}
        </ul>
      ) : filteredProfiles.length === 0 ? (
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
          {filteredProfiles?.map((profile: SavedProfilesType) => {
            const env = ENVIRONMENTS[profile.environment];
            const database = DATABASES[profile.dbType];
            return (
              <li
                key={profile.dbId}
                className="group bg-small-card ring ring-border-primary rounded-md px-4 py-5 flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-6 min-w-0">
                  <div className="shrink-0 bg-card-header w-10 h-10 flex items-center justify-center rounded-md shadow-md">
                    <img
                      src={database.icon}
                      alt={database.label}
                      className="w-6 h-6 object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-md truncate">
                        {profile.profileName}
                      </h1>
                      <Badge
                        className={`rounded-sm shrink-0 border-0 ${env.bgColor} ${env.textColor}`}
                      >
                        {profile.environment}
                      </Badge>
                    </div>
                    <p
                      className="text-[12px] text-muted-foreground truncate"
                      title={`${profile.username}@${profile.host}:${profile.port}`}
                    >
                      {profile.username}@{profile.host}:{profile.port}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[12px] text-muted-foreground">
                      {timeAgo(profile.lastConnectedTime)}
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
            );
          })}
        </ul>
      )}

      <div className="border-t border-border-primary pt-4 flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">
          Keychain/vault · {filteredProfiles?.length || 0} of{" "}
          {profiles?.results?.length || 0} profiles · Community edition
        </span>
      </div>
    </div>
  );
};
