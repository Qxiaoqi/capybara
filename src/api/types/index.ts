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
