import { Rule } from "antd/es/form"

export const isRequired = (message: string = '此项必填!', maxLength?: number, minLength?: number) => {
    const requiredCfgs: Rule[] = [
        {
            required: true,
            // whitespace: true,
            message,
        },
    ]
    if (maxLength) {
        requiredCfgs.push({
            max: maxLength,
            message: `最多输入${maxLength}个字符`
        })
    }
    if (minLength) {
        requiredCfgs.push({
            max: minLength,
            message: `最少输入${minLength}个字符`
        })
    }
    return requiredCfgs
}
export const isOptional = (message: string = '请完善此项!', maxLength?: number, minLength?: number) => {
    const requiredCfgs: Rule[] = [
        {
            required: false,
            // whitespace: true,
            message,
        },
    ]
    if (maxLength) {
        requiredCfgs.push({
            max: maxLength,
            message: `最多输入${maxLength}个字符`
        })
    }
    if (minLength) {
        requiredCfgs.push({
            max: minLength,
            message: `最少输入${minLength}个字符`
        })
    }
    return requiredCfgs
}