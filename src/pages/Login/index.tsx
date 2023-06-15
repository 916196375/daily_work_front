/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-11 17:51:11
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-11 18:05:49
 * @FilePath: /daily_work_front/src/pages/Login/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isRequired } from '@/utils/form'
import { Form, Input } from 'antd'
import React from 'react'
const { Password } = Input
const Login = () => {
    return (
        <div>
            <Form>
                <Form.Item rules={isRequired('请输入账号！')} >
                <Input placeholder='请输入账号' />
                </Form.Item>
                <Form.Item rules={isRequired('请输入密码')}>
                <Password  placeholder='请输入密码' />
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login