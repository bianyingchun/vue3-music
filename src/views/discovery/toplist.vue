<template>
  <m-page title="排行版">
    <template #default>
      <div class="toplist-container">
        <h3>云音乐特色榜</h3>
        <div class="mix-list">
          <mix-item
            v-for="item in sList"
            :key="item.id"
            :isToplist="true"
            :mix="item"
            class="item"
          ></mix-item>
        </div>
        <h3>全球媒体榜</h3>
        <div class="mix-list">
          <mix-item
            v-for="item in gList"
            :key="item.id"
            :isToplist="true"
            :mix="item"
            class="item"
          ></mix-item>
        </div>
      </div>
    </template>
  </m-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MixItem from '@/components/achive/mix-item.vue'
import { getAllTopList } from '@/common/api/toplist'
import { Playlist } from '@/typing/playlist'
export default defineComponent({
  components: {
    MixItem
  },
  setup() {
    const sList = ref<Playlist[]>([])
    const gList = ref<Playlist[]>([])
    async function getList() {
      const res = await getAllTopList()
      const list = res.data.list
      list.forEach(item => {
        if (item.ToplistType) {
          sList.value.push(item)
        } else {
          gList.value.push(item)
        }
      })
    }
    getList()
    return {
      sList,
      gList
    }
  }
})
</script>

<style lang="scss" scoped>
.toplist-container {
  padding: $padding-lg;
  .mix-list {
    @include flex-list();
  }
}
</style>
