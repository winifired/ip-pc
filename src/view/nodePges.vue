<template>
  <div class="content-nodePage" v-loading="loading">
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
      <div class="flex" v-infinite-scroll="bottomFixed" :infinite-scroll-disabled="disabledScroll">
        <div
          v-for="item in list"
          :key="item.id"
          class="scrollbar-item flex column-bwn cursor"
          :class="[chooseItem == item.id ? 'chosseItem' : '',item.stock<=0||!item.stock?'noClick':'']"
          @click="toggleItem(item.id, item.stock)"
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
            <el-input-number
              v-model="item.elseStock"
              :min="1"
              :max="item.stock"
              v-show="chooseItem == item.id"
              @change="elseStockChange"
            />
            <p
              class="flex row-center font18 color505"
              v-show="chooseItem != item.id"
            >剩余：{{ item.stock }}</p>
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
          <span class="color600 font22">￥{{ totalPrice }}</span>
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
    <div class="tipText font20 color000">是否购买{{ chooseStoce }}个节点，总价为{{ totalPrice }}金币</div>
    <template #footer>
      <div class="buttons flex">
        <p class="font20 color262 cursor" @click="dialogVisible = false">否</p>
        <p class="font20 coloreff cursor" :class="isClick?'noClick':''" @click="confirmPay">是</p>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from '@vue/reactivity'
import { computed, getCurrentInstance, onMounted, watch } from '@vue/runtime-core'

const { proxy } = getCurrentInstance();
const form = ref({
  classify: 0,
  onlineServe: 0,
  game_id: '',
  city_id: ''
})
const loading=ref(true);
const dayBuy = ref([]);//时间列表
const chooseDayBuy = ref();//选中的时间
const chooseDayBuyId = ref();//选中的时间id
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
const gameList = ref([]);//游戏列表
const cityList = ref([]);//城市列表
const list = ref([]);//节点列表
const total = ref(0);
const chooseItem = ref('');//选中的节点
const chooseStoce = ref('');//选中的节点购买数量
const dialogVisible = ref(false);
const totalPrice = ref(0);
const isClick=ref(false);
const disabledScroll=ref(false);
onMounted(() => {
  getSerach();
})
function getSerach() {
  proxy.$get(proxy.apis.getSerach).then(res => {
    gameList.value = res.data.game;
    cityList.value = [{ id: 0, name: '全国' }, ...res.data.city];
    if (res.data.game.length > 0) {
      form.value.game_id = res.data.game[0].id;
    }
    if (res.data.game.length > 0) {
      form.value.city_id = cityList.value[0].id;
    }
  })
}
function getNodeList() {
  console.log(form.value)
  if (page.value == 1) {
    list.value = []
  }
  proxy.$get(proxy.apis.nodeIndex, {
    city_id: form.value.city_id,//地址id
    game_id: form.value.game_id,//游戏id
    isp: form.value.onlineServe,//运营商(1=电信,2=联通)
    status: form.value.classify,//节点分类(1=静态,2=动态,3=全国)
    page: page.value,//当前页
    pageSize: 25,//每页数量
  }).then(res => {
    dayBuy.value = res.data.price;
    chooseDayBuy.value = res.data.price[0].name;
    chooseDayBuyId.value = res.data.price[0].id;
    total.value = res.data.total;
    if (res.data.list.length > 0) {
      res.data.list.map(item => {
        item['elseStock'] = (item.stock-0)>0?1:0;
        list.value.push(item);
      })
      let havestock=res.data.list.findIndex(item=>item.stock>0)
      chooseItem.value = havestock?res.data.list[havestock].id:'';
      chooseStoce.value =havestock?res.data.list[havestock].stock:'';
    }
    loading.value=false
  }).catch(()=>{
    loading.value=false
  })
}
const nodePrice = computed(() => {
  return {
    chooseItem: chooseItem.value,
    chooseDayBuy: chooseDayBuy.value
  }
})
const elseStockChange = (value) => {
  const timeItem = dayBuy.value.find(item => item.name == chooseDayBuy.value);
  totalPrice.value = (value - 0) * (timeItem.price - 0)
}
watch(() => form.value, () => {
  chooseItem.value = '';
  chooseStoce.value = '';
  totalPrice.value = 0;
  page.value=1;
  getNodeList();
}, {
  deep: true
})
watch(() => nodePrice.value, (newData) => {
  const timeItem = dayBuy.value.find(item => item.name == newData.chooseDayBuy);
  chooseDayBuyId.value = timeItem.id;
  const nodeItem = list.value.find(item => item.id == newData.chooseItem);
  if (!nodeItem) {
    return
  };
  chooseStoce.value = nodeItem.elseStock;
  totalPrice.value = (nodeItem.elseStock - 0) * (timeItem.price - 0)
});
function confirm() {
  if (!chooseItem.value) {
    proxy.$message.error('请选择节点');
    return;
  }
  dialogVisible.value = true;
}
const confirmPay = () => {
  // 购买
  isClick.value=true;
  proxy.$post(proxy.apis.nodeBuy, {
    id: chooseItem.value,//节点id
    game_id:form.value.game_id,//游戏id
    price_id: chooseDayBuyId.value,//套餐id
    num: chooseStoce.value,//购买数量
  }).then(res => {
    dialogVisible.value = false;
    if (res.code == 1) {
      page.value=1;
      getNodeList();
      proxy.$message.success(res.msg)
    }else{
      proxy.$message.error(res.msg)
    }
  })
}
watch(()=>dialogVisible.value,(newData)=>{
  if(!newData){
    isClick.value=false;
  }
})
function toggleItem(id) {
  // 节点切换
  chooseItem.value = id;
}
function bottomFixed() {
  if (total.value == list.value.length) {
    disabledScroll.value=true;
    return;
  } else {
    page.value++;
    getNodeList();
  }
  
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
.content-nodePage {
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