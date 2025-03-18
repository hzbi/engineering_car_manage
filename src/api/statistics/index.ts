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

/**
 * 获取所有的配件余额
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

/**
 * 获取所有的配件余额
 *
 * @param {object} query
 */
export const getIndexAllNum = async (query: any) => {
    return await request({
        url: '/truck/Accessory/getAllNum',
        method: 'get',
        params: query
    })
}
