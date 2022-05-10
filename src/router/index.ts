import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/designer',
    name: 'designer',
    component: () => import('../views/designer.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
