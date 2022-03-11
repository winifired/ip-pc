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
            @click="activedLi = item.id"
          >{{ item.name }}</li>
        </ul>
      </div>
      <div class="right">
        <div class="title flexc column-bwn">
          <div class="flex row-center userMsg">
            <img src="../../assets/avatar.png" alt />
            <div class="font20 color707">
              <p>15896532121</p>
              <p>代理商1</p>
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
          <level
            :offsetHeight="offsetHeight"
            v-if="activedLi == 'level'"
            @titleMsg="titleMsg"
          ></level>
          <rechargeRecord
            :offsetHeight="offsetHeight"
            v-if="activedLi == 'rechargeRecord'"
            @titleMsg="titleMsg"
          ></rechargeRecord>
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
const titleMsgText = ref('购买记录');
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
watch(() => activedLi.value, (newData) => {
  router.push('/user/' + newData)
})
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