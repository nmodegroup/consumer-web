export const Index = '/pages/index/index'//登录首页
export const Activity = '/pages/index/activity'// 活动页面
export const Mine = '/pages/index/mine'// 我的页面
export const BarList = '/pages/barList/index'// 酒吧列表页面
export const BarDetail = '/pages/barDetail/index'// 酒吧详情页
export const ActivityDetail = '/pages/activityDetail/index'// 酒吧详情页
export const Booking = '/pages/booking/index'// 酒吧预订页
export const BookOrder = '/pages/bookOrder/index'// 我的预订
export const EditPhone = '/pages/editPhone/index'// 换绑手机号
export const Collect = '/pages/collect/index'// 我的收藏
export const Search = '/pages/search/index'// 我的收藏
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
