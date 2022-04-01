<template>
  <Particles id="tsparticles" class="login__particles" :options="particles" />
  <div class="home">
    <div class="home-content">
      <h1>极速稳定、安全便捷、品质保证</h1>
      <div class="tip">
        精选电信、联通、移动等骨干节点布局，全年7×24小时不间断运维监控,专业工程师
        随时为您保驾护航，多年的客服售后经验，能够迅速帮您解决加速遇到的问题
      </div>
      <div class="flex area-between urls">
        <a :href="info.length>0?info[0].url:''" download="畅享ip">
          <p class="flex area-center colorfff cursor font26">
            Win10版
            <img src="../assets/window.png" alt />
          </p>
        </a>
        <a :href="info.length>0?info[1].url:''" download="畅享ip">
          <p class="flex area-center colorfff cursor font26">
            电脑端
            <img src="../assets/window.png" alt />
          </p>
        </a>
        <a :href="info.length>0?info[2].url:''" download="畅享ip">
          <p class="flex area-center colorfff cursor font26">
            安卓端
            <img src="../assets/android.png" alt />
          </p>
        </a>
        <a :href="info.length>0?info[3].url:''" download="畅享ip">
          <p class="flex area-center colorfff cursor font26">
            苹果端
            <img src="../assets/ios.png" alt />
          </p>
        </a>
      </div>
      <div class="colorfff font18">
        华为创立于1987年，是全球领先的ICT（信息与通信）基础设施和智能终端提供商。目前华为约有19.7万员工，业务遍及170多个国家和地区，服务全球30多亿人口。
        华为致力于把数字世界带入每个人、每个家庭、每个组织，构建万物互联的智能世界：让无处不在的联接，成为人人平等的权利，成为智能世界的前提和基础；为世界提供最强算力，让云无处不在，让智能无所不及；所有的行业和组织，因强大的数字平台而变得敏捷、高效、生机勃勃；通过AI重新定义体验，让消费者在家居、出行、办公、影音娱乐、运动健康等全场景获得极致的个性化智慧体验。
      </div>
      <div class="flex area-between imgs">
        <img src="../assets/1.png" alt />
        <img src="../assets/2.png" alt />
        <img src="../assets/3.png" alt />
      </div>
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import { particles } from "../utils/ribbon.js";
const { proxy } = getCurrentInstance();
const info = ref([]);
onMounted(() => {
  getData();
});
function getData() {
  proxy.$post(proxy.apis.link).then(res => {
    console.log(res);
    if (res.code == 1) {
      info.value = res.data.list;
    } else {
      proxy.$message.error(res.msg);
    }
  });
}
</script>
<style lang="scss" scoped>
.home {
  min-height: calc(100vh - 80px);
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("../assets/bg1.jpg");
  &-content {
    position: relative;
    z-index: 20;
    width: 1230px;
    margin: 0 auto;
    padding-top: 200px;
    padding-bottom: 169px;
  }
  h1 {
    font-size: 80px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
  }
  .tip {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 50px;
    margin-top: 43px;
  }
  .urls {
    margin-top: 139px;
    margin-bottom: 189px;
    p {
      width: 230px;
      height: 90px;
      background: #1474fc;
      border: 2px solid #ffffff;
      border-radius: 14px;
    }
    img {
      width: 37px;
      height: 42px;
      margin-left: 14px;
    }
  }
  .imgs {
    margin-top: 87px;
    > img {
      width: 380px;
      height: 251px;
    }
  }
}
</style>