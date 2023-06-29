/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-28 18:20:30
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-29 15:05:35
 * @FilePath: /daily_work_front/src/pages/ProjectManagement/ProjectList/components/NotionDrawer/const.ts
 */
export interface Notion {
  notionId: string;
  order: number;
  title: string;
  content: string;
}

export interface UpdateNotionParams {
  title?: string;
  content?: string;
  notionId: string;
}

export type EditingFormData = Omit<UpdateNotionParams,'notionId'>