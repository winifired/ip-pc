<template>
    <el-scrollbar :height="offsetHeight">
        <ul>
            <li v-for="(item, index) in list" :key="index" class="font18 color000 flexc column-bwn">
                <p>金币：{{item.gold}}</p>
                <div class="flex area-between">
                    <p>¥{{item.price}}</p>
                    <p>{{item.createtime}}</p>
                    <p>{{item.status==1?'微信':'支付宝'}}支付</p>
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
const {proxy}=getCurrentInstance();
const list=ref([]);
const emit = defineEmits();
onMounted(() => {
    emit('titleMsg', '充值记录')
getData();
})
const getData=()=>{
    proxy.$get(proxy.apis.moenryLog).then(res=>{
        if(res.code==1){
            list.value=res.data.list;
        }
    })
}
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
