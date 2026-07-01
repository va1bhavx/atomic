import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "./env";
import { authStorage } from "./auth-storage";

const BASE_URL = env.VITE_BACKEND_BASE_URL;
const isDev: boolean = import.meta.env.VITE_NODE_ENV !== "production";

export type ApiError = {
  status?: number;

  message: string;

  data?: unknown;
};
type ApiErrorResponse = {
  message?: string;
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,

  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      const headerStore = config.headers as
        | (Record<string, string> & {
            get?: (key: string) => string | undefined;
            delete?: (key: string) => void;
          })
        | undefined;

      const skipAuthViaGet = headerStore?.get?.("x-skip-auth");
      const skipAuthViaRecord = headerStore?.["x-skip-auth"];
      const shouldSkipAuth =
        skipAuthViaGet === "true" || skipAuthViaRecord === "true";
      const isFormData =
        typeof FormData !== "undefined" && config.data instanceof FormData;

      if (shouldSkipAuth) {
        headerStore?.delete?.("x-skip-auth");
        if (headerStore && "x-skip-auth" in headerStore) {
          delete headerStore["x-skip-auth"];
        }
      }

      if (isFormData) {
        headerStore?.delete?.("Content-Type");
        headerStore?.delete?.("content-type");
        if (headerStore && "Content-Type" in headerStore) {
          delete headerStore["Content-Type"];
        }
        if (headerStore && "content-type" in headerStore) {
          delete headerStore["content-type"];
        }
      }

      const accessToken = await authStorage.getToken();

      if (accessToken && !shouldSkipAuth) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (isDev) {
        console.group("API REQUEST");

        console.table({
          METHOD: config.method?.toUpperCase(),
          URL: config.url,
          SKIP_AUTH: shouldSkipAuth ? "yes" : "no",
        });

        if (config.params) {
          console.log("PARAMS:", config.params);
        }

        if (config.data) {
          console.log("DATA:", config.data);
        }

        console.groupEnd();
      }

      return config;
    } catch (error) {
      console.error("REQUEST INTERCEPTOR ERROR:", error);

      return Promise.reject(error);
    }
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (isDev) {
      console.group("API RESPONSE");

      console.table({
        STATUS: response.status,
        URL: response.config.url,
      });

      console.log("RESPONSE:", response.data);

      console.groupEnd();
    }

    return response;
  },

  async (error: AxiosError<ApiErrorResponse>): Promise<ApiError> => {
    const status = error.response?.status;

    if (isDev) {
      console.group("API ERROR");

      console.table({
        STATUS: status,
        URL: error.config?.url,
        METHOD: error.config?.method?.toUpperCase(),
      });

      console.error("ERROR RESPONSE:", error.response?.data);

      console.groupEnd();
    }

    if (!error.response) {
      return Promise.reject<ApiError>({
        status: 500,

        message: "Network error. Please check your internet connection.",
      });
    }

    if (status === 401) {
      console.warn("UNAUTHORIZED REQUEST");
    }

    if (status === 403) {
      console.warn("FORBIDDEN ACCESS");
    }

    if (status === 500) {
      console.error("INTERNAL SERVER ERROR");
    }

    const normalizedError: ApiError = {
      status,

      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",

      data: error.response?.data || null,
    };

    return Promise.reject(normalizedError);
  },
);
