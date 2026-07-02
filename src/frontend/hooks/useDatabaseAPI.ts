import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryKeys } from "../services/queryKeys";
import {
  connectProfile,
  getSavedProfiles,
} from "../services/api/database/getDatabaseService";
import type { ApiResponse, ConnectResponse } from "../types/generalTypes";
import type { SavedProfiles } from "../types/databaseTypes";

export const useSavedProfiles = () => {
  return useQuery<ApiResponse<SavedProfiles[]>>({
    queryKey: [queryKeys.SAVED_PROFILES],
    queryFn: getSavedProfiles,
  });
};

export const useConnectProfile = () => {
  return useMutation({
    mutationFn: (userId: string): Promise<ApiResponse<ConnectResponse>> =>
      connectProfile(userId),
  });
};
