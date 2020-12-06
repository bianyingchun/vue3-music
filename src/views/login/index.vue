<template>
  <div class="login-wraper">
    <div class="icon">
      <img src="@/assets/logo.png" alt="" />
    </div>
    <div class="login-info">
      <div class="form-item"><input type="text" v-model="account" /></div>
      <div class="form-item"><input type="password" v-model="password" /></div>
      <div class="form-item">
        <button @click="login" class="login-btn">一键登录</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalState } from '@/typing'
export default defineComponent({
  setup() {
    const account = ref<string>('')
    const password = ref<string>('')
    const store = useStore<GlobalState>()
    function login() {
      store.dispatch('auth/login', {
        account: account.value,
        password: password.value
      })
    }
    return {
      account,
      login,
      password
    }
  }
})
</script>
<style lang="scss" scoped>
.login-wraper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: red;
  color: #fff;
  justify-content: flex-end;
  .icon {
    margin: auto;
  }
  .login-info {
    padding: 50px;
    .form-item {
      > * {
        width: 100%;
        height: 30px;
        width: 100%;
        line-height: 30px;
        margin-bottom: 10px;
        border-radius: 15px;
        border: none;
      }
      .login-btn {
      }
    }
  }
}
</style>
