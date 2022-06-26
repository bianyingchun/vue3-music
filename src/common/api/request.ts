import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'

import useAuthStore from '@/store/auth'

const instance = axios.create({ timeout: 1000 * 10 })

const host = window.location.host
instance.defaults.baseURL =
  host == 'music.bianyc.zyx'
    ? 'http://music.bianyc.xyz:3000'
    : 'http://localhost:3000'

instance.defaults.withCredentials = true
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  return config
})
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  err => {
    const { config, status } = err.response
    if (config.url !== '/user/account' && status === 301) {
      const store = useAuthStore()
      store.loginVisible = true
    }
    return Promise.reject(err)
  }
)

type TAxiosMethod = 'get' | 'GET' | 'POST' | 'post'

function request<T>(
  url: string,
  method: TAxiosMethod,
  params: object = {}
): AxiosPromise<T> {
  const args = params || {}
  const requestData = {
    url,
    method,
    data: {},
    params: {}
  }
  if (method === 'get' || method === 'GET') {
    requestData.params = args
  } else {
    requestData.data = args
  }
  return instance(requestData)
}

export default request
