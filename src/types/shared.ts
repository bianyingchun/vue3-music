export interface PageParams {
  limit?: number
  offset?: number
}

export interface ResponseData<T> {
  data: T
  code: number
  message: string
}
