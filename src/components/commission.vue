<template>
    <el-scrollbar :height="offsetHeight">
        <ul v-show="typeShow == 1">
            <li v-for="(item, index) in list" :key="index" class="font18 color000 commission">
                <p>用户：{{ item.username }}</p>
                <p>{{ item.createtime }}</p>
                <p>返佣：{{ item.gold }}</p>
            </li>
        </ul>
        <ul v-show="typeShow == 2" class="users">
            <div
                class="font20 color000 flex row-center userMsg"
                v-for="(item, index) in promotelist"
                :key="index"
            >
                <img src="../assets/avatar.png" alt />
                <div class="font20 color707">
                    <p>{{ item.username }}</p>
                    <div class="flex area-between">
                        <p>{{ item.level_name }}</p>
                        <p
                            class="coloreff cursor"
                            @click="recharge(index)"
                            v-if="userinfo && (userinfo.level == 1 || userinfo.level == 2)"
                        >充值</p>
                    </div>
                </div>
            </div>
        </ul>
    </el-scrollbar>
    <el-dialog
        v-model="dialogVisible"
        width="500px"
        :show-close="false"
        custom-class="dialogModel"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <template #title>
            <div class="nav">确认充值</div>
        </template>
        <div class="bottom">
            <div class="flex row-center">
                <p class="font18 color000">充值金币：</p>
                <el-input v-model="glad" class="m-2" size="large" />
            </div>
            <div class="flex row-center buyButton font18 color000">
                金币余额：
                <span class="color600 font22">{{ userinfo.money }}</span>
            </div>
        </div>
        <template #footer>
            <div class="buttons flex">
                <p class="font20 color262 cursor" @click="dialogVisible = false">取消</p>
                <p class="font20 coloreff cursor" @click="confirm">确认</p>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
const prop = defineProps({
    offsetHeight: String,
    typeShow: [Number, String]
});
const { proxy } = getCurrentInstance();
const emit = defineEmits();
const list = ref(null);
const dialogVisible = ref(false);
const glad = ref('');
const store = useStore();
const userinfo = ref(store.state.userinfo);
const chooseindex = ref(0);//充值对象
const promotelist = ref([]);
onMounted(() => {
    if (prop.typeShow == 1) {
        emit('titleMsg', '推广充值');
    } else {
        emit('titleMsg', '推广人员');
    }
    getData();
    getpromote();
});
watch(() => prop.typeShow, (newData) => {
    console.log(newData)
    if (newData == 1) {
        emit('titleMsg', '推广充值');
    } else {
        emit('titleMsg', '推广人员');
    }
})
const getData = () => {
    proxy.$get(proxy.apis.spread).then(res => {
        if (res.code == 1) {
            list.value = res.data.list;
            emit('numberMsg', {
                money: res.data.money,
                num: res.data.num
            })
        }
    })
}
const getpromote = () => {
    proxy.$get(proxy.apis.promote, {
        search: ''
    }).then(res => {
        if (res.code == 1) {
            promotelist.value = res.data.list;
        }
    })
}
const recharge = (index) => {
    chooseindex.value = index;
    dialogVisible.value = true;
}
const confirm = () => {
    if (!glad.value) {
        proxy.$message.error('请输入充值金额');
        return;
    }
    if ((glad.value - 0) > (userinfo.money - 0)) {
        proxy.$message.error('余额不足');
        return;
    }
    proxy.$get(proxy.apis.noderecharge, {
        user_id: promotelist.value[chooseindex.value].id,
        money: glad.value
    }).then(res => {
        if (res.code == 1) {
            proxy.$message('充值成功');
            dialogVisible.value = false;
            store.dispatch('updateUserinfo').then(res => {
                userinfo.value = res.userinfo;
            }).catch(err => {
                proxy.$message.error(err);
            });
        } else {
            proxy.$message.error(res.msg);
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
.commission {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(3, 33.333%);
    p {
        display: flex;
        align-items: center;
    }
}
.users {
    display: grid;
    grid-template-rows: 1fr;
    grid-column-gap: 25px;
    grid-template-columns: repeat(3, 300px);
}
.userMsg {
    height: 100px;
    padding: 0 13px;
    background: #ffffff;
    border: 1px solid #d5d5d5;
    border-radius: 6px;
    margin-bottom: 25px;
    img {
        width: 70px;
        height: 70px;
        margin-right: 23px;
        border-radius: 50%;
    }
    > div {
        flex: 1;
        > p {
            margin-bottom: 7px;
        }
    }
}
.nav {
    text-align: center;
    font-size: 22px;
    background: #fff;
    line-height: 80px;
}
.m-2 {
    width: 70%;
}
.buyButton {
    margin-top: 30px;
}
</style>
