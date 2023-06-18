/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-17 13:45:54
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-17 13:48:00
 * @FilePath: \daily-word-front\src\pages\ProjectManagement\ProjectList\components\TaskModal\const.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface AddTaskParams {
    taskName: string
    projectId: string
    description?: string
    startTime?: string
    finishTime?: string
    notion?: string
}

export interface AddTaskForm {
    taskName: string
    description?: string
    startTime?: string
    finishTime?: string
    notion?: string
    parentTaskId: string
    projectId: string
}