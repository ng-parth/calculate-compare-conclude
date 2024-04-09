import axios from 'axios';
const BASE_URL = process.env.REACT_APP_ROUTE_SERVICE_BASE_URL || 'http://localhost:8090';
export const getRoutesApi = () => axios.get(`${BASE_URL}/api/letsgo/routes`);
export const getRouteTagsApi = () => axios.get(`${BASE_URL}/api/letsgo/route-tags`);
export const getRouteStatusApi = id => axios.get(`${BASE_URL}/api/letsgo/status/${id}`);
export const postRouteApi = route => axios.post(`${BASE_URL}/api/letsgo/route`, route);
