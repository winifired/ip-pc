<template>
  <div class="realMsg" v-if="userinfo">
    <div class="msg font16">
      <p>1、未认证用户无法进行其他操作</p>
      <p>2、修改手机需要重新实名制认证</p>
      <p>3、手机号实名和身份证要一致（重要：【手机号实名和身份证要一致】才能通过验证）</p>
      <p>4、其他账号已经认证过的手机，请去手机修改，直接修改手机号码即可通过实名认证</p>
      <p>5、本人支付宝，本人身份证，本人手机号。进行实名认证！非本人支付宝官方刷脸认证不能通过</p>
      <p>根据《中华人民共和国网络安全法》第24条要求，您需要进行实名认证才能继续使用我们的产品和服务，请您尽快完成实名认证，感谢您的理解和支持。</p>
      <p>提示：所有产品已经对接日志系统！实时监控访问记录，严禁从事违法违规活动，异常数据自动上报</p>
    </div>
    <el-button type="primary" size="large" v-if="userinfo.verification == 0" @click="showxieyi">实名认证</el-button>
    <div class="successReal" v-else>
      <span>已实名认证</span> 实名认证无法修改，需要修改实名认证请联系管理员
    </div>
  </div>
  <el-dialog v-model="xieyi" width="800px" custom-class="realmsgxieyi" destroy-on-close>
    <el-scrollbar height="400px">
      <div class="xieyi font16" v-html="real_name"></div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer flex area-center">
        <el-button type="primary" @click="confirmxieyi()" size="large">同意</el-button>
        <el-button @click="realmsgxieyi = false" size="large">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogFormVisible"
    title="实名认证信息"
    width="600px"
    custom-class="realmsg"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
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
        <el-button
          type="primary"
          size="large"
          :disabled="loadingbtn"
          @click="getCode(ruleFormRef)"
        >{{ btnCode }}</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer flex area-center">
        <el-button type="primary" @click="submitForm(ruleFormRef)" size="large">提交</el-button>
        <el-button @click="dialogFormVisible = false" size="large">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="innerVisible"
    width="600px"
    title="发送验证码"
    custom-class="realmsg"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="flex area-center">
      <el-input v-model="codeCanvasTxt" autocomplete="off" size="large" class="input" />
      <canvasCode @canvasText="canvasText" />
    </div>
    <template #footer>
      <div class="flex area-center btnsCanvas">
        <el-button type="primary" @click="confirmCanvas()" size="large">确认</el-button>
        <el-button @click="innerVisible = false; codeCanvasTxt = ''" size="large">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogFormVisiblezfb"
    width="450px"
    custom-class="realmsgzfb"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
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
      <div class="code flex column-center">
        <qrcode-vue :value="text" :size="350" level="H" :margin="12" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'
import canvasCode from "../components/canvasCode.vue";
import { getCurrentInstance, nextTick, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
const prop = defineProps({
  real_name: {
    type: String,
    default: ""
  }
});
const emit = defineEmits();
const store = useStore();
const { proxy } = getCurrentInstance();
const innerVisible = ref(false);
const dialogFormVisible = ref(false);
const dialogFormVisiblezfb = ref(false);
const ruleFormRef = ref(null);
const btnCode = ref("获取验证码");
const setCanvasText = ref(""); //canvas 图形验证
const codeCanvasTxt = ref("");
const onlineCode = ref(""); //服务器返回验证码
const loadingbtn = ref(false);
const timer = ref(null);
const codeNum = ref(60);
const xieyi = ref(false);
const userinfo = ref(store.state.userinfo);
const text = ref('');//人脸二维码
const certify_id = ref('');//人脸识别编号
const timerrenlian = ref(null);//人脸识别定时器
const getCanvasCode = ref(false); //true 输入canvas验证码
onMounted(() => {
  clearInterval(timerrenlian.value);
  emit("titleMsg", "实名认证");
});
const showxieyi = () => {
  xieyi.value = true;
};
const confirmxieyi = () => {
  // 同意协议
  xieyi.value = false;
  dialogFormVisible.value = true;
};
const validatename = (rule, value, callback) => {
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
  if (getCanvasCode.value) {
    callback();
  } else {
    if (value === "") {
      callback(new Error("请输入验证码"));
    } else if (value != onlineCode.value) {
      callback(new Error("验证码错误"));
    } else {
      callback();
    }
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
  code: [{ validator: validatecode, trigger: "blur" }]
});
const submitForm = formEl => {
  console.log(formEl);
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      proxy
        .$post(proxy.apis.alipayindex, {
          certName: ruleForm.name,
          certNo: ruleForm.cardID,
          phone: ruleForm.phone
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            certify_id.value = res.data.certify_id;
            text.value = res.data.from;
            dialogFormVisiblezfb.value = true;
            timerrenlian.value = setInterval(() => {
              getzfbresult()
            }, 3000)
          } else {
            proxy.$message.error(res.msg);
          }
        });
    } else {
      return false;
    }
  });
};
const getzfbresult = () => {
  proxy
    .$get(proxy.apis.certify, {
      certify_id: certify_id.value,
    })
    .then(res => {
      console.log(res);
      if (res.code == 1) {
        dialogFormVisible.value = false;
        dialogFormVisiblezfb.value = false;
        userbase();
        clearInterval(timerrenlian.value);
      }
    });
}
const canvasText = data => {
  setCanvasText.value = data;
};
const getCode = formEl => {
  getCanvasCode.value = true;
  if (!formEl) return;
  formEl.validate(valid => {
    getCanvasCode.value = false;
    if (valid) {
      innerVisible.value = true;
    } else {
      return false;
    }
  });
};
const confirmCanvas = () => {
  console.log(codeCanvasTxt.value);
  console.log(setCanvasText.value);
  if (codeCanvasTxt.value != setCanvasText.value) {
    proxy.$message.error("图形验证码错误");
  } else {
    codeCanvasTxt.value = "";
    innerVisible.value = false;
    loadingbtn.value = true;
    // 获取服务器密码
    proxy
      .$post(proxy.apis.sms, {
        phone: ruleForm.phone
      })
      .then(res => {
        console.log(res);
        if (res.code == 1) {
          setTime();
          onlineCode.value = res.data.code;
        } else {
          proxy.$message.error(res.msg);
        }
      });
  }
};
const setTime = () => {
  timer.value = setInterval(() => {
    if (codeNum.value > 1) {
      codeNum.value--;
      btnCode.value = codeNum.value + 's';
    } else {
      codeNum.value = 60;
      btnCode.value = '获取验证码';
      clearInterval(timer.value);
    }
  }, 1000)
}
function userbase() {
  proxy.$post(proxy.apis.base).then(res => {
    console.log(res);
    if (res.code == 1) {
      userinfo.value = res.data.userinfo;
      store.commit('setUserinfo', res.data.userinfo);
      localStorage.setItem("userinfoIp", JSON.stringify(res.data.userinfo));
    } else {
      proxy.$message.error(res.msg);
    }
  });
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
    margin: 30px auto 0;
  }
}
.realMsg {
  .msg {
    font-size: 14px;
    background: #fcd3d3;
    color: #c45656;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  .successReal {
    font-size: 16px;
    background: #e1f3d8;
    color: #95d475;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #529b2e;
    span {
      color: #529b2e;
      margin-right: 20px;
    }
  }
}
</style>