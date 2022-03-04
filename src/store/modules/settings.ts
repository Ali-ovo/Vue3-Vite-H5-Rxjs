import { Module } from '@/typings';
import { marketStatus, homeNewStock, saveSearchHityory } from '@/servise/api';

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
    async marketStatus({ commit, state }, { payload, callback }: any) {
      const response = await marketStatus(payload);
      callback && callback(response);
    },
    // 盘中指数数据
    async homeNewStock({ commit, state }, { payload, callback }: any) {
      const response = await homeNewStock(payload);
      callback && callback(response);
    },

    async saveSearchHityory({ commit, state }, { payload, callback }: any) {
      const response = await saveSearchHityory(payload);
      callback && callback(response);
    }
  }
};
