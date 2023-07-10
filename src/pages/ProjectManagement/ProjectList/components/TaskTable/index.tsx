/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-15 23:39:28
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-07-03 18:28:48
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\TaskTable\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Button, Tag } from 'antd'
import React, { MutableRefObject, Ref, RefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Task, TaskColumn, TaskStatusEnum, TaskTableData, generateTaskTableData, plusIcon, searchCellTask, taskStatusConfig } from './const'
import { deleteTask, getColumns, getTaskList, updateTask } from '@/services/projectManagement'
import { HttpStatusCode } from 'axios'
import TaskModal from '../TaskModal'
import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { TaskModalMode } from '../ProjectModal/const'
import './index.less'

interface Props {
  activeKey: string
  handleOpenNotion: () => void
}

const ProjectTaskTable = (props: Props, ref: Ref<{ reload: () => void; } | undefined>) => {
  const { activeKey, handleOpenNotion } = props
  const [columns, setColumns] = useState<ProColumns<TaskTableData>[]>([])
  const [isOpenTaskModal, setIsOpenTaskModal] = useState<boolean>(false)
  const [currentTaskId, setCurrentTaskId] = useState<string>('')
  const [parentTaskId, setParentTaskId] = useState<string>('')
  const [taskTreeData, setTaskTreeData] = useState<Task[]>([])
  const [taskModalMode, setTaskModalMode] = useState<TaskModalMode>('add')
  const actionRef = useRef<ActionType>()

  useEffect(() => {
    !taskTreeData.length ? handleGetTaskList() : actionRef.current?.reload()
  }, [activeKey])

  useImperativeHandle(ref, () => ({
    reload: () => {
      actionRef.current?.reload()
    }
  }), [])

  // 处理鼠标进入任务单元格
  const handlePlusIconMouseEnter = (record: TaskTableData, column: TaskColumn) => {
    const els = document.querySelectorAll('.add-task-icon')
    if (els) {
      els.forEach(el => {
        el.remove()
      })
    }
    const currentTask = record[column.columnId]
    // 如果当前单元格没有任务, 则不显示增加任务图标
    if (!currentTask) return
    const cell = document.getElementById(`task-cell-${currentTask.taskId}`)?.parentElement!;
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
      setTaskModalMode('add')
    }
    // 底部增加任务图标
    buttomPlusIcon.style.left = `${cellRect.left + cellRect.width / 2 - 8}px`;
    buttomPlusIcon.style.top = `${cellRect.bottom + 8 - 16}px`;
    buttomPlusIcon.onclick = (event) => {
      setIsOpenTaskModal(true);
      setCurrentTaskId(currentTask.taskId)
      setParentTaskId(currentTask.parentTaskId)
      setTaskModalMode('add')
    }
    // 渲染增加任务图标
    document.body.appendChild(rightPlusIcon);
    document.body.appendChild(buttomPlusIcon);

    // 若为点击任务
    setCurrentTaskId(currentTask.taskId)
    setParentTaskId(currentTask.parentTaskId)
    setTaskModalMode('update')
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
  const generateColumns = (columnsData: TaskColumn[]) => {
    const columns: ProColumns<TaskTableData>[] = columnsData.map((column, columnIndex) => {
      return {
        title: column.columnName,
        dataIndex: column.columnId,
        onCell: (record, rowIndex) => {
          return {
            rowSpan: Object.values(record)[columnIndex]?.rowSpan,
            colSpan: 1,
            onMouseEnter: (event) => { handlePlusIconMouseEnter(record, column) },
            onMouseLeave: (event) => { handlePlusIconMouseLeave(event) },
          };
        },
        render(dom, entity, index, action, schema) {
          return (<div onClick={() => setIsOpenTaskModal(true)} className='task-cell' id={`task-cell-${(dom as unknown as Task).taskId}`}>
            {(dom as unknown as Task).taskName}
          </div>)
        },
      }
    })
    return columns
  }

  // 固定的列
  const initColumn: ProColumns<TaskTableData>[] = [
    {
      title: '状态',
      dataIndex: 'status',
      render(dom, entity, index, action, schema) {
        const currentTask = Object.values(entity).at(-1)!
        const currentTaskConfig = taskStatusConfig[TaskStatusEnum[currentTask.status] as keyof typeof taskStatusConfig]
        return <Tag color={currentTaskConfig.color}>{currentTaskConfig.text}</Tag>
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render(dom, entity, index, action, schema) {
        const currentTask = Object.values(entity).at(-1)!
        return [
          currentTask.status !== TaskStatusEnum.InProgress ? <Button type='link' disabled={false} onClick={() => changeTaskStatus(currentTask.taskId, TaskStatusEnum.InProgress)}>开始</Button> : null,
          <Button type='link' disabled={currentTask.status === TaskStatusEnum.Completed} onClick={() => changeTaskStatus(currentTask.taskId, TaskStatusEnum.Completed)}>完成</Button>,
          currentTask.status === TaskStatusEnum.Completed ? <Button type='link' disabled={currentTask.status !== TaskStatusEnum.Completed} onClick={() => changeTaskStatus(currentTask.taskId, TaskStatusEnum.InProgress)}>激活</Button> : null,
          <Button type='link' onClick={() => handleDeleteTask(currentTask.taskId)}>删除</Button>,
        ]
      },
    }
  ]

  // 完成任务的回调
  const changeTaskStatus = async (tid: string, status: TaskStatusEnum) => {
    try {
      const { code } = await updateTask({ taskId: tid, status })
      if (code === HttpStatusCode.Ok) {
        actionRef.current?.reload()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  // 删的回调
  const handleDeleteTask = async (taskId: string) => {
    try {
      const { code } = await deleteTask({ taskId })
      if (code === HttpStatusCode.Ok) {
        actionRef.current?.reload()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleEditTask = async (record: TaskTableData, task: Task) => {
    setCurrentTaskId(task.taskId)
    setParentTaskId(task.parentTaskId)
    setTaskModalMode('update')
    setIsOpenTaskModal(true)
  }

  const handleGetTaskList = async (par?: any) => {
    const noData = { data: [], success: false, total: 0 }
    try {
      const { code: columnsCode, result: columnsReuslt } = await getColumns({ projectId: activeKey })
      if (columnsCode === HttpStatusCode.Ok) {
        const dynamicColumns = generateColumns(columnsReuslt)
        setColumns([...dynamicColumns, ...initColumn])
      }
      const { result = [], code } = await getTaskList({ projectId: activeKey })
      if (code === HttpStatusCode.Ok) {
        setTaskTreeData(result)
        const newDataSouce = generateTaskTableData(result)
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
    !taskTreeData.length ? handleGetTaskList() : actionRef.current?.reload()
  }

  return (
    <div className='task-list-page'>
      {
        !taskTreeData.length ? <Button type='dashed' onClick={() => { setIsOpenTaskModal(true); setTaskModalMode('add') }}>添加任务</Button> : null
      }
      {taskTreeData.length
        ? <ProTable<TaskTableData>
          className='task-table'
          columns={columns}
          request={(par) => handleGetTaskList(par)}
          actionRef={actionRef}
          rowKey={(record, index) => { return Object.values(record).at(-1)!.taskId + index }}
          search={false}
          options={false}
          pagination={false}
          scroll={{ x: 'max-content',y: 'calc(100vh - 270px)' }}
          toolBarRender={() => [
            <Button type='primary' onClick={handleOpenNotion}>项目便签</Button>
          ]
          }
        />
        : null
      }
      {
        isOpenTaskModal && <TaskModal taskModalMode={taskModalMode} taskTreeData={taskTreeData} parentTaskId={parentTaskId} currentProjectId={activeKey} isOpen={isOpenTaskModal} onClose={handleCloseTaskModal} taskId={currentTaskId} />
      }
    </div>
  )
}

export default forwardRef(ProjectTaskTable)