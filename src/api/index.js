import miluStorage from '@/utils/indexedDB';
import dayjs from 'dayjs';
import { sk } from '@/utils/hot-aes';
import { uniqueFunc } from '@/utils/index';
import { version } from '../../package.json';
import Cookies from 'js-cookie';

const initStorageVersion = async () => {
  const storageVersion = await miluStorage.getItem('version');
  if (storageVersion !== version) {
    await miluStorage.clear();
    await miluStorage.setItem('version', version);
  }
};

// 获取首页链接
export const getUrls = async () => {
  await initStorageVersion();
  const localUrls = await miluStorage.getItem('urls');
  if (localUrls && localUrls?.exp >= Date.now()) {
    return localUrls.data;
  }
  try {
    const { data } = await fetch('https://service-p1kt0sax-1254063733.sh.apigw.tencentcs.com/release/urls-new').then(
      (res) => res.json()
    );
    const item = {
      exp: dayjs().add(10, 'minute').valueOf(),
      data
    };
    miluStorage.setItem('urls', item);
    return data;
  } catch (e) {
    return Promise.reject();
  }
};

export const getFlatUrls = async () => {
  const allUrls = await getUrls();
  const flatUrls = allUrls.reduce((result, item) => {
    item.category.forEach((category) => {
      result.push(...category.urls);
    });
    return result;
  }, []);
  return uniqueFunc(flatUrls, 'href');
};

// 获取友情链接
export const getFriends = () =>
  fetch('https://service-p1kt0sax-1254063733.sh.apigw.tencentcs.com/release/friends')
    .then((res) => res.json())
    .then((res) => {
      // 处理 data url 数据
      const { index, inside } = res.data;
      index.forEach((item) => {
        const urlPt = new URL(item.href);
        urlPt.search = '?f=404l.com';
        item.href = urlPt.href;
      });
      inside.forEach((item) => {
        const urlPt = new URL(item.href);
        urlPt.search = '?f=404l.com';
        item.href = urlPt.href;
      });
      return res;
    });

// 获取提示
export const getNotifys = () =>
  fetch('https://service-p1kt0sax-1254063733.sh.apigw.tencentcs.com/release/alert').then((res) => res.json());

// 获取每日一言
export const getHitokoto = () => fetch('https://v1.hitokoto.cn/').then((res) => res.json());

// 获取今日热榜分类
export const getHotCategory = async () => {
  await initStorageVersion();
  const topCategory = await miluStorage.getItem('hot-category');
  if (topCategory && topCategory?.exp >= Date.now()) {
    return topCategory.data;
  }
  try {
    const { data } = await fetch('https://today.dogged.cn/api/category', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        s: sk()
      }
    }).then((res) => res.json());

    const processedData = data.map(({ category, id, name, type }) => ({
      category,
      id,
      name,
      type
    }));
    const categoryStorageData = {
      exp: dayjs().add(30, 'day').valueOf(),
      data: processedData
    };
    miluStorage.setItem('hot-category', categoryStorageData);
    return data;
  } catch (e) {
    return Promise.reject();
  }
};

// 获取特定的今日热榜
export const getHotListById = (data) =>
  fetch('https://today.dogged.cn/api/list', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      s: sk()
    }
  }).then((res) => res.json());

// 魔盒登录
export const login = (data) =>
  fetch('https://service-p1kt0sax-1254063733.sh.apigw.tencentcs.com/release/login', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json());

// 获取魔盒链接
export const getPandoraUrls = () =>
  fetch('https://service-p1kt0sax-1254063733.sh.apigw.tencentcs.com/release/vip', {
    headers: {
      token: Cookies.get('404l-token')
    }
  }).then((res) => res.json());
