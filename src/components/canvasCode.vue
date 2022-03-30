<template>
  <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" @click="refuseCanvas"></canvas>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
const canvas = ref(null);
const canvasWidth = ref(120);
const canvasHeight = ref(50);
const identifyCode = ref();
const emit=defineEmits();
onMounted(() => {
  identifyCode.value = randomText();
  emit('canvasText',identifyCode.value);
  getCanvas()
})
const randomText = () => {
  let arr = [];
  for (let i = 0; i < 4; i++) {
    arr.push(Math.floor(Math.random() * 10))
  }
  return arr.join('');
}
const randomNum = (max, min) => {
  // 获取随机数
  return Math.floor(Math.random() * (max - min) + min);
}
const randomColor = (max, min) => {
  // 获取随机颜色
  let r = randomNum(max, min), g = randomNum(max, min), b = randomNum(max, min);
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}
const getCanvas = () => {
  nextTick(() => {
    var c = canvas.value;
    var ctx = c.getContext("2d");
    ctx.textbaseline = "bottom";
    ctx.fillStyle = randomColor(240, 180);
    ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
    for (let i = 0; i < identifyCode.value.length; i++) {
      drawText(ctx, identifyCode.value[i], i)
    }
    drawline(ctx);
    drawdot(ctx);
  });
}
const drawText = (ctx, txt, i) => {
  ctx.fillStyle = randomColor(160, 80);
  ctx.font = randomNum(40, 22) + 'px SimHei';
  let x = (i + 1) * (canvasWidth.value / (identifyCode.value.length + 1));
  let y = randomNum(40, canvasHeight.value - 5);
  let deg = randomNum(-45, 45);
  ctx.translate(x, y);
  ctx.rotate(deg * Math.PI / 180);
  ctx.fillText(txt, 0, 0);
  ctx.rotate(-deg * Math.PI / 180);
  ctx.translate(-x, -y);
}
const drawline = (ctx) => {
  // 干扰线
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = randomColor(180, 40);
    ctx.beginPath();
    ctx.moveTo(randomNum(canvasWidth.value, 0), randomNum(canvasHeight.value, 0));
    ctx.lineTo(randomNum(canvasWidth.value, 0), randomNum(canvasHeight.value, 0));
    ctx.stroke();
  }
}
const drawdot = (ctx) => {
  // 干扰点
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(randomNum(canvasWidth.value, 0), randomNum(canvasHeight.value, 0), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
}
const refuseCanvas = () => {
  identifyCode.value = randomText();
  emit('canvasText',identifyCode.value);
  getCanvas()
}
</script>
<style lang="scss">
</style>