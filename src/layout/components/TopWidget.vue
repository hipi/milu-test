<template>
  <div class="top-widgets">
    <div class="recommend">
      <div v-for="list in redPacketList" :key="list.name" class="list eleme" @click="handleOpenModal(list)">
        <img :src="list.icon" alt="" />
        {{ list.name }}
      </div>
      <a class="list tuijian" target="_blank" href="https://go.mintab.cn">
        <img src="@/assets/images/star.svg" alt="" />
        迷鹿起始页
      </a>
      <a class="list tuijian" target="_blank" href="https://support.qq.com/products/298043#label=show">
        <img src="@/assets/images/tuijian.svg" alt="" />
        推荐或反馈
      </a>
    </div>
    <div class="right-info">
      <el-carousel height="40px" direction="vertical" indicator-position="none" autoplay :interval="3000">
        <el-carousel-item v-for="(item, $index) in notifysList" :key="$index">
          <div class="info" :class="{ hot: item.hot }">
            <svg-icon v-if="item.hot" name="fire" class="icon-fire"></svg-icon>
            <a v-if="item.href" :href="item.href" target="_blank">{{ item.text }}</a>
            <span v-else>{{ item.text }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
  <MiluDialog v-if="elemeDiaolog" v-model="elemeDiaolog" width="400px" class="elem-dialog">
    <div class="eleme-diaolog-wrap" @click="handleCopyCode(redPacket.invite_code)">
      <img :src="redPacket.qrcode_url" alt="" />
      <div class="tips">点击复制口令</div>
    </div>
  </MiluDialog>
</template>

<script setup>
import { textCopy } from '@/utils/index';
import { getNotifys, getHitokoto } from '@/api/index';

// 弹窗
const elemeDiaolog = shallowRef(false);

const redPacketList = [
  {
    name: '饿了么红包',
    icon: '/images/red-packet/eleme.svg',
    qrcode_url: 'https://cdn-upyun.dogged.cn/2022/12/16/639c74b68e991.webp',
    invite_code: '0fυィ直此段 666:/＄djpPb6j＄~.👉饿了么App👈【快來領外賣紅包，最高20元，人人都有哦~】',
  },
];
const redPacket = shallowRef({});
const handleOpenModal = (list) => {
  elemeDiaolog.value = true;
  redPacket.value = list;
};

const handleCopyCode = (value) => {
  if (value && textCopy(value)) {
    ElMessage.success('复制成功');
  } else {
    ElMessage.error('复制失败');
  }
};

// * 提示
const notifysList = shallowRef([]);
const getAllNotifys = async () => {
  const P1 = getNotifys();
  const P2 = getHitokoto();
  const { data } = await P1;
  const hitokoto = await P2;
  notifysList.value = [
    ...data,
    {
      text: `${hitokoto.hitokoto}`,
    },
  ];
};

getAllNotifys();
</script>
