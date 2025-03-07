import request from '@/utils/request'

/**
 * 查询司机现列表
 *
 * @param {object} query
 */
export const getDriverPerformanceList = (query: any) => {
    return request({
        url: '/truck/DriverPerformance/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询司机现详细
 *
 * @param {string} id
 */
export const getDriverPerformanceInfo = (id: any) => {
    return request({
        url: `/truck/DriverPerformance/${id}`,
        method: 'get'
    })
}

/**
 * 新增司机现
 *
 * @param {object} data
 */
export const addDriverPerformance = (data: any) => {
    return request({
        url: '/truck/DriverPerformance/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改司机现
 *
 * @param {object} data
 */
export const updateDriverPerformance = (data: any) => {
    return request({
        url: '/truck/DriverPerformance/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除司机现
 *
 * @param {string} id
 */
export const delDriverPerformance = (id: any) => {
    return request({
        url: `/truck/DriverPerformance/${id}`,
        method: 'delete'
    })
}
