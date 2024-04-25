import axios from "axios";

let errRequest = null;
const serviceUrl = process.env.REACT_APP_ERROR_SERVICE_URL;
const initializeErrorReportingService = () => {
    if (!errRequest) {
        errRequest = axios.create();
    }
};

const reportError = err => {
    if (!errRequest) {
        initializeErrorReportingService();
    }
    if (!serviceUrl || !errRequest) {
        return console.error('Failed to report error: ');
    }
    // console.log(err);
    const errData = {...err, src: process.env.REACT_APP_UI_SRC || ''};
    return errRequest.post(serviceUrl, errData);
};

const getErrorObj = ({name = 'REPORT_ERROR', api = null, reportData}) => {
    let apiInfo = {};
    try {
        apiInfo = JSON.stringify(reportData);
    } catch (e) {
        console.error(`Failed to stringify reportData: `, e);
    }
    return {name, api, apiInfo};
}

export default { reportError, initializeErrorReportingService, getErrorObj };
