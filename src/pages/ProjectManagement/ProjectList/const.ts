export interface Project {
  projectId: string;
  projectName: string;
  updatedTime: string;
  createdTime: string;
  startTime: string;
  finishTime: string;
  status: ProjectStatusEnum;
  creatorId: string;
  description?: string;
}

export enum ProjectStatusEnum {
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Delayed = 3,
    Suspended = 4, // 暂停
    Aborted = 5, // 终止
}

export interface ProjectListTab {
    key: string;
    label: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    children?: React.ReactNode;
    forceRender?: boolean;
    closable?: boolean;
    closeIcon?: React.ReactNode;
    prefixCls?: string;
    tabKey?: string;
    id?: string;
    animated?: boolean;
    active?: boolean;
    destroyInactiveTabPane?: boolean;
}

export const initAddProjectTabItem ={
    key: 'addProject',
    label: '添加项目',
    
}