import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../services/queryKeys";
import {
  connectProfile,
  getSavedProfiles,
  postTestConnection,
} from "../services/api/database/getDatabaseService";
import type { ApiResponse, ConnectResponse } from "../types/generalTypes";
import type {
  DatabaseConnectionPayload,
  SavedProfiles,
  TestConnectionResponse,
} from "../types/databaseTypes";

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

export const useTestConnection = () => {
  return useMutation({
    mutationFn: (
      payload: DatabaseConnectionPayload,
    ): Promise<ApiResponse<TestConnectionResponse>> =>
      postTestConnection(payload),
  });
};
