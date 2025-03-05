import request from '@/utils/request'

/**
 * 查询维护记录管理列表
 *
 * @param {object} query
 */
export const getMaintainRecordsList = (query: any) => {
    return request({
        url: '/truck/maintenance/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询维护记录管理详细
 *
 * @param {string} id
 */
export const getMaintainRecordsInfo = (id: any) => {
    return request({
        url: `/truck/maintenance/${id}`,
        method: 'get'
    })
}

/**
 * 新增维护记录管理
 *
 * @param {object} data
 */
export const addMaintainRecords = (data: any) => {
    return request({
        url: '/truck/maintenance/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改维护记录管理
 *
 * @param {object} data
 */
export const updateMaintainRecords = (data: any) => {
    return request({
        url: '/truck/maintenance/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除维护记录管理
 *
 * @param {string} id
 */
export const delMaintainRecords = (id: any) => {
    return request({
        url: `/truck/maintenance/${id}`,
        method: 'delete'
    })
}
