<template>
    <el-scrollbar :height="offsetHeight">
        <ul>
            <li v-for="(item, index) in 12" :key="index" class="font18 color000 flex area-between">
                <p>¥15.00</p>
                <p>2022-02-15 15:56:22</p>
                <p>支付宝支付</p>
            </li>
        </ul>
    </el-scrollbar>
</template>
<script setup>
import { onMounted } from "@vue/runtime-core";
const prop = defineProps({
    offsetHeight: String
})
const emit = defineEmits();
onMounted(() => {
    emit('titleMsg', '推广返佣')
})
</script>
<style lang='scss' scoped>
ul {
    li {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #ececec;
        padding: 0 23px;
    }
}
</style>
