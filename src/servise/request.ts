import { MethodsType, paramsType } from '@/typings';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const codeMessage: {
  [code: number]: string;
} = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

const service: AxiosInstance = axios.create({
  timeout: 50000, // request timeout
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8'
  }
});

const checkStatus = (response: AxiosResponse<any>) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }

  if (response.status === 401) {
    // console.log(response)
    // 跳转到登录页
    // if(history.length>1){
    //   wx.miniProgram.redirectTo({ url })
    //   history.goBack();
    // } else {
    // }
  }

  return Promise.reject(codeMessage[response.status] || response.statusText);
};

// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig<any>) =>
    // config.headers.Authorization =
    //   'Beraer eyJhbGciOiJIUzUxMiJ9.eyJleHRlbmQiOnt9LCJzdWIiOiI1NjA4NTc0MCIsImFkbWluIjpmYWxzZSwidXNlclR5cGUiOiJDIiwiZXhwIjoxNjM1NDc3MTg3LCJ1c2VySWQiOiIxNDM1MjAyOTgxMDYwNDY0NjQxIiwiaWF0IjoxNjMyODg1MTg3LCJ1c2VybmFtZSI6IjU2MDg1NzQwIn0.viimmjkfvyCmwm8Yf8YxsI6ozDbdisvl-vpZK_-E1hm9zCgAlpNxfzhsE9VrL8belq1BkqRWBpjMTAk7a745yw';

    config,
  (error: any) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse<any, any>) =>
    // const status = response.status;
    // console.log(status);

    // const data = response.data
    // 不处理前台配置
    // if (response.config.url.includes('/app.config.json')) {
    //   return data;
    // }

    // if (data.result) {
    //   if (data.result === 'S')
    //     return data.attach || {};
    //   return Promise.reject(data.result + ',' + data.errorMsg || 'Error');
    // }
    // 可能是下载的文档流
    response,
  (error: any) => {
    console.log(error + ' debug');

    return Promise.reject(error);
  }
);

const switchReq: MethodsType = function (
  url,
  { method, params, authorizeHeader }
) {
  switch (method) {
    case 'GET':
      return service.get(url, {
        params: { ...params },
        headers: { ...authorizeHeader }
      });

    case 'POST':
      return service.post(url, params, { headers: { ...authorizeHeader } });
    case 'FORM':
      return service.post(
        url,
        {},
        { params: { ...params }, headers: { ...authorizeHeader } }
      );
    default:
      return Promise.resolve({});
  }
};

export default function request(
  url: string,
  { params, method = 'GET', isAuthorization }: paramsType
) {
  if (!url) {
    console.log('发送了空的请求！');
    return;
  }
  let authorizeHeader: any = {};
  // 需要token字段
  if (isAuthorization) {
    authorizeHeader = {
      Authorization:
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJleHRlbmQiOnt9LCJzdWIiOiI2NjU3NTI0MSIsImFkbWluIjpmYWxzZSwidXNlclR5cGUiOiJDIiwiZXhwIjoxNjQwMzE1NTkxLCJ1c2VySWQiOiIxNDUyODIwODAwNTA2NjMwMTQ2IiwiaWF0IjoxNjM3NzIzNTkxLCJ1c2VybmFtZSI6IjY2NTc1MjQxIn0.xnYkzc4T59KdvMwMNhVhfG70zP09W-ErMlyi0-67kVQ1WBQOUf1_61yt3JJ6kXYrkNw4vPjarP0yHkavwbKsVg'
    };
  }

  return switchReq(url, { method, params, authorizeHeader })
    .then(checkStatus)
    .catch((error: any) => {
      console.log(error);
    });
}
