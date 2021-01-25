<template>
  <div class="result-list" ref="refreshElem">
    <user-list :list="list"></user-list>
    <div class="loading" v-if="loading">加载中</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import UserList from '@/components/achive/user-list.vue'
import { showToast } from '@/plugin/toast'
import { User, SearchUserResult, SearchTypeVal } from '@/types'
import { useLoadMore } from '@/hooks/useLoadMore'
import { search } from '@/common/api/search'
export default defineComponent({
  props: {
    active: Boolean,
    query: String
  },
  components: {
    UserList
  },
  setup(props) {
    let hasMore = true
    const loading = ref(false)
    const list = ref<User[]>([])
    async function getList() {
      try {
        if (!hasMore || loading.value || !props.query) return
        loading.value = true
        const res = await search<SearchUserResult>({
          keywords: props.query,
          type: SearchTypeVal.user
        })
        hasMore = res.data.result.hasMore
        list.value = [...list.value, ...res.data.result.userprofiles]
      } catch (err) {
        showToast('加载失败')
      } finally {
        loading.value = false
      }
    }
    const refreshElem = ref<HTMLDivElement | null>(null)
    useLoadMore(refreshElem, getList)
    watch(
      () => props.active,
      () => {
        if (!list.value.length) {
          getList()
        }
      },
      {
        immediate: true
      }
    )
    return {
      list,
      refreshElem,
      loading
    }
  }
})
</script>

<style lang="scss" scoped></style>
