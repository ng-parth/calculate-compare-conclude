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
    errRequest.post(serviceUrl, errData);
};

export default { reportError, initializeErrorReportingService };
