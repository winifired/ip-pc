<template>
    <el-scrollbar :height="offsetHeight">
        <ul>
            <li v-for="(item, index) in list" :key="index" class="font18 color000 flexc column-bwn">
                <div>
                    <p>金币：{{ item.money }}</p>
                    <p>{{ item.createtime }}</p>
                </div>
                <div>
                    <p>¥{{ item.before }}</p>
                    <p>消费后剩余：{{item.after}}</p>
                    <p>{{ item.memo}}</p>
                </div>
            </li>
        </ul>
    </el-scrollbar>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from "@vue/runtime-core";
const prop = defineProps({
    offsetHeight: String
});
const { proxy } = getCurrentInstance();
const list = ref([]);
const emit = defineEmits();
onMounted(() => {
    emit('titleMsg', '消费记录')
    getData();
})
const getData = () => {
    proxy.$get(proxy.apis.moenryLogs).then(res => {
        if (res.code == 1) {
            list.value = res.data.list;
        }
    })
}
</script>
<style lang='scss' scoped>
ul {
    border: 1px solid #ececec;
    li {
        > div {
            width: 100%;
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(3, 33.333%);
        }

        height: 100px;
        padding: 13px 27px;
    }
    li:nth-child(2n) {
        background: #ececec;
    }
}
</style>
