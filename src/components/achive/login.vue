<template>
  <div class="login-wraper" v-if="showLogin">
    <span class="iconfont icon-back" @click="toggleLoginBox(false)"></span>
    <div class="icon">
      <img src="@/assets/pics/logo.png" alt="" />
    </div>
    <div class="login-info">
      <div class="form-item">
        <input type="text" v-model="phone" placeholder="账号" />
      </div>
      <div class="form-item">
        <input type="password" v-model="password" placeholder="密码" />
      </div>
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
import useAuthStore from '@/store/auth'
export default defineComponent({
  setup() {
    const phone = ref('')
    const password = ref('')
    const store = useAuthStore()
    const islogining = computed(() => store.isLogining)
    const showLogin = computed(() => {
      return !store.account && store.loginVisible
    })
    const toggleLoginBox = (value: boolean) => (store.loginVisible = value)

    function login() {
      store.login({
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
        height: 36px;
        line-height: 36px;
        margin-bottom: 10px;
        border-radius: 36px;
        border: none;
        padding: 0 $padding-lg;
        box-sizing: border-box;
        font-size: $font-size-lg;
      }
      input {
        background: rgba(255, 255, 255, 0.8);
      }
      .login-btn {
        background: #fff;
        color: $primary;
      }
    }
  }
}
</style>
