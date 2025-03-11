import request from '@/utils/request'

/**
 * 按照车辆统计表格
 *
 * @param {object} query
 */
export const getTruckStatisticsList = async (query: any) => {
    return await request({
        url: '/carInfo/selectCarTongji',
        method: 'get',
        params: query
    })
}
