<template>
  <svg aria-hidden="true" class="symbol-svg-icon">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>
<script setup name="SvgIcon">
import { computed } from 'vue';
const $props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
});
const symbolId = computed(() => `#${$props.prefix}-${$props.name}`);
</script>
<style lang="css">
.symbol-svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.13em;
  fill: currentColor;
  overflow: hidden;
}
</style>
