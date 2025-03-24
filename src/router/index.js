import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import NewContact from '../views/NewContact.vue';
import ClientInfo from '../views/ClientInfo.vue';
import ClientAccount from '../views/ClientAccount.vue';
import OCR from '../views/OCR.vue';
import OCRtextview from '../views/OCR-textview.vue';
import AllClients from '../views/AllClients.vue';
import Reprinting from '../views/Reprinting.vue';
import PrintPassbook from '../views-printing/PrintPassbook.vue';

const routes = [
    { path: '/', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/client_info', name: 'ClientInfo', component: ClientInfo, meta: { requiresAuth: true } },
    { path: '/client_account', name: 'ClientAccount', component: ClientAccount, meta: { requiresAuth: true } },
    { path: '/ocr', name: 'OCR', component: OCR, meta: { requiresAuth: true } },
    { path: '/ocr-textview', name: 'OCR-textview', component: OCRtextview, meta: { requiresAuth: true } },
    { path: '/all_clients', name: 'AllClients', component: AllClients, meta: { requiresAuth: true } },
    { path: '/new_contact', name: 'NewContact', component: NewContact, meta: { requiresAuth: true } },
    { path: '/reprinting', name: 'Reprinting', component: Reprinting, meta: { requiresAuth: true } },
    { 
        path: '/new_account/:cid', 
        name: 'NewAccount', 
        component: () => import('../views/NewAccount.vue'),
        props: true,
        meta: { requiresAuth: true } 
    },
    { 
        path: '/client_account_list/:CID', 
        name: 'ClientAccountList', 
        component: () => import('../views/ClientAccountList.vue'),
        meta: { requiresAuth: true } 
    },
    {
        path: '/print-passbook',
        name: 'PrintPassbook',
        component: PrintPassbook,
        meta: { layout: 'print' }
    }
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
