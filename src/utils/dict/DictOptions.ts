import { mergeRecursive } from '@/utils/ruoyi'
import dictConverter from './DictConverter'

export const options = {
    metas: {
        '*': {
            /**
             * 字典请求，方法签名为function(dictMeta: DictMeta): Promise
             */
            request: (dictMeta: { type: any }) => {
                return Promise.resolve([])
            },
            /**
             * 字典响应数据转换器，方法签名为function(response: Object, dictMeta: DictMeta): DictData
             */
            responseConverter,
            labelFieldEn: 'labelEn',
            labelField: 'label',
            valueField: 'value'
        }
    },
    /**
     * 默认标签字段
     */
    DEFAULT_LABEL_FIELDS_EN: ['labelEn', 'nameEn', 'titleEn'],
    /**
     * 默认标签字段
     */
    DEFAULT_LABEL_FIELDS: ['label', 'name', 'title'],
    /**
     * 默认值字段
     */
    DEFAULT_VALUE_FIELDS: ['value', 'id', 'uid', 'key']
}

/**
 * 映射字典
 * @param {Object} response 字典数据
 * @param {DictMeta} dictMeta 字典元数据
 * @returns {DictData}
 */
function responseConverter(response: any, dictMeta: any) {
    console.log(response)
    const dicts = response.content instanceof Array ? response.content : response
    if (dicts === undefined) {
        console.warn(`no dict data of "${dictMeta.type}" found in the response`)
        return []
    }
    return dicts.map((d: any) => dictConverter(d, dictMeta))
}

export function mergeOptions(src: { [x: string]: any }) {
    mergeRecursive(options, src)
}

export default options
