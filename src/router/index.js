import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        // 设置重定向  '/'时，直接登录到  '/login'
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users }
            ]
        }
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 是从哪个路径跳转而来
    // next 是一个函数，表示放行
    //  next() 放行   next('/login')  强制跳转

    if (to.path === '/login') return next();
    // 获取token  根据键名获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login')
    next()

})

export default router