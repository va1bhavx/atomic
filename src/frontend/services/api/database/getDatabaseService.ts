// export const getCareerJobList = async (
// 	params?: ListParams,
// ): Promise<ApiResponse<CareerJobListItem[]>> => {
// 	return makeApiRequest<ApiResponse<CareerJobListItem[]>>({
// 		url: API_ENDPOINTS.JOBS.CAREER_SITE_JOB_LISTING,
// 		service: "enterprise",
// 		params,
// 	});
// };

import type { SavedProfiles } from "../../../types/databaseTypes";
import type { ApiResponse, ConnectResponse } from "../../../types/generalTypes";
import { apiEndPoints } from "../../apiEndPoints";
import { makeApiRequest } from "../../makeApiRequest";

export const getSavedProfiles = async (): Promise<
  ApiResponse<SavedProfiles[]>
> => {
  return makeApiRequest<ApiResponse<SavedProfiles[]>>({
    url: apiEndPoints.SAVED_PROFILES,
  });
};

export const connectProfile = async (
  userId: string,
): Promise<ApiResponse<ConnectResponse>> => {
  return makeApiRequest<ApiResponse<ConnectResponse>>({
    url: apiEndPoints.CONNECT_PROFILE,
    method: "POST",
    data: { userId },
  });
};
