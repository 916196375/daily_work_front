export interface ProjectFormProps {
    projectName: string
    description?: string
    startTime?: string
    finishTime?: string
    notion?: string
}
export interface AddProjectParams {
    projectName: string
    description?: string
    startTime?: string
    finishTime?: string
    notion?: string
}
export interface UpdateProjectParams {
    projectId: string
    projectName?: string
    description?: string
    startTime?: string
    finishTime?: string
    notion?: string
}

export type TaskModalMode = 'add' | 'update' | 'readonly'