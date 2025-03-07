import request from '@/utils/request'

/**
 * 查询司机信息列表
 *
 * @param {object} query
 */
export const getDriverList = async (query: any) => {
    return await request({
        url: '/truck/Driver/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询司机信息详细
 *
 * @param {string} id
 */
export const getDriverInfo = async (id: any) => {
    return await request({
        url: `/truck/Driver/${id}`,
        method: 'get'
    })
}

/**
 * 新增司机信息
 *
 * @param {object} data
 */
export const addDriver = async (data: any) => {
    return await request({
        url: '/truck/Driver/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改司机信息
 *
 * @param {object} data
 */
export const updateDriver = async (data: any) => {
    return await request({
        url: '/truck/Driver/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除司机信息
 *
 * @param {string} id
 */
export const delDriver = async (id: any) => {
    return await request({
        url: `/truck/Driver/${id}`,
        method: 'delete'
    })
}

/**
 *  获取司机和卡车
 *
 * @param {object} data
 */
export const getDriverAndTruck = async (data: any) => {
    return await request({
        url: '/truck/Driver/getDriverAndCar',
        method: 'get',
        data: data
    })
}
