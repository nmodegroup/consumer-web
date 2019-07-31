export const Index = '/pages/index/index'//登录首页
export const Activity = '/pages/index/activity'// 活动页面
export const Mine = '/pages/index/mine'// 我的页面
export const BarList = '/pages/barList/index'// 酒吧列表页面
/** 生成参数 */
export function joinPath(paramsObj) {
  const url = paramsObj.url;
  const params = paramsObj.params;
  if (typeof params === 'object') {
    const keys = Object.keys(params);
    if (keys && keys.length) {
      const path = keys.reduce((url, key) => {
        return `${url}${key}=${params[key]}&`;
      }, `${url}?`)
      return path.substring(0, path.length - 1);
    } else {
      return url;
    }
  }
  return url;
}
