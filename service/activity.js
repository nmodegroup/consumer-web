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