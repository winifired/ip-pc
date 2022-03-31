<template>
  <div class="content-recharge">
    <p class="font18 colorb2b">当前金币余额</p>
    <p class="font34 color000 money">{{ userMoney }}</p>
    <p class="font18 colorb2b title">充值套餐</p>
    <ul class="flex ul">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="flexc row-center cursor"
        :class="chooseItem == index ? 'chooseItem' : ''"
        @click="chooseItem = index"
      >
        <p class="font30 color000">{{ item.gold }}</p>
        <div class="flex font18 color505 sell">
          <p class="delate">￥{{ item.ol_price }}</p>
          <p>￥{{ item.price }}</p>
        </div>
      </li>
      <li
        class="flexc row-center"
        @click="chooseItem = list.length + 1"
        :class="chooseItem == list.length + 1 ? 'chooseItem' : ''"
      >
        <p>
          <input
            type="number"
            placeholder="自定义"
            class="font30 color000"
            v-model.number="inputNumber"
          />
        </p>
        <div class="flex font18 color505 sell">
          <p>￥{{ (inputNumber / ratio).toFixed(2) }}</p>
        </div>
      </li>
    </ul>
    <div class="flex area-between buyButton">
      <div class="font18 color000 flex row-center">
        应付金额：
        <span class="color600 font22">{{ total }}</span>
        <div class="paytype">
          <el-radio v-model="paytype" label="1" size="large">
            <p class="flex row-center radioImg">
              <img src="../assets/wx.png" alt />微信支付
            </p>
          </el-radio>
          <el-radio v-model="paytype" label="2" size="large">
            <p class="flex row-center radioImg">
              <img src="../assets/zfb.png" alt />支付宝支付
            </p>
          </el-radio>
        </div>
      </div>
      <button class="font20 colorfff" @click="confirm" v-if="!loading">购买</button>
      <el-button class="font20 colorfff" color="#ff9600;" style="color:#ffffff" v-else :loading="loading">购买</el-button>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    width="520px"
    :show-close="false"
    custom-class="dialogModel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #title>
      <div class="flex nav">
        <p
          class="flex area-center font20 color000 cursor"
          :class="choosePay == 1 ? 'choosePay' : ''"
          @click="choosePay = 1"
        >
          <img src="../assets/wx.png" alt />微信支付
        </p>
        <p
          class="flex area-center font20 color000 cursor"
          :class="choosePay == 2 ? 'choosePay' : ''"
          @click="choosePay = 2"
        >
          <img src="../assets/zfb.png" alt />支付宝支付
        </p>
      </div>
    </template>
    <div>
      <img src="../assets/code.png" alt class="code" />
    </div>
    <template #footer>
      <div class="buttons flex">
        <p class="font20 color262 cursor" @click="dialogVisible">取消支付</p>
        <p class="font20 coloreff cursor">已支付</p>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="modelPay"
    width="500px"
    title="微信扫码支付"
    :show-close="false"
    :close-on-click-modal="false"
    center
  >
    <div class="acea-row row-center-wrapper">
      <!-- <qrcode-vue :value="code_url" level="H" id="qrcode" size="200"></qrcode-vue> -->
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="paySure()">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <realMsg></realMsg>
</template>
<script setup>
import realMsg from "../components/realMsg.vue"
import { ref } from '@vue/reactivity'
import { getCurrentInstance, onMounted, watch } from '@vue/runtime-core';
import { useStore } from "vuex";
const dialogVisible = ref(false)
const chooseItem = ref(0);
const choosePay = ref(1);
const userMoney = ref(0);
const ratio = ref(1);
const list = ref([]);
const inputNumber = ref('');
const total = ref(0);
const paytype = ref('2');
const code_url = ref('');
const modelPay = ref(false);
const loading = ref(false);
const { proxy } = getCurrentInstance();
const store=useStore();
onMounted(() => {
  getData();
  getuserinfo();
});
const getData = () => {
  proxy.$get(proxy.apis.recharge).then(res => {
    if (res.code == 1) {
      list.value = res.data.list;
      userMoney.value = res.data.money;
      ratio.value = res.data.ratio;
      total.value = res.data.list.length > 0 ? list.value[0].price : 0
    }
  })
}
watch(() => inputNumber.value, (newData) => {
  total.value = (newData / ratio.value).toFixed(2)
})
watch(() => chooseItem.value, (newData) => {
  if (newData == list.value.length + 1) {
    total.value = inputNumber.value ? (inputNumber.value / ratio.value).toFixed(2) : 0
  } else {
    total.value = list.value[newData].price
  }
});
const confirm = () => {
  let data = {
    pay_type: paytype.value,//类型(1=微信,2=支付宝)
    status: chooseItem.value == list.value.length + 1 ? 2 : 1,//类型(1=套餐,2=自定义)
    id: chooseItem.value == list.value.length + 1 ? '' : list.value[chooseItem.value].id,//套餐id
    gold: chooseItem.value == list.value.length + 1 ? inputNumber.value : '',//自定义金币
  }
  if (data.status == 2 && !data.gold) {
    proxy.$message.error('请输入自定义金币金额');
    return;
  }
  loading.value = true;
  proxy.$post(proxy.apis.pay, data).then(res => {
    if (res.code == 1) {
      pay(res.data.id)
    } else {
      loading.value = false;
      proxy.$message.error(res.msg)
    }
  })
}
const pay = (id) => {
  proxy.$post(proxy.apis.wxpay, {
    id
  }).then(res => {
    if (res.code == 1) {
      if (paytype.value == 2) {
        let htmls = res.data; //打开新页面
        // window.open(routerData.href, "_blank");
        const div = document.createElement("div");
        div.innerHTML = htmls;
        document.body.appendChild(div);
        document.forms[0].submit();
      } else {
        code_url.value = res.data;
        modelPay.value = true;
      }
      getuserinfo();
      loading.value = false;
    } else {
      loading.value = false;
      proxy.$message.error(res.msg)
    }
  })
}
const paySure = () => {
  modelPay.value = false;
}
const getuserinfo=()=>{
  proxy.$post(proxy.apis.base).then(res => {
    console.log(res)
    if (res.code == 1) {
      store.commit('setUserinfo',res.data.userinfo)
      localStorage.setItem('userinfoIp', JSON.stringify(res.data.userinfo));
    } else {
      proxy.$message.error(res.msg)
    }
  })
}
</script>
<style scoped lang="scss">
.content-recharge {
  width: 1230px;
  margin: 0 auto;
  padding: 45px 0 200px;
  position: relative;
  z-index: 3;
  .money {
    margin-top: 22px;
  }
  .title {
    margin-top: 50px;
  }
  .ul {
    li {
      width: 293px;
      height: 150px;
      background: #ffffff;
      border: 1px solid #adadad;
      border-radius: 8px;
      padding: 25px 0 32px;
      margin-top: 22px;
      .font30 {
        line-height: 30px;
      }
      .sell {
        margin-top: 36px;
        .delate {
          margin-right: 53px;
          text-decoration: line-through;
        }
      }
      input {
        width: 200px;
        text-align: center;
      }
    }
    li:not(:nth-child(4n)) {
      margin-right: 18px;
    }
    .chooseItem {
      background: #ecf7ff !important;
      border: 1px solid #45aeff;
    }
  }
  .buyButton {
    position: fixed;
    bottom: 0;
    width: 1230px;
    z-index: 10;
    padding-bottom: 40px;
  }
}
.radioImg img {
  width: 28px;
  height: 25px;
  margin-right: 10px;
}
</style>