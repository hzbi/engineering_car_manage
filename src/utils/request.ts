import axios, { AxiosResponse } from 'axios'
// prettier-ignore
import { ElNotification, ElMessageBox, ElLoading, ElMessage} from "element-plus";
import useUserStore from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import errorCode from '@/utils/errorCode'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import { nanoid } from 'nanoid'

import useAppStore from '@/store/modules/app'

const userAgent = navigator.userAgent
// prettier-ignore
// var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
// console.log('是否是IE11', isIE11)

// prettier-ignore
// var isLessIE11 = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
// console.log('是否是小于IE11', isLessIE11)

// prettier-ignore
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

// 创建axios实例
export const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 超时
    timeout: 10000 * 20
})
// 是否显示重新登录
export let isRelogin = { show: false }
// request拦截器
service.interceptors.request.use(
    (config: any) => {
        // 是否需要设置 token
        // prettier-ignore
        const isToken = (config.headers || {}).isToken === false;
        // 是否需要防止数据重复提交
        // prettier-ignore
        const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
        const requestId = nanoid()
        if (getToken() && !isToken) {
            // 请求加上随机ID
            config.headers['RequestId'] = requestId
            // prettier-ignore
            config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        config.params = {
            ...config.params,
            language: useAppStore().language
        }
        // get请求映射params参数
        if (config.method === 'get' && config.params) {
            let url = config.url + '?' + tansParams(config.params)
            url = url.slice(0, -1)
            config.params = {}
            config.url = url
        }
        // prettier-ignore
        if (!isRepeatSubmit &&(config.method === "post" || config.method === "put")) {
            // prettier-ignore
			const requestObj = {
                url: config.url,
                data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
                time: new Date().getTime()
            }
            // prettier-ignore
			const sessionObj = cache.session.getJSON("sessionObj");
             // prettier-ignore
			if (sessionObj === undefined ||sessionObj === null ||sessionObj === "") {
				cache.session.setJSON("sessionObj", requestObj);
			} else {
				const s_url = sessionObj.url; // 请求地址
				const s_data = sessionObj.data; // 请求数据
				const s_time = sessionObj.time; // 请求时间
				const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
                 // prettier-ignore
				if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
					const message = useAppStore().language == 'zh' ? '数据正在处理，请勿重复提交' : 'Data is being processed, please do not submit repeatedly'
					console.warn(`[${s_url}]: ` + message);
					return Promise.reject(new Error(message));
				} else {
					cache.session.setJSON("sessionObj", requestObj);
				}
			}
		}
        return config
    },
    (error) => {
        console.log(error)
        Promise.reject(error)
    }
)

// 响应拦截器
// prettier-ignore
service.interceptors.response.use((res: AxiosResponse) => {
		// 未设置状态码则默认成功状态
		const code = res.data.code || 200;
		// 获取错误信息
         // prettier-ignore
		const msg = errorCode[code as '401' | '403' | '404' | 'default'] || res.data.msg || errorCode['default']
		// 二进制数据则直接返回
		// prettier-ignore
		if (res.request.responseType === "blob" || res.request.responseType === "arraybuffer") {
			return res.data;
		}
		if (code === 401) {
			if (!isRelogin.show) {
				isRelogin.show = true;
				// prettier-ignore
				ElMessageBox.confirm(useAppStore().language == 'zh' ? '登录状态已过期，您可以继续留在该页面，或者重新登录' : 'Your login status has expired. You can stay on this page or log in again', useAppStore().language == 'zh' ? '系统提示' : 'System prompt', {
                    confirmButtonText: useAppStore().language == 'zh' ? '重新登录' : 'Re-login',
                    cancelButtonText: useAppStore().language == 'zh' ? '取消' : 'Cancel',
                    type: 'warning'
                })
                    .then(() => {
                        isRelogin.show = false
                        useUserStore()
                            .logOut()
                            .then(() => {
                                location.href = '/index'
                            })
                    })
                    .catch(() => {
                        isRelogin.show = false
                    })
			}
             // prettier-ignore
			return Promise.reject(useAppStore().language == 'zh' ? '无效的会话，或者会话已过期，请重新登录。' : 'Invalid session, or the session has expired, please log in again')
		} else if (code === 500) {
			ElMessage({
				message: msg,
				type: "error"
			});
			return Promise.reject(new Error(msg));
		} else if (code !== 200) {
			ElNotification.error({
				title: msg
			});
			return Promise.reject("error");
		} else {
			return res.data;
		}
	},
	error => {
		console.log("err", error);
		let { message } = error;
		if (message == "Network Error") {
			message = useAppStore().language == 'zh' ? '后端接口连接异常' : 'Backend interface connection exception'
		} else if (message.includes("timeout")) {
			message = useAppStore().language == 'zh' ? '系统接口请求超时' : 'System interface request timeout'
		}
		ElMessage({
			message: message,
			type: "error",
			duration: 5 * 1000
		});
		return Promise.reject(error);
	}
);

export const download = async (url: string, params: any, filename: string) => {
    // prettier-ignore
    const downloadLoadingInstance = ElLoading.service({ text: useAppStore().language == 'zh' ? '正在下载数据，请稍候' : 'Downloading data, please wait', spinner: 'loading', background: 'rgba(0, 0, 0, 0.7)' })
    let req = null
    if (params) {
        req = service.post(url, params, {
            transformRequest: [
                (params) => {
                    return tansParams(params)
                }
            ],
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'blob'
        })
    } else {
        req = service.get(url, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'blob'
        })
    }
    return await req
        .then(async (resp: any) => {
            const isLogin = await blobValidate(resp)
            if (isLogin) {
                const blob = new Blob([resp])
                // saveAs(blob, filename, {
                // 	type: "application/octet-stream;charset=utf-8"
                // });
                saveAs(blob, filename)
                //var blob2 = new Blob([resp], {type: "text/plain;charset=utf-8"});
                //saveAs(blob, resp.msg + ".xlsx");
                // console.log('%s ====>>>导出成功', filename)
            } else {
                const resText = resp.text()
                const rspObj: any = JSON.parse(resText)
                // prettier-ignore
                const errMsg = errorCode[rspObj.code as '401' | '403' | '404' | 'default'] || rspObj.msg || errorCode['default']
                ElMessage.error(errMsg)
            }
            downloadLoadingInstance.close()
        })
        .catch((r) => {
            console.error(r)
            ElMessage.error(useAppStore().language == 'zh' ? '下载文件出现错误，请联系管理员！' : 'An error occurred while downloading the file, please contact the administrator!')
            downloadLoadingInstance.close()
        })
}

export default service
