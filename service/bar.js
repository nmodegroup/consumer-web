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