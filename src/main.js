import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Particles from 'particles.vue3';
import {post} from "./utils/reuqest";
import apis from "./utils/apis";
const app=createApp(App);
console.log(import.meta.env)
app.config.globalProperties.$post=post;
app.config.globalProperties.apis=apis;
app.use(router).use(Particles).use(ElementPlus).mount('#app')
