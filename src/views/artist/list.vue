<template>
  <m-page title="歌手列表">
    <template #navbar>
      <div class="artist-category">
        <div class="artist-area-list">
          <div
            class="category-item"
            v-for="item in areaList"
            :key="item.val"
            :class="{ active: item.val === area }"
            @click="setArea(item.val)"
          >
            {{ item.text }}
          </div>
        </div>
        <div class="artist-type-list">
          <div
            @click="setType(item.val)"
            class="category-item"
            v-for="item in typeList"
            :key="item.val"
            :class="{ active: item.val === type }"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <div class="artist-list">
        <div
          class="artist-item"
          v-for="artist in artistList"
          :key="artist.id"
          @click="$router.push(`/artist/${artist.id}`)"
        >
          <img class="avatar" :src="artist.picUrl" />
          <div class="name">{{ artist.name }}</div>
          <span class="follow-status unfollowed" v-if="!artist.followed">
            <i class="iconfont icon-add"></i>关注
          </span>
          <span class="follow-status" v-else>
            <i class="iconfont icon-selected"></i>
            已关注</span
          >
        </div>
      </div>
    </template>
  </m-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { ARTIST_CATEGORY } from '@/common/js/config'
import { getArtistList } from '@/common/api/artist'
import { Artist } from '@/typing'
const LIMIT = 30
export default defineComponent({
  components: {},
  setup() {
    const defaultType = ARTIST_CATEGORY.type[0].val
    const defaultArea = ARTIST_CATEGORY.area[0].val
    const type = ref(defaultType)
    const area = ref(defaultArea)
    const typeList = ARTIST_CATEGORY.type.slice(1)
    const areaList = ARTIST_CATEGORY.area.slice(1)
    function setArea(val: number) {
      area.value = val
      if (type.value === defaultArea) {
        type.value = ARTIST_CATEGORY.type[1].val
      }
    }
    function setType(val: number) {
      type.value = val
      if (area.value === defaultType) {
        area.value = ARTIST_CATEGORY.area[1].val
      }
    }
    const page = ref(1)
    const offset = computed(() => (page.value - 1) * LIMIT)
    const loading = ref(false)
    const artistList = ref<Artist[]>([])
    const hasMore = ref(true)
    async function getList() {
      if (loading.value || !hasMore.value) return
      loading.value = true
      const res = await getArtistList({
        limit: LIMIT,
        offset: offset.value,
        type: type.value,
        area: area.value
      })
      artistList.value = [...artistList.value, ...res.data.artists]
      hasMore.value = res.data.more
      page.value++
      loading.value = false
    }
    watch(
      [type, area],
      async () => {
        page.value = 1
        hasMore.value = true
        artistList.value = []
        await getList()
      },
      { immediate: true }
    )
    getList()
    return {
      typeList,
      areaList,
      type,
      area,
      setType,
      setArea,
      artistList,
      hasMore
    }
  }
})
</script>

<style lang="scss" scoped>
.artist-category {
  padding-bottom: $padding;
  .category-item {
    width: 60px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    &.active {
      color: $primary;
    }
  }
}
.artist-list {
  .artist-item {
    display: flex;
    align-items: center;
    padding: $padding;
    .avatar {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 50%;
    }
    .name {
      flex: 1;
      margin: 0 $gap;
    }
    .follow-status {
      width: 60px;
      text-align: center;
      line-height: 24px;
      height: 24px;
      border-radius: 24px;
      border: 1px solid $gary;
      font-size: $font-size-sm;
      .iconfont {
        font-size: $font-size-sm;
      }
      &.unfollowed {
        border-color: $primary;
        color: $primary;
      }
    }
  }
}
</style>
