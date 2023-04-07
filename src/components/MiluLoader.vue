<template>
  <div class="milu-loader">
    <div v-if="loading" class="milu-loader__pre">
      <div class="loader"></div>
    </div>
    <div class="milu-loader__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const $props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  height: {
    type: [String, Number],
    default: '100%',
  },
});
</script>

<style lang="scss">
.milu-loader {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 56px;
  .milu-loader__pre {
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color-loading-mask);
    border-radius: var(--border-radius-card);
    .loader {
      width: 36px;
      height: 36px;
      border: 2px solid var(--font-color-card-minor);
      border-radius: 50%;
      animation: rotation 1s ease-in-out infinite;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        width: 7px;
        height: 7px;
        background-color: var(--font-color-card-minor);
        border-radius: 100%;
        left: 50%;
      }
    }
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  .milu-loader__content {
    min-height: v-bind(height);
  }
}
</style>
