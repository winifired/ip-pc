import { createRouter, createWebHistory } from "vue-router";
const routes = [{
    path: "/user/:name",
    name: "user",
    component: () =>
        import ("../view/user/user.vue"),
},{
    path: "/recharge",
    name: "recharge",
    component: () =>
        import ("../view/recharge.vue"),
},{
    path: "/login",
    name: "login",
    component: () =>
        import ("../view/login.vue"),
},{
    path: "/nodePges",
    name: "nodePges",
    component: () =>
        import ("../view/nodePges.vue"),
},{
    path: "/register",
    name: "register",
    component: () =>
        import ("../view/register.vue"),
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