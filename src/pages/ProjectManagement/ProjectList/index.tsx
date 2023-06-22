/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-15 23:39:28
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-22 17:51:52
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEu
 */
import { Modal, Result, TabPaneProps, Tabs } from 'antd'
import React, { Ref, useEffect, useRef, useState } from 'react'
import ProjectTaskTable from './components/TaskTable'
import { deleteProject, getProjectList } from '@/services/projectManagement'
import { HttpStatusCode } from 'axios'
import { Project, ProjectListTab } from './const'
import ProjectModal from './components/ProjectModal'
import { SmileOutlined } from '@ant-design/icons'

const PrjectList = () => {
    const [tabsItems, setTabsItems] = useState<ProjectListTab[]>([])
    const [activeKey, setActiveKey] = useState<string>('')
    const [isOpenProjectModal, setIsOpenProjectModal] = useState<boolean>(false)
    const [currentClickProjectId, setCurrentClickProjectId] = useState<string>('')
    const tableRef = useRef<{ reload: () => void }>()

    useEffect(() => {
        getTabsList()
    }, [])

    const getTabsList = async () => {
        try {
            const { code, result } = await getProjectList()
            if (code === HttpStatusCode.Ok) {
                const tabs = result.map((project) => {
                    return {
                        key: project.projectId,
                        label: project.projectName,
                    }
                })
                setTabsItems(tabs)
                setActiveKey(tabs[0].key)
            }

        } catch (error) {
            console.log('error', error)
        }
    }

    const handleTabChange = (key: string) => {
        setActiveKey(key)
    }

    const handleDeleteProject = async (projectId: string) => {
        try {
            const { code } = await deleteProject({ projectId })
            if (code === HttpStatusCode.Ok) {
                getTabsList()
                projectId === activeKey && tableRef.current?.reload()
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleEditProject = (targetKey: string | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>, action: "add" | "remove") => {
        action === 'add' && setIsOpenProjectModal(true)

        if (action === 'remove' && typeof targetKey === 'string') {
            Modal.confirm({
                title: '提示',
                content: '确定删除该项目吗？',
                onOk: () => handleDeleteProject(targetKey)
            })
        }
    }

    const handleCloseProjectModal = () => {
        currentClickProjectId && setCurrentClickProjectId('')
        setIsOpenProjectModal(false)
        getTabsList()
        tableRef?.current?.reload()
    }

    return (
        <div>
            <Tabs type='editable-card' onEdit={handleEditProject} items={tabsItems} onChange={handleTabChange} activeKey={activeKey} />
            {!tabsItems.length ?
                <Result
                    icon={<SmileOutlined />}
                    title="欢迎使用 Daily Work 请先添加项目!"
                />
                : null}
            {tabsItems.length ? <ProjectTaskTable ref={tableRef} activeKey={activeKey} /> : null}
            {
                isOpenProjectModal && <ProjectModal isOpen={isOpenProjectModal} projectId={currentClickProjectId} onClose={handleCloseProjectModal} />
            }
        </div>
    )
}

export default PrjectList