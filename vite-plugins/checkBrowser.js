const checkBrowserPlugin = (options) => {
  let config = {};
  return {
    name: 'checkBrowser-html-transform',
    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig;
    },
    transformIndexHtml(html) {
      if (!config.env.PROD) {
        return;
      }
      const codeNormal = `alert('本网站已不支持低版本浏览器，如须继续浏览请您更换高版本的现代浏览器！')`;
      const innerCode = options?.alertCode || codeNormal;

      const noModuleFix = innerCode;
      const importMetaFix = `try{import.meta.url;}catch(e){${innerCode}}`;
      const tags = [];
      tags.push(
        {
          tag: 'script',
          attrs: { nomodule: true },
          children: noModuleFix,
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: {
            type: 'module',
          },
          children: importMetaFix,
          injectTo: 'head',
        }
      );
      return { html, tags };
    },
  };
};

export default checkBrowserPlugin;
