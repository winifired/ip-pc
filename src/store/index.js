import { createStore } from 'vuex'
export default createStore({
    state() {
        return {
            userinfo:localStorage.getItem('userinfoIp')?JSON.parse(localStorage.getItem('userinfoIp')):null
        }
    },
    mutations: {
        setUserinfo(state, info) {
            state.userinfo = info;
        },
    }
})