<template>
  <div class="content">
    <div class="form">
      <div class="flex row-center fifltar">
        <div class="flex row-center">
          <p class="color000 font18">节点分类：</p>
          <ul class="flex row-center">
            <li
              v-for="(item, index) in classifyList"
              :key="index"
              :class="form.classify == item ? 'actived' : ''"
              class="font18 color666 cursor"
              @click="form.classify = item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="flex row-center">
          <p class="color000 font18">选择运营商：</p>
          <ul class="flex row-center">
            <li
              v-for="(item, index) in onlineServeList"
              :key="index"
              :class="form.onlineServe == item ? 'actived' : ''"
              class="font18 color666 cursor"
              @click="form.onlineServe = item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="flex row-center fifltar">
        <div class="flex row-center">
          <p class="color000 font18">选择游戏：</p>
          <el-select v-model="form.game" class="m-2" size="large">
            <el-option
              v-for="item in gameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="flex row-center">
          <p class="color000 font18">选择地区：</p>
          <el-select v-model="form.game" class="m-2" size="large">
            <el-option
              v-for="item in gameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <el-scrollbar always>
      <div class="flex">
        <div
          v-for="item in 30"
          :key="item"
          class="scrollbar-item flex column-bwn chosseItem"
        >
          <div class="name flex font20 color000 row-center">
            <p class="cycle"></p>
            <p class="line1">天翼贵州大宽带2</p>
          </div>
          <div class="flex area-between number">
            <p class="flex row-center font18 colorD12">
              <img src="../assets/signal.png" alt="" class="signal" />良好
            </p>
            <p class="flex row-center font18 color505">剩余：6</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div class="bottom flex column-bwn">
      <div class="flex row-center">
        <p class="font18 color000">购买时长：</p>
        <el-radio-group v-model="chooseDayBuy" size="large">
          <el-radio-button
            :label="item"
            v-for="(item, index) in dayBuy"
            :key="index"
            class="font18 color818"
          ></el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex area-between buyButton">
        <p class="font18 color000">
          应付金币：<span class="color600 font22">150.00</span>
        </p>
        <button class="font20 colorfff" @click="confirm">购买</button>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    width="480px"
    :show-close="false"
    custom-class="dialogModel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="tipText font20 color000">是否购买11个节点，总价为136金币</div>
    <template #footer>
      <div class="buttons flex">
        <p class="font20 color262 cursor" @click="dialogVisible=false">否</p>
        <p class="font20 coloreff cursor">是</p>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from '@vue/reactivity'

const form = reactive({
  classify: '静态',
  onlineServe: '联通',
  game: '梦幻西游'
})
const dayBuy = ref(['1天', '3天', '1周', '15天', '1个月', '2个月'])
const chooseDayBuy = ref('1天')
const classifyList = ref(['静态', '动态', '全国'])
const onlineServeList = ref(['联通', '电信'])
const gameList = ref([
  {
    lable: 1,
    value: '梦幻西游'
  },
  {
    lable: 2,
    value: '英雄联盟'
  },
  {
    lable: 3,
    value: '大话西游'
  }
])
const dialogVisible = ref(false)
function confirm() {
  dialogVisible.value = true
}
</script>
<style scoped lang="scss">
.tipText{
  padding:50px 0;
  text-align: center;
}
.bottom {
  width: 1230px;
  height: 160px;
  background: #ffffff;
  border: 1px solid #adadad;
  border-radius: 4px;
  padding: 18px 30px;
  > div {
    width: 100%;
  }
}
.scrollbar-item {
  width: 230px;
  min-height: 120px;
  background: #ffffff;
  border: 1px solid #adadad;
  border-radius: 4px;
  padding: 0 16px;
  margin-bottom: 15px;
  .cycle {
    width: 14px;
    height: 14px;
    background: #009d12;
    border-radius: 50%;
    margin-right: 10px;
  }
  .line1 {
    flex: 1;
  }
  > div {
    width: 100%;
  }
  .signal {
    width: 30px;
    height: 24px;
    margin-right: 14px;
  }
}
.scrollbar-item:not(:nth-child(5n)) {
  margin-right: 12px;
}
.content {
  width: 1230px;
  height: calc(100vh - 80px);
  margin: 0 auto;
  background: #fff;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 35px;
  grid-template-rows: 160px auto 160px;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  li {
    width: 80px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #ffffff;
    border: 1px solid #d5d5d5;
    border-radius: 6px;
  }
  li:not(:last-child) {
    margin-right: 20px;
  }
  .actived {
    background: #45aeff !important;
    color: #fff !important;
  }
  .m-2 {
    width: 287px;
    height: 50px;
  }
}
.fifltar {
  > div:not(:last-child) {
    margin-right: 94px;
  }
}
.fifltar:last-child {
  margin-top: 25px;
}
.chosseItem{
  border:1px solid #45aeff;
}
</style>