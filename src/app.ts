/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-07 08:57:15
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-22 11:24:42
 * @FilePath: \daily-word-front\src\app.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'Daily Work' };
}