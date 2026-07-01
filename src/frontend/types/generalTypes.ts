export interface TabItem {
  value: string;
  name: string;
  content: React.ReactNode;
}

export type Environment = "local" | "stage" | "prod" | "dev";
