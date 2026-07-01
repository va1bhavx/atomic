export interface QueryTab {
  id: string;
  name: string;
  query: string;
  columns: string[];
  rows: Record<string, unknown>[];
  limit: string;
}
