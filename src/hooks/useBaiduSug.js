import { ref } from 'vue';
import jsonp from '@/utils/jsonp';
const useBaiduSug = () => {
  const sugArrs = ref([]);
  const sugSearch = (searchWord) => {
    if (searchWord.replace(/\s/g, '') !== '') {
      jsonp(`https://www.baidu.com/sugrec?prod=pc&wd=${searchWord}&cb=jQ`).then((res) => {
        sugArrs.value = res.g || [];
      });
    } else {
      sugArrs.value = [];
    }
  };
  return { sugArrs, sugSearch };
};

export default useBaiduSug;
