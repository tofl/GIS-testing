import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    comparedStations: [],
  },
  mutations: {
    addStation(state, station) {
      state.comparedStations.push(station);
    },
  },
});

new Vue({
  render: (h) => h(App),
  store,
}).$mount('#app');
