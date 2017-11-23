import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['./views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['./views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['./views/main_components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },
        { path: 'order/:order_id', title: '订单详情', name: 'order_info', component: resolve => { require(['./views/advanced-router/component/order-info.vue'], resolve); } },  // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['./views/advanced-router/component/shopping-info.vue'], resolve); } },  // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['./views/message/message.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        give: '案例展示',
        path: '/demo',
        icon: 'android-sad',
        title: 'demo',
        name: 'demo',
        component: Main,
        children: [
            { path: 'index', title: '案例', name: 'demo_index', component: resolve => { require(['./views/demo/demo.vue'], resolve); } },
            { path: 'table', title: '表格', name: 'table', component: resolve => { require(['./views/demo/table.vue'], resolve); } },
            { path: 'tree', title: '树', name: 'tree', component: resolve => { require(['./views/demo/tree.vue'], resolve); } },
            // { path: 'stepLog', title: 'stepLog', name: 'stepLog', component: resolve => { require(['./views/demo/stepLog.vue'], resolve); } }
        ]
    },
    {
        give: '基础数据',
        path: '/goods_set',
        icon: 'key',
        title: '物品设置',
        name: 'goods_set',
        component: Main,
        children: [
            { path: 'material_set', title: '原辅料设置', name: 'material_set' },
            { path: 'prod_set', title: '产品设置', name: 'prod_set', component: resolve => { require(['./views/app/base-data/goods-set/prod-set.vue'], resolve); } }
        ]
    },
    {
        give: '基础数据',
        path: '/deptm_set',
        icon: 'key',
        title: '部门单位设置',
        name: 'deptm_set',
        component: Main,
        children: [
            { path: 'index', title: '部门单位设置', name: 'deptm_index', component: resolve => { require(['./views/app/base-data/deptm-set/deptm-set.vue'], resolve); } }
        ]
    },
    {
        give: '基础数据',
        path: '/other_set',
        icon: 'key',
        title: '其它设置',
        name: 'other_set',
        component: Main,
        children: [
            { path: 'index', title: '其它设置', name: 'other_index', component: resolve => { require(['./views/app/base-data/other-set/other-set.vue'], resolve); } }
        ]
    },
    {
        give: '物料中心',
        path: '/material_center',
        icon: 'key',
        title: '原料管理',
        name: 'material_mgmt',
        component: Main,
        children: [
            { path: 'receive_record_mgmt', title: '原料到货记录管理', name: 'receive_record_mgmt', component: resolve => { require(['./views/app/material-center/record-mgmt/record-mgmt.vue'], resolve); } }
        ]
    },
    {
        give: '系统管理',
        path: '/system',
        icon: 'wrench',
        title: '部门管理',
        name: 'deptm_mgmt',
        component: Main,
        children: [
            { path: 'deptm_mgmt_index', title: '部门管理', name: 'deptm_mgmt_index', component: resolve => { require(['./views/app/system//deptm-mgmt/deptm-mgmt.vue'], resolve); } }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
