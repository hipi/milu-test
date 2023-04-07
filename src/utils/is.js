export function isWeixin() {
  let flag = navigator.userAgent.match(/MicroMessenger/i);
  return flag;
}
