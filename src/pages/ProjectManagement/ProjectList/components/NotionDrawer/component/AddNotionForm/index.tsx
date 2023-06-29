import { Button, Form, Input, Space, Typography } from 'antd'
import React, { FC } from 'react'
import { AddNotionParams } from './const'
import { HttpStatusCode } from 'axios'
import { addNotion } from '@/services/projectManagement'
import './index.less'

const { TextArea } = Input
const { Title } = Typography

interface Props {
    onCloseAddNotionForm: () => void
    projectId: string
}

const AddNotionForm: FC<Props> = ({ onCloseAddNotionForm, projectId }) => {

    const [form] = Form.useForm()

    const handleCommit = async (values: AddNotionParams) => {
        try {
            const { code } = await addNotion({ ...values, projectId })
            if (code === HttpStatusCode.Ok) {
                onCloseAddNotionForm()
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    return (
        <div className='add-notion-form-box'>
            <Space className='form-item' direction='vertical'>
                <Title level={5} >新建便签</Title>
                <Form
                    form={form}
                    onFinish={handleCommit}
                    title='新建便签'
                >
                    <Form.Item name='title' rules={[() => ({
                        validator(_, value) {
                            if (value?.trim()) {
                                return Promise.resolve()
                            }
                            return Promise.reject('请输入标题')
                        }
                    })]}>
                        <Input placeholder='请输入标题' />
                    </Form.Item>
                    <Form.Item name='content'>
                        <TextArea rows={5} className='content-ipt' name='content' placeholder='请输入内容' />
                    </Form.Item>
                    <Space className='form-commit-btn'>
                        <Button htmlType='submit' type='primary'>新建</Button>
                        <Button onClick={onCloseAddNotionForm}>取消</Button>
                    </Space>
                </Form>
            </Space>
        </div>
    )
}

export default AddNotionForm