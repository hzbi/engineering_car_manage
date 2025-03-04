import request from '@/utils/request'

/**
 * 查询工地信息列表
 *
 * @param {object} query
 */
export const getSiteList = (query: any) => {
    return request({
        url: '/truck/Site/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询工地信息详细
 *
 * @param {string} id
 */
export const getSiteInfo = (id: any) => {
    return request({
        url: `/truck/Site/${id}`,
        method: 'get'
    })
}

/**
 * 新增工地信息
 *
 * @param {object} data
 */
export const addSite = (data: any) => {
    return request({
        url: '/truck/Site/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改工地信息
 *
 * @param {object} data
 */
export const updateSite = (data: any) => {
    return request({
        url: '/truck/Site/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除工地信息
 *
 * @param {string} id
 */
export const delSite = (id: any) => {
    return request({
        url: `/truck/Site/${id}`,
        method: 'delete'
    })
}
