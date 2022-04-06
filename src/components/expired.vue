<template>
  <!-- <el-table :data="tableData" size="large" :max-height="offsetHeight">
        <el-table-column prop="title" label="游戏项目" width="245" align="center" />
        <el-table-column prop="num" label="节点数" width="100" align="center" />
        <el-table-column prop="price" label="金币" width="100" align="center" />
        <el-table-column prop="expiretime" label="到期时间" width="242" align="center" />
        <el-table-column prop="day" label="剩余" width="100" align="center" />
        <el-table-column label="操作" width="148" align="center">
            <template #default>
                <el-button type="text" size="small" @click="handleClick">查看详情</el-button>
            </template>
        </el-table-column>
  </el-table>-->
  <purchaseDetailVue :typenum="1" :offsetHeight="offsetHeight" ref="detailVue"></purchaseDetailVue>
</template>
<script setup>
import purchaseDetailVue from "./purchase-detail.vue";
import { ref } from "@vue/reactivity";
import { nextTick } from "vue";
const detailVue = ref(null);
const extendOp = () => {
  nextTick(() => {
    detailVue.value.extendVue();
  });
};
const exportOp = () => {
  nextTick(() => {
    detailVue.value.exportVue();
  });
};
const convert = () => {
  nextTick(() => {
    detailVue.value.convert();
  });
};
const searchIp = () => {
  nextTick(() => {
    detailVue.value.searchIp();
  });
};
defineExpose({
  extendOp,
  exportOp,
  convert,
  searchIp
});
// import { getCurrentInstance, onMounted } from "@vue/runtime-core";
// import { useRouter } from "vue-router";
// const {proxy}=getCurrentInstance();
// const prop = defineProps({
//     offsetHeight: String
// })
// const tableData = ref([]);
// const emit=defineEmits();
// onMounted(()=>{
//     emit('titleMsg','节点管理');
//     getData();
// })
// const getData=()=>{
//     proxy.$get(proxy.apis.expire).then(res => {
//     console.log(res)
//     if (res.code == 1) {
//         tableData.value=res.data.list;
//     } else {
//       proxy.$message.error(res.msg)
//     }
//   })
// }
// const router=useRouter()
// function handleClick() {
//     router.push('/user/purchaseDetail')
// }
</script>
<style lang='scss' scoped>
</style>
