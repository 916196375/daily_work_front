/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 10:44:10
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-16 10:44:14
 * @FilePath: \daily-word-front\config\them.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { convertLegacyToken } from '@ant-design/compatible/lib'
import { theme } from 'antd/lib'
const { defaultAlgorithm, defaultSeed, useToken, compactAlgorithm } = theme
const mapToken = defaultAlgorithm(defaultSeed)
const v4Token = convertLegacyToken(mapToken)
export const modifyVars = {
  'primary-color': '#009162',
  'light-color': '#d8f2d7',
}
export default v4Token
