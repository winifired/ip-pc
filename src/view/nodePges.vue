<template>
  <div class="content">
    <div class="form">
      <div class="flex row-center fifltar">
        <div class="flex row-center">
          <p class="color000 font18">节点分类：</p>
          <ul class="flex row-center">
            <li
              v-for="item in classifyList"
              :key="item.id"
              :class="form.classify == item.id ? 'actived' : ''"
              class="font18 color666 cursor"
              @click="form.classify = item.id"
            >{{ item.name }}</li>
          </ul>
        </div>
        <div class="flex row-center">
          <p class="color000 font18">选择运营商：</p>
          <ul class="flex row-center">
            <li
              v-for="item in onlineServeList"
              :key="item.id"
              :class="form.onlineServe == item.id ? 'actived' : ''"
              class="font18 color666 cursor"
              @click="form.onlineServe = item.id"
            >{{ item.name }}</li>
          </ul>
        </div>
      </div>
      <div class="flex row-center fifltar">
        <div class="flex row-center">
          <p class="color000 font18">选择游戏：</p>
          <el-select v-model="form.game_id" class="m-2" size="large" placeholder="请选择">
            <el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="flex row-center">
          <p class="color000 font18">选择地区：</p>
          <el-select v-model="form.city_id" class="m-2" size="large" placeholder="请选择">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <el-scrollbar always>
      <div class="flex" v-infinite-scroll="bottomFixed">
        <div
          v-for="item in list"
          :key="item.id"
          class="scrollbar-item flex column-bwn cursor"
          :class="chooseItem == item.id ? 'chosseItem' : ''"
          @click="toggleItem(item.id,item.stock)"
        >
          <div class="name flex font20 color000 row-center">
            <p
              class="cycle"
              :style="{ background: (item.signal == 1 ? '#009D12' : (item.signal == 2 ? '#FFA800' : '#F70C0C')) }"
            ></p>
            <p class="line1">{{ item.name }}</p>
          </div>
          <div class="flex area-between number">
            <p class="flex row-center font18 colorD12">
              <img src="../assets/signal.png" alt class="signal" v-if="item.signal == 1" />
              <img src="../assets/signal2.png" alt class="signal" v-if="item.signal == 2" />
              <img src="../assets/signal3.png" alt class="signal" v-if="item.signal == 3" />
              {{ item.signal == 1 ? '良好' : (item.signal == 2 ? '一般' : '差') }}
            </p>
            <el-input-number v-model="item.stock" :min="1" :max="item.stock" v-show="chooseItem == item.id" />
            <p class="flex row-center font18 color505" v-show="chooseItem != item.id">剩余：{{ item.stock }}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div class="bottom flex column-bwn">
      <div class="flex row-center">
        <p class="font18 color000">购买时长：</p>
        <el-radio-group v-model="chooseDayBuy" size="large">
          <el-radio-button
            :label="item.name"
            v-for="(item, index) in dayBuy"
            :key="index"
            class="font18 color818"
          ></el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex area-between buyButton">
        <p class="font18 color000">
          应付金币：
          <span class="color600 font22">150.00</span>
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
        <p class="font20 color262 cursor" @click="dialogVisible = false">否</p>
        <p class="font20 coloreff cursor">是</p>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from '@vue/reactivity'
import { getCurrentInstance, onMounted, watch } from '@vue/runtime-core'

const { proxy } = getCurrentInstance();
const form = reactive({
  classify: 0,
  onlineServe: 0,
  game_id: '',
  city_id: ''
})
const dayBuy = ref([])
const chooseDayBuy = ref();
const classifyList = ref([{
  id: 1,
  name: '静态'
}, {
  id: 2,
  name: '动态'
}, {
  id: 3,
  name: '全国'
}])
const onlineServeList = ref([{
  id: 2,
  name: '联通'
}, {
  id: 1,
  name: '电信'
}]);
const page = ref(1)
const gameList = ref([]);
const cityList = ref([]);
const list = ref([]);
const total = ref(0);
const chooseItem=ref('');//选中的节点
const dialogVisible = ref(false);
watch(() => form, () => {
  page.value = 1;
  getNodeList();
}, {
  deep: true
})
function confirm() {
  dialogVisible.value = true
}
onMounted(() => {
  getSerach();
})
function getSerach() {
  proxy.$post(proxy.apis.getSerach).then(res => {
    gameList.value = res.data.game;
    cityList.value = [{ id: 0, name: '全国' }, ...res.data.city];
    if (res.data.game.length > 0) {
      form.game_id = res.data.game[0].id;
    }
    if (res.data.game.length > 0) {
      form.city_id = cityList.value[0].id;
    }
    getNodeList();
  })
}
function getNodeList() {
  console.log(form)
  if (page.value == 1) {
    list.value = []
  }
  proxy.$post(proxy.apis.nodeIndex, {
    city_id: form.city_id,//地址id
    game_id: form.game_id,//游戏id
    isp: form.onlineServe,//运营商(1=电信,2=联通)
    status: form.classify,//节点分类(1=静态,2=动态,3=全国)
    page: page.value,//当前页
    pageSize: 25,//每页数量
  }).then(res => {
    dayBuy.value = res.data.price;
    list.value.push(...res.data.list);
    total.value = res.data.total;
    if(res.data.list.length>0){
      chooseItem.value=res.data.list[0].id;
    }
  })
}
function toggleItem(id){
  chooseItem.value=id;
}
function bottomFixed() {
  if (total.value == list.value.length) {
    return;
  } else {
    page.value++
  }
  getNodeList();
}
</script>
<style scoped lang="scss">
.tipText {
  padding: 50px 0;
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
  // background: #fff;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 35px;
  grid-template-rows: 160px auto 160px;
  position: relative;
  z-index: 3;
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
.chosseItem {
  border: 2px solid #45aeff;
}
</style>