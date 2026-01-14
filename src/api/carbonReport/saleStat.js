
import request from '@/utils/request'
export function saleStat(query) {
    return request({
        url: '/carbonReport/saleStat',
        method: 'get',
        params: query
    })
}
