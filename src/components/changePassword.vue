<template>
    <div class="flex row-center input">
        <p class="font18 color000">原始密码：</p>
        <input type="text" placeholder="请输入原始密码" class="font18 color000" />
    </div>
    <div class="flex row-center input">
        <p class="font18 color000">新密码：</p>
        <input type="text" placeholder="请输入新密码" class="font18 color000" />
    </div>
    <div class="flex row-center input">
        <p class="font18 color000">新密码：</p>
        <input type="text" placeholder="请再次输入新密码" class="font18 color000" />
    </div>
    <div class="button font18 colorfff cursor">确认修改</div>
</template>
<script setup>
import { onMounted } from "@vue/runtime-core";

const emit = defineEmits();
onMounted(() => {
    emit('titleMsg', '修改密码')
})
</script>
<style lang='scss' scoped>
.input {
    p {
        width: 100px;
        text-align: right;
    }
    input {
        width: 406px;
        height: 52px;
        background: #ffffff;
        border: 2px solid #e1e1e1;
        border-radius: 4px;
        padding: 0 22px;
    }
}
.input:not(:first-child) {
    margin-top: 24px;
}
.button {
    width: 499px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin-top: 50px;
    background: #45aeff;
    border-radius: 6px;
}
</style>
