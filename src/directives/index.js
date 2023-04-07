import lazyLoad from './lazyLoad';

const defineDirective = (app) => {
  app.directive('lazyLoad', lazyLoad);
};
export default {
  install(app) {
    defineDirective(app); //自定义指令
  }
};
