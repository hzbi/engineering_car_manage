/**
 * @classdesc 字典数据
 * @property {String} label 标签
 * @property {*} value 标签
 * @property {Object} raw 原始数据
 */
export default class DictData {
    labelEn: string
    label: string
    value: string
    raw: string
    constructor(labelEn: string, label: string, value: string, raw: string) {
        this.labelEn = labelEn
        this.label = label
        this.value = value
        this.raw = raw
    }
}
