import axios from 'axios';
import qs from 'qs'
import {
    ElMessage
} from 'element-plus'
import router from "../router";
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
});
instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status) {
        switch (error.response.status) {
            case 401:
                ElMessage.error('未登录');
                router.replace('/login')
                break
            case 404:
                router.replace('/login')
                break
            default:
                return Promise.reject(error);
        }
    }else{
        return Promise.reject(error);
    }

});
const request = (url, options) => {
    return new Promise((resolve, reject) => {
        instance.defaults.headers.common['token'] = localStorage.getItem('userinfoIp') ? JSON.parse(localStorage.getItem('userinfoIp')).token : '';
        let data = {
            method: options.method,
            url: `${url}`,
        }
        if (options.method == 'get') {
            data['params'] = options.data
        } else {
            data['data'] = qs.stringify(options.data)
        }
        instance(data).then(value => {
            if (value.status == 200) {
                resolve(value.data)
            } else {
                ElMessage.error(value.statusText);
            }
        }).catch(error => {
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