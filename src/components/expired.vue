<template>
    <el-table :data="tableData" size="large" :max-height="offsetHeight">
        <el-table-column prop="date" label="标题" width="245" align="center" />
        <el-table-column prop="name" label="节点数" width="100" align="center" />
        <el-table-column prop="state" label="金币" width="100" align="center" />
        <el-table-column prop="city" label="到期时间" width="242" align="center" />
        <el-table-column prop="address" label="剩余" width="100" align="center" />
        <el-table-column label="操作" width="148" align="center">
            <template #default>
                <el-button type="text" size="small" @click="handleClick">查看详情</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";

const prop = defineProps({
    offsetHeight: String
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
];
const emit=defineEmits();
onMounted(()=>{
    emit('titleMsg','最近到期')
})
const router=useRouter()
function handleClick() {
    router.push('/user/purchaseDetail')
}
</script>
<style lang='scss' scoped>
</style>
