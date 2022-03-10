import { Dispatch } from 'vuex'
import { Observable } from 'rxjs'
import { GetterTree, ActionTree, MutationTree, ModuleTree } from 'vuex'
import { AxiosPromise } from 'axios'

// 传参的type
export interface absTypes<T extends ResponseData> {
	dispatch: Dispatch
	payload?: object
	type: string
	defaultState?: T['data']
	callbackFn?: (fn: T) => T['data']
}

// 方法的type
// export interface absPromise {
// 	({ payload, type, defaultState, dispatch, adapter, callbackFn }: absTypes): Promise<any>
// }

// 封装请求hooks
// export interface useCommonAsyncType {
// 	<T>(
// 		subjectId: string,
// 		_this?: {
// 			[s: string]: Observable<any>
// 		},
// 		{
// 			defaultState,
// 			callbackFn
// 		}: { defaultState?: T; callbackFn?: (data: T) => any }
// 	): {
// 		data: Ref<T>
// 		loading: Ref<boolean>
// 	}
// }
// export interface useCommonAsyncType<T> {
// 	subjectId: string,
// 	_this?: {
// 		[subjectId: string]: Observable<any>
// 	},
// 	defaultState?: T
// }

// 请求传参类型
export interface params {
	[key: string]: string | number | object | any
}

// store类型
export interface Module<S, R> {
	namespaced?: boolean
	state?: S | (() => S)
	getters?: GetterTree<S, R>
	actions?: ActionTree<S, R>
	mutations?: MutationTree<S>
	modules?: ModuleTree<R>
}

// 请求方法和传参type
export type Methods = 'GET' | 'POST' | 'FORM'

export interface paramsType {
	method: Methods
	isAuthorization?: boolean
	params?: object | Array<any>
	authorizeHeader?: object
}

// 方法的type
export interface MethodsType {
	(url: string, { params, method, authorizeHeader }: paramsType): AxiosPromise | Promise<{}>
}

export type RequestFactoryType = () => Observable<any>[]

// 请求返回的类型
export interface ResponseData {
	code?: number
	message?: boolean | string
	data?: unknown
	success?: boolean
}

// 对象循环需要的类型
export interface Obj {
	[key: string]: string | number
}

// 对象循环key需要的类型
export type Key = {
	[key: string]: object
}
