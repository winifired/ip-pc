<template>
  <div class="login"></div>
</template>
<script setup>
import Ribbons from "../utils/ribbon.js";
Ribbons;
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