<script setup>
import headerPage from "./components/header.vue";
import { useRoute, useRouter } from "vue-router";
import { getCurrentInstance, ref } from "vue";
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
const filing = ref("");
const { proxy } = getCurrentInstance();
proxy.$post(proxy.apis.filing).then(res => {
  console.log(res);
  if (res.code == 1) {
    filing.value = res.data.filing;
  }
});
</script>

<template>
  <headerPage v-if="showHeader"></headerPage>
  <router-view />
  <a href="https://beian.miit.gov.cn/">
    <div class="company">
      <div :style="{ color: companyColor }">Copyright 2022 深圳市畅享信息科技发展有限公司版权所有</div>
      <div :style="{ color: companyColor }">备案号：{{filing}}</div>
    </div>
  </a>
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
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 300;
  position: fixed;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  text-align: center;
}
.el-input-number {
  width: 106px !important;
}
.el-input-number__decrease,
.el-input-number__increase {
  background: #fff !important;
}
.realmsgxieyi {
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__body {
    padding: 20px 30px !important;
  }
  .el-button > span {
    font-size: 14px !important;
  }
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
