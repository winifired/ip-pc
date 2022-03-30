<template>
    <el-table :data="tableData" size="large" :max-height="offsetHeight">
        <el-table-column prop="title" label="游戏项目" width="345" align="center" />
        <el-table-column prop="num" label="节点数" width="200" align="center" />
        <el-table-column prop="price" label="金币" width="200" align="center" />
        <el-table-column label="操作" align="center">
            <template #default="scope">
                <el-button type="text" size="small" @click="handleClick(scope.row.id)">查看详情</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
const {proxy}=getCurrentInstance();
const prop = defineProps({
    offsetHeight: String
})
const tableData =ref([]);
const emit=defineEmits();
onMounted(()=>{
    emit('titleMsg','购买记录');
    getData();
});
const getData=()=>{
    proxy.$get(proxy.apis.buyLog).then(res => {
    console.log(res)
    if (res.code == 1) {
        tableData.value=res.data.list;
    } else {
      proxy.$message.error(res.msg)
    }
  })
}
const router=useRouter()
function handleClick(id) {
    console.log(id)
    router.push('/user/purchaseDetail?id='+id)
}
</script>
<style lang='scss' scoped>
</style>
