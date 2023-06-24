/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-17 12:15:31
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-24 22:27:35
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\components\TaskModal\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isRequired } from '@/utils/form'
import { ModalForm, ProForm, ProFormCascader, ProFormDatePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Button, Form, Input, Modal, Space, message } from 'antd'
import React, { MouseEvent, useEffect, useState } from 'react'
import { AddTaskForm, findParentTask } from './const'
import { addProject, addTask, getTaskDetail, updateTask } from '@/services/projectManagement'
import { HttpStatusCode } from 'axios'
import { Task, UpdateTaskParams } from '../TaskTable/const'
import { TaskModalMode } from '../ProjectModal/const'
import { MinusCircleOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons'
import './index.less'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  taskId?: string
  currentProjectId: string
  parentTaskId: string
  taskTreeData: Task[]
  taskModalMode: TaskModalMode
}

const TaskModal = (props: Props) => {
  const { isOpen, onClose, onConfirm, taskId, currentProjectId, parentTaskId, taskTreeData, taskModalMode } = props
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({ parentTaskId: parentTaskId })
    taskModalMode === 'update' && handleGetTaskDetail(taskId!)
  }, [parentTaskId, taskId])

  const handleGetTaskDetail = async (taskId: string) => {
    const { code, result } = await getTaskDetail({ taskId })
    if (code === HttpStatusCode.Ok) {
      const currentTaskPath = findParentTask(taskTreeData, parentTaskId)
      form.setFieldsValue({ ...result, parentTaskId: currentTaskPath })
    }
  }

  const handleUpdateTask = async (values: AddTaskForm) => {
    if (taskId === undefined) {
      message.error('修改任务失败,任务id不存在')
      return false
    }
    const query: UpdateTaskParams = { ...values, taskId }
    if (query.parentTaskId || query.parentTaskId === undefined) {
      if (query.parentTaskId === undefined) {
        query.parentTaskId = ''
      } else {
        query.parentTaskId = Array.isArray(query.parentTaskId) ? query.parentTaskId.at(-1) ?? '' : query.parentTaskId
      }
    }
    try {
      const { code } = await updateTask(query)
      if (code === HttpStatusCode.Ok) {
        onConfirm && onConfirm()
        onClose()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleAddTask = async (values: AddTaskForm) => {
    const query: AddTaskForm = { ...values, projectId: currentProjectId }
    if ('parentTaskId' in query) {
      if (query.parentTaskId === undefined) {
        query.parentTaskId = ''
      } else {
        console.log('query.parentTaskId', query.parentTaskId)
        query.parentTaskId = Array.isArray(query.parentTaskId) ? query.parentTaskId.at(-1) ?? '' : query.parentTaskId
      }
    }
    try {
      const { code } = await addTask(query)
      if (code === 200) {
        onConfirm && onConfirm()
        onClose()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  /**
   * 
   * @param path [name, key],  [行号,键名]
   */
  const handleCopyCustomItem = (path: [number, string]) => {
    const [rowIndex, key] = path
    const target = form.getFieldValue('customItemList')[rowIndex][key]
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(target).then(() => {
        message.success('复制成功!')
      }, () => {
        message.error('复制失败,请尝试手动复制!')
      }).catch(e => { console.log(e) })
    } else {
      const copyiedResult = document.execCommand('copy', false, target)
      if (copyiedResult) {
        message.success('复制成功!')
      } else {
        message.error('复制失败,请尝试手动复制!')
      }
    }
  }

  return (
    <div className='task-modal-page'>
      <ModalForm<AddTaskForm>
        form={form}
        open={isOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: onClose,
          onOk: form.submit,
          okText: taskModalMode === 'update' ? '保存' : '新增',
          className: 'task-modal-modal',
        }}
        onFinish={taskModalMode === 'update' ? handleUpdateTask : handleAddTask}
        layout='horizontal'
        title={taskModalMode === 'update' ? '编辑任务' : '新增任务'}
      >
        <ProFormText
          width="md"
          name="taskName"
          label="任务名称"
          placeholder="请输入任务名称"
          rules={isRequired('请输入任务名称')}
        />
        <ProFormTextArea
          width='md'
          name='description'
          label='任务描述'
          placeholder='请输入任务描述'
        />

        <Form.List name="customItemList">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'key']}
                  >
                    <Input suffix={<CopyOutlined className='copy-btn' onClick={() => handleCopyCustomItem([name, 'key'])} />} placeholder="" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                  >
                    <Input suffix={<CopyOutlined className='copy-btn' onClick={() => handleCopyCustomItem([name, 'value'])} />} style={{ width: '100%' }} placeholder="" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  新增项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        {
          taskId && <ProFormCascader
            name="parentTaskId"
            label="移动任务"
            placeholder={`若为空则将任务${taskModalMode === 'update' ? '移动' : '新建'}到首列`}
            fieldProps={{
              options: taskTreeData,
              fieldNames: { label: 'taskName', value: 'taskId', children: 'children' },
              changeOnSelect: true,
              notFoundContent: '暂无任务',
            }}
            rules={[{
              async validator(_, value) {
                if (taskModalMode === 'update' && value?.includes(taskId)) {
                  return Promise.reject('不能将当前节点作为自身父节点!')
                }
                return Promise.resolve()
              }
            }
            ]}
          />
        }
        <ProFormDatePicker name="startTime" label="开始日期" />
        <ProFormDatePicker name="finishTime" label="结束日期" />
        <ProFormTextArea
          width='md'
          name='notion'
          label='备注'
          placeholder='请输入备注'
        />
      </ModalForm>
    </div>
  )
}

export default TaskModal