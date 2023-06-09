/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-15 23:39:28
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-07-02 00:46:46
 * @FilePath: \daily-word-front\config\const.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface Route {
    component: string
    layout: string
    path: string
    redirect: string
    wrappers: string
}

const isDevelopment = process.env.REACT_APP_ENV === 'development' ? true : false
const isTest = process.env.REACT_APP_ENV === 'test' ? true : false
const isProduction = process.env.REACT_APP_ENV === 'production' ? true : false

const publicPath = '/'
const base = '/'

const web_doman = isProduction ? 'http://localhost:3101' : isTest ? 'http://localhost:3101' : 'http://localhost:3101'
const admin_doman = isProduction ? 'http://localhost:3101' : isTest ? 'http://localhost:3101' : 'http://localhost:3101'
const login_domain = 'http://localhost:8000/login'
// const login_domain = 'http://dailywork.vowels.cn/login'
const skipRedirectUrls = ['/auth/login', '/auth/loginPic']

const X_API_KEY = 'Other'
const perfixApiWeb = '/api'
const perfixApiManage = '/management'
const perfixApi = `${web_doman}${perfixApiManage}`

export { X_API_KEY, isDevelopment, isTest, isProduction, publicPath, base, web_doman, admin_doman, login_domain, perfixApi, perfixApiManage, perfixApiWeb,skipRedirectUrls }
