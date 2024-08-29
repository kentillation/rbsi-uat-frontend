import { createRouter, createWebHistory } from 'vue-router';
import NewContact from '../views/NewContact.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import ClientInfo from '../views/ClientInfo.vue';
import AllClients from '../views/AllClients.vue';
// import EditClientInfo from '../views/EditClientInfo.vue';

const routes = [
    { path: '/', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/client_info', name: 'ClientInfo', component: ClientInfo, meta: { requiresAuth: true } },
    { path: '/all_clients', name: 'AllClients', component: AllClients, meta: { requiresAuth: true } },
    { path: '/new_contact', name: 'NewContact', component: NewContact, meta: { requiresAuth: true } },
    { 
        path: '/edit_client_info/:cid/:last_name', 
        name: 'EditClientInfo', 
        // component: EditClientInfo,
        component: () => import('../views/EditClientInfo.vue'),
        meta: { requiresAuth: true } 
    },

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
