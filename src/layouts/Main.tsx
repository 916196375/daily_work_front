/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-30 11:15:18
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-30 17:14:08
 * @FilePath: /daily_work_front/src/layouts/Main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { useOutlet } from '@umijs/max'
import { ProLayout } from '@ant-design/pro-components'
import { layoutsRoutes } from 'config/routes'
import React, { ReactNode } from 'react'
import { Link } from '@umijs/max'
import { mapIcon } from './IconFontMap'

const Main = () => {

    const menuItemRender = (item: any, dom: any) => {
        const { icon, name, path } = item
        const iconNode = icon ? mapIcon[icon as keyof typeof mapIcon] : ''
        return (
            <Link to={path} className="menu-item" >
                {iconNode}
                <span>{name}</span>
            </Link>
        )
    }

    return (
        <>
            <ProLayout
                title="Daily Work"
                defaultCollapsed
                fixSiderbar={true}
                layout='mix'
                route={{ routes: layoutsRoutes }}
                menuItemRender={(item, dom) => {
                    return menuItemRender(item, dom)
                }}
            >
                {useOutlet()}
            </ProLayout>
        </>
    )
}

export default Main