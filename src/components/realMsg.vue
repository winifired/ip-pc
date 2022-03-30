<template>
  <el-dialog v-model="dialogFormVisible" title="实名认证信息" width="600px" custom-class="realmsg">
    <div class="tip">填写的身份信息需要和支付宝身份验证信息一致</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off" size="large" class="input" />
      </el-form-item>
      <el-form-item label="身份证号" prop="cardID">
        <el-input v-model="ruleForm.cardID" autocomplete="off" size="large" class="input" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone" autocomplete="off" size="large" class="input" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="ruleForm.code" autocomplete="off" size="large" class="input" />
        <el-button type="primary" size="large" :loading="loadingbtn" @click="getCode">{{ btnCode }}</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer flex area-center">
        <el-button type="primary" @click="submitForm(ruleFormRef)" size="large">提交</el-button>
        <el-button @click="dialogFormVisible = false" size="large">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="innerVisible" width="600px" title="发送验证码" custom-class="realmsg" destroy-on-close>
    <div class="flex area-center">
      <el-input v-model="codeCanvasTxt" autocomplete="off" size="large" class="input" />
      <canvasCode @canvasText="canvasText" />
    </div>
    <template #footer>
      <div class="flex area-center btnsCanvas">
      <el-button type="primary" @click="confirmCanvas()" size="large">确认</el-button>
      <el-button @click="innerVisible = false;codeCanvasTxt=''" size="large">取消</el-button>
    </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogFormVisiblezfb"
    width="450px"
    custom-class="realmsgzfb"
    :showClose="false"
    before-close="beforeClose"
  >
    <div class="headTitle flex area-center">
      <img src="../assets/zfb.svg" alt />
      <div>
        <p>支付宝</p>
        <p>ALIPAY</p>
      </div>
    </div>
    <div class="zfbcode">
      <div class="tips">请用支付宝扫码继续身份验证</div>
      <div class="code"></div>
    </div>
  </el-dialog>
</template>

<script setup>
import canvasCode from "../components/canvasCode.vue";
import { getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const innerVisible = ref(false);
const dialogFormVisible = ref(true);
const dialogFormVisiblezfb = ref(false);
const ruleFormRef = ref(null);
const btnCode = ref("获取验证码");
const setCanvasText = ref('');//canvas 图形验证
const codeCanvasTxt = ref('');
const onlineCode = ref('');//服务器返回验证码
const loadingbtn = ref(false);
const validatename = (rule, value, callback) => {
  console.log(rule, value);
  if (value === "") {
    callback(new Error("请输入姓名"));
  } else {
    callback();
  }
};
const validateID = (rule, value, callback) => {
  let reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  if (value === "") {
    callback(new Error("请输入身份证号"));
  } else if (!reg.test(value)) {
    callback(new Error("身份证号错误"));
  } else {
    callback();
  }
};
const validatephone = (rule, value, callback) => {
  let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else if (!reg.test(value)) {
    callback(new Error("手机号错误"));
  } else {
    callback();
  }
};
const validatecode = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else if (value != onlineCode.value) {
    callback(new Error("验证码错误"));
  } else {
    callback();
  }
};
const ruleForm = reactive({
  name: "",
  cardID: "",
  phone: "",
  code: ""
});
const rules = reactive({
  name: [{ validator: validatename, trigger: "blur" }],
  cardID: [{ validator: validateID, trigger: "blur" }],
  phone: [{ validator: validatephone, trigger: "blur" }],
  code: [{ validator: validatecode, trigger: "blur" }],
});
const submitForm = formEl => {
  console.log(formEl);
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log(valid)
      //   ``````````````
    } else {
      return false;
    }
  });
};
const canvasText = (data) => {
  setCanvasText.value = data;
}
const getCode = () => {
  // 获取验证码前需要通过数字验证码验证
  innerVisible.value = true;
}
const confirmCanvas = () => {
  console.log(codeCanvasTxt.value)
  console.log(setCanvasText.value)
  if (codeCanvasTxt.value != setCanvasText.value) {
    proxy.$message.error('图形验证码错误')
  } else {
    codeCanvasTxt.value="";
    innerVisible.value = false;
    loadingbtn.value=true;
    // 获取服务器密码
  }
}
const beforeClose = () => {
  console.log('询问是否已实名')
}
</script>

<style lang="scss" scoped>
.tip {
  height: 53px;
  line-height: 53px;
  padding-left: 20px;
  background: rgb(217, 237, 247);
  font-size: 18px;
  color: rgb(91, 191, 241);
  margin-bottom: 20px;
}
.input {
  width: 260px;
  margin-right: 20px;
}
.headTitle {
  height: 130px;
  img {
    width: 82px;
    height: 82px;
    margin-right: 14px;
  }
  > div {
    > p:nth-child(1) {
      font-size: 42px;
      font-weight: 600;
      color: #333;
    }
    > p:nth-child(2) {
      font-size: 26px;
      font-weight: 600;
      color: #333;
      letter-spacing: 7px;
    }
  }
}
.zfbcode {
  height: 500px;
  background: #00a0e9;
  padding-top: 15px;
  .tips {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    color: #fff;
  }
  .code {
    border: 1px solid #fff;
    padding: 12px;
    margin: 15px auto 0;
    width: 400px;
    height: 400px;
  }
}
</style>