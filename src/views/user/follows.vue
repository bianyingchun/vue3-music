<template>
  <m-page title="关注列表">
    <template #default>
      <div class="scroller-container" ref="refreshElm">
        <user-list :list="list"></user-list>
      </div>
    </template>
  </m-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import UserList from '@/components/achive/user-list.vue'
import { useRoute } from 'vue-router'
import { getFollowList } from '@/common/api/user'
import { useLoadMore } from '@/hooks/useLoadMore'
import { usePage } from '@/hooks/usePage'
import { User } from '@/typing'
export default defineComponent({
  components: {
    UserList
  },
  setup() {
    const route = useRoute()
    const uid = Number(route.params.id)
    const list = ref<User[]>([])
    async function getData(limit: number, offset: number) {
      const res = await getFollowList(uid, { limit, offset })
      list.value = [...list.value, ...res.data.follow]
      return res.data.more
    }
    const { getList, loading, hasMore } = usePage(getData)
    const refreshElm = ref<null | HTMLElement>(null)
    useLoadMore(refreshElm, getList)
    getList()
    return {
      list,
      refreshElm,
      loading,
      hasMore
    }
  }
})
</script>

<style lang="scss" scoped></style>
