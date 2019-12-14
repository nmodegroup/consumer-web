const httpManager = require('../lib/request/httpManager');

/**
 * 获取活动列表
 */
export function getActivityList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/activity/list', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取活动详情
 */
export function getActivityDetail(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/activity/detail', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 活动预订
 */
export function activityBooking(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/activity/order', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 取消活动预订
 */
export function cancelBooking(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/consumer/activity/order', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 取消活动预订
 */
export function getTable(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/activity/table', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 
 * 购买活动
*/

export function gtePayInfo(params){
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/activity/info', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
/**
 * 下单
*/
export function postPayment(params){
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/activity/pay', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
/**
 * 支付结果页
*/
export function getPayResult(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/activity/tickets', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}