/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-07 10:56:23
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-07 11:57:31
 * @FilePath: /daily_work_front/src/types/router.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import projectManagemnt from "@/utils/routers/projectManagemnt"



export interface Route {
    module: string
    name: string
    key: string
    paths: { name: string, value: string }[]
}

export type Routers = Record<
    'root' |
    'login' |
    typeof projectManagemnt[number]['paths'][number]['name']
    , string>

export type RouteObj = Record<Route['paths'][number]['name'], string> 