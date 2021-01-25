<template>
  <div class="login-wraper" v-if="showLogin">
    <span class="iconfont icon-back" @click="toggleLoginBox(false)"></span>
    <div class="icon">
      <img src="@/assets/logo.png" alt="" />
    </div>
    <div class="login-info">
      <div class="form-item"><input type="text" v-model="phone" /></div>
      <div class="form-item"><input type="password" v-model="password" /></div>
      <div class="form-item">
        <button @click="login" class="login-btn" :disabled="islogining">
          一键登录
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalState } from '@/types'
import { SET_LOGIN_VISIBLE } from '@/store/action-types'
export default defineComponent({
  setup() {
    const phone = ref('')
    const password = ref('')
    const store = useStore<GlobalState>()
    const islogining = computed(() => store.state.auth.isLogining)
    const showLogin = computed(() => {
      const { loginVisible, account } = store.state.auth
      return !account && loginVisible
    })
    const toggleLoginBox = (value: boolean) =>
      store.commit(`auth/${SET_LOGIN_VISIBLE}`, value)
    function login() {
      store.dispatch('auth/login', {
        account: phone.value,
        password: password.value
      })
    }
    return {
      islogining,
      showLogin,
      toggleLoginBox,
      phone,
      login,
      password
    }
  }
})
</script>
<style lang="scss" scoped>
.login-wraper {
  position: fixed;
  z-index: $login-box-index;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: red;
  color: #fff;
  justify-content: flex-end;
  .icon-back {
    position: absolute;
    top: $padding-lg;
    left: $padding-lg;
    padding: $padding-sm;
    font-size: $font-size-lg;
  }
  .icon {
    margin: auto;
  }
  .login-info {
    padding: 50px;
    .form-item {
      > * {
        width: 100%;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        border-radius: 15px;
        border: none;
        padding: 0 $padding-lg;
        box-sizing: border-box;
      }
      .login-btn {
        background: #fff;
        color: $primary;
      }
    }
  }
}
</style>
