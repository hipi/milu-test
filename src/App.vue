<template>
  <RouterView />
</template>
<script setup>
import { useSettingsStore } from '@/stores/settings';
import { useHead } from '@vueuse/head';

useHead({
  titleTemplate: (title) => (title ? `${title} - 迷鹿导航` : '迷鹿导航 - 实用的网站导航'),
});

const settingsStore = useSettingsStore();

watch(
  () => settingsStore.isDark,
  (val) => {
    if (val) {
      document.documentElement.classList.add('is-dark');
    } else {
      document.documentElement.classList.remove('is-dark');
    }
  },
  {
    immediate: true,
  }
);
</script>
