import { AddProjectParams } from "@/pages/ProjectManagement/ProjectList/components/ProjectModal/const"
import { AddTaskParams } from "@/pages/ProjectManagement/ProjectList/components/TaskModal/const"
import { Project } from "@/pages/ProjectManagement/ProjectList/const"
import request from "@/utils/request"

export async function getProjectList(params = {}) {
    return request.get<Project[]>('/project/list', params)
}

export async function getTaskList(params: { projectId: string }) {
    return request.get<null>('/task/list', params)
}

export async function addProject(params: AddProjectParams) {
    return request.post<null>('/project/add', params, { promptMessage: true })
}

export async function deleteProject(params: { projectId: string }) {
    return request.post<null>('/project/delete', params, { promptMessage: true })
}

export async function addTask(params: AddTaskParams) {
    return request.post<null>('/task/add', params, { promptMessage: true })
}
export async function getColumns(params: {projectId: string}) {
    return request.get<null>('/column/list', params)
}