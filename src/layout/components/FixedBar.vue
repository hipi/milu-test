<template>
  <div class="fixed-bar">
    <div class="tool">
      <div class="tool-inner" @click="handleChangeMode">
        <svg-icon :name="settingsStore.isDark ? 'moon' : 'sun'"></svg-icon>
      </div>
      <div class="tip">模式切换</div>
    </div>
    <div class="tool">
      <div class="tool-inner" @click="zsDiaolog = true">
        <svg-icon name="thumbs"></svg-icon>
      </div>
      <div class="tip">赞赏我们</div>
    </div>

    <div :style="`visibility: ${isNeedBackTop ? 'visible' : 'hidden'};`" class="tool">
      <div class="tool-inner" @click="handleBackToTop">
        <svg-icon name="up"></svg-icon>
      </div>
      <div class="tip">回到顶部</div>
    </div>
    <MiluDialog v-if="zsDiaolog" v-model="zsDiaolog" width="600px" class="elem-dialog">
      <div class="zs-diaolog-wrap">
        <img src="https://cdn-upyun.dogged.cn/2023/03/02/6400c5f84ae93.png" alt="" />
      </div>
    </MiluDialog>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings';
const settingsStore = useSettingsStore();
const zsDiaolog = shallowRef(false);
const handleChangeMode = () => {
  settingsStore.toogleDarkModel();
};

const isNeedBackTop = ref(false);
const handleScroll = () => {
  isNeedBackTop.value = document.documentElement.scrollTop >= 800;
};
document.addEventListener('scroll', handleScroll, { passive: true });
onBeforeUnmount(() => {
  document.removeEventListener('scroll', handleScroll);
  isNeedBackTop.value = false;
});
// 返回顶部
const handleBackToTop = () => {
  window.scrollTo({
    top: 0,
    // behavior: 'smooth',
  });
};
</script>
