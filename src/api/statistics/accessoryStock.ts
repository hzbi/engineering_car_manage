import request from '@/utils/request'

/**
 * 维护记录分析
 *
 * @param {object} query
 */
export const getAccessoryStockList = async (query: any) => {
    return await request({
        url: '/truck/Accessory/getAllSize',
        method: 'get',
        params: query
    })
}
