/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-07 10:40:01
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-16 17:12:58
 * @FilePath: /daily_work_front/src/utils/routers.ts
 * @Description: 路由
 */

import { Route, RouteObj, Routers } from "@/types/router"
import projectManagemnt from "./routers/projectManagemnt"


/**
 * 
 * @param {String} path 路由地址
 * @param {Object} data 参数对象
 * @returns {String}
 */
export const generateRoute = (path: string, data: Record<string, string | number>) => {
    const text = path.replace(/:(\w+)/g, (value: string | number, key: string): string => {
        if (data[key] === undefined) return ''
        if (data[key] === '0' || data[key] === 0) return `${data[key]}`
        return (data[key] || value) as string
    })
    return text
}

const url = (url: string, prefix: string = '') => {
    prefix = prefix && prefix?.charAt(0) !== '/' ? `/${prefix}` : prefix
    url = url.charAt(0) !== '/' ? `/${url}` : url
    return `${prefix}${url}`
}

// 根据路由模块配置路由前缀
const generateRoutesWithPrefix = <T = Route[]>(routes: T, prefix: string = '') => {
    const route: RouteObj = {} as RouteObj
    (routes as Route[]).forEach(routeItem => {
        routeItem.paths.forEach(path => {
            route[path.name] = url(path.value, `${prefix}${routeItem.module}`)
        })
    })
    return route
}

// 模块路由前缀
export const homePerfix = '/home'
export const projectManagemntPrefix = 'project_management' // 项目管理

const routers = {
    root: url('/'),
    login: url('/login'),
    ...generateRoutesWithPrefix(projectManagemnt, projectManagemntPrefix),
}

export default routers as Routers