<template>
  <div class="milu-links-main">
    <div class="aside"></div>
    <div class="content"></div>
    {{ urlsData }}
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

const $props = defineProps({
  urlsData: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss">
.milu-links-main {
}
</style>
