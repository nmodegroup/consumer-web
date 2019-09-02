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
 * 首页-获取banner/人气酒吧/附近酒吧
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