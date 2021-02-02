import Vue from 'vue';
import Router from 'vue-router';
import SortMehodsSelect from '@/components/sortMethodsSelect';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SortMehodsSelect',
      component: SortMehodsSelect,
    },
  ],
});
