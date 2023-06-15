import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { generateColumns } from './const'

interface Props {
  activeKey: string
}

const ProjectManagement = (props: Props) => {
  const { activeKey } = props
  const [columns, setColumns] = useState<ProColumns<any>[]>([])
  useEffect(() => {
    getColumns()
  }, [activeKey])

  // 固定的列
  const initColumn: ProColumns<any>[] = [
    {
      title: '状态',
      dataIndex: 'status',
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

  const getColumns = async () => {
    try {
      const columnsData = [{
        name: 'task 1',
        isDone: 0,
        createTime: '2023.1.1',
        children: {
          name: 'task2',
          isDone: 0,
          createTime: '2023.1.1',
        }
      }]
      const dynamicColumns = generateColumns(columnsData)
      setColumns([...dynamicColumns, ...initColumn])
    } catch (error) {
      console.log('error', error)
    }
  }

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


  return (
    <div>
      <ProTable
        columns={columns}

      />
    </div>
  )
}

export default ProjectManagement