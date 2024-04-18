import req from "./RequestService";
const BASE_URL = process.env.REACT_APP_ROUTE_SERVICE_BASE_URL || 'http://localhost:8090';
export const getRoutesApi = () => req.get(`${BASE_URL}/api/letsgo/routes`);
export const getRouteTagsApi = () => req.get(`${BASE_URL}/api/letsgo/route-tags`);
export const getRouteStatusApi = id => req.get(`${BASE_URL}/api/letsgo/status/${id}`);
export const postRouteApi = route => req.post(`${BASE_URL}/api/letsgo/route`, route);
