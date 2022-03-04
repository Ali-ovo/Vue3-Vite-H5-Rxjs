import { params } from '@/typings';
import request from '@/servise/request';
import config from '@/../public/out_config';

// 请求拼接 判断生产 测试 仿真
const joinRequestUrl = (url: string, type?: string) => {
  if ((import.meta.env.VITE_APP_URL as string) === '/prod') {
    let newUrl = '';
    switch (config.run_evn) {
      case 'test':
        // 测试 test
        newUrl = '测试';

        break;
      case 'emulation':
        // 仿真
        newUrl = '仿真';

        break;
      case 'production':
        // 生产
        newUrl = '生产';
        break;
      default:
        // 本地环境
        newUrl = '/api';
    }

    return `${newUrl}${url}`;
  }
  return import.meta.env.VITE_APP_URL + url;
};

/**
 * test
 * @param {params} params 需要进行处理的路径
 * @returns {String} 返回处理后的路径
 */
export async function marketStatus(params: params) {
  return request(
    joinRequestUrl(
      '/gwapi/stockit/yjbapi/stockit-web-provider/v1/market/status'
    ),
    {
      method: 'GET',
      params
    }
  );
}

/**
 * test
 * @param {params} params 需要进行处理的路径
 * @returns {String} 返回处理后的路径
 */
export async function homeNewStock(params: params) {
  return request(
    joinRequestUrl(
      '/gwapi/stockit/yjbapi/stockit-web-provider/yjbapi/quote/realtimeList/query'
    ),
    {
      method: 'GET',
      params: params
    }
  );
}

/**
 * test
 * @param {params} params 需要进行处理的路径
 * @returns {String} 返回处理后的路径
 */
export async function saveSearchHityory(params: params) {
  return request(
    joinRequestUrl(
      '/gwapi/tpfm/yjbapi/taohao-platform-provider/v1/search-history/save'
    ),
    {
      method: 'POST',
      params,
      isAuthorization: true
    }
  );
}
