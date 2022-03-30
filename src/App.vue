<script setup>
import headerPage from "./components/header.vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
const route = useRoute();
const router = useRouter();
const showHeader = ref(false);
const companyColor = ref("#7c7c7c");
watch(
  () => route.name,
  newData => {
    if (newData == "login" || newData == "register") {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
    if (newData == "home") {
      companyColor.value = "#ffffff";
    } else {
      companyColor.value = "#7c7c7c";
    }
  }
);
</script>

<template>
  <headerPage v-if="showHeader"></headerPage>
  <router-view />
  <div class="company" :style="{ color: companyColor }">Copyright © 2022 XXXXXX有限公司</div>
</template>

<style lang="scss">
@import "./common/public.scss";
.m-2 {
  .el-input__inner {
    height: 50px !important;
    font-size: 18px !important;
    font-family: PingFang SC;
    font-weight: 300;
    color: #1a1a1a !important;
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.company {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 300;
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
}
.el-input-number {
  width: 106px !important;
}
.el-input-number__decrease,
.el-input-number__increase {
  background: #fff !important;
}
.realmsg {
  .el-dialog__header {
    border-bottom: 1px solid #f7f7f7;
  }
  .el-dialog__body {
    padding: 20px 30px !important;
  }
  .el-button > span {
    font-size: 14px !important;
  }
}
.realmsgzfb {
  .el-dialog__footer,
  .el-dialog__body,
  .el-dialog__header {
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
