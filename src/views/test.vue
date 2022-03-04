<template>
  <h1 class="h1">Test</h1>

  <h1>{{ data.nowDate }}</h1>
  <h1>{{ loading }}</h1>
  <Button type="primary" @click="testClick">主要按钮</Button>
  <Button type="success" @click="optionClick">成功按钮</Button>
  <Button type="default" @click="indexClick">默认按钮</Button>
  <Button type="warning">警告按钮</Button>
  <Button type="danger">危险按钮</Button>
</template>
<script setup lang="ts">
import { Button } from 'vant';
import { watch, ref, isRef } from 'vue';
import { useStore } from 'vuex';
import { useCommonAsync } from '@/utils/rxjsMixin';
import { useRouter } from 'vue-router';

const { dispatch } = useStore();
const router = useRouter();

// const { proxy } = getCurrentInstance();
// console.log(proxy.$dayjs());

const ref1 = ref(1)
console.log(ref1);


const _this: any = {};

// get请求测试
const callbackFn = (data: any) => {
  console.log(data);
  return data;
};
const { loading, data } = useCommonAsync('init', _this, { callbackFn });

const testClick = () => {
  // _this.init.next({
  //   type: 'settings/marketStatus',
  //   dispatch,
  //   defaultState: {}
  // });
  ref1.__v_isRef = false
  console.log(ref1)
  console.log(isRef(ref1));

  // router.push('/test2');
};

// post带token请求测试
const optionClick = () => {
  _this.option.next({
    type: 'settings/saveSearchHityory',
    dispatch,
    defaultState: {},
    payload: {
      bizKey: '000005.SZ',
      bizType: '5',
      text: '世纪星源'
    }
  });
};
const { loading: optionLoading, data: optionData } = useCommonAsync(
  'option',
  _this,
  {}
);

// get带参请求
const indexClick = () => {
  _this.indexNumber.next({
    type: 'settings/homeNewStock',
    dispatch,
    defaultState: {},
    payload: {
      stock_list:
        'stock_code:1A0001,market:SH|stock_code:2A01,market:SZ|stock_code:399006,market:SZ|stock_code:1B0300,market:SH|stock_code:1B0016,market:SH|stock_code:1B0905,market:SH'
    }
  });
};
const { loading: indexLoading, data: indexData } = useCommonAsync(
  'indexNumber',
  _this,
  {}
);
watch(
  [optionData, indexData, data],
  (val: any) => {
    console.log(val);
  },
  {
    deep: true
  }
);
</script>

<style scoped lang="scss">
.h1 {
  font-size: 40px;
}
</style>
