import { createStore } from 'vuex'
import {
    post,
    get
} from "../utils/reuqest";
import apis from "../utils/apis";
export default createStore({
    state() {
        return {
            userinfo: localStorage.getItem('userinfoIp') ? JSON.parse(localStorage.getItem('userinfoIp')) : null
        }
    },
    mutations: {
        setUserinfo(state, info) {
            state.userinfo = info;
        },
    },
    actions: {
        updateUserinfo({ commit }) {
            // console.log(post)
            // console.log(apis)
            return new Promise((resolve,reject)=>{
                post(apis.base).then(res => {
                    if (res.code == 1) {
                        resolve({userinfo:res.data.userinfo,real_name:res.data.real_name});
                        commit('setUserinfo', res.data.userinfo);
                        localStorage.setItem("userinfoIp", JSON.stringify(res.data.userinfo));
                    }else{
                        reject(res.msg)
                    }
                });
            })
        }
    }
})