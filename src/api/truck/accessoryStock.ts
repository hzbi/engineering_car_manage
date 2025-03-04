import request from '@/utils/request'

/**
 * 查询配件库存列表
 *
 * @param {object} query
 */
export const getAccessoryStockList = (query: any) => {
    return request({
        url: '/truck/Accessory/list',
        method: 'get',
        params: query
    })
}

/**
 * 查询配件库存详细
 *
 * @param {string} id
 */
export const getAccessoryStockInfo = (id: any) => {
    return request({
        url: `/truck/Accessory/${id}`,
        method: 'get'
    })
}

/**
 * 新增配件库存
 *
 * @param {object} data
 */
export const addAccessoryStock = (data: any) => {
    return request({
        url: '/truck/Accessory/add',
        method: 'post',
        data: data
    })
}

/**
 *  修改配件库存
 *
 * @param {object} data
 */
export const updateAccessoryStock = (data: any) => {
    return request({
        url: '/truck/Accessory/edit',
        method: 'put',
        data: data
    })
}

/**
 * 删除配件库存
 *
 * @param {string} id
 */
export const delAccessoryStock = (id: any) => {
    return request({
        url: `/truck/Accessory/${id}`,
        method: 'delete'
    })
}
