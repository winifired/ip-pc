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
      <template #default="scope">{{scope.row.day}}天</template>
    </el-table-column>
  </el-table>
  <a href="http://ip.hangdaokeji.com/uploads/node/13612345678.txt" download="12">下载</a>
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
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted, watch } from "@vue/runtime-core";
import { useRoute } from "vue-router";

const route = useRoute();
const prop = defineProps({
  offsetHeight: String,
  typenum: {
    type: Number,
    default: 0
  }
});
const { proxy } = getCurrentInstance();
const emit = defineEmits();
const tableData = ref([]);
const renew = ref([]);
const id = ref(route.query.id);
const dialogVisible = ref(false);
const chooseDayBuy = ref(); //选中的时间
const chooseDayBuyId = ref(); //选中的时间id
const totalPrice = ref(0);
onMounted(() => {
  if (prop.typenum == 1) {
    emit("titleMsg", "最近到期");
  } else {
    emit("titleMsg", "节点列表");
  }
  getData();
});
const getData = () => {
  let url = "",
    data = {};
  if (prop.typenum == 1) {
    url = proxy.apis.expire;
  } else {
    url = proxy.apis.details;
    data = {
      id: id.value
    };
  }
  proxy.$post(url, data).then(res => {
    console.log(res.data);
    if (res.code == 1) {
      tableData.value = res.data.list;
      renew.value = res.data.renew;
      chooseDayBuy.value = res.data.renew[0].name;
      chooseDayBuyId.value = res.data.renew[0].id;
      totalPrice.value = res.data.renew[0].price;
    }
  });
};
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
    proxy.$message.error("请选择要续费的ID");
    return;
  }
  dialogVisible.value = true;
};
const exportVue = () => {
  if (multipleSelection.value.length == 0) {
    proxy.$message.error("请选择要导出的ID");
    return;
  }
  // console.log(multipleSelection.value)
  confirmExport();
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
      ids: arr.join(",") //节点id
    })
    .then(res => {
      if (res.code == 1) {
        downloadFile(res.data.url,res.data.filename);
      } else {
        proxy.$message.error(res.msg);
      }
    });
};
function downloadFile(url,filename) {
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
defineExpose({
  extendVue,
  exportVue
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
</style>
