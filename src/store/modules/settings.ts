import { Module } from '@/typings'
import { homeNewStock } from '@/servise/api'

export default <Module<any, any>>{
	namespaced: true,
	state: {
		fixedHeader: false,
		sidebarLogo: false,
		sidebar: {
			opened: true,
			withoutAnimation: false
		},
		device: 'desktop'
	},
	mutations: {},
	actions: {
		// test
		async homeNewStock({ commit, state }, { payload, callback }: any) {
			const response = await homeNewStock(payload)
			callback && callback(response)
		}
	}
}
