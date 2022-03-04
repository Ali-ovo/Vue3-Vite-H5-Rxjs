import {
  createRouter,
  createWebHashHistory,
  Router,
  RouteRecordRaw
} from 'vue-router';

import Test from '@/views/test.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/test' },
  { path: '/test', component: Test }
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 路由拦截
router.beforeEach((to, from, next) => {
  next();
});
export default router;
