# Vue3.0 + typescript 高仿网易云音乐 WebApp

## 前言

Vue3.0 的正式发布，让我心动不已，于是尝试用 vue3 实现一个完整的项目，整个项目全部使用了 composition api, 相比较 options 方式，逻辑更加清晰，使用也更加灵活。

先贴上地址，喜欢的可以 star 一波
源码地址 : https://github.com/bianyingchun/vue3-music
这里还有 [react hooks 版本](https://github.com/bianyingchun/react-music)

## 项目介绍

本项目是使用 vue-cli 4.5 搭建的项目, vue-router 以及 vuex 均为 4.0 版本，以支持 composition api 的使用。使用 typescript 编写完成。该项目的所有数据接口来自大佬 binaryify 的[网易云音乐 NodeJS 版 API](https://binaryify.github.io/NeteaseCloudMusicApi)。

本项目将会持续维护开发中，目前实现了以下模块:

### 滚动加载更多

这个项目中几乎所有的列表页都使用到了滚动加载更多的逻辑，于是我封装了一个公共 hooks,以供复用

```javascript
import _ from 'lodash'
import { Ref, onMounted, onUnmounted } from 'vue'
export function useLoadMore(
  refreshElm: Ref<null | HTMLElement>,
  loadData: () => any
) {
  let element: HTMLElement
  const _loadMore = _.throttle(() => {
    const containerHeight = element.clientHeight
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight
    if (containerHeight + scrollTop + 20 >= scrollHeight) {
      loadData()
    }
  }, 200)

  onMounted(() => {
    element = refreshElm.value as HTMLElement
    element.addEventListener('scroll', _loadMore)
  })
  onUnmounted(() => {
    element.removeEventListener('scroll', _loadMore)
  })
  return {}
}
```

### 主题切换

通过 css 变量和 sass mixin 的结合，实现了明暗主题的切换，当然你可以定义不同的主题。

```css
@mixin css-var(
  $text,
  $text-reversal,
  $text-nav,
  $header-bg,
  $text-secondary,
  $primary,
  $link-bg,
  $body-bg,
  $module-bg,
  $border
) {
  #{--body-bg}: $body-bg;
  #{--text}: $text;
  #{--text-reversal}: $text-reversal;
  #{--text-nav}: $text-nav;
  #{--text-secondary}: $text-secondary;
  #{--primary}: $primary;
  #{--header-bg}: $header-bg;
  #{--link-bg}: $link-bg;
  #{--module-bg}: $module-bg;
  #{--border}: $border;
  #{--bg-reversal-opacity-9}: rgba($text, 0.9);
}
.light {
  @include css-var(
    $text: #333,
    $text-reversal: #fff,
    $text-nav: #5d5d5d,
    $text-secondary: #888,
    $primary: #d23931,
    //active
      $link-bg: #f34d3f,
    $header-bg: #da3d34,
    $body-bg: #f0f0f0,
    $module-bg: #fff,
    $border: #ccc
  );
}
.dark {
  @include css-var(
    $text: #fff,
    $text-reversal: #333,
    $text-nav: #d7d7d7,
    $text-secondary: #ccc,
    $primary: #f1423d,
    $link-bg: #414141,
    $header-bg: #414141,
    $body-bg: #262626,
    $module-bg: #2c2c2c,
    $border: #4e4a4a
  );
}
```
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/407efbddb7354843adb4056c688c7326~tplv-k3u1fbpfcp-watermark.image" width="300px" alt="亮色主题">
<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb52079c81c54d918c5377a5fa878b46~tplv-k3u1fbpfcp-watermark.image" width="300px" alt="亮色主题">

### 登录

通过登录以体验更丰富的功能，如发表评论，点赞，关注用户，歌手，收藏歌曲，创建歌单等。在未登录状态下触及到这些功能时会自动显示登录界面，登录成功后会返回到当前页面，刷新当前用户状态。
为了共享用户状态，我将用户状态保存到 store 中，并抽离出公共逻辑 useAuth.ts

```javascript
export function useAuth(store: Store<GlobalState>) {
  const account = computed(() => store.state.auth.account);
  const profile = computed(() => store.state.auth.profile);
  const toggleLoginBox = (val: boolean) =>
    store.commit(`auth/${SET_LOGIN_VISIBLE}`, val);
  return {
    account,
    profile,
    toggleLoginBox,
  };
}
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7630a1ebf234440bb5c34f25165e1c9f~tplv-k3u1fbpfcp-watermark.image =300)
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7630a1ebf234440bb5c34f25165e1c9f~tplv-k3u1fbpfcp-watermark.image" width="300px" alt="亮色主题">

### 个人中心
在用户登录成功，个人中心会显示用户信息，以及个人创建和收藏的歌单， 用户可以创建、删除、编辑歌单、取消收藏的歌单。

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5c024d3bf0e4cadb3ceaa1c7b3bbd63~tplv-k3u1fbpfcp-watermark.image" width="300px" alt="个人中心" ><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec718fabb36a45a6b5fd358961e57dae~tplv-k3u1fbpfcp-watermark.image" width="300px" alt="创建歌单">

### 播放器
播放器算是此项目中最核心的模块了。实现了一个播放器应该有的基本功能。
- 列表播放
- 插入歌曲
- 切换歌曲
- 从播放列表中删除歌曲
- 清空播放列表
- 切换播放模式
- 歌词同步
- 调整播放进度
- 添加到歌单
由于在多个页面中使用到了播放歌曲的功能，我抽离出了公共逻辑 usePlayMusic.ts
```javascript
export function usePlayMusic(store: Store<GlobalState>) {
  const playing = computed(() => store.state.player.playing);
  const currentSong = computed(() => store.getters["player/currentSong"]);
  function selectPlay(list: Track[], index: number) {
    store.dispatch("player/selectPlay", {
      list,
      index,
    });
  }
  function insertSong(song: Track) {
    store.dispatch("player/insertSong", song);
  }
  return {
    currentSong,
    insertSong,
    selectPlay,
    playing,
  };
}
```
在实现收藏歌曲到歌单时，考虑到这个功能多次被使用，且无需反复创建，故设计为公共单例组件，并封装成 hooks,方便调用。
```javascript
import { ref, createApp, App, h } from "vue";
import Comp from "@/components/achive/fav-to-mix.vue";
import { useMylist } from "./usePlaylist";
import { useAuth } from "./useAuth";
import { Track, Playlist } from "@/types";
import store from "@/store";

let favToMixVm: App | null = null;

const show = ref(false);
function hide() {
  show.value = false;
}

export function favTrackToMix(track: Track) {
  const { account, toggleLoginBox } = useAuth(store);
  if (!account.value) return toggleLoginBox(true);
  show.value = true;
  const { likelist, createdList, addTrack } = useMylist(store);
  const list = likelist.value
    ? [likelist.value, ...createdList.value]
    : createdList.value;
  async function onSelect(mix: Playlist) {
    show.value = false;
    await addTrack(mix.id, track);
  }
  if (!favToMixVm) {
    favToMixVm = createApp({
      setup() {
        return () =>
          h(Comp, {
            show: show.value,
            list,
            hide,
            onSelect,
          });
      },
    });
    const el = document.createElement("div");
    document.body.appendChild(el);
    favToMixVm.mount(el);
  }
}
```
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf13802fe9b648d3a4ce710ea50f7e2f~tplv-k3u1fbpfcp-watermark.image" width="300px">
<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6a4c7bceb8a44bb9af7677446f8ec0d~tplv-k3u1fbpfcp-watermark.image" width="300px" >
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3948f9b150a84051a352a01a4c18c4c1~tplv-k3u1fbpfcp-watermark.image" width="300px">
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/808c839b5e234e31aa192b2c1d10c555~tplv-k3u1fbpfcp-watermark.image" width="300px">

### 搜索
搜索页面中，实现功能的功能有
+ 搜索歌手、歌单、歌曲、用户
+ 搜索提示（函数防抖）
+ 热门搜索、历史搜索

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb1298a2074049508167e407e53fa6bc~tplv-k3u1fbpfcp-watermark.image" width="300px"><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a253e10361a45e1ae4a2e45945a043c~tplv-k3u1fbpfcp-watermark.image" width="300px" >

### 歌单详情
在歌单页面中，可以收藏和取消收藏其他用户的歌单，点击歌曲可以播放整个歌单歌曲列表，如果是自己的歌单可以将歌曲从歌单中删除。补充：排行榜的详情页以及每日推荐其实也是歌单，只是歌曲样式稍有不同。

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38f1dc27c49945f5ad6a42f254636b4c~tplv-k3u1fbpfcp-watermark.image" width="300px">

### 评论
歌曲和歌单的评论是同一个组件，只是传入的参数不同。
实现的功能有
- 评论列表
- 发布评论
- 回复评论
- 查看回复列表
- 点赞评论
- 删除自己发布的评论

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/295b10bc5878451a8a1fba80d83615c2~tplv-k3u1fbpfcp-watermark.image" width="300px"><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08e15f4766b448209d83b3d94d1d552c~tplv-k3u1fbpfcp-watermark.image" width="300px">

### 用户主页
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e574fb3614e4bbcbacb6ba60ad02864~tplv-k3u1fbpfcp-watermark.image" width="300px" >

### 关注/粉丝列表
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c966d025a23b498a89518c8d7fa16fbb~tplv-k3u1fbpfcp-watermark.image" width="300px" >

### 歌手主页
歌手主页和用户主页使用的是同一个布局组件，通过传入 slot 插槽, 呈现不同的主体。
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/404dba10e33c49288fd908601ae06229~tplv-k3u1fbpfcp-watermark.image" width="300px">

### 歌手分类
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50be853ac3634f66b8bc20c7fe74f2cd~tplv-k3u1fbpfcp-watermark.image" width="300px">

### 歌单广场
 <img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebec13ac679c4f059b97f864980a32c5~tplv-k3u1fbpfcp-watermark.image"  width="300px">

### 排行榜
 <img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22fc83be43fb4180b8801d6328f162de~tplv-k3u1fbpfcp-watermark.image" width="300px">

## 项目运行

1. 克隆到本地
   git clone https://github.com/bianyingchun/react-music.git

2. 安装依赖
   yarn install

3. 运行
   yarn serve

4. 打包
   yarn build


