import { nanoid } from './index';
const jsonp = (url, cb = 'cb') => {
  const jsonCallBack = `jsonp_${nanoid(12)}`.replace(/-/g, '');
  return new Promise((resolve, reject) => {
    const JSONP = document.createElement('script');
    JSONP.type = 'text/javascript';
    JSONP.referrerPolicy = 'no-referrer';
    window[jsonCallBack] = (result) => {
      resolve(result);
      document.getElementsByTagName('head')[0].removeChild(JSONP);
    };
    try {
      const myUrl = new URLSearchParams(url);
      myUrl.delete(cb);
      myUrl.append(cb, jsonCallBack);
      JSONP.src = decodeURIComponent(myUrl.toString());
      document.getElementsByTagName('head')[0].appendChild(JSONP);
    } catch (e) {
      document.getElementsByTagName('head')[0].removeChild(JSONP);
      reject(e);
    }
  });
};

export default jsonp;
