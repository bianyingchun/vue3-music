import request from './request'
import { AllToplist } from '@/typing/toplist'
export function getAllTopList() {
  return request<AllToplist>('/toplist', 'get')
}
