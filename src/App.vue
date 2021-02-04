<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue';
import Vuex from 'vuex';
import { sortMethods } from './constants';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    sortMethod: 'selection',
    sortMethods,
    arrayLength: 100,
  },
  mutations: {
    changeSortMethod(state, method) {
      state.sortMethod = method || 'selection';
    },
  },
});


export default {
  name: 'App',
  store,
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
