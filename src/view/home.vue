<template>
  <div class="login"></div>
</template>
<script setup>
import { sidan } from "../utils/ribbon.js";
sidan();
</script>
<style lang="scss" scoped>
.login {
  height: calc(100vh - 80px);
  width: 100vw;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("../assets/bg1.jpg");
}
</style>