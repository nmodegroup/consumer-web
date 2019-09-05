const httpManager = require('../lib/request/httpManager');

/**
 * 用户登录
 */
export function userLogin (params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/login', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 用户授权解析手机号
 */
export function setPhone(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/phone', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}