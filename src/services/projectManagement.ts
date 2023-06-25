/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-19 09:34:47
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-25 15:25:24
 * @FilePath: /daily_work_front/src/services/projectManagement.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { AddProjectParams } from "@/pages/ProjectManagement/ProjectList/components/ProjectModal/const"
import { AddTaskParams } from "@/pages/ProjectManagement/ProjectList/components/TaskModal/const"
import { Task, TaskColumn, UpdateTaskParams } from "@/pages/ProjectManagement/ProjectList/components/TaskTable/const"
import { Project } from "@/pages/ProjectManagement/ProjectList/const"
import request from "@/utils/request"

export async function getProjectList(params = {}) {
    return request.get<Project[]>('/project/list', params)
}

export async function addProject(params: AddProjectParams) {
    return request.post<null>('/project/add', params, { promptMessage: true })
}

export async function deleteProject(params: { projectId: string }) {
    return request.post<null>('/project/delete', params, { promptMessage: true })
}

export async function sortProject(params: { projectIds: string[] }) {
    return request.post<null>('/project/order', params, { promptMessage: true })
}

export async function getProjectDetail(params: { projectId: string }) {
    return request.get<Project>('/project/detail', params)
}

export async function getTaskList(params: { projectId: string }) {
    return request.get<Task[]>('/task/list', params)
}

export async function addTask(params: AddTaskParams) {
    return request.post<null>('/task/add', params, { promptMessage: true })
}

export async function getColumns(params: { projectId: string }) {
    return request.get<TaskColumn[]>('/column/list', params)
}

export async function updateTask(params: UpdateTaskParams) {
    return request.post<null>('/task/update', params, { promptMessage: true })
}

export async function deleteTask(params: { taskId: string }) {
    return request.post<null>('/task/delete', params, { promptMessage: true })
}

export async function getTaskDetail(params: { taskId: string }) {
    return request.get<Task>('/task/detail', params)
}

