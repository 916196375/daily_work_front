/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-28 17:27:30
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-29 18:09:47
 * @FilePath: /daily_work_front/src/pages/ProjectManagement/ProjectList/components/NotionDrawer/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { deleteNotion, getNotionList, updateNotion } from '@/services/projectManagement';
import { ActionType, ProList, ProListMetas } from '@ant-design/pro-components';
import { Button, Drawer, Input, Space, Typography } from 'antd';
import { HttpStatusCode } from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { EditingFormData, Notion } from './const';
import TextArea from 'antd/es/input/TextArea';
import AddNotionForm from './component/AddNotionForm';
import './index.less'

const { Paragraph } = Typography;

interface Props {
    isOpen: boolean
    onClose: () => void
    projectName: string
    projectId: string
}

const NotionDrawer = (props: Props) => {
    const { isOpen, onClose, projectName, projectId } = props
    const [dataSource, setDataSource] = useState<Notion[]>([]);
    const [editKeys, setEditKeys] = useState<string[]>([])
    const [editingFormData, setEditingFormData] = useState<EditingFormData>({} as EditingFormData)
    const [isShowAddNewNotion, setIsShowAddNewNotion] = useState<boolean>(false)

    useEffect(() => {
        fetchNotionList()
    }, [projectId])

    const fetchNotionList = async () => {
        try {
            const { code, result } = await getNotionList({ projectId })
            if (code === HttpStatusCode.Ok) {
                setDataSource(result)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleUpdateNotion = async (notionId: string) => {
        try {
            const { code } = await updateNotion({ ...editingFormData, notionId })
            if (code === HttpStatusCode.Ok) {
                setEditKeys([])
                fetchNotionList()
                setEditingFormData({} as EditingFormData)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleDeleteNotion = async (notionId: string) => {
        try {
            const { code } = await deleteNotion({ notionId })
            if (code === HttpStatusCode.Ok) {
                setEditKeys([])
                setEditingFormData({} as EditingFormData)
                fetchNotionList()
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleCancelEdit = () => {
        setEditKeys([])
        fetchNotionList()
        setEditingFormData({} as EditingFormData)
    }

    const handleClose = () => {
        onClose()
    };

    const handleAddNewNotion = () => {
        setIsShowAddNewNotion(true)
        document.querySelector('.ant-drawer-body')?.scrollTo(0, 0)
    }

    const handleCancelAddNewNotion = () => {
        setIsShowAddNewNotion(false)
        fetchNotionList()
    }

    const metas: ProListMetas<Notion> = {
        title: {
            dataIndex: 'title',
            render(dom, entity, index, action, schema) {
                let isTitleEmpty = false
                if (editingFormData.title !== undefined && editingFormData.title.trim() === '') {
                    isTitleEmpty = true
                }
                return !editKeys.includes(entity.notionId)
                    ? <span>{dom}</span>
                    : <>
                        <Input
                            placeholder='请输入标题,不可为空'
                            required
                            status={isTitleEmpty ? 'error' : undefined}
                            defaultValue={entity.title}
                            onChange={(e) => setEditingFormData({ ...editingFormData, title: e.target.value })}
                        />
                        {isTitleEmpty ? <span className='empty-title-warning-wrods'>标题不可为空！</span> : null}
                    </>
            },
        },
        description: {},
        actions: {
            render(dom, entity, index, action, schema) {
                return [
                    !editKeys.includes(entity.notionId) ? <Button key="editBtn" type="link" onClick={() => setEditKeys([entity.notionId])}>编辑</Button> : null,
                    editKeys.includes(entity.notionId) ? <Button key="saveBtn" type="link" onClick={() => handleUpdateNotion(entity.notionId)}>保存</Button> : null,
                    <Button key="deleteBtn" type="link" onClick={() => handleDeleteNotion(entity.notionId)}>删除</Button>,
                    editKeys.includes(entity.notionId) ? <Button key="cancelBtn" type="link" onClick={handleCancelEdit}>取消</Button> : null,
                ]
            },
        },
        extra: {},
        content: {
            render(dom, entity, index, action, schema) {
                return editKeys.includes(entity.notionId)
                    ? <TextArea
                        placeholder='请输入内容'
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        defaultValue={entity.content}
                        onChange={(e) => setEditingFormData({ ...editingFormData, content: e.target.value })}
                    />
                    : (<Paragraph style={{ whiteSpace: 'pre-line' }} ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                        {`${entity.content}`}
                    </Paragraph>)
            },
        },
    }

    return (
        <div >
            <Drawer
                className='projectManagement-drawer'
                title={`${projectName}便签`}
                width={500}
                onClose={handleClose}
                open={isOpen}
                extra={
                    <Space>
                        <Button onClick={handleAddNewNotion}>新建便签</Button>
                    </Space>
                }
            >
                {
                    isShowAddNewNotion && <AddNotionForm projectId={projectId} onCloseAddNotionForm={handleCancelAddNewNotion} />
                }
                <ProList<Notion>
                    rowKey="notionId"
                    headerTitle=""
                    dataSource={dataSource}
                    showActions="hover"
                    itemLayout='vertical'
                    onDataSourceChange={setDataSource}
                    metas={metas}
                    className='projectManagement-drawer-list'
                />
            </Drawer>
        </div >
    )
}

export default NotionDrawer