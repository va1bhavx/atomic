export interface TabItem {
  value: string;
  name: string;
  content: React.ReactNode;
}

export interface ApiResponse<T> {
  message: string;
  results: T;
}

export interface ConnectResponse {
  jwtToken: string;
  isConnected: boolean;
}

export const ENVIRONMENTS = {
  LOCAL: {
    key: "local",
    label: "LOCAL",
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-400",
  },
  DEV: {
    key: "dev",
    label: "DEV",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
  },
  STAGE: {
    key: "stage",
    label: "STAGE",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
  },
  PROD: {
    key: "prod",
    label: "PROD",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
} as const;

export const DATABASES = {
  POSTGRES: {
    key: "postgresql",
    label: "POSTGRES",
    icon: "/assets/postgres.png",
    defaultPort: 5432,
    smallAbbreviation: "Pg",
  },
  MYSQL: {
    key: "mysql",
    label: "MYSQL",
    icon: "/assets/mysql.png",
    defaultPort: 3306,
    smallAbbreviation: "My",
  },
  MSSQL: {
    key: "mssql",
    label: "MSSQL",
    icon: "/assets/mssql.png",
    defaultPort: 1433,
    smallAbbreviation: "Ms",
  },
  ORACLE: {
    key: "oracle",
    label: "ORACLE",
    icon: "/assets/oracle.png",
    defaultPort: 1521,
    smallAbbreviation: "Or",
  },
} as const;

export type Environment = keyof typeof ENVIRONMENTS;
export type DatabaseType = keyof typeof DATABASES;
