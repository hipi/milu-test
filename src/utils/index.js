export function textCopy(text) {
  function addFake(value) {
    const fakeDom = document.createElement('textarea');
    fakeDom.style.fontSize = '12pt';
    // Reset box model
    fakeDom.style.border = '0';
    fakeDom.style.padding = '0';
    fakeDom.style.margin = '0';
    // Move element out of screen horizontally
    fakeDom.style.position = 'absolute';
    const isRTL = document.documentElement.getAttribute('dir') == 'rtl';
    fakeDom.style[isRTL ? 'right' : 'left'] = '-9999px';
    // Move element to the same position vertically
    const yPosition = window.pageYOffset | document.documentElement.scrollTop;
    fakeDom.style.top = yPosition + 'px';
    fakeDom.setAttribute('readonly', '');
    fakeDom.value = value;
    document.body.appendChild(fakeDom);
    return fakeDom;
  }
  const selectdom = addFake(text);
  selectdom.select();
  let succeeded;
  try {
    succeeded = document.execCommand('copy');
  } catch (err) {
    succeeded = false;
  }
  document.body.removeChild(selectdom);
  return succeeded;
}

export function getArrayRandomItems(arr, num) {
  const temp_arr = arr.slice(0);
  // 取出的数值项，保存在此数组
  const return_arr = [];
  for (let i = 0; i < num; i++) {
    // 判断如果数组还有可以取出的元素，以防下标越界
    if (temp_arr.length > 0) {
      // 在数组中产生一个随机索引
      const arrIndex = Math.floor(Math.random() * temp_arr.length);
      // 将此随机索引的对应数组元素值复制出来
      return_arr[i] = temp_arr[arrIndex];
      // 然后删掉此索引的数组元素，这时候temp_arr变为新的数组
      temp_arr.splice(arrIndex, 1);
    } else {
      // 数组中数据项取完后，退出循环，比如数组本来只有10项，但要求取出20项
      break;
    }
  }
  return return_arr;
}

let scrollBarWidth;
export const getScrollBarWidth = () => {
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  const outer = document.createElement('div');
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);
  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);
  const widthWithScroll = inner.offsetWidth;
  outer.parentNode?.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;
  return scrollBarWidth;
};

// 洗牌算法
export const shuffle = (arr) => {
  const result = [];
  while (arr.length > 0) {
    const random = Math.floor(Math.random() * arr.length);
    result.push(arr[random]);
    arr.splice(random, 1);
  }
  return result;
};

// nanoid
export const nanoid = (t = 21) =>
  crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(
      (t, e) =>
        (t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? '-' : '_'),
      ''
    );

export function debounce(fn, delay) {
  let timer = null; // 声明计时器
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

// 对象数组去重
export function uniqueFunc(arr, uniId) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

// 驼峰转连字符
export function toLowerLine(str) {
  let temp = str.replace(/([A-Z])/g, '-$1').toLowerCase();
  if (temp.slice(0, 1) === '-') {
    //如果首字母是大写，执行replace时会多一个_，这里需要去掉
    temp = temp.slice(1);
  }
  return temp;
}

// 连字符转驼峰
export function toCamel(str) {
  return str.replace(/([^-])(?:-+([^-]))/g, ($0, $1, $2) => $1 + $2.toUpperCase());
}

// TODO:
export const offset2 = (node) => {
  var offest = {
    top: 0,
    left: 0
  };
  // 当前为IE11以下, 直接返回{top: 0, left: 0}
  if (!node.getClientRects().length) {
    return offest;
  }
  // 当前DOM节点的 display === 'node' 时, 直接返回{top: 0, left: 0}
  if (window.getComputedStyle(node)['display'] === 'none') {
    return offest;
  }
  // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
  // 返回值包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。
  // 返回如{top: 8, right: 1432, bottom: 548, left: 8, width: 1424…}
  offest = node.getBoundingClientRect();
  var docElement = node.ownerDocument.documentElement;
  return {
    top: offest.top + window.pageYOffset - docElement.clientTop,
    left: offest.left + window.pageXOffset - docElement.clientLeft
  };
};

export const offset = (ele) => {
  let result = {
    top: 0,
    left: 0
  };
  /*
   * nodeType 属性返回以数字值返回指定节点的节点类型。
   * 如果节点是元素节点，则 nodeType 属性将返回 1。
   * 如果节点是属性节点，则 nodeType 属性将返回 2。
   * 如果节点 node.nodeType 类型不是 Element(1)，则跳出；
   * 如果相关节点的 position 属性为 static，则不计入计算，进入下一个节点（其父节点）的递归。
   * 如果相关属性的 display 属性为 none，则应该直接返回 0 作为结果。
   */
  const getOffset = (node, init) => {
    if (node.nodeType !== 1) {
      return;
    }
    position = window.getComputedStyle(node)['position'];

    if (typeof init === 'undefined' && position === 'static') {
      getOffset(node.parentNode);
      return;
    }
    result.top = node.offsetTop + result.top - node.scrollTop;
    result.left = node.offsetLeft + result.left - node.scrollLeft;

    if (position === 'fixed') {
      return;
    }
    getOffset(node.parentNode);
  };

  // 当前 DOM 节点的 display === 'none' 时, 直接返回 {top: 0, left: 0}
  if (window.getComputedStyle(ele)['display'] === 'none') {
    return result;
  }
  let position;
  getOffset(ele, true);
  return result;
};
