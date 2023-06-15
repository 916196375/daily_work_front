/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-07 10:34:42
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-11 18:49:05
 * @FilePath: /daily_work_front/config/routers/projectManagement.ts
 * @Description: 项目管理
 */

import routers from "../../src/utils/routers";

export const projectManagement = [
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
] as const