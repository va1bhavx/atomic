export const isElectron = (): boolean => {
  return (
    typeof window !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("electron")
  );
};
