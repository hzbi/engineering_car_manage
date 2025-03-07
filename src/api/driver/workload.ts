import request from '@/utils/request'

/**
 * 查询工作量信息列表
 *
 * @param {object} query
 */
export const getWorkloadList = (query: any) => {
    return request({
        url: '/truck/workload/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询工作量信息详细
 *
 * @param {string} id
 */
export const getWorkloadInfo = (id: any) => {
    return request({
        url: `/truck/workload/${id}`,
        method: 'get'
    })
}

/**
 * 新增工作量信息
 *
 * @param {object} data
 */
export const addWorkload = (data: any) => {
    return request({
        url: '/truck/workload/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改工作量信息
 *
 * @param {object} data
 */
export const updateWorkload = (data: any) => {
    return request({
        url: '/truck/workload/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除工作量信息
 *
 * @param {string} id
 */
export const delWorkload = (id: any) => {
    return request({
        url: `/truck/workload/${id}`,
        method: 'delete'
    })
}
