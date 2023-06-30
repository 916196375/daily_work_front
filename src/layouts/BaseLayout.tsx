/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-30 11:00:52
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-30 11:25:08
 * @FilePath: /daily_work_front/src/layouts/BaseLayout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import React from 'react'
import Main from './Main'

const BaseLayout = (props:any) => {

  return (
    <>
      <ConfigProvider>
        <StyleProvider hashPriority="high">
          {props.children ?? <Main />}
        </StyleProvider>
      </ConfigProvider>
    </>
  )
}

export default BaseLayout