import { useState, type FormEvent } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/web/custom-component/CustomInput";
import { Button } from "../../../components/ui/button";
import { ChevronRight, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";

const ENGINES = [
  { name: "Postgres", smallAbbreviation: "Pg", defaultPort: "5432" },
  { name: "MySQL", smallAbbreviation: "My", defaultPort: "3306" },
  { name: "MSSql", smallAbbreviation: "Ms", defaultPort: "1433" },
  { name: "Oracle", smallAbbreviation: "Or", defaultPort: "1521" },
];

const ENVIRONMENTS = [
  { name: "Local" },
  { name: "Dev" },
  { name: "Stage" },
  { name: "Prod" },
];

export default function NewConnection() {
  const [selectedEngine, setSelectedEngine] = useState(ENGINES[0]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(
    ENVIRONMENTS[0],
  );
  const [vaultOnly, setVaultOnly] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    // TODO: wire up to the real connection-test endpoint
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsTesting(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up to the real connect handler
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7 relative">
      <div className="max-w-md">
        <h1 className="text-xl">Connect to database</h1>
        <p className="text-muted-foreground">
          Enter connection details or start from a keychain/vault profile.
          Passwords stay as secret references.
        </p>
      </div>

      {/* Engine */}
      <div className="flex gap-3 flex-col">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
          Engine
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ENGINES.map((engine) => {
            const isSelected = engine.name === selectedEngine.name;
            return (
              <button
                key={engine.name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedEngine(engine)}
                className={`relative flex flex-col items-center gap-2 rounded-md py-4 cursor-pointer transition-all outline-none
                  ${
                    isSelected
                      ? "bg-primary/10 border border-primary/50 text-foreground"
                      : "bg-small-card border border-border-primary text-muted-foreground hover:text-foreground hover:border-white/20"
                  }
                  focus-visible:ring-2 focus-visible:ring-primary/40`}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center size-3.5 rounded-full bg-primary text-primary-foreground">
                    <Check size={9} strokeWidth={3} />
                  </span>
                )}
                <span className="font-mono text-[11px] size-7 flex items-center justify-center rounded bg-white/5">
                  {engine.smallAbbreviation}
                </span>
                <span className="text-xs font-medium">{engine.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile name + environment */}
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-3">
        <div className="w-full flex flex-col gap-3">
          <Label htmlFor="profile-name" className="text-xs">
            Profile Name
          </Label>
          <Input id="profile-name" placeholder="e.g. inventory-service-prod" />
        </div>

        <div className="flex flex-col gap-3">
          <Label className="text-xs">Environment</Label>
          <div
            role="radiogroup"
            aria-label="Environment"
            className="flex items-center gap-2"
          >
            {ENVIRONMENTS.map((env) => {
              const isSelected = env.name === selectedEnvironment.name;
              return (
                <button
                  key={env.name}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedEnvironment(env)}
                  className={`px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-all outline-none border
                    ${
                      isSelected
                        ? "bg-primary/10 border-primary/50 text-foreground"
                        : "bg-small-card border-border-primary text-muted-foreground hover:text-foreground hover:border-white/20"
                    }
                    focus-visible:ring-2 focus-visible:ring-primary/40`}
                >
                  {env.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-border-primary" />

      <span className="-mt-4 text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
        Connection details
      </span>

      {/* Host and Port */}
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-3">
        <div className="w-full flex-1 min-w-0 flex flex-col gap-3">
          <Label htmlFor="host" className="text-xs">
            Host
          </Label>
          <Input id="host" placeholder="e.g. db.internal.company.com" />
        </div>
        <div className="w-full sm:w-32 shrink-0 flex flex-col gap-3">
          <Label htmlFor="port" className="text-xs">
            Port
          </Label>
          <Input
            id="port"
            inputMode="numeric"
            placeholder={selectedEngine.defaultPort}
          />
        </div>
      </div>

      {/* Database and Username */}
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-3">
        <div className="w-full flex-1 min-w-0 flex flex-col gap-3">
          <Label htmlFor="database" className="text-xs">
            Database
          </Label>
          <Input id="database" placeholder="e.g. inventory_db" />
        </div>
        <div className="w-full flex-1 min-w-0 flex flex-col gap-3">
          <Label htmlFor="username" className="text-xs">
            Username
          </Label>
          <Input id="username" placeholder="e.g. svc_readonly" />
        </div>
      </div>

      <div className="border-t border-border-primary" />

      <span className="-mt-4 text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
        Security
      </span>

      {/* Password */}
      <div className="w-full flex flex-col gap-3">
        <Label htmlFor="password" className="text-xs">
          Password
        </Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="pointer-events-auto cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="vault-only"
          checked={vaultOnly}
          onCheckedChange={(checked) => setVaultOnly(checked === true)}
          className="mt-0.5"
        />
        <Label
          htmlFor="vault-only"
          className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer"
        >
          Save only a keychain/vault reference. Plaintext passwords are not
          stored in local metadata.
        </Label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isTesting}
          onClick={handleTestConnection}
          className="rounded-md px-5 py-2.5 text-xs font-bold transition-all active:scale-95 hover:bg-muted cursor-pointer gap-1.5"
        >
          {isTesting && <Loader2 size={14} className="animate-spin" />}
          {isTesting ? "Testing..." : "Test Connection"}
        </Button>
        <Button
          type="submit"
          className="rounded-md px-6 py-2.5 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 gap-1.5 shadow-sm cursor-pointer"
        >
          Connect
          <ChevronRight size={14} />
        </Button>
      </div>
    </form>
  );
}
