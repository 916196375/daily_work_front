import { ProColumns } from "@ant-design/pro-components"



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
    const mapData = (currentData: any[], lastData: any = {}, lastIndex = 0) => {
        currentData.forEach((data, dataIndex) => {
            if (data.children) {
                // if (lastIndex === 0) {
                mapData(
                    data.children,
                    { ...lastData, [data.columnId]: { colspan: data.children.length || 1, ...data } },
                    dataIndex)
                // } else {
                //     console.log('789', 789)
                //     mapData(data.children, {})
                // }
            } else {
                if (lastIndex === 0) {
                    flatData.push({ ...lastData, [data.columnId]: { colspan: 1, ...data } })
                } else {
                    flatData.push({ [data.columnId]: { colspan: 1, ...data } })
                }
            }
            // if (data.children) {
            //     mapData(data.children, { ...lastData, [data.columnId]: { colspan: lastIndex === 0 ? data.children.length || 1 : 0, ...data } })
            // } else {
            //     flatData.push({ ...lastData, [data.columnId]: { colspan: 1, ...data } })
            // }
        })
    }
    mapData(datas)
    console.log('flatData', flatData)
    return flatData
}