import { Ref, ref, watchPostEffect } from 'vue'
import { concat, from, map, Observable, Subject, Subscription, switchAll } from 'rxjs'
import { absTypes, ResponseData } from '@/typings'

// 统一封装的请xjs
export const useSubscriptions = function (subscriptions: () => { [s: string]: Observable<unknown> }) {
	watchPostEffect((onInvalidate: (cb: () => void) => void) => {
		const subscription = new Subscription()
		if (typeof subscriptions === 'function') {
			const obj = subscriptions()

			if (!obj || !(obj instanceof Object)) {
				return
			}
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					subscription.add(obj[key].subscribe({}))
				}
			}
		}

		onInvalidate(() => {
			subscription && subscription.unsubscribe()
		})
	})
}

// 请求封装
export const abstractPromise = <T extends ResponseData>({
	payload = {},
	type = '',
	defaultState,
	dispatch,
	callbackFn
}: absTypes<T>): Promise<T['data']> =>
	new Promise((resolve: (value: T['data']) => void) => {
		dispatch({
			type: type,
			payload: payload instanceof FormData ? payload : { ...payload },
			callback: (res: T) => {
				if (res.code === 0 || res.message === 'ok' || res.success) {
					defaultState = callbackFn ? callbackFn(res) : res.data
				}
				return resolve(defaultState)
			}
		})
	})

// 返回 subject 和 一个流
export const commonRequestFactory = <T extends ResponseData>(): [Subject<unknown>, Observable<T['data']>] => {
	const absSubject = new Subject()
	const abs$ = absSubject.pipe(
		map(args => from(abstractPromise<T>(args as absTypes<T>))),
		switchAll(),
		map(data => data)
	)
	return [absSubject, abs$]
}

// 封装的统一请求hooks
export const useCommonAsync = <T extends ResponseData>(
	subjectId: string,
	_this?: {
		[subjectId: string]: Subject<unknown> | Observable<T>
	}
): {
	result: Ref<T | undefined>
	loading: Ref<boolean>
} => {
	// 数据和loading
	const result = ref<T>()
	const loading = ref(false)

	useSubscriptions(() => {
		const [requestSubject, request$]: [Subject<unknown>, Observable<T['data']>] = commonRequestFactory<T>()
		_this![subjectId] = requestSubject as Subject<unknown>

		const requestSubject$ = concat(requestSubject as Observable<T>).pipe(
			map(() => {
				loading.value = true
			})
		)

		const requestData$ = concat(request$ as Observable<T>).pipe(
			map(res => {
				result.value = res
				loading.value = false
				return res
			})
		)

		_this![subjectId + '$'] = requestData$

		return {
			requestSubject$,
			requestData$
		}
	})

	return {
		result,
		loading
	}
}

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
