/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-07 10:34:42
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-16 00:45:50
 * @FilePath: /daily_work_front/config/routers/projectManagement.ts
 * @Description: 项目管理
 */

import routers from "../../src/utils/routers";

export const projectManagement = [
    {
        path: routers.projectList,
        name: '项目管理',
        routes: [
            {
                path: routers.projectList,
                component: '@/pages/ProjectManagement/ProjectList',
            }
        ]
    },

] as const