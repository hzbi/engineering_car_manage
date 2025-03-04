import request from '@/utils/request'

/**
 * 查询配件使用列表
 *
 * @param {object} query
 */
export const listAccessory = (query: any) => {
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
export const getLog = (id) => {
    return request({
        url: '/system/log/' + id,
        method: 'get'
    })
}

/**
 * 新增配件使用
 *
 * @param {object} data
 */
export const addLog = (data) => {
    return request({
        url: '/system/log/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改配件使用
 *
 * @param {object} data
 */
export const updateLog = (data) => {
    return request({
        url: '/system/log/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除配件使用
 *
 * @param {string} id
 */
export const delLog = (id) => {
    return request({
        url: '/system/log/' + id,
        method: 'delete'
    })
}
