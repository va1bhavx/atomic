import type { ApiRequestProps } from "../types/apiRequestTypes";
import { axiosInstance } from "./axios";
import { env } from "./env";

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
}

export async function makeApiRequest<T>({
  url,
  method = "GET",
  data,
  params,
  headers,
  skipAuth = false,
}: ApiRequestProps): Promise<T> {
  const baseUrl = env.VITE_BACKEND_BASE_URL;

  if (!isAbsoluteUrl(url) && !baseUrl) {
    throw new Error("Unable to resolve base URL");
  }

  const finalUrl = isAbsoluteUrl(url) ? url : joinUrl(baseUrl, url);

  const requestHeaders: Record<string, string> = { ...(headers ?? {}) };

  if (skipAuth) {
    requestHeaders["x-skip-auth"] = "true";
  }

  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;

  if (isFormData) {
    delete requestHeaders["Content-Type"];
    delete requestHeaders["content-type"];
  }

  const finalHeaders = isFormData
    ? { ...requestHeaders, "Content-Type": undefined }
    : requestHeaders;

  const response = await axiosInstance({
    url: finalUrl,
    method,
    data,
    params,
    headers: finalHeaders,
  });
  return response.data;
}
