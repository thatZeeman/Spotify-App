import Vue from 'vue'
import Router from 'vue-router'
import SpotifySearch from '@/components/SpotifySearch'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SpotifySearch',
      component: SpotifySearch
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
