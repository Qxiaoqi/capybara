import request from "./request"
import { IOverviewResponse, IResponse } from "./types"

export const getOverview = async (): Promise<IOverviewResponse> => {
  const body = request({
    url: "analyze/overview",
    method: "GET",
  }) as Promise<IResponse>
  return body
}
