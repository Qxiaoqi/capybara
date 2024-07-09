export interface IResponse {
  code: number
  message: string
  status: number
  data: any
}

export interface ITranslateResponse extends IResponse {
  data: {
    from: string
    to: string
    result: string
  }
}

export interface ILoginResponse extends IResponse {
  data: {
    type: "login" | "verify"
    accessToken?: string
  }
}

export interface IVerifyResponse extends IResponse {
  data: {
    accessToken: string
  }
}

export interface IProfileResponse extends IResponse {
  data: {
    email: string
    points: string
  }
}

export interface IOverviewResponse extends IResponse {
  data: {
    usageCount: string
    costPoints: string
  }
}
