/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-17 12:15:31
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-22 18:03:26
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\components\TaskModal\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isRequired } from '@/utils/form'
import { ModalForm, ProForm, ProFormCascader, ProFormDatePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Button, Form, Input, Modal, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { AddTaskForm, findParentTask } from './const'
import { addProject, addTask, getTaskDetail, updateTask } from '@/services/projectManagement'
import { HttpStatusCode } from 'axios'
import { UpdateTaskParams } from '../TaskTable/const'
import { TaskModalMode } from '../ProjectModal/const'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  taskId?: string
  currentProjectId: string
  parentTaskId: string
  taskTreeData: any[]
  taskModalMode: TaskModalMode
}

const TaskModal = (props: Props) => {
  const { isOpen, onClose, onConfirm, taskId, currentProjectId, parentTaskId, taskTreeData, taskModalMode } = props
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({ parentTaskId: parentTaskId })
    taskModalMode === 'update' && handleGetTaskDetail(taskId)
  }, [parentTaskId, taskId])

  const handleGetTaskDetail = async (taskId: string) => {
    const { code, result } = await getTaskDetail({ taskId })
    if (code === HttpStatusCode.Ok) {
      const currentTaskPath = findParentTask(taskTreeData, parentTaskId)
      form.setFieldsValue({ ...result, parentTaskId: currentTaskPath })
    }
  }

  const handleUpdateTask = async (values: any) => {
    const query: UpdateTaskParams = { ...values, projectId: currentProjectId, taskId }
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

  return (
    <div>
      <ModalForm<AddTaskForm>
        form={form}
        open={isOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: onClose,
          onOk: form.submit,
          okText: taskModalMode === 'update' ? '保存' : '新增',
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
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'key']}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加项
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