<template>
  <m-page title="歌单标签">
    <template #default>
      <div class="playlist-tags">
        <div class="category-item">
          <div class="title">
            我的歌单广场
            <button @click="isEdit = !isEdit">
              {{ isEdit ? '完成' : '编辑' }}
            </button>
          </div>
          <div class="list">
            <button
              class="tag-item"
              v-for="(tag, index) in squareTags"
              :key="tag.name"
              :disabled="tag.fixed"
            >
              <i
                class="iconfont icon-close"
                v-if="isEdit && !tag.fixed"
                @click="deleteSquareTag(index)"
              ></i>
              <i class="iconfont icon-fire" v-if="!isEdit && tag.hot"></i
              ><span class="text">{{ tag.name }}</span>
            </button>
          </div>
        </div>
        <div
          class="category-item"
          v-for="(item, index) in catlist"
          :key="index"
        >
          <div class="title">{{ item.name }}</div>
          <div class="list">
            <button
              class="tag-item"
              v-for="tag in item.children"
              :key="tag.name"
              :disabled="tagIsInSquare(tag.name)"
            >
              <i
                class="iconfont icon-add"
                v-if="isEdit"
                @click="addSquareTag(tag)"
              ></i>
              <i class="iconfont icon-fire" v-else-if="tag.hot"></i
              ><span class="text">{{ tag.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </m-page>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted,
  onUnmounted,
  onDeactivated
} from 'vue'
import { storeToRefs } from 'pinia'
import usePlaylists from '@/store/playlists'
import { Tag } from '@/types'
import { showToast } from '@/plugin/toast'
export default defineComponent({
  setup() {
    const store = usePlaylists()
    const { catlist, squareTags } = storeToRefs(store)
    const isEdit = ref(false)
    onMounted(() => {
      if (!catlist.value.length) {
        store.getPlaylistCatlist()
      }
    })
    const { deleteSquareTag, addSquareTag } = store
    function tagIsInSquare(name: string) {
      return !!squareTags.value.find(tag => tag.name === name)
    }
    onUnmounted(() => {
      isEdit.value = false
    })
    onDeactivated(() => {
      isEdit.value = false
    })
    function deleteTag(index: number) {
      if (squareTags.value.length <= 5) {
        return showToast('不能再删除了')
      }
      deleteSquareTag(index)
    }
    return {
      catlist,
      squareTags,
      isEdit,
      deleteSquareTag: deleteTag,
      addSquareTag,
      tagIsInSquare
    }
  }
})
</script>

<style lang="scss" scoped>
.playlist-tags {
  .category-item {
    padding: $padding;
    .title {
      padding: $padding-lg 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      button {
        border: 1px solid $primary;
        padding: 0 10px;
        color: $primary;
        font-size: $font-size-sm;
        line-height: 1.5;
        border-radius: 30px;
        float: right;
      }
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      $tag-gap: $gap;
      $tag-item-count: 4;
      margin-right: -$tag-gap;
      .tag-item {
        width: calc(
          (100% - #{$tag-gap} * #{$tag-item-count}) / #{$tag-item-count}
        );
        margin-bottom: $tag-gap;
        margin-right: $tag-gap;

        position: relative;
        box-sizing: border-box;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:disabled {
          opacity: 0.7;
        }
        .icon-fire {
          position: absolute;
          left: 5px;
          top: 50%;
          transform: translateY(-50%);
          color: $primary;
        }
        .text {
          flex: 1;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
