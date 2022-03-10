<template>
  <div class="login">
    <Particles id="tsparticles" class="login__particles" :options="particles" />
    <div class="content flex row-center">
      <h3>欢迎使用IP分配<span>管理系统</span></h3>
      <div class="flex row-center input">
        <User class="icon" color="#A8A8A8" />
        <input type="text" placeholder="请输入账号" v-model="account" class="font20" />
      </div>
      <div class="flex row-center input">
        <Unlock class="icon" color="#A8A8A8" style="width:1.8em;height:1.8em;" />
        <input type="text" placeholder="请输入密码" v-model="password" class="font20" />
      </div>
     <div class="flex row-center input">
        <Unlock class="icon" color="#A8A8A8" style="width:1.8em;height:1.8em;" />
        <input type="text" placeholder="请再次输入密码" v-model="passwordreset" class="font20" />
      </div>
      <div class="confirm font20 cursor">立即注册</div>
      <div>
        <router-link to="/login" replace class="tip font20">已有账号？去<span>登录</span></router-link>
      </div>
    </div>
  </div>
  <div class="company">Copyright © 2022  XXXXXX有限公司</div>
</template>
<script setup>
import { particles } from "../utils/particles-config.js";
import { User, Unlock, Check } from "@element-plus/icons-vue";
import { ref } from "@vue/reactivity";
const account = ref("");
const password = ref("");
const checked=ref(false);
</script>
<style lang="scss">
@import "../common/login.scss";
</style>