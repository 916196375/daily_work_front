/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 10:25:34
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-16 17:36:28
 * @FilePath: \daily-word-front\src\utils\cookies.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Cookies from 'js-cookie'

export const LocalKey = 'locale'
export const TokenKey = 'token'
export const RedirectKey = 'main'

export const ExpiresInKey = 'Admin-Expires-In'

export function getCookie(key: string) {
  return Cookies.get(key)
}

export function setCookie(key: string, value: any) {
  return Cookies.set(key, value)
}

export function removeCookie(key: string) {
  return Cookies.remove(key)
}

// getACookie
// removeACookie

export function removeAllCookie() {
  Object.keys(Cookies.get()).forEach((cookieName) => {
    let neededAttributes = {}
    Cookies.remove(cookieName, neededAttributes)
  })
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setExpiresIn(time: string) {
  return Cookies.set(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey)
}
