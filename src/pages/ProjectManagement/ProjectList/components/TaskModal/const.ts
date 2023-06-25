import { Task } from "../TaskTable/const"

/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-17 13:45:54
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-24 21:23:04
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
    customItemList?: { key?: string, value?: string }[][]
}

export interface AddTaskForm {
    taskName: string
    description?: string
    startTime?: string
    finishTime?: string
    notion?: string
    parentTaskId: string
    projectId: string
    customItemList?: { key?: string, value?: string }[][]
}

// 寻找父任务的路径(不包含子任务)
export const findParentTaskPath = (treeData: Task[], taskId: string) => {
    try {
        const findTaskPath = (treeData: Task[], taskId: string, idPath: string[] = []) => {
            return treeData.forEach(item => {
                if (item.taskId === taskId) {
                    throw new Error([...idPath, item.taskId].toString())
                }
                if (item.children) {
                    return findTaskPath(Object.values(item.children), taskId, [...idPath, item.taskId])
                }
            })
        }
        findTaskPath(treeData, taskId)
    } catch (error: string | any) {
        return error.message.split(',')
    }

}