<template>
  <div>
    <header>
      <div class="nav-list">
        <router-link to="/mine">我的</router-link>
        <router-link to="/discovery">发现</router-link>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
