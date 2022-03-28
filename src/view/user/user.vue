<template>
  <div class="box">
    <div class="content-user flex">
      <div class="left">
        <ul>
          <li
            v-for="item in list"
            :key="item.id"
            class="font20 color000 cursor"
            :class="item.id == activedLi ? 'activedLi' : ''"
            @click="toggleActive(item.id)"
          >{{ item.name }}</li>
        </ul>
      </div>
      <div
        class="right"
        :style="{ gridTemplateRows: activedLiItem != 'commission' ? '200px calc(100% - 220px)' : '318px calc(100% - 338px)' }"
      >
        <div class="title flexc column-bwn">
          <div class="flex area-between">
            <div class="flex row-center userMsg">
              <img :src="userinfo.avatar" alt />
              <div class="font20 color707">
                <p>{{ userinfo.username }}</p>
                <p v-if="userinfo.level > 0">{{ userinfo.level_name }}</p>
              </div>
            </div>
            <p class="font20 coloreff cursor" v-if="activedLiItem == 'commission'">复制链接</p>
          </div>
          <div class="flex numberToatal" v-if="activedLiItem == 'commission'">
            <div class="flexc area-center colorfff">
              <p class="font40">{{ commissionMsg && commissionMsg.money ? commissionMsg.money : 0 }}</p>
              <p class="font18">共获取佣金</p>
            </div>
            <div class="flexc area-center colorfff">
              <p class="font40">{{ commissionMsg && commissionMsg.num ? commissionMsg.num : 0 }}</p>
              <p class="font18">推广人员</p>
            </div>
          </div>
          <div class="font20 color000 flex area-between">
            <p>{{ titleMsgText }}</p>
            <div class="flex column-end btns" v-if="activedLiItem == 'purchaseDetail'">
              <button @click="extendOp">续费IP</button>
              <button @click="exportOp">导出</button>
            </div>
          </div>
        </div>
        <div ref="table">
          <purchase
            :offsetHeight="offsetHeight"
            v-if="activedLiItem == 'purchase'"
            @titleMsg="titleMsg"
          ></purchase>
          <purchaseDetail
            :offsetHeight="offsetHeight"
            v-if="activedLiItem == 'purchaseDetail'"
            @titleMsg="titleMsg"
            ref="detailVue"
          ></purchaseDetail>
          <expired
            :offsetHeight="offsetHeight"
            v-if="activedLiItem == 'expired'"
            @titleMsg="titleMsg"
          ></expired>
          <level :offsetHeight="offsetHeight" v-if="activedLiItem == 'level'" @titleMsg="titleMsg"></level>
          <rechargeRecord
            :offsetHeight="offsetHeight"
            v-if="activedLiItem == 'rechargeRecord'"
            @titleMsg="titleMsg"
          ></rechargeRecord>
          <changePassword v-if="activedLiItem == 'changePassword'" @titleMsg="titleMsg"></changePassword>
          <commission
            :offsetHeight="offsetHeight"
            v-if="activedLiItem == 'commission'"
            @titleMsg="titleMsg"
            @numberMsg="numberMsg"
          ></commission>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { defineAsyncComponent, nextTick, watch } from "@vue/runtime-core";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const purchase = defineAsyncComponent(() => import("../../components/purchase.vue"));
const purchaseDetail = defineAsyncComponent(() => import("../../components/purchase-detail.vue"));
const expired = defineAsyncComponent(() => import("../../components/expired.vue"));
const level = defineAsyncComponent(() => import("../../components/level.vue"));
const rechargeRecord = defineAsyncComponent(() => import("../../components/rechargeRecord.vue"));
const changePassword = defineAsyncComponent(() => import("../../components/changePassword.vue"));
const commission = defineAsyncComponent(() => import("../../components/commission.vue"));
const userinfo = JSON.parse(localStorage.getItem('userinfoIp'))
const list = [
  { id: "purchase", name: "购买记录" }, //purchase
  // { id: "commission", name: "推广返佣" }, //commission
  { id: "changePassword", name: "修改密码" }, //changePassword
  { id: "rechargeRecord", name: "充值记录" }, //rechargeRecord
  { id: "level", name: "代理等级" }, //level
  { id: "expired", name: "最近到期" }, //expired
];
if (userinfo.level > 0) {
  list.splice(1,0,{ id: "commission", name: "推广返佣" })
}
const route = useRoute();
const router = useRouter();
const activedLi = ref('purchase');
const activedLiItem = ref('purchase');
const table = ref(null);
const offsetHeight = ref(0);
const titleMsgText = ref('');
const commissionMsg = ref(null);
onMounted(() => {
  nextTick(() => {
    offsetHeight.value = table.value.offsetHeight - 50 + 'px';
  });
  changeRouter(route.params.name)
})
watch(
  () => route.params.name,
  (newData) => {
    changeRouter(newData)
  }
);

function toggleActive(id) {
  router.push('/user/' + id);
}
function changeRouter(newData) {
  activedLiItem.value = newData;
  if (newData != 'purchaseDetail') {
    activedLi.value = newData;
  } else {
    if (localStorage.getItem('userTabr') == 'purchase') {
      activedLi.value = 'purchase';
    } else if (localStorage.getItem('userTabr') == 'expired') {
      activedLi.value = 'expired';
    }
  }
  localStorage.setItem('userTabr', activedLi.value);
}
function titleMsg(msg) {
  titleMsgText.value = msg
}
function numberMsg(msg) {
  commissionMsg.value = msg
};
const detailVue = ref(null);
const extendOp = () => {
  nextTick(() => {
    detailVue.value.extendVue();
  })
}
const exportOp = () => {
  nextTick(() => {
    detailVue.value.exportVue();
  })
}
</script>
<style scoped lang="scss">
@import "../../common/user.scss";
.btns {
  button {
    width: 120px;
    height: 50px;
    background: #45aeff;
    border-radius: 6px;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 300;
    color: #ffffff;
    line-height: 50px;
    text-align: center;
    margin-right: 26px;
    cursor: pointer;
  }
}
</style>