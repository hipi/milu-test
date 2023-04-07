import defaultImg from '@/assets/images/loading.gif';
export default {
  created(el, binding) {
    el.src = defaultImg;
    if (binding.value) {
      const observe = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            observe.unobserve(el);
            el.src = binding.value;
          }
        },
        {
          threshold: 0 //进入到可视区交界就开始观察
        }
      );
      el.__observe__ = observe;
    }
  },
  mounted(el) {
    el.__observe__ && el.__observe__.observe(el);
  },
  beforeUnmount(el) {
    el.__observe__ && el.__observe__.disconnect();
  }
};
