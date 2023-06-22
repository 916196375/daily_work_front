export interface AddProjectParams {
    projectName: string
    description?: string
    startTime?: string
    finishTime?: string
    notion?: string
}

export type TaskModalMode = 'add' | 'update' | 'readonly'