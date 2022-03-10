import { createRouter, createWebHistory } from "vue-router";
const routes = [{
    path: "/login",
    name: "login",
    component: () =>
        import ("../view/login.vue"),
},{
    path: "/",
    name: "home",
    component: () =>
        import ("../view/home.vue"),
}];
// process.env.BASE_URL
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;