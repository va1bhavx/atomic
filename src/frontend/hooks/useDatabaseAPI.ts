import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../services/queryKeys";
import { getSavedProfiles } from "../services/api/database/getSavedProfiles";
import type { ApiResponse } from "../types/generalTypes";
import type { SavedProfiles } from "../types/databaseTypes";

export const useSavedProfiles = () => {
  return useQuery<ApiResponse<SavedProfiles[]>>({
    queryKey: [queryKeys.SAVED_PROFILES],
    queryFn: getSavedProfiles,
  });
};
