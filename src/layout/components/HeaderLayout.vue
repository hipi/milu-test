<template>
  <div class="header">
    <div class="header-content">
      <a href="/" class="logo">
        <img :src="`/images/logo-${settingsStore.isDark ? 'dark' : 'light'}.svg`" alt="" />
      </a>
      <div v-if="!settingsStore.isMobile" class="menu">
        <router-link v-for="menu in menuArr" :key="menu.href" :to="menu.href">
          {{ menu.name }}
        </router-link>
        <router-link to="/pandora">
          <svg-icon name="gift"></svg-icon>
          <span style="margin-left: 6px">潘多拉魔盒</span>
        </router-link>
      </div>
      <div class="right-panel tools">
        <div class="search">
          <form action="" @submit.prevent="handleSearch">
            <el-input type="search" v-model="searchKeyword" placeholder="寻找心仪的内容" :suffix-icon="Search" />
          </form>
        </div>
        <template v-if="settingsStore.isMobile">
          <div
            class="menu-icon"
            ref="mobileMenuIconRef"
            :class="{ close: isMobileMenuShow }"
            @click="handleClickMobileMenuIcon"
          >
            <i class="line"></i>
          </div>
          <div class="mobile-menu" :class="{ show: isMobileMenuShow }" ref="mobileMenuRef">
            <router-link v-for="menu in menuArr" :key="menu.href" :to="menu.href" @click="handleClickMobileMenu">
              {{ menu.name }}
            </router-link>
            <router-link to="/pandora"> 潘多拉魔盒 </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

const menuArr = [
  { name: '首页', href: '/', type: 'route' },
  { name: '今日热榜', href: '/hot', type: 'route' },
  { name: '关于我们', href: '/about', type: 'route' },
];
const $router = useRouter();
const mobileMenuRef = ref(null);
const mobileMenuIconRef = ref(null);
const isMobileMenuShow = ref(false);
const searchKeyword = ref('');

const handleSearch = (e) => {
  searchKeyword.value = searchKeyword.value.trim();
  if (!searchKeyword.value) {
    ElMessage.error('请输入关键词');
  } else {
    $router.push({ path: '/search', query: { q: searchKeyword.value } });
  }
  // 输入框失去焦点
  if (settingsStore.isMobile) {
    e.target[0].blur();
  }
};

const handleClickMobileMenuIcon = () => {
  isMobileMenuShow.value = !isMobileMenuShow.value;
};
const handleClickMobileMenu = () => {
  isMobileMenuShow.value = false;
};

const handleBlurMobileMenu = (e) => {
  if (mobileMenuRef.value && !mobileMenuRef.value.contains(e.target) && !mobileMenuIconRef.value.contains(e.target)) {
    isMobileMenuShow.value = false;
  }
};
document.addEventListener('click', handleBlurMobileMenu);
onBeforeUnmount(() => {
  document.removeEventListener('click', handleBlurMobileMenu);
});
</script>
