/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-15 23:39:28
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-29 18:12:48
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEu
 */
import { Modal, Result, TabPaneProps, Tabs } from 'antd'
import React, { Ref, useEffect, useRef, useState } from 'react'
import ProjectTaskTable from './components/TaskTable'
import { deleteProject, getProjectList, sortProject } from '@/services/projectManagement'
import { HttpStatusCode } from 'axios'
import { Project, ProjectListTab } from './const'
import ProjectModal from './components/ProjectModal'
import { SmileOutlined } from '@ant-design/icons'
import './index.less'

import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/css';
import NotionDrawer from './components/NotionDrawer'
interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
    'data-node-key': string;
    onActiveBarTransform: (className: string) => void;
}

const DraggableTabNode = ({ className, onActiveBarTransform, ...props }: DraggableTabPaneProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({
        id: props['data-node-key'],
    });
    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'move',
    };

    useEffect(() => {
        if (!isSorting) {
            onActiveBarTransform('');
        } else if (className?.includes('ant-tabs-tab-active')) {
            onActiveBarTransform(
                css`
            .ant-tabs-ink-bar {
              transform: ${CSS.Transform.toString(transform)};
              transition: ${transition} !important;
            }
          `,
            );
        }
    }, [className, isSorting, transform]);

    return React.cloneElement(props.children as React.ReactElement, {
        ref: setNodeRef,
        style,
        ...attributes,
        ...listeners,
    });
};

const PrjectList = () => {
    const [tabsItems, setTabsItems] = useState<ProjectListTab[]>([])
    const [activeKey, setActiveKey] = useState<string>('')
    const tab = useRef<string>()
    const [isOpenProjectModal, setIsOpenProjectModal] = useState<boolean>(false)
    const [currentClickProjectId, setCurrentClickProjectId] = useState<string>('')
    const [className, setClassName] = useState('');
    const [isOpenNotionDrawer, setIsOpenNotionDrawer] = useState<boolean>(false)
    const sensor = useSensor(PointerSensor, { activationConstraint: { distance: { x: 10 } } });
    const [tabsData, setTabsData] = useState<Project[]>([])
    const tableRef = useRef<{ reload: () => void }>()
    useEffect(() => {
        getTabsList()
    }, [])

    useEffect(() => {
        // 通过ref获取到当前的activeKey
        tab.current = activeKey
    }, [activeKey])

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const activeIndex = tabsItems.findIndex((i) => i.key === active.id);
            const overIndex = tabsItems.findIndex((i) => i.key === over?.id);
            const sortResult = arrayMove(tabsItems, activeIndex, overIndex);
            handleSortProject(sortResult.map(project => project.key))
        }
    };

    const handleSortProject = async (projectIds: string[]) => {
        try {
            const { code } = await sortProject({ projectIds })
            if (code === HttpStatusCode.Ok) {
                await getTabsList()
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    // 点击ProjectTab 打开项目详情弹窗
    const handleClickProjectTab = (projectId: string) => {
        const isOpenModal = projectId === tab.current
        if (isOpenModal) {
            setIsOpenProjectModal(isOpenModal)
            setCurrentClickProjectId(projectId)
        }
    }

    const getTabsList = async () => {
        try {
            const { code, result } = await getProjectList()
            if (code === HttpStatusCode.Ok) {
                const tabs = result.map((project) => {
                    return {
                        key: project.projectId,
                        label: <span onClick={() => handleClickProjectTab(project.projectId)}>{project.projectName}</span>,
                    }
                })
                setTabsData(result)
                setTabsItems(tabs)
                !activeKey && setActiveKey(tabs[0].key)
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
        <div className='project-list-main-box'>
            <Tabs
                className={className}
                type='editable-card'
                onEdit={handleEditProject}
                items={tabsItems}
                onChange={handleTabChange}
                activeKey={activeKey}
                renderTabBar={(tabBarProps, DefaultTabBar) => (
                    <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
                        <SortableContext items={tabsItems.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
                            <DefaultTabBar {...tabBarProps}>
                                {(node) => (
                                    <DraggableTabNode
                                        {...node.props}
                                        key={node.key}
                                        onActiveBarTransform={setClassName}
                                    >
                                        {node}
                                    </DraggableTabNode>
                                )}
                            </DefaultTabBar>
                        </SortableContext>
                    </DndContext>
                )}
            />
            {/* 空项目判断 */}
            {!tabsItems.length ?
                <Result
                    icon={<SmileOutlined />}
                    title="欢迎使用Daily Work,请先添加项目!"
                />
                : null}
            {/* 任务列表 */}
            {tabsItems.length ?
                <ProjectTaskTable ref={tableRef} activeKey={activeKey} handleOpenNotion={() => setIsOpenNotionDrawer(true)} />
                : null}
            {/* 项目弹窗 */}
            {
                isOpenProjectModal &&
                <ProjectModal isOpen={isOpenProjectModal} projectId={currentClickProjectId} onClose={handleCloseProjectModal} />
            }
            {/* 便签 */}
            {
                isOpenNotionDrawer &&
                <NotionDrawer
                    projectId={activeKey}
                    isOpen={isOpenNotionDrawer}
                    onClose={() => setIsOpenNotionDrawer(false)}
                    projectName={tabsData.find(tab => tab.projectId === activeKey)!.projectName!}
                />
            }

        </div>
    )
}

export default PrjectList