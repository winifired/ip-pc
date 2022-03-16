<template>
  <div class="box">
    <div class="content flex">
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
        :style="{ gridTemplateRows: activedLi != 'commission' ? '200px calc(100% - 220px)' : '318px calc(100% - 338px)' }"
      >
        <div class="title flexc column-bwn">
          <div class="flex area-between">
            <div class="flex row-center userMsg">
              <img src="../../assets/avatar.png" alt />
              <div class="font20 color707">
                <p>15896532121</p>
                <p>代理商1</p>
              </div>
            </div>
            <p class="font20 coloreff cursor" v-if="activedLi == 'commission'">复制链接</p>
          </div>
          <div class="flex numberToatal" v-if="activedLi == 'commission'">
            <div class="flexc area-center colorfff">
              <p class="font40">150.00</p>
              <p class="font18">共获取佣金</p>
            </div>
            <div class="flexc area-center colorfff">
              <p class="font40">10</p>
              <p class="font18">推广人员</p>
            </div>
          </div>
          <div class="font20 color000">{{ titleMsgText }}</div>
        </div>
        <div ref="table">
          <!-- <component :is="" ></component> -->
          <purchase
            :offsetHeight="offsetHeight"
            v-if="activedLi == 'purchase' && !showPurchaseDetail"
            @titleMsg="titleMsg"
          ></purchase>
          <purchaseDetail
            :offsetHeight="offsetHeight"
            v-if="showPurchaseDetail"
            @titleMsg="titleMsg"
          ></purchaseDetail>
          <expired
            :offsetHeight="offsetHeight"
            v-if="activedLi == 'expired' && !showPurchaseDetail"
            @titleMsg="titleMsg"
          ></expired>
          <level :offsetHeight="offsetHeight" v-if="activedLi == 'level'" @titleMsg="titleMsg"></level>
          <rechargeRecord
            :offsetHeight="offsetHeight"
            v-if="activedLi == 'rechargeRecord'"
            @titleMsg="titleMsg"
          ></rechargeRecord>
          <changePassword v-if="activedLi == 'changePassword'" @titleMsg="titleMsg"></changePassword>
          <commission
            :offsetHeight="offsetHeight"
            v-if="activedLi == 'commission'"
            @titleMsg="titleMsg"
          ></commission>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { computed, defineAsyncComponent, nextTick, watch } from "@vue/runtime-core";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const purchase = defineAsyncComponent(() => import("../../components/purchase.vue"));
const purchaseDetail = defineAsyncComponent(() => import("../../components/purchase-detail.vue"));
const expired = defineAsyncComponent(() => import("../../components/expired.vue"));
const level = defineAsyncComponent(() => import("../../components/level.vue"));
const rechargeRecord = defineAsyncComponent(() => import("../../components/rechargeRecord.vue"));
const changePassword = defineAsyncComponent(() => import("../../components/changePassword.vue"));
const commission = defineAsyncComponent(() => import("../../components/commission.vue"));

const list = [
  { id: "purchase", name: "购买记录" }, //purchase
  { id: "commission", name: "推广返佣" }, //commission
  { id: "changePassword", name: "修改密码" }, //changePassword
  { id: "rechargeRecord", name: "充值记录" }, //rechargeRecord
  { id: "level", name: "代理等级" }, //level
  { id: "expired", name: "最近到期" }, //expired
];
const route = useRoute();
const router = useRouter();
console.log(route);
const activedLi = ref("purchase");
const table = ref(null);
const offsetHeight = ref(0);
const showPurchaseDetail = ref(false);
const titleMsgText = ref('');
onMounted(() => {
  nextTick(() => {
    offsetHeight.value = table.value.offsetHeight - 50 + 'px';
  });
  changeRouter(route.params.name)
})
watch(
  () => route.params.name,
  (newData) => {
    console.log(newData)
    changeRouter(newData)
  }
);
function toggleActive(id) {
  router.push('/user/' + id);
}
function changeRouter(newData) {
  if (newData != 'purchaseDetail') {
    showPurchaseDetail.value = false;
    activedLi.value = newData;
  } else {
    showPurchaseDetail.value = true;
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
</script>
<style scoped lang="scss">
@import "../../common/user.scss";
</style>