/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-11 17:51:11
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-24 23:13:21
 * @FilePath: /daily_work_front/src/pages/Login/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { isRequired } from '@/utils/form'
import { Button, Form, Input, message } from 'antd'
const { Password } = Input
import { LoginForm } from './const'
import { login } from '@/services/login'
import { HttpStatusCode } from 'axios'
import { history } from '@umijs/max'
import routers, { generateRoute } from '@/utils/routers'
import { TokenKey, setCookie } from '@/utils/cookies'
import './index.less'

const Login = () => {
    const [form] = Form.useForm()
    const handleFinish = async (values: LoginForm) => {
        try {
            const { result, code } = await login(values)
            if (code === HttpStatusCode.Ok) {
                setCookie(TokenKey, result.token)
                history.push(generateRoute(routers.root, {}))
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    return (
        <div className='login-page'>
            <Form<LoginForm> onFinish={handleFinish} form={form}>
                <Form.Item name='username' rules={isRequired('请输入账号！')} >
                    <Input className='username-ipt' placeholder='请输入账号' />
                </Form.Item>
                <Form.Item className='password-ipt' name='password' rules={isRequired('请输入密码')}>
                    <Password placeholder='请输入密码' />
                </Form.Item>
            </Form>
            <Button type='primary' onClick={form.submit}>登录</Button>
        </div>
    )
}

export default Login