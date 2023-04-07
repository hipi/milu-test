import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';

import DefaultLayout from '@/layout/DefaultLayout.vue';

import HomePage from '@/views/pages/HomePage.vue';
// import HomeCategoryPage from '../views/HomeCategoryPage.vue';
// import LinkJumpPage from '../views/LinkJumpPage.vue';
// import PandoraPage from '../views/PandoraPage.vue';
// import HotPage from '../views/HotPage.vue';
// import FriendlinkPage from '../views/FriendlinkPage.vue';
// import NotFoundPage from '../views/NotFoundPage.vue';
// import LoginPage from '../views/LoginPage.vue';
// import AboutPage from '../views/AboutPage.vue';
// import SearchPage from '../views/SearchPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage
      }
      // {
      //   path: 'category/:categoryId',
      //   name: 'home-category',
      //   component: HomeCategoryPage,
      // },
      // {
      //   path: 'search',
      //   name: 'search',
      //   component: SearchPage,
      // },
      // {
      //   path: 'hot/:chapters*',
      //   name: 'hot',
      //   component: HotPage,
      // },
      // {
      //   path: 'pandora',
      //   name: 'pandora',
      //   component: PandoraPage,
      // },
      // {
      //   path: 'friendlink',
      //   name: 'friendlink',
      //   component: FriendlinkPage,
      // },
      // {
      //   path: 'about',
      //   name: 'about',
      //   component: AboutPage,
      // },
    ]
  },
  // {
  //   path: '/link-jump',
  //   name: 'linkjump',
  //   component: LinkJumpPage,
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: LoginPage,
  // },
  // {
  //   path: '/404',
  //   name: '404',
  //   component: NotFoundPage,
  // },
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/404'
  // }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 84
          });
        }, 300);
      });
    } else if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition);
        }, 300);
      });
    } else {
      return { top: 0 };
    }
  }
});

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.fullPath === '/pandora') {
    const token = Cookies.get('404l-token');
    if (!token) {
      next('/login?s_path=/pandora');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
