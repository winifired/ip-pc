<template>
    <div class="flex row-center input">
        <p class="font18 color000">原始密码：</p>
        <input type="password" v-model="oldPass" placeholder="请输入原始密码" class="font18 color000" />
    </div>
    <div class="flex row-center input">
        <p class="font18 color000">新密码：</p>
        <input type="password" v-model="newPass" placeholder="请输入新密码" class="font18 color000" />
    </div>
    <div class="flex row-center input">
        <p class="font18 color000">新密码：</p>
        <input type="password" v-model="newPassAgain" placeholder="请再次输入新密码" class="font18 color000" />
    </div>
    <div class="button font18 colorfff cursor" @click="confirm">确认修改</div>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from "@vue/runtime-core";
const {proxy}=getCurrentInstance();
const emit = defineEmits();
const oldPass=ref('');
const newPass=ref('');
const newPassAgain=ref('');
onMounted(() => {
    emit('titleMsg', '修改密码')
});
const confirm=()=>{
    if(!oldPass.value||!newPass.value||!newPassAgain.value){
        proxy.$message.error('请输入旧密码或者新密码');
        return;
    }
    if(newPass.value!=newPassAgain.value){
        proxy.$message.error('两次新密码不一致');
        return;
    }
    proxy.$post(proxy.apis.resetpwdpost,{
        username:JSON.parse(localStorage.getItem('userinfoIp')).username,
        password:oldPass.value,
        newpassword:newPass.value,
    }).then(res => {
    if (res.code == 1) {
        proxy.$message('修改密码成功');
        oldPass.value='';
        newPass.value='';
        newPassAgain.value='';
    } else {
      proxy.$message.error(res.msg)
    }
  })
}
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
