/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-15 23:39:28
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-16 10:50:33
 * @FilePath: \daily-word-front\config\routes.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import routers from '../src/utils/routers';
import { projectManagement } from './routers/projectManagement';

export const layoutsRoutes = [
    {
        path: routers.root,
        name: '首页',
        routes: [
            {
                path: '',
                component: '@/pages/Home',
            }
        ]
    },

    ...projectManagement,
    {
        path: '',
        redirect: routers.root,
    },
    {
        path: '*',
        redirect: routers.root,
    },
    {
        path: routers.login,
        name: '登录',
        routes: [
            {
                path: '',
                component: '@/pages/Login',
            }
        ]
    },
]

const voidRoutes = [
    {
        path: routers.login,
        component: '@/pages/Login',
    },
]

export default layoutsRoutes