import request from "./request"
import { ITranslateResponse, IResponse } from "./types"

export interface TranslateParams {
  content: string
  from?: string
  to?: string
}

export const baiduTranslate = async (
  params: TranslateParams
): Promise<ITranslateResponse> => {
  const body = request({
    url: "translate/baidu",
    method: "POST",
    data: params,
  }) as Promise<IResponse>
  return body
}

export const tencentTranslate = async (
  params: TranslateParams
): Promise<ITranslateResponse> => {
  const body = request({
    url: "translate/tencent",
    method: "POST",
    data: params,
  }) as Promise<IResponse>
  return body
}
