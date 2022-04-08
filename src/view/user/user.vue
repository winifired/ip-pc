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
          <div class="flex area-between" v-if="userinfo">
            <div class="flex row-center userMsg">
              <img src="../../assets/avatar.png" alt />
              <div class="font20 color707">
                <p>{{ userinfo.username }}</p>
                <p v-if="userinfo.level > 0">{{ userinfo.level_name }}</p>
              </div>
            </div>
            <div class="flex row-center">
              <p
              class="font20 coloreff cursor"
              v-if="activedLiItem == 'commission'&&userinfo && userinfo.level==1"
              @click="copy(1)"
            >推广代理</p>
            <p
              class="font20 coloreff cursor"
              style="margin-left:20px;"
              v-if="activedLiItem == 'commission'&&userinfo && userinfo.level!=3"
              @click="copy(2)"
            >推广客户</p>
            </div>
          </div>
          <div class="flex numberToatal" v-if="activedLiItem == 'commission'">
            <div class="flexc area-center colorfff cursor" @click="togglecommission(1)">
              <p class="font40">{{ commissionMsg && commissionMsg.money ? commissionMsg.money : 0 }}</p>
              <p class="font18">共获取佣金</p>
            </div>
            <div class="flexc area-center colorfff cursor" @click="togglecommission(2)">
              <p class="font40">{{ commissionMsg && commissionMsg.num ? commissionMsg.num : 0 }}</p>
              <p class="font18">推广人员</p>
            </div>
          </div>
          <div class="font20 color000 flex area-between">
            <p>{{ titleMsgText }}</p>
            <div
              class="flex column-end btns"
              v-if="activedLiItem == 'purchaseDetail' || activedLiItem == 'expired'"
            >
              <p class="font18 flex area-center search cursor" @click="searchIp">
                <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索IP或账号
              </p>
              <button @click="convert" v-if="userinfo && userinfo.level!=3">转户</button>
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
            ref="expiredVue"
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
            :typeShow="commissionItem"
            v-if="activedLiItem == 'commission'"
            @titleMsg="titleMsg"
            @numberMsg="numberMsg"
          ></commission>
          <realUser
            :offsetHeight="offsetHeight"
            :real_name="real_name"
            v-if="activedLiItem == 'realUser'"
            @titleMsg="titleMsg"
          ></realUser>
          <consumption
            :offsetHeight="offsetHeight"
            :real_name="real_name"
            v-if="activedLiItem == 'consumption'"
            @titleMsg="titleMsg"
          ></consumption>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import {
  defineAsyncComponent,
  getCurrentInstance,
  inject,
  nextTick,
  watch
} from "@vue/runtime-core";
import { Search } from '@element-plus/icons-vue'
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const purchase = defineAsyncComponent(() =>
  import("../../components/purchase.vue")
);
const purchaseDetail = defineAsyncComponent(() =>
  import("../../components/purchase-detail.vue")
);
const expired = defineAsyncComponent(() =>
  import("../../components/expired.vue")
);
const level = defineAsyncComponent(() => import("../../components/level.vue"));
const rechargeRecord = defineAsyncComponent(() =>
  import("../../components/rechargeRecord.vue")
);
const changePassword = defineAsyncComponent(() =>
  import("../../components/changePassword.vue")
);
const commission = defineAsyncComponent(() =>
  import("../../components/commission.vue")
);
const realUser = defineAsyncComponent(() =>
  import("../../components/realMsg.vue")
);
const consumption = defineAsyncComponent(() =>
  import("../../components/consumption.vue")
);
const userinfo = ref(null);
const list = ref([
  { id: "purchase", name: "购买记录" }, //purchase
  // { id: "commission", name: "推广充值" }, //commission
  { id: "changePassword", name: "修改密码" }, //changePassword
  // { id: "rechargeRecord", name: "充值记录" }, //rechargeRecord
  // { id: "level", name: "代理等级" }, //level
  { id: "expired", name: "节点管理" }, //expired
  { id: "consumption", name: "消费记录" }, //consumption
  { id: "realUser", name: "实名认证" },
]);
const purchaseDetailItem = ref('');//1 搜索 2 转户  3导出
const route = useRoute();
const router = useRouter();
const activedLi = ref("purchase");
const activedLiItem = ref("purchase");
const table = ref(null);
const offsetHeight = ref(0);
const titleMsgText = ref("");
const commissionMsg = ref(null);
const store = useStore();
const real_name = ref('');
const { proxy } = getCurrentInstance();
onMounted(() => {
  nextTick(() => {
    offsetHeight.value = table.value.offsetHeight - 25 + "px";
  });
  changeRouter(route.params.name);
  store.dispatch('updateUserinfo').then(res => {
    userinfo.value = res.userinfo;
    real_name.value = res.real_name;
    if (res.userinfo.level!=3) {
      list.value.splice(1, 0, { id: "commission", name: "推广充值" });
      list.value.splice(4, 0, { id: "level", name: "代理等级" });
    }
    if (res.userinfo.level==1) {
      list.value.splice(3, 0, { id: "rechargeRecord", name: "充值记录" });
    }
  }).catch(err => {
    proxy.$message.error(err);
  });
});
watch(
  () => route.params.name,
  newData => {
    changeRouter(newData);
  }
);

