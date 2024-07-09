import request from "./request"
import {
  ILoginResponse,
  IProfileResponse,
  IResponse,
  IVerifyResponse,
} from "./types"

interface LoginParams {
  email: string
  password: string
}

export const login = async (params: LoginParams): Promise<ILoginResponse> => {
  const body = request({
    url: "users",
    method: "POST",
    data: params,
  }) as Promise<IResponse>
  return body
}

interface VerifyParams {
  email: string
  token: string
}

export const verify = async (
  params: VerifyParams
): Promise<IVerifyResponse> => {
  const body = request({
    url: "users/verify",
    method: "POST",
    data: params,
  }) as Promise<IResponse>
  return body
}

export const getProfile = async (): Promise<IProfileResponse> => {
  const body = request({
    url: "users/profile",
    method: "GET",
  }) as Promise<IResponse>
  return body
}
