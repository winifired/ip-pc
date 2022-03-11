<template>
  <div class="box">
    <div class="content">
      <div class="left">
        <ul>
          <li
            v-for="item in list"
            :key="item.id"
            class="font20 color000 cursor"
            :class="item.id == activedLi ? 'activedLi' : ''"
            @click="activedLi = item.id"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>
<script setup>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

const list = [
  { id: 'purchase', name: '购买记录' }, //purchase
  { id: 'commission', name: '推广返佣' }, //commission
  { id: 'changePassword', name: '修改密码' }, //changePassword
  { id: 'rechargeRecord', name: '充值记录' }, //rechargeRecord
  { id: 'level', name: '代理等级' }, //level
  { id: 'expired', name: '最近到期' } //expired
];
const route = useRoute();
const router = useRouter();
console.log(route);
const activedLi = ref(1);
const routeName = ref(route.params.name);
watch(
  () => routeName.value,
  (newData) => {
    if (newData == 'purchase') {
      activedLi.value = 1;
    } else if (newData == 'commission') {
      activedLi.value = 2;
    } else if (newData == 'changePassword') {
      activedLi.value = 3;
    } else if (newData == 'rechargeRecord') {
      activedLi.value = 4;
    } else if (newData == 'level') {
      activedLi.value = 5;
    } else if (newData == 'expired') {
      activedLi.value = 6;
    }
  }
)
watch(()=>activedLi.value,(newData)=>{

})
</script>
<style scoped lang="scss">
@import '../../common/user.scss';
</style>