function toggleActive(id) {
  router.push("/user/" + id);
}
function changeRouter(newData) {
  activedLiItem.value = newData;
  if (newData != "purchaseDetail") {
    activedLi.value = newData;
  } else {
    if (localStorage.getItem("userTabr") == "purchase") {
      activedLi.value = "purchase";
    } else if (localStorage.getItem("userTabr") == "expired") {
      activedLi.value = "expired";
    }
  }
  localStorage.setItem("userTabr", activedLi.value);
}
function titleMsg(msg) {
  titleMsgText.value = msg;
}
function numberMsg(msg) {
  commissionMsg.value = msg;
}
const detailVue = ref(null);
const expiredVue = ref(null);
const extendOp = () => {
  if (activedLiItem.value == "expired") {
    nextTick(() => {
      expiredVue.value.extendOp();
    });
  } else {
    nextTick(() => {
      detailVue.value.extendVue();
    });
  }
};
const exportOp = () => {
  if (activedLiItem.value == "expired") {
    nextTick(() => {
      expiredVue.value.exportOp();
    });
  } else {
    nextTick(() => {
      detailVue.value.exportVue();
    });
  }
};
const convert = () => {
  if (userinfo.value.level == 3) {
    proxy.$message.error('三级代理商暂不可转户');
    return;
  }
  if (activedLiItem.value == "expired") {
    nextTick(() => {
      expiredVue.value.convert();
    });
  } else {
    nextTick(() => {
      detailVue.value.convert();
    });
  }
}
const searchIp = () => {
  if (activedLiItem.value == "expired") {
    nextTick(() => {
      expiredVue.value.searchIp();
    });
  } else {
    nextTick(() => {
      detailVue.value.searchIp();
    });
  }
}
const copy = (type) => {
  let oInput = document.createElement("input");
  oInput.value =
    "http://ip.hangdaokeji.com/#/register?prevUserId=" +
    localStorage.getItem("useridIp")+'&type='+type;
  document.body.appendChild(oInput);
  oInput.select();
  document.execCommand("Copy");
  oInput.remove();
  proxy.$message("复制成功");
};
// 切换推广显示
const commissionItem = ref(1);
const togglecommission = (type) => {
  if (userinfo.value.level !=3) {
    commissionItem.value = type
  }
}
const foo = inject('resetshowItem');
console.log(foo)
</script>
<style scoped lang="scss">
@import "../../common/user.scss";
.btns {
  .search {
    width: 165px;
    height: 50px;
    background: #ffffff;
    border: 1px solid #d5d5d5;
    border-radius: 6px;
    margin-right: 26px;
    color: #999999;
  }
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