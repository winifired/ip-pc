<template>
    <div class="confition font18 color000">
        <div v-html="info"></div>
    </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from "@vue/runtime-core";
const {proxy}=getCurrentInstance();
const emit=defineEmits();
const info=ref(null);
onMounted(()=>{
    emit('titleMsg','代理等级说明');
    getData();
});
const getData=()=>{
    proxy.$get(proxy.apis.agent).then(res => {
    console.log(res)
    if (res.code == 1) {
        info.value=res.data.info;
    } else {
      proxy.$message.error(res.msg)
    }
  })
}
</script>
<style lang='scss' scoped>
.confition{
line-height: 30px;
}
</style>
