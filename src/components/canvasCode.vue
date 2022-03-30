<template>
  <canvas ref="canvas" width="200" height="100"></canvas>
</template>

<script setup>
import { nextTick, ref } from "vue";
const canvas = ref(null);
nextTick(() => {
  var c = canvas.value;
  var cxt = c.getContext("2d");
  cxt.fillStyle = "#FF0000";
  cxt.fillRect(0, 0, 150, 75);
});
const randomNum=()=>{
    // 获取随机数
}
</script>
<style lang="scss">
</style>