<template>
  <div class="ipcontent">
    <div class="flex area-between header">
      <img :src="logo" alt class="logo" />
      <ul class="flex area-between">
        <li
          v-for="item in navbar"
          :key="item.id"
          :class="chooseNav == item.id ? 'actived' : ''"
          class="cursor"
          @click="toggelHeadNav(item.id)"
        >{{ item.name }}</li>
      </ul>
      <el-popover
        placement="bottom"
        :width="150"
        trigger="hover"
      >
        <template #reference>
          <div class="flex row-center font22 colorfff cursor" @click="toggelHeadNav(4)">
            <img src="../assets/avatar.png" alt class="avatar" />
            <div>
              {{ userinfo && userinfo.nickname ? userinfo.nickname : '' }}
              <p v-if="userinfo" class="font16">余额：{{ userinfo.money}}</p>
            </div>
          </div>
        </template>
        <template #default>
          <div class="flex area-center outlogin font24 cursor" @click="loginout">
            <img src="../assets/outlogin.svg" alt="">
            退出登录
          </div>
        </template>
      </el-popover>
    </div>
    <div style="height: 80px"></div>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const prop = defineProps({
  chooseHeadNav: {
    type: [Number, String],
    default: 1
  }
});
const navbar = ref([
  { id: 1, name: "首页" },
  { id: 4, name: "个人中心" }
]);
const chooseNav = ref(prop.chooseHeadNav);
const router = useRouter();
const route = useRoute();
const userinfo = ref(null);
const store=useStore();
const logo=ref('');
const userid = ref(store.state.userinfo);
const {proxy}=getCurrentInstance();
onMounted(() => {
  if (store.state.userinfo) {
    userinfo.value = store.state.userinfo;
    if(userinfo.value.level==3){
      if(userinfo.value.switch&&userinfo.value.switch==2){
        navbar.value.splice(1, 0, { id: 2, name: "节点购买" });
      }
    }else{
      navbar.value.splice(1, 0, { id: 2, name: "节点购买" });
    }
    if(userinfo.value.level==1){
      navbar.value.push({ id: 3, name: "充值" });
    }
  }
  showPage(route.name);
  proxy.$get(proxy.apis.link).then(res => {
    if (res.code == 1) {
      logo.value=res.data.logo;
    } else {
      proxy.$message.error(res.msg)
    }
  })
});
watch(
  () => route.name,
  newData => {
    showPage(newData);
  }
);
watch(
  () => store.state.userinfo,
  newData => {
    userinfo.value =newData
  },{
    deep:true
  }
);
function showPage(name) {
  if (name == "home") {
    chooseNav.value = 1;
  } else if (name == "nodePges") {
    chooseNav.value = 2;
  } else if (name == "recharge") {
    chooseNav.value = 3;
  } else if (name == "user") {
    chooseNav.value = 4;
  }
}
function toggelHeadNav(id) {
  chooseNav.value = id;
  if (id == 1) {
    router.push("/");
  } else if (id == 2) {
    router.push("/nodePges");
  } else if (id == 3) {
    router.push("/recharge");
  } else if (id == 4) {
    router.push("/user/purchase");
  }
}
function loginout() {
  localStorage.removeItem("useridIp");
  localStorage.removeItem("userinfoIp");
  router.replace("/login");
}
</script>
<style scoped lang="scss">
.ipcontent{
  min-width:1200px;
}
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
    width: 167px;
    height: 65px;
  }
  ul {
    width: 440px;
    height: 80px;
  }
  li {
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.9);
    line-height: 83px;
    min-width: 82px;
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
    font-size: 24px !important;
    font-weight: 500;
  }
  .avatar {
    width: 50px;
    height: 50px;
    margin-right: 18px;
    border-radius: 50%;
  }
  .yue {
    margin-left: 12px;
  }
}
.outlogin{
    img{
      width:20px;
      height:20px;
      margin-right:10px;
    }
  }
</style>
