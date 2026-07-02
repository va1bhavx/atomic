import { useState } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/web/custom-component/CustomInput";
import { Button } from "../../../components/ui/button";
import { ChevronRight, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { DATABASES, ENVIRONMENTS } from "../../../types/generalTypes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTestConnection } from "../../../hooks/useDatabaseAPI";
import { Badge } from "../../../components/ui/badge";

const connectionSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z
    .string()
    .min(1, "Port is required")
    .regex(/^\d+$/, "Port must be a number"),
  dbName: z.string().min(1, "Database is required"),
  environment: z.string().min(1, "Environment is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  dbType: z.string().min(1, "Engine is required"),
  profileName: z.string().min(1, "Profile name is required"),
});

type ConnectionFormValues = z.infer<typeof connectionSchema>;

export default function NewConnection() {
  const [selectedEngine, setSelectedEngine] = useState(
    Object.values(DATABASES)[0],
  );
  const [selectedEnvironment, setSelectedEnvironment] = useState(
    Object.values(ENVIRONMENTS)[0].label,
  );
  const [isTestConnected, setIsTestConnected] = useState<boolean>(false);
  const { mutate: testConnection } = useTestConnection();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      host: "",
      port: "",
      dbName: "",
      environment: "LOCAL",
      username: "",
      dbType: "POSTGRES",
      profileName: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const handleTestConnection = async (data: ConnectionFormValues) => {
    setIsTesting(true);
    // TODO: wire up to the real connection-test endpoint
    console.log("Valid form data:", data);
    testConnection(
      {
        dbName: data.dbName,
        dbType: data.dbType,
        profileName: data.profileName,
        username: data.username,
        host: data.host,
        port: parseInt(data.port),
        password: data.password,
        environment: data.environment,
      },
      {
        onSuccess: (response) => {
          setIsConnecting(false);
          setIsTesting(false);
          setIsTestConnected(response.results.isConnected);
          console.log(response);
        },
        onError: (error) => {
          setIsTesting(false);
          setIsConnecting(false);
          console.error(error);
        },
      },
    );
  };

  const handleOnConnect = (data: ConnectionFormValues) => {
    // e.preventDefault();
    setIsConnecting(true);
    console.log("Valid form data:", data);
    // TODO: wire up to the real connect handler
  };

  return (
    <form className="flex flex-col gap-7 relative">
      <div className="max-w-md">
        <h1 className="text-xl">Connect to database</h1>
      </div>

      {/* Engine */}
      <div className="flex gap-2 flex-col">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
          Engine
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(DATABASES).map((engine) => {
            const isSelected = engine.key === selectedEngine.key;
            return (
              <>
                <button
                  key={engine.label}
                  type="button"
                  aria-pressed={isSelected}
                  {...register("dbType")}
                  onClick={() => {
                    setSelectedEngine(engine);
                    setValue("dbType", engine.label);
                  }}
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
                  {engine.icon && (
                    <img
                      src={engine.icon}
                      alt={engine.label}
                      className="size-15"
                    />
                  )}

                  <span className="text-xs font-medium">{engine.label}</span>
                </button>
              </>
            );
          })}
        </div>
        {errors.dbType && (
          <span className="text-xs text-red-500">{errors.dbType.message}</span>
        )}
      </div>

      {/* Profile name + environment */}
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-3">
        <div className="w-full flex flex-col gap-3">
          <Label htmlFor="profile-name" className="text-xs">
            Profile Name
          </Label>
          <Input
            id="profile-name"
            placeholder="e.g. inventory-service-prod"
            inputSize={"sm"}
            {...register("profileName")}
            className="rounded-xs"
          />
          {errors.profileName && (
            <span className="text-xs text-red-500">
              {errors.profileName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label className="text-xs">Environment</Label>
          <div
            role="radiogroup"
            aria-label="Environment"
            className="flex items-center gap-2"
          >
            {Object.values(ENVIRONMENTS).map((env) => {
              const isSelected = env.label === selectedEnvironment;
              return (
                <>
                  <button
                    key={env.label}
                    type="button"
                    role="radio"
                    {...register("environment")}
                    aria-checked={isSelected}
                    onClick={() => {
                      setSelectedEnvironment(env.label);
                      setValue("environment", env.label);
                    }}
                    className={`px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-all outline-none border
                    ${
                      isSelected
                        ? "bg-primary/10 border-primary/50 text-foreground"
                        : "bg-small-card border-border-primary text-muted-foreground hover:text-foreground hover:border-white/20"
                    }
                    focus-visible:ring-2 focus-visible:ring-primary/40 capitalize`}
                  >
                    {env.key}
                  </button>
                </>
              );
            })}
          </div>
          {errors.environment && (
            <span className="text-xs text-red-500">
              {errors.environment.message}
            </span>
          )}
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
          <Input
            id="host"
            placeholder="e.g. db.internal.company.com"
            inputSize={"sm"}
            className="rounded-xs"
            {...register("host")}
          />
          {errors.host && (
            <span className="text-xs text-red-500">{errors.host.message}</span>
          )}
        </div>
        <div className="w-full sm:w-32 shrink-0 flex flex-col gap-3">
          <Label htmlFor="port" className="text-xs">
            Port
          </Label>
          <Input
            id="port"
            inputMode="numeric"
            placeholder={String(selectedEngine.defaultPort)}
            inputSize={"sm"}
            className="rounded-xs"
            {...register("port")}
          />
          {errors.port && (
            <span className="text-xs text-red-500">{errors.port.message}</span>
          )}
        </div>
      </div>

      {/* Database and Username */}
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-3">
        <div className="w-full flex-1 min-w-0 flex flex-col gap-3">
          <Label htmlFor="database" className="text-xs">
            Database
          </Label>
          <Input
            id="database"
            placeholder="e.g. inventory_db"
            {...register("dbName")}
            inputSize={"sm"}
            className="rounded-xs"
          />
          {errors.dbName && (
            <span className="text-xs text-red-500">
              {errors.dbName.message}
            </span>
          )}
        </div>
        <div className="w-full flex-1 min-w-0 flex flex-col gap-3">
          <Label htmlFor="username" className="text-xs">
            Username
          </Label>
          <Input
            id="username"
            placeholder="e.g. svc_readonly"
            {...register("username")}
            inputSize={"sm"}
            className="rounded-xs"
          />
          {errors.username && (
            <span className="text-xs text-red-500">
              {errors.username.message}
            </span>
          )}
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
          {...register("password")}
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
          inputSize={"sm"}
          className="rounded-xs"
        />
        {errors.password && (
          <span className="text-xs text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            variant="outline"
            onClick={handleSubmit(handleTestConnection)}
            disabled={isTesting}
            className="rounded-md px-5 py-2.5 text-xs font-bold transition-all active:scale-95 hover:bg-muted cursor-pointer gap-1.5"
          >
            {isTesting && <Loader2 size={14} className="animate-spin" />}
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
          {isTestConnected && (
            <span className="px-2 py-1 rounded-sm  bg-green-500/20 text-xs text-green-500/80">
              Connected
            </span>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="submit"
            className="rounded-md px-6 py-2.5 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 gap-1.5 shadow-sm cursor-pointer"
            onClick={handleSubmit(handleOnConnect)}
            disabled={isConnecting}
          >
            Connect
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </form>
  );
}
