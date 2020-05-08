import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.timeout = 100000
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
const ENV_INFO: any = process.env.ENV_INFO
const origin = ENV_INFO.BASEURL || window.origin || window.location.origin
console.log('url', origin)
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config
  },
  (error) =>
    // 对请求错误做些什么
    Promise.reject(error),
)
const codeError: any = {
  '-1': '未知错误！',
  404: '服务未找到！',
  500: '服务器错误，请稍后重试！',
  504: '超时',
  403: '无权限',
}
const errorHandler = (res: any) => {
  const response = res.response || res
  const data = response.data
  let code = -1
  let message = (data && data.message) || codeError[code]
  if (response.status === 401) {
    return Promise.reject({
      code: 401,
      message: '登录权限失效，请重新登录!',
      data,
    })
  }
  alert(message)
  return Promise.reject({ code, message, data })
}
const successHandler = (response: any) => {
  if (response.status === 200) {
    return response
  } else {
    return errorHandler(response)
  }
}
axios.interceptors.response.use(successHandler, errorHandler)
export default {
  post(url: string, data?: any) {
    return axios({
      method: 'post',
      url: origin + url,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  },
  get(url: string, params?: any) {
    return axios({
      method: 'get',
      url: origin + url,
      params,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  },
}
