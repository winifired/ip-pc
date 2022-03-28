<template>
  <div class="login">
    <Particles id="tsparticles" class="login__particles" :options="particles" />
    <div class="content-login flex row-center">
      <h3>
        欢迎使用IP分配
        <span>管理系统</span>
      </h3>
      <div class="flex row-center input">
        <User class="icon" color="#A8A8A8" />
        <input type="text" placeholder="请输入账号" v-model="account" class="font20" />
      </div>
      <div class="flex row-center input">
        <Unlock class="icon" color="#A8A8A8" />
        <input type="password" placeholder="请输入密码" v-model="password" class="font20" />
      </div>
      <div class="readPass" style="margin-top:0;">
        <div class="flex font20 cursor" @click="checked = !checked">
          <p class="box-border flex area-center">
            <Check style="width: 1em; height: 1em" color="red" v-show="checked" />
          </p>记住密码
        </div>
      </div>
      <div class="confirm font20 cursor" @click="confirm">立即登录</div>
      <div>
        <router-link to="/register" replace class="tip font20 cursor">
          没有账号？去
          <span>注册</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { particles } from "../utils/particles-config.js";
import { User, Unlock, Check } from "@element-plus/icons-vue";
import { ref } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import { useRouter } from "vue-router";
const account = ref("");
const password = ref("");
const checked = ref(false);
const router=useRouter();
const { proxy } = getCurrentInstance();
watch(() => account.value, () => {
  if (localStorage.getItem(account.value + 'Ip')) {
    checked.value=true;
    password.value = window.atob(localStorage.getItem(account.value + 'Ip'))
  }
})
function confirm() {
  if (!account.value) {
    proxy.$message.error('请输入账号');
    return;
  }
  if (!password.value) {
    proxy.$message.error('请输入密码');
    return;
  }
  proxy.$post(proxy.apis.login, {
    account: account.value,
    password: password.value,
  }).then(res => {
    console.log(res)
    if (res.code == 1) {
      if (checked.value) {
        localStorage.setItem(account.value + 'Ip', window.btoa(password.value))
      }
      proxy.$message.success('登录成功');
      localStorage.setItem('useridIp',res.data.userinfo.id)
      localStorage.setItem('userinfoIp', JSON.stringify(res.data.userinfo))
      router.replace('/');
    } else {
      proxy.$message.error(res.msg)
    }
  })
}
</script>
<style lang="scss">
@import "../common/login.scss";
</style>