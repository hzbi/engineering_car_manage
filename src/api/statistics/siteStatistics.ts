import request from '@/utils/request'

/**
 * 按照工地统计表格
 *
 * @param {object} query
 */
export const getSiteStatisticsList = async (query: any) => {
    return await request({
        url: '/truck/workload/CarNumAndWorkTime',
        method: 'get',
        params: query
    })
}
