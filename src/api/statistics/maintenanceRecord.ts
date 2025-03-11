import request from '@/utils/request'

/**
 * 维护记录分析
 *
 * @param {object} query
 */
export const getMaintenanceRecordList = async (query: any) => {
    return await request({
        url: '/truck/maintenance/selectMain',
        method: 'get',
        params: query
    })
}
