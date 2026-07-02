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
