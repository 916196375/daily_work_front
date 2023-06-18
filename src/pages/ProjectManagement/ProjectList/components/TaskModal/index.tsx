/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-17 12:15:31
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-18 20:54:28
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\components\TaskModal\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isRequired } from '@/utils/form'
import { ModalForm, ProFormCascader, ProFormDatePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { AddTaskForm } from './const'
import { addProject, addTask } from '@/services/projectManagement'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  taskId?: string
  currentProjectId: string
  parentTaskId: string
}

const TaskModal = (props: Props) => {
  const { isOpen, onClose, onConfirm, taskId, currentProjectId, parentTaskId } = props
  const [form] = Form.useForm()
  console.log('parentTaskId', parentTaskId)
  useEffect(() => {
    form.setFieldsValue({ parentTaskId: parentTaskId })
  }, [parentTaskId, taskId])

  const handleCommit = async (values: AddTaskForm) => {
    const query: AddTaskForm = { ...values, projectId: currentProjectId }
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
          okText: taskId ? '保存' : '新增',
        }}
        onFinish={handleCommit}
        layout='horizontal'
        title={taskId ? '编辑任务' : '新增任务'}
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

        {
          taskId && <ProFormCascader
            name="parentTaskId"
            label="移动任务"
            fieldProps={{
              options: [
                {
                  value: 'zhejiang',
                  label: 'Zhejiang',
                  children: [
                    {
                      value: 'hangzhou',
                      label: 'Hangzhou',
                      children: [
                        {
                          value: 'xihu',
                          label: 'West Lake',
                        },
                      ],
                    },
                  ],
                },
              ],
            }}
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