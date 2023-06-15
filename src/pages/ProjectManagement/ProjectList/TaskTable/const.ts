import { ProColumns } from "@ant-design/pro-components"

// 生成动态列
// 这里拿列的columnID当做列的dataIndex
// 在列的数据接入时，需要将datasource中返回pid(每个单元格对应的列的id去匹配对应的列进行渲染)
// 预期的datasurce数据结构
// {
// pid: string   // 应当与所属的列 id相同，进行匹配
// name:string 
// isDone:0 | 1
// }
export const generateColumns: ProColumns<any[]> = (columnsData: any[]) => {
    const columns: ProColumns<any>[] = columnsData.map(item => {
        return {
            title: item.name,
            rowSpan: item.children.length,
            dataIndex: item.columnId,
            render(dom, entity, index, action, schema) {
                return entity[item.columnId]?.name
            },
        }
    })
    return columns
}
