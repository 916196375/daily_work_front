/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-17 10:56:04
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-28 17:26:28
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\components\ProjectModal\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { isRequired } from '@/utils/form'
import { ModalForm, ProFormDatePicker, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Form, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { ProjectFormProps, } from './const'
import { addProject, getProjectDetail, updateProject } from '@/services/projectManagement'
import { HttpStatusCode } from 'axios'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  projectId?: string
}

const ProjectModal = (props: Props) => {
  const { isOpen, onClose, onConfirm, projectId } = props
  const [form] = Form.useForm()

  useEffect(() => {
    projectId && handleGetProjectDetail(projectId)
  }, [projectId])

  const handleAddProject = async (values: ProjectFormProps) => {
    try {
      const { code } = await addProject(values)
      if (code === HttpStatusCode.Ok) {
        onConfirm && onConfirm()
        onClose()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleGetProjectDetail = async (projectId: string) => {
    try {
      const { code, result } = await getProjectDetail({ projectId })
      if (code === HttpStatusCode.Ok) {
        form.setFieldsValue(result)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleUpdateProject = async (values: ProjectFormProps) => {
    if (!projectId) return message.error('未找到项目，请重试！')
    try {
      const { code } = await updateProject({ ...values, projectId })
      if (code === HttpStatusCode.Ok) {
        onConfirm && onConfirm()
        onClose()
      }
    } catch (error) {
      console.log('error', error)
    }
  }


  return (
    <div>
      <ModalForm<ProjectFormProps>
        form={form}
        open={isOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: onClose,
          onOk: form.submit,
          okText: projectId ? '保存' : '新增',
        }}
        onFinish={projectId ? handleUpdateProject : handleAddProject}
        layout='horizontal'
        title={projectId ? '编辑项目' : '新增项目'}
      >
        <ProFormText
          name="projectName"
          label="项目名称"
          placeholder="请输入项目名称"
          rules={isRequired('请输入项目名称')}
        />
        <ProFormTextArea
          name='description'
          label='项目描述'
          placeholder='请输入项目描述'
        />
        <ProFormDatePicker name="startTime" label="开始日期" />
        <ProFormDatePicker name="finishTime" label="结束日期" />
        <ProFormTextArea
          name='notion'
          label='备注'
          placeholder='请输入备注'
        />
      </ModalForm>
    </div >
  )
}

export default ProjectModal
