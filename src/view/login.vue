<template>
  <div class="login">
    <Particles id="tsparticles" class="login__particles" :options="particles" />
  </div>
</template>
<script setup>
import { particles } from '../utils/particles-config.js'
</script>
<style lang="scss">
.login {
  flex: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  height: 100vh;
  width:100vm;
  overflow: hidden;

  &__particles {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('../assets/bg1.jpg');
  }
}
</style>