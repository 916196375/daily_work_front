/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 10:05:26
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-07-03 15:30:51
 * @FilePath: \daily-word-front\src\utils\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { message } from 'antd'
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, HttpStatusCode, InternalAxiosRequestConfig } from 'axios'
import { X_API_KEY, login_domain, perfixApiWeb, skipRedirectUrls, web_doman } from '../../config/const'
import { LocalKey, RedirectKey, TokenKey, getCookie, removeCookie } from './cookies'
import uuid from './uuid'


// 字符串转hash
const strToHash = (str: string) => {
    let hash = 0
    let chr
    if (str.length === 0) {
        return hash
    }
    for (let i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0
    }
    return hash
}

// 生成请求key
const getRequestKey = (config: InternalAxiosRequestConfig) => {
    let { url, method, data, params } = config
    data = typeof data === 'string' ? JSON.parse(data) : data
    // 把请求转为字符串
    const requestStr = `${method}_${url}_${params ? JSON.stringify(params) : JSON.stringify(data)}`
    // 设置请求key
    const requestKey = strToHash(requestStr)
    return requestKey
}

export type IResponse<Result> = {
    message: string
    result: Result
    code: HttpStatusCode
}
export type GptResponse = {
    messages: string
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
}

type IAxiosRequestHeaders =
    | ({
        'X-REQUEST-ID': string
        'X-LANGUAGE': string
        'X-API-KEY': string
    } & AxiosRequestHeaders)
    | AxiosHeaders

interface IInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    allowDuplicate?: boolean // 允许重复请求
    promptMessage?: boolean // 需要提示消息
    headers: IAxiosRequestHeaders
}

/**
 * allowDuplicate {boolean} false 允许重复请求
 * retry {number} 1 重试次数
 * retryDelay {number} 2 重试时间(单位s)
 */
// 请求队列
const requestQueue = new Map()

const instance = axios.create({
    baseURL: perfixApiWeb,
    timeout: 10 * 1000,
    allowDuplicate: true,
    promptMessage: false,
} as unknown as IInternalAxiosRequestConfig)

// 请求
const request = async <T>(config: AxiosRequestConfig): Promise<IResponse<T>> => {
    return instance(config)
    // return instance.request<IResponse<T>>(config)
}

// 请求拦截器
instance.interceptors.request.use(
    (config: IInternalAxiosRequestConfig) => {
        const { baseURL, url, headers, allowDuplicate } = config
        const token = getCookie(TokenKey)
        const lang = getCookie(LocalKey)
        console.log('url', url)
        if (token || skipRedirectUrls.includes(url as string)) {
            headers['X-REQUEST-ID'] = uuid()
            headers['X-API-KEY'] = X_API_KEY
            headers['X-LANGUAGE'] = lang
            if (token) {
                headers.Authorization = 'Bearer ' + token
            }
        } else {
            redirect()
            return config
        }
        // 允许重复请求
        if (!allowDuplicate) {
            return config
        }

        // 重复请求逻辑
        const requestKey = getRequestKey(config)
        const controller = new AbortController()
        config.signal = controller.signal
        // 判断请求队列是否存在相同请求
        if (requestQueue.has(requestKey)) {
            controller.abort()
        } else {
            requestQueue.set(requestKey, controller)
        }
        return config
    },
    (error) => {
        // 请求错误
        console.log('请求错误', error)
        return Promise.reject(error)
    },
)

// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // console.log('响应拦截', response)
        const { data, config } = response
        const { code } = data
        const { promptMessage, responseType } = config as IInternalAxiosRequestConfig
        const requestKey = getRequestKey(config)
        requestQueue.delete(requestKey)
        // 响应成功
        if (Number.isInteger(code)) {
            if (code === HttpStatusCode.Ok) {
                promptMessage && message.success(data.message)
            } else {
                message.error(data.message)
            }
            // token 失效
            if (code === HttpStatusCode.Unauthorized) {
                setTimeout(() => {
                    redirect()
                }, 200)
            }
        }

        // 流文件
        if (responseType === 'blob') {
            const filename = response.headers['x-filename']
            if (data.type === 'application/json') {
                return {
                    code: HttpStatusCode.Ok,
                    message: data.message,
                    data,
                }
            } else {
                return {
                    code: HttpStatusCode.BadRequest,
                    message: data.message,
                    data,
                    x_filename: filename,
                }
            }
        }
        return data ?? {}
    },
    async (error) => {
        // 响应 code !== 0
        // console.log('响应错误', error)
        const { config, code, response } = error
        //  超时 => 请求重试
        if (error.message.indexOf('timeout') !== -1) {
            const requestKey = getRequestKey(config)
            requestQueue.delete(requestKey)
            if (config.allowDuplicate) {
                const { retry = 1, retryDelay = 2, retryCount = 0 } = config
                // 延时请求
                const delay = new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, retryDelay * 1000)
                })
                // 重试次数 && 当前重试次数未超过最大重试次数
                if (retry && retryCount < retry) {
                    config.retryCount = retryCount + 1
                    // console.log(`[请求异常] 尝试重新请求 => [${config.url}] => 第 ${config.retryCount} 次`)
                    // 重新发起请求
                    return delay.then(function () {
                        return request(config)
                    })
                }
            }
            cancelAllRequest()
        }
        // 取消不报错
        if (!['ERR_CANCELED'].includes(code)) {
            message.error(response?.data?.message || 'error')
            return Promise.reject(error)
        }
    },
)

// 取消所有请求
const cancelAllRequest = () => {
    requestQueue.forEach((controller) => {
        controller.abort()
    })
    requestQueue.clear()
    return true
}

// 重定向 - 清除 token
const redirect = () => {
    cancelAllRequest()
    removeCookie(TokenKey)
    window.location.href = login_domain
}

const get = <T>(url = '', params = {}, config: Partial<IInternalAxiosRequestConfig> = {}) => {
    const iconfig = {
        method: 'get',
        url,
        params,
        ...config,
    }
    return request<T>(iconfig)
}

const post = <T>(url = '', data = {}, config: Partial<IInternalAxiosRequestConfig> = {}) => {
    const iconfig = {
        method: 'post',
        url,
        data,
        ...config,
    }
    return request<T>(iconfig)
}

const put = <T>(url = '', data = {}, config = {}) => {
    const iconfig = {
        method: 'put',
        url,
        data,
        ...config,
    }
    return request<T>(iconfig)
}

const destroy = <T>(url = '', data = {}, config = {}) => {
    const iconfig = {
        method: 'delete',
        url,
        data,
        ...config,
    }
    return request<T>(iconfig)
}

const upload = <T>(url = '', data = {}, config = {}) => {
    const iconfig = {
        method: 'post',
        url,
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 20 * 1000,
        ...config,
    }
    return request<T>(iconfig)
}

export default {
    get,
    post,
    put,
    delete: destroy,
    upload,
    cancelAllRequest,
}
