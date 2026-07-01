export const env = {
  VITE_BACKEND_BASE_URL:
    import.meta.env.VITE_BACKEND_BASE_URL ??
    (() => {
      throw new Error("Missing required env var: VITE_BACKEND_BASE_URL");
    })(),
} as const;
