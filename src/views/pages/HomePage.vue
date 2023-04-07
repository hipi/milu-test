<template>
  <MiluLoader :loading="isLoading" height="calc(100vh - 140px)">
    <MiluLinksMain :urlsData="urlsData" />
  </MiluLoader>
</template>

<script setup>
import MiluLinksMain from '@/views/modules/MiluLinksMain.vue';
import { getUrls } from '@/api/index';

const isLoading = ref(true);
const urlsData = shallowRef([]);
const getAllData = () => {
  isLoading.value = true;
  getUrls()
    .then((data) => {
      urlsData.value = data;
      isLoading.value = false;
    })
    .catch(() => {
      ElMessage.error('请求发生错误，请稍后再试！');
    });
};
getAllData();
</script>
