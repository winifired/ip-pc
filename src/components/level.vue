<template>
    <div class="confition font18 color000">
        华为创立于1987年，是全球领先的ICT（信息与通信）基础设施和智能终端提供商。目前华为约有19.7万员工，业务遍及170多个国家和地区，服务全球30多亿人口。
        华为致力于把数字世界带入每个人、每个家庭、每个组织，构建万物互联的智能世界：让无处不在的联接，成为人人平等的权利，成为智能世界的前提和基础；为世界提供最强算力，让云无处不在，让智能无所不及；所有的行业和组织，因强大的数字平台而变得敏捷、高效、生机勃勃；通过AI重新定义体验，让消费者在家居、出行、办公、影音娱乐、运动健康等全场景获得极致的个性化智慧体验。
    </div>
</template>
<script setup>
import { onMounted } from "@vue/runtime-core";

const emit=defineEmits();
onMounted(()=>{
    emit('titleMsg','代理等级说明')
})
</script>
<style lang='scss' scoped>
.confition{
line-height: 30px;
}
</style>
