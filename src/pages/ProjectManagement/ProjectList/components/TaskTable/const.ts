/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-19 09:34:47
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-21 17:12:43
 * @FilePath: /daily_work_front/src/pages/ProjectManagement/ProjectList/components/TaskTable/const.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { FlagTwoTone } from "@ant-design/icons"
import { ProColumns } from "@ant-design/pro-components"
import { cloneDeep } from 'lodash'




// 表格用的加号图标
export const plusIcon = '<span  role="img" aria-label="plus-circle" class="anticon anticon-plus-circle"><svg  viewBox="64 64 896 896" focusable="false" data-icon="plus-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg></span>'

/**
 * 寻找当前列最对应的任务
 * @param taskList 任务列表
 * @returns 
 */
export const searchCellTask = (taskList: any[] | any, column: any) => {
    if (!taskList) return undefined
    // 判断是否为子任务列表
    if (!Array.isArray(taskList)) {
        if (taskList.columnId === column.columnId) {
            return taskList
        } else {
            return taskList.children ? searchCellTask(taskList.children, column) : undefined
        }
    } else {
        return taskList.find(task => {
            return task.columnId === column.columnId ? task : searchCellTask(task.children, column)
        })
    }
}

// 遍历任务列表，生成表格数据
export const generateTaskTableData = (datas: any[]) => {
    const flatData = []
    const mapData = (currentData: any[], lastData: any = {}) => {
        currentData.forEach((data, dataIndex) => {
            if (data.children) {
                mapData(
                    data.children,
                    { ...lastData, [data.columnId]: { ...data } },
                )
            } else {
                flatData.push({ ...lastData, [data.columnId]: { ...data } })
            }
        })
    }
    mapData(datas)
    const _flatData = JSON.parse(JSON.stringify(flatData))
    _flatData.forEach((row, rowIndex) => {
        const rowColumnIds = Object.keys(row)
        rowColumnIds.forEach((columnId) => {
            let rowSpan = 0
            const task = row[columnId]
            _flatData.forEach((currentRow, index) => {
                const currentTask = currentRow[columnId]
                if (currentTask && currentTask.taskId === task.taskId && currentTask.rowSpan === undefined) {
                    currentTask.rowSpan = 0
                    rowSpan = rowSpan + 1
                }
            })
            row[columnId].rowSpan = row[columnId].rowSpan ? row[columnId].rowSpan : rowSpan
        })
    })
    return _flatData
}

export enum TaskStatusEnum {
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Delayed = 3,
    Suspended = 4,
    Aborted = 5,
}

export const taskStatusConfig = {
    NotStarted: {
        text: '未开始',
        color: '#91D5FF', // 蓝色
    },
    InProgress: {
        text: '进行中',
        color: '#1890FF', // 蓝色
    },
    Completed: {
        text: '已完成',
        color: '#52C41A', // 绿色
    },
    Delayed: {
        text: '已延期',
        color: '#F5222D', // 红色
    },
    Suspended: {
        text: '已暂停',
        color: '#FAAD14', // 黄色
    },
    Aborted: {
        text: '已终止',
        color: '#BFBFBF', // 灰色
    }
}

export interface UpdateTaskParams {
    taskId: string,
    taskName?: string,
    status?: TaskStatusEnum,
    startTime?: string,
    finishTime?: string,
    parentTaskId?: string,
    description?: string,
    isMoveWithChildren?: 0 | 1
  }