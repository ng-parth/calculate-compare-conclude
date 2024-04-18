import axios from "axios";
import ErrorReportingService from "./ErrorReportingService";
// Request instance for all request
// const request = axios.create({timeout: 45000});
const request = axios.create();
request.interceptors.request.use(function (config) {
    const headers = config.headers || {};
    headers.reqTs = new Date().getTime();
    config.headers = headers;
    return config;
});

request.interceptors.response.use(function (response) {
    const reqTs = response?.config?.headers?.reqTs;
    const timeElapsed = reqTs && (new Date().getTime() - reqTs);
    // console.log('===== timeElapsed in ms:', timeElapsed);
    if (timeElapsed > 5000) {
        const errObj = {
            name: 'COLD_START',
            api: `${response?.config?.method}: ${response?.config?.url}`,
            apiInfo: JSON.stringify({timeElapsed, response: response.data, referer: window.location.href}),
        }
        ErrorReportingService.reportError(errObj)
    }
    return response;
});

export default request;
