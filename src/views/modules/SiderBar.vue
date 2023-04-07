<template>
  <div class="yy-c siderbar" ref="siderbarRef">
    <span class="indicator"></span>
    <div v-for="(list, $index) in lists" :key="$index" class="list" :class="{ active: current === $index }">
      <a class="anchor" @click="handleClickAnchor($index)">
        {{ list.name }}
      </a>
    </div>
  </div>
</template>

<script setup name="SiderBar">
import { ref, shallowRef, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue';
import { debounce } from '@/utils/index';
import { offset, offset2 } from '@/utils/index';
const $props = defineProps({
  lists: {
    type: Array,
  },
  targetCustomAttr: {
    type: String,
    default: 'category-index',
  },
  pTop: {
    type: Number,
    default: 84,
  },
});

const cssTop = computed(() => `${$props.pTop}px`);
const siderbarRef = ref(null);
const current = ref(0);
const indicatorTop = ref('0px');
// 锚点点击
const handleClickAnchor = (index) => {
  const $target = document.querySelector(`[data-${$props.targetCustomAttr}='${index}']`);
  if (!$target) {
    return false;
  }
  $target.scrollIntoView();
};

// * 计算TOPS
const targetTops = shallowRef([]);
const processTargetTops = () => {
  const $targets = document.querySelectorAll(`[data-${$props.targetCustomAttr}]`);
  const targetsArr = Array.from($targets);
  const tops = [];
  targetsArr.forEach((el) => {
    tops.push(Math.floor(offset2(el).top));
  });
  targetTops.value = tops;
};
const bodyObserver = new ResizeObserver(debounce(processTargetTops, 300));
onMounted(() => {
  bodyObserver.observe(document.body);
});
onBeforeUnmount(() => {
  bodyObserver.disconnect();
});

// * 计算TOPS 结束

const handleScroll = () => {
  const elementToTop = 84;
  // 判断dom
  const tops = targetTops.value;
  const st = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const limit = Math.ceil(st + elementToTop);
  let index = 0;
  for (var i = 0; i < tops.length; i++) {
    if (limit >= tops[i]) {
      index = i;
    } else {
      break;
    }
  }
  if (index < 0) index = 0;
  current.value = index;
};

watch(
  () => current.value,
  () => {
    nextTick(() => {
      const $current = siderbarRef.value.querySelector('.active');
      if ($current) {
        indicatorTop.value = `${$current.offsetHeight / 2 + $current.offsetTop}px`;
      }
    });
  },
  {
    immediate: true,
  }
);

document.addEventListener('scroll', handleScroll, { passive: true });
onBeforeUnmount(() => {
  document.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.siderbar {
  top: v-bind(cssTop);
  .indicator {
    top: v-bind(indicatorTop);
  }
}
</style>
