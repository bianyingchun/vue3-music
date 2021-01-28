<template>
  <div class="search-container" @click="onClickPage">
    <div class="search-header">
      <div class="search-box-container" @click.stop>
        <div class="search-box">
          <i class="iconfont icon-back" @click="onBack"></i>
          <div class="input-box">
            <input
              type="text"
              :placeholder="defaultQuery ? defaultQuery.showKeyword : ''"
              v-model.trim="query"
              @focus="onFocus"
              @input="onInput"
              @keypress.enter="onSearch"
            />
            <i class="iconfont icon-close" v-if="query" @click="query = ''"></i>
          </div>
        </div>
        <div class="suggest-list">
          <div
            class="item"
            v-for="(item, index) in suggestList"
            :key="index"
            @click.stop="doSearch(item.keyword)"
          >
            {{ item.keyword }}
          </div>
        </div>
      </div>
    </div>
    <div class="search-main">
      <div class="shortcut-container" v-show="!realQuery">
        <div class="search-history">
          <h4 class="title">历史</h4>
          <div class="history-list">
            <span
              class="item"
              v-for="item in history"
              :key="item"
              @click="doSearch(item)"
            >
              {{ item }}
            </span>
          </div>
          <i class="iconfont icon-delete" @click="clearSearchHistory"></i>
        </div>
        <div class="hot-search">
          <h4 class="title">热搜榜</h4>
          <div class="hot-list">
            <div
              v-for="(item, index) in hotList"
              :class="['item', { top: index < 3 }]"
              :key="index"
              @click="doSearch(item.searchWord)"
            >
              <span class="index">{{ index + 1 }}</span>
              <span class="text">{{ item.searchWord }}</span>
              <img
                :src="item.iconUrl"
                alt=""
                class="icon"
                v-if="item.iconUrl"
              />
            </div>
          </div>
        </div>
        <div class="feature-list">
          <router-link class="item" to="/artists"> 歌手分类</router-link>
        </div>
      </div>
    </div>
    <search-result v-if="realQuery" :query="realQuery" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { GlobalState, SearchDefault, HotSearchItem, SuggestItem } from '@/types'
import { useRouter } from 'vue-router'
import {
  getSearchHot,
  getSearchDefault,
  getSearchSuggest
} from '@/common/api/search'
import SearchResult from './components/result.vue'
import { popup } from '@/plugin/popup'

export default defineComponent({
  components: {
    SearchResult
  },
  setup() {
    const store = useStore<GlobalState>()
    const history = computed(() => store.state.search.history)
    const saveHistory = (query: string) => {
      if (!query.trim()) return
      store.dispatch('search/saveSearchHistory', query)
    }
    const clearSearchHistory = () => {
      popup('确认清空所有记录吗').then(() => {
        store.dispatch('search/clearSearchHistory')
      })
    }
    const deleteSearchHistory = (query: string) =>
      store.dispatch('search/deleteSearchHistory', query)

    const hotList = ref<HotSearchItem[]>([])
    async function fetchHotList() {
      try {
        const res = await getSearchHot()
        hotList.value = res
      } catch (err) {
        console.log(err)
      }
    }
    fetchHotList()
    const defaultQuery = ref<SearchDefault | null>(null)
    async function fetchDefaultQuery() {
      try {
        const res = await getSearchDefault()
        defaultQuery.value = res.data.data
      } catch (err) {
        console.log(err)
      }
    }
    fetchDefaultQuery()

    const suggestList = ref<SuggestItem[]>([])
    const fetchSuggest = _.debounce(async (value: string) => {
      try {
        if (value) {
          const res = await getSearchSuggest(value)
          suggestList.value = res
        } else {
          suggestList.value = []
        }
      } catch (err) {
        console.log(err)
      }
    })

    const query = ref('')
    const realQuery = ref('')
    function doSearch(text: string) {
      realQuery.value = text
    }
    function onFocus() {
      fetchSuggest(query.value)
    }
    function onInput() {
      fetchSuggest(query.value)
    }
    function onClickPage() {
      if (suggestList.value.length) {
        suggestList.value = []
      }
    }
    function onSearch() {
      realQuery.value = query.value
    }
    watch(realQuery, value => {
      saveHistory(value)
      query.value = value
      suggestList.value = []
    })
    const router = useRouter()
    function onBack() {
      if (realQuery.value) {
        realQuery.value = ''
      } else {
        router.back()
      }
    }
    return {
      query,
      onFocus,
      onInput,
      doSearch,
      history,
      hotList,
      suggestList,
      clearSearchHistory,
      deleteSearchHistory,
      saveHistory,
      defaultQuery,
      realQuery,
      onSearch,
      onClickPage,
      onBack
    }
  }
})
</script>

<style lang="scss" scoped>
.search-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $module-bg;
  .search-header {
    position: relative;
    .search-box {
      display: flex;
      align-items: center;
      background: $header-bg;
      color: #fff;
      padding: 0 $padding-lg;
      height: 50px;
      .icon-back {
        margin-right: $gap-lg;
        font-size: $font-size-lx;
      }
      .input-box {
        flex: 1;
        display: flex;
        align-items: center;
        border-bottom: 1px solid $gary;
        input {
          flex: 1;
          font-size: $font-size-lg;
          color: rgba($color: #fff, $alpha: 0.7);
        }
        .iconfont {
          font-size: $font-size-lg;
          margin-left: $gap-lg;
        }
      }
    }
    .suggest-list {
      position: absolute;
      top: 60px;
      left: $gap-lg;
      right: $gap-lg;
      z-index: 2;
      background: $module-bg;
      .item {
        display: block;
        padding: $padding;
        &:not(:last-child) {
          @include border1px($border, bottom);
        }
      }
    }
  }
  .search-main {
    flex: 1;
    overflow-y: auto;
    .shortcut-container {
      padding: $padding-lg;
      .search-history {
        display: flex;
        align-items: center;
        margin-bottom: $gap-lg;
        .history-list {
          flex: 1;
          white-space: nowrap;
          overflow-x: auto;
          margin: 0 $gap;
          .item {
            display: inline-block;
            height: 24px;
            line-height: 24px;
            border-radius: 12px;
            padding: 0 $padding;
            margin: 0 $gap-xs;
            background: rgba($gary, 0.4);
          }
        }
      }
      .hot-search {
        .title {
          padding: $padding 0;
        }
        .hot-list {
          @include flex-list($gap, $gap-mx, 2);
          padding-top: $padding;
          .item {
            display: flex;
            align-items: center;
            .index {
              display: inline-block;
              width: 24px;
              color: $text-secondary;
            }
            .icon {
              height: 1rem;
              margin-left: $gap-sm;
            }
            &.top .index {
              color: $primary;
            }
          }
        }
      }
      .feature-list {
        margin-top: $gap;
        @include flex-list($gap, $gap-mx, 2);
        .item {
          padding: $padding-lg;
          box-sizing: border-box;
          border-radius: $border-radius-md;
          background: $link-bg;
          color: #fff;
          font-size: $font-size-lg;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
