<template>
  <el-table
    :data="tableData"
    size="large"
    :max-height="offsetHeight"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="66" align="center" />
    <el-table-column prop="id" label="ID" width="122" align="center" />
    <el-table-column prop="user" label="账号" width="200" align="center" />
    <el-table-column prop="ip" label="IP" align="center" />
    <el-table-column prop="expiretime" label="到期时间" width="242" align="center" />
    <el-table-column prop="day" label="剩余" width="130" align="center">
      <template #default="scope">{{ scope.row.day }}天</template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    :show-close="false"
    custom-class="dialogModel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #title>
      <div class="nav">确认续费</div>
    </template>
    <div class="bottom">
      <div class="flex row-center">
        <p class="font18 color000">购买时长：</p>
        <el-radio-group v-model="chooseDayBuy" size="large">
          <el-radio-button
            :label="item.name"
            v-for="(item, index) in renew"
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
      </div>
    </div>
    <template #footer>
      <div class="buttons flex">
        <p class="font20 color262 cursor" @click="dialogVisible = false">取消</p>
        <p class="font20 coloreff cursor" @click="confirm">确认</p>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogVisibleElse"
    :width="showItemElse == 1 ? '500px' : (showItemElse == 2 ? '660px' : '850px')"
    :show-close="false"
    custom-class="dialogModel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <template #title>
      <div class="nav" v-show="showItemElse == 1">搜索</div>
      <div class="nav" v-show="showItemElse == 2">转户</div>
      <div class="nav" v-show="showItemElse == 3">导出</div>
    </template>
    <div class="bottom">
      <el-input
        v-show="showItemElse == 1"
        v-model="textareaSearch"
        :rows="8"
        type="textarea"
        placeholder="请输入"
        class="textareaSearch"
      />
      <div class="flex area-between searchPhone" v-show="showItemElse == 2">
        <input type="text" placeholder="请输入用户手机号" v-model="searchPhone" @keyup.enter="getnodeuser" />
        <Search style="width: 1.5em; height: 1.5em; margin-right: 8px" @click="getnodeuser" />
      </div>
      <el-scrollbar height="400px" v-show="showItemElse == 2">
        <div class="users">
          <div
            class="font20 color000 flex row-center userMsg cursor"
            v-for="(item, index) in nodeuserlist"
            :key="index"
            @click="choosezhuanhu = index"
            :class="choosezhuanhu == index ? 'chooseuser' : ''"
          >
            <img :src="item.avatar" alt />
            <div class="font20 color707">
              <p>{{ item.username }}</p>
              <p>{{ item.level_name }}</p>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="flex exportModel column-bwn" v-show="showItemElse == 3">
        <div class="otem cursor" @click="chooseExport = 1">
          <p :class="chooseExport == 1 ? 'chooseuser' : ''">
            <span
              v-for="(item, index) in multipleSelection"
              :key="index"
            >{{ item.ip }}|{{ item.port }}|{{item.user}}|{{item.pwd}}|{{ item.expiretime }}</span>
          </p>
          <p class="flex area-center">万安格式  <span class="copy" @click="copy(1)">复制</span> </p>
        </div>
        <div class="otem cursor" @click="chooseExport = 2">
          <p :class="chooseExport == 2 ? 'chooseuser' : ''">
            <span
              v-for="(item, index) in multipleSelection"
              :key="index"
            >{{ item.ip }}:{{ item.port }} {{item.user}} {{item.pwd}} {{ item.expiretime }}</span>
          </p>
          <p class="flex area-center">HTTP格式  <span class="copy" @click="copy(2)">复制</span> </p>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="buttons flex">
        <p class="font20 color262 cursor" @click="dialogVisibleElse = false">取消</p>
        <p class="font20 coloreff cursor" @click="confirmType">确认</p>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted, watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { Search } from '@element-plus/icons-vue'
