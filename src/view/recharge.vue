<template>
  <div class="content">
    <p class="font18 colorb2b">当前金币余额</p>
    <p class="font34 color000 money">150.00</p>
    <p class="font18 colorb2b title">充值套餐</p>
    <ul class="flex ul">
      <li
        v-for="(item, index) in 16"
        :key="index"
        class="flexc row-center cursor"
        :class="chooseItem == index ? 'chooseItem' : ''"
        @click="chooseItem = index"
      >
        <p class="font30 color000">150.00</p>
        <div class="flex font18 color505 sell">
          <p class="delate">￥30.00</p>
          <p>￥15.00</p>
        </div>
      </li>
      <li class="flexc row-center">
        <p class="font30 color000">自定义</p>
        <div class="flex font18 color505 sell">
          <p>￥0.00</p>
        </div>
      </li>
    </ul>
    <div class="flex area-between buyButton">
      <p class="font18 color000">
        应付金币：<span class="color600 font22">150.00</span>
      </p>
      <button class="font20 colorfff" @click="confirm">购买</button>
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
        <p class="flex area-center font20 color000 cursor" :class="choosePay==1?'choosePay':''" @click="choosePay=1">
          <img src="../assets/wx.png" alt="" />微信支付
        </p>
        <p class="flex area-center font20 color000 cursor" :class="choosePay==2?'choosePay':''" @click="choosePay=2">
          <img src="../assets/zfb.png" alt="" />支付宝支付
        </p>
      </div>
    </template>
    <div>
      <img src="../assets/code.png" alt="" class="code" />
    </div>
    <template #footer>
      <div class="buttons flex">
        <p class="font20 color262 cursor" @click="dialogVisible">取消支付</p>
        <p class="font20 coloreff cursor">已支付</p>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from '@vue/reactivity'
const dialogVisible = ref(false)
const chooseItem = ref(0);
const choosePay = ref(1);
</script>
<style scoped lang="scss">
.content {
  width: 1230px;
  margin: 0 auto;
  padding: 45px 0 0;
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
</style>