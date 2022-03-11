<template>
    <el-table
        :data="tableData"
        size="large"
        :max-height="offsetHeight"
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="66" align="center" />
        <el-table-column prop="name" label="ID" width="175" align="center" />
        <el-table-column prop="state" label="账号" width="239" align="center" />
        <el-table-column prop="city" label="IP" width="239" align="center" />
    </el-table>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

const prop = defineProps({
    offsetHeight: String
});
const emit=defineEmits();
onMounted(()=>{
    emit('titleMsg','节点列表')
})
const tableData = [
    {
        date: '静态--联通--梦幻西游',
        name: '3',
        state: '130.00',
        city: '2022-02-15 15:32:55',
        address: '3',
    },
    {
        date: '静态--联通--梦幻西游',
        name: '3',
        state: '130.00',
        city: '2022-02-15 15:32:55',
        address: '3',
    }
]
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}
function handleClick() {
    showDetail.value = true;
}
</script>
<style lang='scss' scoped>
</style>
