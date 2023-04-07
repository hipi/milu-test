import { defineStore } from 'pinia';
import dayjs from 'dayjs';

import useMediaQuery from '@/hooks/useMediaQuery';
const isMobileQuery = useMediaQuery('(max-width: 768px)');
const isMediaDark = useMediaQuery('(prefers-color-scheme: dark)');
// 下午6点到早上6点
const getIsNightTime = () => dayjs().hour() >= 18 || dayjs().hour() < 6;

const getCurrentAutoThemeDark = () => {
  if (isMediaDark.value || getIsNightTime()) {
    return true;
  } else {
    return false;
  }
};

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    isMobile: isMobileQuery,
    themeAppearance: localStorage.getItem('theme-appearance')
  }),
  getters: {
    isDark: (state) => {
      if (!state.themeAppearance || state.themeAppearance === 'auto') {
        // 会自动收集依赖变动
        return getCurrentAutoThemeDark();
      } else {
        return state.themeAppearance === 'dark';
      }
    }
  },

  actions: {
    toogleDarkModel() {
      const autoDark = getCurrentAutoThemeDark();
      const nowState = !this.isDark;

      if (nowState === autoDark) {
        this.themeAppearance = 'auto';
        localStorage.setItem('theme-appearance', 'auto');
      } else {
        this.themeAppearance = nowState ? 'dark' : 'light';
        localStorage.setItem('theme-appearance', nowState ? 'dark' : 'light');
      }
    }
  }
});
