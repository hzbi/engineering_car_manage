import request from '@/utils/request'

/**
 * 查询车辆信息列表
 *
 * @param {object} query
 */
export const getTruckList = (query: any) => {
    return request({
        url: '/carInfo/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询车辆信息详细
 *
 * @param {string} id
 */
export const getTruckInfo = (id: any) => {
    return request({
        url: `/carInfo/${id}`,
        method: 'get'
    })
}

/**
 * 新增车辆信息
 *
 * @param {object} data
 */
export const addTruck = (data: any) => {
    return request({
        url: '/carInfo/insertCarInfo',
        method: 'post',
        data: data
    })
}

/**
 *  修改车辆信息
 *
 * @param {object} data
 */
export const updateTruck = (data: any) => {
    return request({
        url: '/carInfo/updateCarInfo',
        method: 'post',
        data: data
    })
}

/**
 * 删除车辆信息
 *
 * @param {string} id
 */
export const delTruck = (id: any) => {
    return request({
        url: `/carInfo/${id}`,
        method: 'delete'
    })
}
