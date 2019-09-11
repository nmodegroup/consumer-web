const httpManager = require('../lib/request/httpManager');

/**
 * 首页-获取banner/人气酒吧/附近酒吧
 */
export function barList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/homePage', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 用户位置上报
 */
export function setLocation(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/location', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取城市列表
 */
export function getCityList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/city/list', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取订单信息
 */
export function getOrder(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/homePage/order', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取订单信息
 */
export function getBarList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/bar/list', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取历史搜索记录
 */
export function getHistoryList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/search/hirstory', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 删除历史搜索记录
 */
export function delHistoryList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/consumer/search/hirstory', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}