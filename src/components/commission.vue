<template>
    <el-scrollbar :height="offsetHeight">
        <ul>
            <li v-for="(item, index) in list" :key="index" class="font18 color000 flex area-between">
                <p>用户：{{item.username}}</p>
                <p>{{item.createtime}}</p>
                <p>返佣：{{item.gold}}</p>
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
const emit = defineEmits();
const list=ref(null);
onMounted(() => {
    emit('titleMsg', '推广返佣');
    getData();
})
const getData=()=>{
    proxy.$get(proxy.apis.spread).then(res=>{
        if(res.code==1){
            list.value=res.data.list;
            emit('numberMsg',{
                money:res.data.money,
                num:res.data.num
            })
        }
    })
}
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
