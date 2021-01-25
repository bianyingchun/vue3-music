import request from './request'
import { AllToplist } from '@/types'
export function getAllTopList() {
  return request<AllToplist>('/toplist', 'get')
}
