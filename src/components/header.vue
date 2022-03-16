<script setup>
import { onMounted, ref, watch } from "vue";
import {useRoute, useRouter} from "vue-router"
const prop = defineProps({
  chooseHeadNav: {
    type: [Number, String],
    default: 1,
  },
});
const navbar = ref([
  { id: 1, name: "首页" },
  { id: 2, name: "节点" },
  { id: 3, name: "充值" },
]);
const chooseNav = ref(prop.chooseHeadNav);
const router=useRouter();
const route=useRoute();
const userinfo=ref(null);
onMounted(()=>{
  if(localStorage.getItem('useridIp')){
    userinfo.value=localStorage.getItem('userinfoIp')
  }
})
watch(() => route.name,(newData) => {
  if(newData=='home'){
    chooseNav.value=1
  }else if(newData=='nodePges'){
    chooseNav.value=2
  }else if(newData=='recharge'){
    chooseNav.value=3
  }else if(newData=='user'){
    chooseNav.value=4
  }
})
function toggelHeadNav(id) {
  chooseNav.value = id;
  if(id==1){
    router.push('/');
  }else if(id==2){
    router.push('/nodePges');
  }else if(id==3){
    router.push('/recharge');
  }else if(id==4){
    router.push('/user/purchase');
  }
}
</script>

<template>
  <div>
    <div class="flex area-between header">
      <img src="../assets/avatar.png" alt="" class="logo" />
      <ul class="flex area-between">
        <li
          v-for="item in navbar"
          :key="item.id"
          :class="chooseNav == item.id ? 'actived' : ''"
          class="cursor"
          @click="toggelHeadNav(item.id)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="flex row-center font22 colorfff cursor" @click="toggelHeadNav(4)">
        <img :src="userinfo&&userinfo.avatar?userinfo.avatar:'../assets/avatar.png'" alt="" class="avatar" />
        {{userinfo&&userinfo.nickname?userinfo.nickname:''}}
      </div>
    </div>
    <div style="height: 80px"></div>
  </div>
</template>

<style scoped lang="scss">
.header {
  height: 80px;
  background: #45aeff;
  box-shadow: 0px 0px 22px 2px rgba(159, 159, 159, 0.22);
  padding: 0 43px 0 39px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 50;
  .logo {
    width: 50px;
    height: 50px;
  }
  ul {
    width: 440px;
    height: 80px;
  }
  li {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
    line-height: 83px;
    width: 82px;
    text-align: center;
    position: relative;
    height: 100%;
    list-style: none;
  }
  .actived:after {
    width: 100%;
    height: 4px;
    background: #ffffff;
    position: absolute;
    bottom: 0;
    left: 0;
    content: "";
  }
  .actived {
    color: #ffffff !important;
    font-size: 26px !important;
    font-weight: 500;
  }
  .avatar {
    width: 50px;
    height: 50px;
    margin-right: 18px;
  }
}
</style>