const route = useRoute();
const prop = defineProps({
  offsetHeight: String,
  typenum: {
    type: Number,
    default: 0
  }
});
const dialogVisibleElse = ref(false);
const showItemElse = ref(0);//选中的操作
const textareaSearch = ref('');//搜索IP
const searchPhone = ref('');//搜索用户
const choosezhuanhu = ref(-1);
const { proxy } = getCurrentInstance();
const emit = defineEmits();
const tableData = ref([]);
const renew = ref([]);
const id = ref(route.query.id);
const dialogVisible = ref(false);
const chooseDayBuy = ref(); //选中的时间
const chooseDayBuyId = ref(); //选中的时间id
const totalPrice = ref(0);
const store = useStore();
const chooseExport = ref(1);//1 万安格式 2 HTTP格式
const nodeuserlist = ref([]);
onMounted(() => {
  if (prop.typenum == 1) {
    emit("titleMsg", "节点管理");
  } else {
    emit("titleMsg", "节点列表");
  }
  getData();
  getnodeuser();//转户列表
});
const getData = () => {
  let url = "",
    data = {};
  if (prop.typenum == 1) {
    url = proxy.apis.expire;
    data = {
      search: textareaSearch.value
    };
  } else {
    url = proxy.apis.details;
    data = {
      id: id.value,
      search: textareaSearch.value
    };
  }
  proxy.$post(url, data).then(res => {
    if (res.code == 1) {
      tableData.value = res.data.list;
      renew.value = res.data.renew;
      chooseDayBuy.value = res.data.renew[0].name;
      chooseDayBuyId.value = res.data.renew[0].id;
      totalPrice.value = res.data.renew[0].price;
      dialogVisibleElse.value = false;
    }
  });
};
const getnodeuser = () => {
  proxy.$get(proxy.apis.nodeuser, {
    search: searchPhone.value
  }).then(res => {
    if (res.code == 1) {
      nodeuserlist.value = res.data.list;
    }
  });
}
watch(
  () => chooseDayBuy.value,
  newData => {
    const timeItem = renew.value.find(item => item.name == newData);
    chooseDayBuyId.value = timeItem.id;
    totalPrice.value = timeItem.price;
  }
);
const multipleSelection = ref([]);
const handleSelectionChange = val => {
  multipleSelection.value = val;
};
const extendVue = () => {
  if (multipleSelection.value.length == 0) {
    proxy.$message.error("请选择要续费的IP");
    return;
  }
  dialogVisible.value = true;
};
const convert = () => {
  showItemElse.value = 2;
  if (multipleSelection.value.length == 0) {
    proxy.$message.error("请选择要转户的IP");
    return;
  }
  dialogVisibleElse.value = true;
};
const exportVue = () => {
  showItemElse.value = 3;
  if (multipleSelection.value.length == 0) {
    proxy.$message.error("请选择要导出的IP");
    return;
  }
  dialogVisibleElse.value = true;
};
const searchIp = () => {
  showItemElse.value = 1;
  dialogVisibleElse.value = true;
};
const confirm = () => {
  let arr = [];
  multipleSelection.value.map(item => {
    arr.push(item.id);
  });
  dialogVisible.value = false;
  proxy
    .$post(proxy.apis.renew, {
      ids: arr.join(","), //节点id
      renew_id: chooseDayBuyId.value //套餐id
    })
    .then(res => {
      if (res.code == 1) {
        proxy.$message(res.msg);
        getData();
        store.dispatch("updateUserinfo").catch(err => {
          proxy.$message.error(err);
        });
      } else {
        proxy.$message.error(res.msg);
      }
    });
};
const confirmExport = () => {
  let arr = [];
  multipleSelection.value.map(item => {
    arr.push(item.id);
  });
  proxy
    .$post(proxy.apis.export, {
      ids: arr.join(","), //节点id
      export: chooseExport.value
    })
    .then(res => {
      if (res.code == 1) {
        dialogVisibleElse.value = false;
        downloadFile(res.data.url, res.data.filename);
      } else {
        proxy.$message.error(res.msg);
      }
    });
};
function downloadFile(url, filename) {
  console.log(url);
  const link = document.createElement("a");
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      // 将链接地址字符内容转变成blob地址
      link.href = URL.createObjectURL(blob);
      // console.log(link.href)
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}
const copy = (type) => {
  let text='';
  if(type==1){
    for(let i in multipleSelection.value){
      text+=`${multipleSelection.value[i].ip}|${multipleSelection.value[i].port}|${multipleSelection.value[i].user}|${multipleSelection.value[i].pwd}|${multipleSelection.value[i].expiretime} \n`;
    }
  }else{
    for(let i in multipleSelection.value){
      text+=`${multipleSelection.value[i].ip}:${multipleSelection.value[i].port} ${multipleSelection.value[i].user} ${multipleSelection.value[i].pwd} ${multipleSelection.value[i].expiretime} \n`;
    }
  }
  let oInput = document.createElement("textarea");
  oInput.value =text;
  document.body.appendChild(oInput);
  oInput.select();
  document.execCommand("Copy");
  oInput.remove();
  proxy.$message("复制成功");
};
// 操作弹窗确认
const confirmType = () => {
  if (showItemElse.value == 1) {
    // if (!textareaSearch.value) {
    //   proxy.$message.error('请输入要搜索的IP');
    //   return;
    // }
    getData();
  } else if (showItemElse.value == 2) {
    // 转户
    let arr = [];
    multipleSelection.value.map(item => {
      arr.push(item.id);
    });
    proxy
      .$post(proxy.apis.nodegive, {
        node_ids: arr.join(","), //节点id
        user_id: nodeuserlist.value[choosezhuanhu.value].id
      })
      .then(res => {
        if (res.code == 1) {
          proxy.$message('转户成功');
          dialogVisibleElse.value = false;
          getData();
        } else {
          proxy.$message.error(res.msg);
        }
      });
  } else if (showItemElse.value == 3) {
    confirmExport();
  }
}
defineExpose({
  extendVue,
  exportVue,
  convert,
  searchIp
});
</script>
<style lang='scss' scoped>
.nav {
  text-align: center;
  font-size: 22px;
  background: #fff;
  line-height: 80px;
}
.buyButton {
  margin-top: 50px;
}
.textareaSearch {
  font-size: 18px;
}
.searchPhone {
  width: 554px;
  margin: 0 30px;
  height: 50px;
  background: #ffffff;
  border: 1px solid #d5d5d5;
  border-radius: 6px;
  padding: 0 19px;
  input {
    flex:1;
    font-size: 18px;
  }
}
.users {
  padding: 20px 30px;
  display: grid;
  grid-template-rows: 1fr;
  grid-column-gap: 35px;
  grid-template-columns: repeat(2, 260px);
}
.chooseuser {
  border: 1px solid #45aeff !important;
}
.userMsg {
  height: 100px;
  padding: 0 13px;
  background: #ffffff;
  border: 1px solid #d5d5d5;
  border-radius: 6px;
  margin-bottom: 25px;
  img {
    width: 70px;
    height: 70px;
    margin-right: 23px;
    border-radius: 50%;
  }
  > div {
    > p:last-child {
      margin-bottom: 7px;
    }
  }
}
.exportModel {
  .otem {
    > p:nth-child(1) {
      width: 400px;
      padding: 0 0 13px;
      background: #ffffff;
      border: 1px solid #d5d5d5;
      border-radius: 6px;
    }
    > p:nth-child(2) {
      font-size: 22px;
      text-align: center;
      margin-top: 23px;
      color: #000;
    }
    span {
      display: block;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #070707;
      text-align: center;
      margin-top: 12px;
    }
  }
}
.copy{
  cursor: pointer;
  font-size: 18px;
  color:#45aeff!important;
  margin-top:0!important;
  margin-left: 12px;
}
</style>
