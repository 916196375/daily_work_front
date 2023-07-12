/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 11:02:19
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-07-11 11:26:45
 * @FilePath: \daily-word-front\src\services\login.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { LoginParams } from "@/pages/Login/const";
import request from "@/utils/request";

export async function login(data: LoginParams) {
    return request.post<{ token: string }>(
        '/auth/login',
        data,
        { promptMessage: true }
    )
}

// 获取登录页图片
export async function loginPic(data?: {}) {
    return request.get<{ urlCode: string | null }>(
        '/auth/loginPic',
        data,
    )
}

// 注册
export async function userRegister(data?: {}) {
    return request.post<null>(
        '/user/register',
        data,
    )
}