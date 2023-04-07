<template>
  <div id="layout" class="layout-default">
    <HeaderLayout />
    <div class="container">
      <TopWidget/>
      <RouterView />
    </div>
    <FooterLayout />
    <FixedBar/>
  </div>
</template>
<script setup>
import HeaderLayout from './components/HeaderLayout.vue';
import FooterLayout from './components/FooterLayout.vue';
import FixedBar from './components/FixedBar.vue';
import TopWidget from './components/TopWidget.vue';
</script>
