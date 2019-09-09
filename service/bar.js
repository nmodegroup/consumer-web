const httpManager = require('../lib/request/httpManager');

/**
 * 获取酒吧详情
 */
export function getBarDetail(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/bar/detail', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取酒吧预订信息
 */
export function getBarOrder(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/bar/order', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 酒吧收藏
 */
export function setCollect(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/bar/collect', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 取消收藏
 */
export function cancelCollect(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/consumer/bar/collect', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}