const httpManager = require('../lib/request/httpManager');

/**
 * 获取验证码
 */
export function getCode(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/common/msg', params)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        reject(e)
      })
  })
}

/**
 * 验证旧手机下一步
 */
export function validatePhone(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/phone', params)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        reject(e)
      })
  })
}

/**
 * 绑定新手机-完成
 */
export function bindPhone(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/consumer/phone', params)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        reject(e)
      })
  })
}

/**
 * 获取我的预订单列表
 */
export function getTableOrder(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/table/order', params)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        reject(e)
      })
  })
}

/**
 * 获取我的活动单列表
 */
export function getActivityOrder(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/activity/order', params)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        reject(e)
      })
  })
}

/**
 * 获取感兴趣的酒吧列表
 */
export function getCollectOrder(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/bar/collect', params)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        reject(e)
      })
  })
}

