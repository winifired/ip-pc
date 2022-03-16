<template>
    <el-scrollbar :height="offsetHeight">
        <ul>
            <li v-for="(item, index) in 12" :key="index" class="font18 color000 flexc column-bwn">
                <p>金币：150.00</p>
                <div class="flex area-between">
                    <p>¥15.00</p>
                    <p>2022-02-15 15:56:22</p>
                    <p>支付宝支付</p>
                </div>
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
    emit('titleMsg', '充值记录')
})
</script>
<style lang='scss' scoped>
ul {
    border: 1px solid #ececec;
    li {
        >div{
            width:100%;
        }

        height: 100px;
        padding: 13px 27px;
    }
    li:nth-child(2n) {
        background: #ececec;
    }
}
</style>
