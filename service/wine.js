const httpManager = require('../lib/request/httpManager');

/**
 * 酒云测试
*/
export function postDivination(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/divination', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}