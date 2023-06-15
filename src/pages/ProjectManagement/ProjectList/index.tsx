import { TabPaneProps, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'

const PrjectList = () => {
    const [tabsItems, setTabsItems] = useState([])
    const [activeKey, setActiveKey] = useState<string>('')
    useEffect(() => {
        getTabsList()
    }, [])


    const getTabsList = async () => {
        try {

            // 生成tab items

        } catch (error) {
            console.log('error', error)
        }
    }

    const handleTabChange = (key: string) => {
        setActiveKey(key)
    }

    return (
        <div>
            <Tabs items={tabsItems} onChange={handleTabChange} activeKey={activeKey} />
        </div>
    )
}

export default PrjectList