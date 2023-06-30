/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-30 11:27:53
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-30 11:40:20
 * @FilePath: /daily_work_front/src/layouts/VoidLayout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import React from 'react'
import Main from './Main'
import BaseLayout from './BaseLayout'
import { useOutlet } from '@umijs/max'

const VoidLayout = (props: any) => {
    return (
        <>
            <BaseLayout>
            {useOutlet()}
            </BaseLayout>
        </>
    )
}

export default VoidLayout