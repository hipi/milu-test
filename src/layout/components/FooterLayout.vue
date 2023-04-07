<template>
  <div class="footer">
    <div class="links" v-if="isHomePage">
      <span class="label"> 友情链接： </span>
      <a v-for="link in frinendsLink" :key="link.href" :href="link.href" target="_blank" class="link">
        {{ link.title }}
      </a>
      <a href="/friendlink" target="_blank" class="link">更多链接&gt; </a>
    </div>
    <div class="card">
      <div class="warn">
        本站为网址导航类网站，网站来源于网络，对其内容不负任何责任。若本站内容无意中侵犯到您的版权利益，请联系我们，我们会在收到信息后尽快给予处理。
      </div>

      <div class="brand-info">
        <span class="lx">
          <router-link to="/friendlink">友情链接</router-link>
          <router-link to="/about">关于我们</router-link>
          <router-link to="/about#zs">赞赏</router-link>
          <a href="https://support.qq.com/products/298043#label=show" target="_blank">留言投稿</a>
          <a href="mailto:admin@dogged.cn">邮箱：admin@dogged.cn</a>
        </span>
      </div>
      <div class="copyright">Copyright © 2023 迷鹿导航</div>
    </div>
  </div>
</template>

<script setup>
import { getFriends } from '@/api/index';
const $route = useRoute();
const isHomePage = computed(() => $route.path === '/');
const frinendsLink = shallowRef([]);
getFriends().then((res) => {
  frinendsLink.value = res.data.index;
});
</script>
