import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Particles from 'particles.vue3';
import {
    post,
    get
} from "./utils/reuqest";
import apis from "./utils/apis";
router.beforeEach((to, form, next) => {
    if (!localStorage.getItem('useridIp')) {
        if (to.path == '/login' || to.path == '/register') {
            next();
        } else {
            next('/login');
        }
    } else {
        next();
    }

})
const app = createApp(App);
app.config.globalProperties.$post = post;
app.config.globalProperties.$get = get;
app.config.globalProperties.apis = apis;
app.use(router).use(Particles).use(ElementPlus).mount('#app')