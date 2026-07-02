import { useQuery } from "@tanstack/react-query";
import { authStorage } from "../services/auth-storage";

export const useAuthToken = () => {
  return useQuery({
    queryKey: ["authToken"],
    queryFn: () => authStorage.getToken(),
  });
};
