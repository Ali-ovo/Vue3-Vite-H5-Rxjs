import { Dispatch } from 'vuex'
import { Observable } from 'rxjs'
import { GetterTree, ActionTree, MutationTree, ModuleTree } from 'vuex';
import { AxiosPromise } from 'axios';

// 传参的type
export interface absTypes {
  dispatch: Dispatch;
  payload?: object;
  type: string;
  defaultState?: object | Array<any>;
}


// 方法的type
export interface absPromise {
  ({ payload, type, defaultState, dispatch, adapter }: absTypes): Promise<any>
}

// 封装请求hooks
export interface useCommonAsyncType {
  (
    subjectId: string,
    _this?: {
      [s: string]: Observable<any>;
    },
    {
      defaultState,
      callbackFn
    }: { defaultState?: any, callbackFn?: (data: any) => any }
  ): {
    data: Ref<any>;
    loading: Ref<boolean>;
  };
}

// 请求传参类型
export interface params { params: string | number | object }


// store类型
export interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R>;
  actions?: ActionTree<S, R>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<R>;
}

// 请求方法和传参type
export type Methods = 'GET' | 'POST' | 'FORM';
export interface paramsType {
  method: Methods;
  isAuthorization?: boolean;
  params?: any;
  authorizeHeader?: object
}


// 方法的type
export interface MethodsType {
  (url: string, { params, method, authorizeHeader }: paramsType): AxiosPromise | Promise<{}>
}

export type RequestFactoryType = () => Observable<any>[]