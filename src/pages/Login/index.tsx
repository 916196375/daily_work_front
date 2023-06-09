/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-11 17:51:11
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-07-11 11:40:39
 * @FilePath: /daily_work_front/src/pages/Login/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { isRequired } from '@/utils/form'
import { Button, Form, Input, message } from 'antd'
const { Password } = Input
import { LoginForm } from './const'
import { login, loginPic, userRegister } from '@/services/login'
import axios, { HttpStatusCode } from 'axios'
import { history } from '@umijs/max'
import routers, { generateRoute } from '@/utils/routers'
import { TokenKey, setCookie } from '@/utils/cookies'
import './index.less'

const Login = () => {
    const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' })
    const [touchFinshPicUrl, setTouchFinshPicUrl] = useState<string>('')
    const [pageMode, setPageMode] = useState<'login' | 'register'>('login')
    const [form] = Form.useForm()

    useEffect(() => {
        getLoginPicCode()
    }, [])

    const handleLogin = async () => {
        const isEmpty = !Object.values(loginForm).every(item => !!item)
        if (isEmpty) {
            message.error('请填写用户名或密码')
            return
        }
        try {
            const { result, code } = await login(loginForm)
            if (code === HttpStatusCode.Ok) {
                setCookie(TokenKey, result.token)
                history.push(generateRoute(routers.root, {}))
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleRegister = async () => {
        const isEmpty = !Object.values(loginForm).every(item => !!item)
        if (isEmpty) {
            message.error('请填写用户名或密码或邮箱')
            return
        }
        try {
            const { result, code, message: msg } = await userRegister(loginForm)
            if (code === HttpStatusCode.Ok) {
                message.success(msg)
                handleLogin()
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const getLoginPicCode = async () => {
        const { result } = await loginPic()
        setTouchFinshPicUrl(result.urlCode!)
    }

    const handleClickSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (pageMode === 'login') {
            handleLogin()
        } else if (pageMode === 'register') {
            handleRegister()
        }
    }

    return (
        <div className='login-page'>
            <div className="content">
                <div className="box-img">
                    {
                        touchFinshPicUrl ? <img className='img-bg' src={`data:image/png;base64,${touchFinshPicUrl}`} alt="" /> : <div className="img-bg img1"></div>
                    }
                </div>
                <div className="box-form">
                    <div className="change-color newmimicry-protrusion">
                        <span className="iconfont icon-zhuti_o"></span>
                    </div>
                    <div className="logon">
                        <div className="title">
                            <span></span>
                            <span>Daily Work</span>
                            <span className="tips">打工不能致富，摸鱼日进斗金.</span>
                        </div>
                        <div className="other-login">
                            <div className="other-login-item">
                                <div className="iconfont-wrapper newmimicry-protrusion">
                                    <span className="iconfont icon-github-fill"></span>
                                </div>
                            </div>
                            <div className="other-login-item">
                                <div className="iconfont-wrapper newmimicry-protrusion">
                                    <span className="iconfont icon-QQ"></span>
                                </div>
                            </div>
                            <div className="other-login-item">
                                <div className="iconfont-wrapper newmimicry-protrusion">
                                    <span className="iconfont icon-weixin"></span>
                                </div>
                            </div>
                        </div>
                        <form className="forms">
                            <input type="text" onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} placeholder="UserName" className="ipts newmimicry-protrusion" />
                            <input type={pageMode === 'login' ? "password" : "text"} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="Password" className="ipts newmimicry-protrusion" />
                            {pageMode === 'register' && <input type="text" onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="Email" className="ipts newmimicry-protrusion" />}
                            {pageMode === 'login' && <button onClick={(e) => { setPageMode('register') }} className="login-btn newmimicry-protrusion">Register</button>}
                            <button type='submit' onClick={(e) => handleClickSubmit(e)} className="login-btn newmimicry-protrusion">{pageMode === 'login' ? 'Login' : 'Register'}</button>
                            {pageMode === 'register' && <button onClick={(e) => { setPageMode('login') }} className="login-btn newmimicry-protrusion">Login</button>}
                        </form>
                    </div>
                </div>
            </div>
            {/* <Form<LoginForm> onFinish={handleLogin} form={form}>
                <Form.Item name='username' rules={isRequired('请输入账号！')} >
                    <Input className='username-ipt' placeholder='请输入账号' />
                </Form.Item>
                <Form.Item className='password-ipt' name='password' rules={isRequired('请输入密码')}>
                    <Password placeholder='请输入密码' />
                </Form.Item>
            </Form> */}
            {/* <Button type='primary' onClick={form.submit}>登录</Button> */}
        </div>
    )
}

export default Login