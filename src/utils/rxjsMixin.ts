import { ref, watchPostEffect } from 'vue';
import {
  concat,
  from,
  map,
  Observable,
  Subject,
  Subscription,
  switchAll
} from 'rxjs';
import {
  absPromise,
  absTypes,
  RequestFactoryType,
  useCommonAsyncType
} from '@/typings';

// 统一封装的请xjs
export const useSubscriptions = function (
  subscriptions: () => { [s: string]: Observable<any> }
) {
  watchPostEffect((onInvalidate: (cb: () => void) => void) => {
    const subscription = new Subscription();
    if (typeof subscriptions === 'function') {
      const obj: object = subscriptions();

      if (!obj || !(obj instanceof Object)) {
        return;
      }
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          subscription.add(obj[key].subscribe({}));
        }
      }
    }

    onInvalidate(() => {
      subscription && subscription.unsubscribe();
    });
  });
};

// 请求封装
export const abstractPromise: absPromise = ({
  payload = {},
  type = '',
  defaultState = {},
  dispatch
}: absTypes) =>
  new Promise((resolve: (value: any) => void) => {
    dispatch({
      type: type,
      payload: { ...payload },
      callback: (res: any = {}) => {
        if (res.code === 0 || res.success) {
          defaultState = res.data;
        }
        return resolve(defaultState);
      }
    });
  });

// 返回 subject 和 一个流
export const commonRequestFactory: RequestFactoryType = () => {
  const absSubject = new Subject();
  const abs$ = absSubject.pipe(
    map((args: absTypes) => from(abstractPromise(args))),
    switchAll(),
    map((data: any) => data)
  );
  return [absSubject, abs$];
};

// 封装的统一请求hooks
export const useCommonAsync: useCommonAsyncType = (
  subjectId,
  _this,
  { defaultState = {}, callbackFn }
) => {
  _this[subjectId] = new Subject();

  // 数据和loading
  const data = ref(defaultState);
  const loading = ref(false);

  useSubscriptions(() => {
    const [requestSubject, request$]: Observable<any>[] =
      commonRequestFactory();

    _this[subjectId] = requestSubject;

    const requestSubject$ = concat(requestSubject).pipe(
      map(() => {
        loading.value = true;
      })
    );

    const requestData$ = concat(request$).pipe(
      map((res: any) => {
        data.value = callbackFn ? callbackFn(res) : res;
        loading.value = false;
        return res;
      })
    );

    _this[subjectId + '$'] = requestData$;

    return {
      requestSubject$,
      requestData$
    };
  });

  return {
    data,
    loading
  };
};

/* 处理请求流和
封装的统一请求hooks
export const useCommonAsync: useCommonAsyncType = (
  subjectId,
  _this,
  { payload = {}, type = '', defaultState = {}, dispatch, callbackFn }
) => {
  _this[subjectId] = new Subject();

  const data = ref(defaultState);

  const loading = ref(false);

  useObservable(
    _this[subjectId].pipe(
      tap(() => (loading.value = true)),
      map(() =>
        abstractPromise({
          type,
          defaultState,
          dispatch,
          payload
        })
      ),
      switchAll(),
      map((res: any) => {
        data.value = callbackFn ? callbackFn(res) : res;
        loading.value = false;
        return res;
      })
    ),
    {
      onError: (rej: any) => {
        console.log(rej);
      }
    }
  );

  return {
    data,
    loading
  };
};
*/
