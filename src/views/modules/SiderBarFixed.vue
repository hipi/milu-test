<template>
  <Teleport to="body">
    <div class="milu-drawer-overlay" :class="{ active: drawerVisible }" @click="handleToogle">
      <div class="milu-drawer" @click.stop>
        <div class="milu-drawer-body">
          <div class="list-wrap" ref="listWrapRef">
            <div v-for="(list, $index) in lists" :key="$index" class="list">
              <a class="anchor" :class="{ active: current === $index }" @click="handleClickAnchor($index)">
                {{ list.name }}
              </a>
            </div>
          </div>
        </div>

        <div class="fixed-menu" @click="handleToogle">
          <svg-icon v-if="drawerVisible" name="menu-fold"></svg-icon>
          <svg-icon v-else name="menu-unfold"></svg-icon>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup name="SiderBarFixed">
import { ref, watch, onBeforeUnmount } from 'vue';
import { getScrollBarWidth } from '@/utils';
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

const drawerVisible = ref(false);

const listWrapRef = ref(null);

const current = ref(0);

watch(
  () => drawerVisible.value,
  (value) => {
    if (value) {
      document.body.classList.add('milu-body-overflow-hidden');
    } else {
      document.body.classList.remove('milu-body-overflow-hidden');
    }
  }
);

// 锚点点击
const handleClickAnchor = (index) => {
  const $target = document.querySelector(`[data-${$props.targetCustomAttr}='${index}']`);
  if (!$target) {
    return false;
  }
  const docRect = document.documentElement.getBoundingClientRect();
  const targetRect = $target.getBoundingClientRect();
  const positionY = targetRect.top - docRect.top;
  window.scrollTo({
    top: positionY - $props.pTop,
    behavior: 'smooth',
  });
  drawerVisible.value = false;
};

// 判断当前锚点
const handlePositionActive = () => {
  // 判断dom
  const $targets = document.querySelectorAll(`[data-${$props.targetCustomAttr}]`);
  const targetsArr = Array.from($targets);
  const tops = [];
  targetsArr.forEach((el) => {
    tops.push(Math.floor(offset2(el).top));
  });
  const elementToTop = 84;
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

const handleToogle = () => {
  drawerVisible.value = !drawerVisible.value;
  if (drawerVisible.value) {
    handlePositionActive();
  }
};

onBeforeUnmount(() => {
  document.body.classList.remove('milu-body-overflow-hidden');
});
</script>
