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

/**
 * 取消提醒
 */
export function cancelRemind(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/consumer/bar/remind', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 设置提醒
 */
export function setRemind(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/bar/remind', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}


/**
 * 酒吧预订确认
 */
export function bookBarOrder(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/consumer/bar/reserve', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 酒吧预订取消
 */
export function cancelBarOrder(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/consumer/bar/reserve', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 根据日期获取桌位列表
 */
export function getBarTable(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/bar/table', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 根据日期获取桌位列表
 */
export function getBarTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/consumer/bar/time', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
