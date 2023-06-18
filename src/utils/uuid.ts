/*
 * @Author: liuhongbo 916196375@qq.com
 * @Date: 2023-06-16 10:28:47
 * @LastEditors: liuhongbo 916196375@qq.com
 * @LastEditTime: 2023-06-16 10:28:55
 * @FilePath: \daily-word-front\src\utils\uuid.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4 } from 'uuid'

function create(type?: string): string {
  if (type) {
    return uuidv3(type, uuidv3.DNS)
  }
  if (Math.random() > 0.5) {
    return uuidv4()
  }
  return uuidv1()
}

const UUID = function (type?: string): string {
  const value = create(type)
  const id = value.replace(/-/g, '')
  return id
}

export default UUID
