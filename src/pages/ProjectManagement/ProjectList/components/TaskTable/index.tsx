/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-15 23:39:28
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-18 23:02:31
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\TaskTable\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Button, Tag } from 'antd'
import React, { MutableRefObject, Ref, RefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TaskStatusEnum, generateTaskTableData, plusIcon, searchCellTask, taskStatusConfig } from './const'
import { getColumns, getTaskList } from '@/services/projectManagement'
import { HttpStatusCode } from 'axios'
import TaskModal from '../TaskModal'
import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom'

interface Props {
  activeKey: string
}

const ProjectTaskTable = (props: Props, ref: Ref<{ reload: () => void; } | undefined>) => {
  const { activeKey } = props
  const [columns, setColumns] = useState<ProColumns<any>[]>([])
  const [isOpenTaskModal, setIsOpenTaskModal] = useState<boolean>(false)
  const [currentTaskId, setCurrentTaskId] = useState<string>('')
  const [parentTaskId, setParentTaskId] = useState<string>('')
  const [dataSource, setDataSource] = useState<any[]>([])
  const actionRef = useRef<ActionType>()

  useEffect(() => {
    !dataSource.length ? handleGetTaskList() : actionRef.current?.reload()
  }, [activeKey])

  useImperativeHandle(ref, () => ({
    reload: () => {
      actionRef.current?.reload()
    }
  }), [])

  // 处理鼠标进入任务单元格
  const handlePlusIconMouseEnter = (record, column) => {
    // const currentTask = searchCellTask(record, column)
    const currentTask = record
    // 如果当前单元格没有任务, 则不显示增加任务图标
    if (!currentTask) return
    const cell = document.getElementById(`task-cell-${currentTask.taskId}`);
    const cellRect = cell.getBoundingClientRect();

    const rightPlusIcon = document.createElement('div'); // 右侧增加任务图标
    const buttomPlusIcon = document.createElement('div'); // 底部增加任务图标
    // 设置增加任务图标公共属性
    [rightPlusIcon, buttomPlusIcon].forEach(icon => {
      icon.className = 'add-task-icon';
      icon.style.position = 'absolute';
      icon.style.color = '#999';
      icon.style.cursor = 'pointer';
      icon.onmouseenter = (event) => { event.target!.style!.color = 'rgb(145, 213, 255)' }
      icon.onmouseleave = (event) => { rightPlusIcon.remove(); buttomPlusIcon.remove() }
      icon.innerHTML = plusIcon;
    })
    // 右侧增加任务图标
    rightPlusIcon.style.left = `${cellRect.left + cellRect.width - 8}px`;
    rightPlusIcon.style.top = `${cellRect.bottom - cellRect.height / 2 - 8}px`;
    rightPlusIcon.onclick = (event) => {
      setIsOpenTaskModal(true);
      setCurrentTaskId(currentTask.taskId)
      setParentTaskId(currentTask.taskId)
    }
    // 底部增加任务图标
    buttomPlusIcon.style.left = `${cellRect.left + cellRect.width / 2 - 8}px`;
    buttomPlusIcon.style.top = `${cellRect.bottom + 8}px`;
    buttomPlusIcon.onclick = (event) => {
      setIsOpenTaskModal(true);
      setCurrentTaskId(currentTask.taskId)
      setParentTaskId(currentTask.parentTaskId)
    }
    // 渲染增加任务图标
    document.body.appendChild(rightPlusIcon);
    document.body.appendChild(buttomPlusIcon);
  };

  // 处理鼠标离开任务单元格事件
  const handlePlusIconMouseLeave = (event: React.MouseEvent<any, MouseEvent>) => {
    const mouseX = event.clientX
    const mouseY = event.clientY
    let isMouseInAddTaskIcon = false
    const els = document.querySelectorAll('.add-task-icon')
    els.forEach(el => {
      isMouseInAddTaskIcon = isMouseInAddTaskIcon || el.getClientRects()[0].left <= mouseX && mouseX <= el.getClientRects()[0].right && el.getClientRects()[0].top <= mouseY && mouseY <= el.getClientRects()[0].bottom
    })
    if (els && !isMouseInAddTaskIcon) {
      els.forEach(el => {
        el.remove()
      })
    }
  };

  // 生成动态列
  const generateColumns: ProColumns<any[]> = (columnsData: any[]) => {
    const columns: ProColumns<any>[] = columnsData.map((column, columnIndex) => {
      return {
        title: column.columnName,
        dataIndex: column.columnId,
        onCell: (record: any, rowIndex: number) => {
          console.log('record', record, rowIndex)
          return {
            rowSpan: Object.values(record)[columnIndex]?.colspan || 1,
            onMouseEnter: (event) => { handlePlusIconMouseEnter(record, column) },
            onMouseLeave: (event) => { handlePlusIconMouseLeave(event) },
          };
        },
        render(dom, entity, index, action, schema) {
          const currentTask = entity
          console.log('domg', dom)
          return (<div id={`task-cell-${dom.taskId}`}>
            {dom.taskName}
          </div>)
        },
      }
    })
    console.log('columns', columns)
    return columns
  }

  // 固定的列
  const initColumn: ProColumns<any>[] = [
    {
      title: '状态',
      dataIndex: 'status',
      render(dom, entity, index, action, schema) {
        const currentTaskConfig = taskStatusConfig[TaskStatusEnum[entity.status] as keyof typeof taskStatusConfig]
        // return <Tag color={currentTaskConfig.color}>{currentTaskConfig.text}</Tag>
        return null
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render(dom, entity, index, action, schema) {
        return [
          <Button type='link'>完成</Button>,
          <Button type='link'>编辑</Button>,
          <Button type='link'>删除</Button>,
        ]
      },
    }
  ]

  // 完成任务的回调
  const handleDoneTask = async (tid: string) => {
    try {

    } catch (error) {
      console.log('error', error)
    }
  }

  // 删的回调
  const handleDeleteTask = async (tid: string) => {
    try {

    } catch (error) {
      console.log('error', error)
    }
  }

  const handleEditTask = async (tid: string) => {

  }

  const handleGetTaskList = async (par?: any) => {
    const noData = { data: [], success: false, total: 0 }
    try {
      const { code: columnsCode, result: columnsReuslt } = await getColumns({ projectId: activeKey })
      if (columnsCode === HttpStatusCode.Ok) {
        const dynamicColumns = generateColumns(columnsReuslt)
        console.log([...dynamicColumns, ...initColumn], '[...dynamicColumns, ...initColumn]')
        setColumns([...dynamicColumns, ...initColumn])
      }
      const { result = [], code } = await getTaskList({ projectId: activeKey })
      if (code === HttpStatusCode.Ok) {
        setDataSource(result)
        const newDataSouce = generateTaskTableData(result)
        console.log('newDataSouce', newDataSouce)
        return { data: newDataSouce, success: true, total: result?.length }
      }
      return noData
    } catch (error) {
      console.log('error', error)
      return noData
    }
  }

  const handleCloseTaskModal = () => {
    setIsOpenTaskModal(false)
    !dataSource.length ? handleGetTaskList() : actionRef.current?.reload()
  }


  return (
    <div>
      {
        !dataSource.length ? <Button type='dashed' onClick={() => setIsOpenTaskModal(true)}>添加任务</Button> : null
      }
      {dataSource.length ? <ProTable
        columns={columns}
        request={(par) => handleGetTaskList(par)}
        actionRef={actionRef}
        expandable={{
          childrenColumnName: 'children123',
        }}
      /> : null}
      {
        isOpenTaskModal && <TaskModal parentTaskId={parentTaskId} currentProjectId={activeKey} isOpen={isOpenTaskModal} onClose={handleCloseTaskModal} taskId={currentTaskId} />
      }
    </div>
  )
}

export default forwardRef(ProjectTaskTable)