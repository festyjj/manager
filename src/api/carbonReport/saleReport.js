import request from '@/utils/request'
export function saleOverall(query) {
    return request({
        url: '/carbonReport/saleOverall',
        method: 'get',
        params: query
    })
}
export function saleCustomer(query) {
    return request({
        url: '/carbonReport/saleCustomer/ranking',
        method: 'get',
        params: query
    })
}

export function achieveRate(query) {
    return request({
        url: '/carbonReport/salePlan/achieveRate',
        method: 'get',
        params: query
    })
}
export function saleStat(query) {
    return request({
        url: '/carbonReport/saleStat',
        method: 'get',
        params: query
    })
}

