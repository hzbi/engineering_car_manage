import request from '@/utils/request'

/**
 * 查询配件使用列表
 *
 * @param {object} query
 */
export const getAccessoryUseList = (query: any) => {
    return request({
        url: '/truck/AccessoryUse/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询配件使用详细
 *
 * @param {string} id
 */
export const getAccessoryUseInfo = (id: any) => {
    return request({
        url: `/truck/AccessoryUse/${id}`,
        method: 'get'
    })
}

/**
 * 新增配件使用
 *
 * @param {object} data
 */
export const addAccessoryUse = (data: any) => {
    return request({
        url: '/truck/AccessoryUse/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改配件使用
 *
 * @param {object} data
 */
export const updateAccessoryUse = (data: any) => {
    return request({
        url: '/truck/AccessoryUse/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除配件使用
 *
 * @param {string} data
 */
export const delAccessoryUse = (data: any) => {
    return request({
        url: `/truck/AccessoryUse/delete`,
        method: 'post',
        data: data
    })
}
