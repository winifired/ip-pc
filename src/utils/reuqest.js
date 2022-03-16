import axios from 'axios';
import qs from 'qs'
import {
    ElMessage
} from 'element-plus'
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token':localStorage.getItem('userinfoIp')?.token
    }
});
const request = (url, options) => {
    return new Promise((resolve, reject) => {
        instance({
            method: options.method,
            url: `${url}`,
            data:qs.stringify(options.data)
        }).then(value => {
            if (value.status == 200) {
                resolve(value.data)
            } else {
                ElMessage.error(value.statusText);
            }
        }).catch(error => {
            console.log(error)
            ElMessage.error('请求超时，请稍后重试');
            reject(error)
        })
    })
}
export const get = (url, options = {}) => {
    return request(url, {
        method: 'get',
        data: options
    })
}
export const post = (url, options = {}) => {
    return request(url, {
        method: 'post',
        data: options
    })
}
export const put = (url, options = {}) => {
    return request(url, {
        method: 'put',
        data: options
    })
}
export const remove = (url, options = {}) => {
    return request(url, {
        method: 'delete',
        data: options
    })
}