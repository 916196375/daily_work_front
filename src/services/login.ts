import { LoginParams } from "@/pages/Login/const";
import request from "@/utils/request";

export async function login(data: LoginParams) {
    return request.post<{ token: string }>(
        '/auth/login',
        data,
        { promptMessage: true }
    )
}