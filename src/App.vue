<script setup>
import headerPage from "./components/header.vue";
import { useRouter } from "vue-router";
import { ref } from "@vue/reactivity";
const router = useRouter();
const showHeader = ref(false);
const companyColor = ref('#7c7c7c');
router.beforeEach((to, form,next) => {
  console.log(to);
  if (to.name == "login" || to.name == "register") {
    showHeader.value = false;
  } else {
    showHeader.value = true;
  }
  if (to.name == "home") {
    companyColor.value = '#ffffff';
  } else {
    companyColor.value = '#7c7c7c';
  }
  next();
});
</script>

<template>
  <headerPage v-show="showHeader"></headerPage>
  <router-view />
  <div class="company" :style="{color:companyColor}">Copyright © 2022 XXXXXX有限公司</div>
</template>

<style lang="scss">
@import "./common/public.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.company {
  margin-top: 20px;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 300;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
