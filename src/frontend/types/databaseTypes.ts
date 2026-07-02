import type { DatabaseType, Environment } from "./generalTypes";

export interface DatabaseConnectionPayload {
  dbName: string;
  dbType: string;
  profileName: string;
  username: string;
  host: string;
  port: number;
  password: string;
  environment: string;
}

export interface SavedProfiles {
  dbId: string;
  dbName: string;
  dbType: DatabaseType;
  userId: string;
  profileName: string;
  username: string;
  host: string;
  port: number;
  password: string | null;
  environment: Environment;
  lastConnectedTime: string;
  lastConnectionStatus: string;
}
