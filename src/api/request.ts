// import store from '@/redux';
import type { RequestMethod, RequestOptionsInit } from 'umi-request/types';
import { STATUS_CODE, Response } from './types';
import { extend } from 'umi-request';
import { Toast } from 'antd-mobile';

type RequestQueue = {
  url: string;
  method: 'post' | 'get';
  data: any;
};

interface Req extends RequestMethod {
  /** 基础前缀 */
  basicPrefix: string;
  /** 上传前缀 */
  uploadPrefix: string;
  /** 上传预览地址前缀 */
  uploadVisitPrefix: string;
}

/** URL 地址 */
const API_URL = {
  /** 上传接口地址 */
  UPLOAD: '/v4/common/upload/upload',
};

/** 请求队列 */
const requestQueues: RequestQueue[] = [];

/** 请求 - 出队 */
function outRequestQueues(url: string): void {
  const requestQueueIndex = requestQueues.findIndex(item => {
    if (item.url === url.split('?')[0]) {
      return true;
    }
  });

  if (requestQueueIndex !== -1) {
    requestQueues.splice(requestQueueIndex, 1);
  }
}

/** URL 处理 - 正向代理 */
function handleUrl(url: string, options: RequestOptionsInit) {
  /** 上传接口 */
  if (options.url === API_URL.UPLOAD) {
    return {
      url: req.uploadPrefix + API_URL.UPLOAD,
      options: { ...options, prefix: req.uploadPrefix, url: API_URL.UPLOAD },
    };
  }

  return { url, options };
}

/** Headers 处理 */
function handleHeaders(url: string, options: RequestOptionsInit) {
  /** 上传接口 */
  if (options.url !== API_URL.UPLOAD) {
    /** 设置请求头 */
    const headers = {
      // Authorization: store.getState().auth.token || '',
    };

    Object.assign(options.headers, headers);
  }

  return options.headers;
}

const req = <Req>extend({
  timeout: 30000,
  responseType: 'json',
  prefix: process.env.HOST,
  params: {
    _env: process.env.NAME,
  },
  errorHandler: error => {
    // 出队
    outRequestQueues(error.request.url);

    if (/timeout/.test(error.message)) {
      Toast.show({ icon: 'fail', content: '请求超时' });
    }

    if (/The user aborted a request/.test(error.message)) {
      return {
        code: STATUS_CODE.SUCCESS,
        data: null,
        msg: '用户取消了请求',
      };
    }

    return Promise.reject(error);
  },
});

req.interceptors.request.use((RequestUrl, RequestOptions) => {
  const { url, options } = handleUrl(RequestUrl, RequestOptions);

  options.headers = handleHeaders(url, options);

  /** 控制器 */
  const controller = new AbortController();

  /** 设置当前控制器可控制的请求 */
  options.signal = controller.signal;

  /** 检查队列是否存在当前请求 */
  const requestQueueIndex = requestQueues.findIndex(item => {
    if (item.url === url && item.method === options.method) {
      switch (options.method) {
        case 'get':
          if (JSON.stringify(options.params) === item.data) return true;
          break;
        case 'post':
          if (JSON.stringify(options.data) === item.data) return true;
          break;
        default:
          Toast.show({ icon: 'fail', content: '暂时未开放除了GET与POST的请求' });
          controller.abort();
          break;
      }
    }
  });

  /** 改请求是否在队列中存在 */
  if (requestQueueIndex >= 0) {
    controller.abort();
  } else {
    /** 添加请求到队列 */
    requestQueues.push({
      url,
      method: options.method as 'get' | 'post',
      data:
        options.method === 'get' ? JSON.stringify(options.params) : JSON.stringify(options.data),
    });
  }

  return { url, options };
});

req.interceptors.response.use(async (response, options) => {
  let res: Response | Blob | ArrayBuffer | FormData | string;
  switch (options.responseType) {
    case 'json':
      res = await response.clone().json();
      break;
    case 'arrayBuffer':
      res = await response.clone().arrayBuffer();
      break;
    case 'formData':
      res = await response.clone().formData();
      break;
    case 'text':
      res = await response.clone().text();
      break;
    case 'blob':
      res = await response.clone().blob();
      break;
    default:
      res = await response.clone().json();
      break;
  }

  // 出队
  outRequestQueues(response.url);

  if (options.responseType === 'json') {
    res = res as Response;
    switch (res.code) {
      case STATUS_CODE.SUCCESS:
        return response;
      case STATUS_CODE.FAIL_MESSAGE:
        Toast.show({ icon: 'fail', content: res.msg });
        return Promise.reject(res);
      default:
        return response;
    }
  }

  return response;
});

req.basicPrefix = process.env.HOST!;
req.uploadPrefix = process.env.UPLOAD_HOST!;
req.uploadVisitPrefix = process.env.UPLOAD_VISIT_PREFIX!;

export default req;
