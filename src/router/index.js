import { createRouter, createWebHistory } from 'vue-router';
import NewClient from '../views/NewClient.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import CustomerInfo from '../views/CustomerInfo.vue';

const routes = [
    { path: '/', name: 'Login', component: Login },
    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/customer-info', name: 'CustomerInfo', component: CustomerInfo, meta: { requiresAuth: true } },
    { path: '/new-contact', name: 'NewClient', component: NewClient, meta: { requiresAuth: true } },
    { path: '/register', name: 'Register', component: Register },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('auth_token');

    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next('/');
    } else {
        next();
    }
});

export default router;
