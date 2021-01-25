import request from './request'
import {
  SearchHotData,
  SearchSuggestData,
  SearchDefaultData,
  SearchTypeVal
} from '@/types'

export async function getSearchHot() {
  const res = await request<SearchHotData>('/search/hot/detail', 'get')
  return res.data.code === 200 ? res.data.data : []
}

export async function getSearchSuggest(keywords: string) {
  const res = await request<SearchSuggestData>('/search/suggest', 'get', {
    keywords,
    type: 'mobile'
  })
  if (res.data.code === 200 && res.data.result.allMatch) {
    return res.data.result.allMatch
  } else {
    return []
  }
}

export function getSearchDefault() {
  return request<SearchDefaultData>('/search/default', 'get')
}
interface SearchParams {
  keywords: string
  type?: SearchTypeVal
  limit?: number
  offset?: number
}
export function search<T>(params: SearchParams) {
  return request<T>('/search', 'get', params)
}
