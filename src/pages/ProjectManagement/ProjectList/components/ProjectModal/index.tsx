/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-17 10:56:04
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-18 18:32:00
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\components\ProjectModal\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { isRequired } from '@/utils/form'
import { ModalForm, ProFormDatePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Form, Modal } from 'antd'
import React, { useState } from 'react'
import { AddProjectParams } from './const'
import { addProject } from '@/services/projectManagement'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  projectId?: string
}

const ProjectModal = (props: Props) => {
  const { isOpen, onClose, onConfirm, projectId } = props
  const [form] = Form.useForm()

  const handleCommit = async (values: AddProjectParams) => {
    try {
      const { code } = await addProject(values)
      if (code === 200) {
        onConfirm && onConfirm()
        onClose()
      }
    } catch (error) {
      console.log('error', error)
    }
    onClose()
  }

  return (
    <div>
      <ModalForm<AddProjectParams>
        form={form}
        open={isOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: onClose,
          onOk: form.submit,
          okText: projectId ? '保存' : '新增',
        }}
        onFinish={handleCommit}
        layout='horizontal'
        title={projectId ? '编辑项目' : '新增项目'}
      >
        <ProFormText
          width="md"
          name="projectName"
          label="项目名称"
          placeholder="请输入项目名称"
          rules={isRequired('请输入项目名称')}
        />
        <ProFormTextArea
          width='md'
          name='description'
          label='项目描述'
          placeholder='请输入项目描述'
        />
        <ProFormDatePicker name="startTime" label="开始日期" />
        <ProFormDatePicker name="finishTime" label="结束日期" />
        <ProFormTextArea
          width='md'
          name='notion'
          label='备注'
          placeholder='请输入备注'
        />
      </ModalForm>
    </div >
  )
}

export default ProjectModal
