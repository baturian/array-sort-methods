import Vue from 'vue';
import Router from 'vue-router';
import SortMehodsView from '@/components/arraySort/sortMethods';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SortMehodsView',
      component: SortMehodsView,
    },
  ],
});
