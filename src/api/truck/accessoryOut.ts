import request from '@/utils/request'

/**
 * 查询配件使用列表
 *
 * @param {object} query
 */
export const getAccessoryOutList = (query: any) => {
    return request({
        url: '/truck/AccessoryOut/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询配件使用详细
 *
 * @param {string} id
 */
export const getAccessoryOutInfo = (id: any) => {
    return request({
        url: `/truck/AccessoryOut/${id}`,
        method: 'get'
    })
}

/**
 * 新增配件使用
 *
 * @param {object} data
 */
export const addAccessoryOut = (data: any) => {
    return request({
        url: '/truck/AccessoryOut/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改配件使用
 *
 * @param {object} data
 */
export const updateAccessoryOut = (data: any) => {
    return request({
        url: '/truck/AccessoryOut/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除配件使用
 *
 * @param {string} data
 */
export const delAccessoryOut = (id: any) => {
    return request({
        url: `/truck/AccessoryOut/${id}`,
        method: 'delete'
    })
}
