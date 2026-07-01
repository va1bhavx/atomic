import type { Method } from "axios";

export type ApiRequestProps = {
  url: string;

  method?: Method;

  data?: unknown;

  params?: unknown;

  headers?: Record<string, string>;

  skipAuth?: boolean;
};
