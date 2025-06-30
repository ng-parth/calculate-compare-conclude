import req from "./RequestService";
import moment from "moment/moment";

const BASE_URL = process.env.REACT_APP_ROUTE_SERVICE_BASE_URL || 'http://localhost:8090';
export const getRoutesApi = id => {
    const params = {}
    if (id) params.id = id;
    return req.get(`${BASE_URL}/api/letsgo/routes`, { params });
};
export const getRouteTagsApi = () => req.get(`${BASE_URL}/api/letsgo/route-tags`);
export const getRouteStatusApi = id => req.get(`${BASE_URL}/api/letsgo/status/${id}`);
// export const getRouteStatusApi = id => Promise.resolve({data: {
//         "action": "success",
//         "data": {
//             "routeLiveInfo": {
//                 "-Nv_18wetTobSvPphGw8": "{\"lSId\":\"pVQKfTnd\",\"_longitude\":72.819199,\"eta\":95,\"vNo\":\"6601\",\"opId\":\"1909\",\"_isHalted\":true,\"_latitude\":19.013662,\"tS\":1713240690000,\"sId\":\"DnLNPdBR\"}",
//                 "-O-pcLJGPigTwLOn3cgn": "{\"lSId\":\"pVQKfTnd\",\"_longitude\":72.838341,\"eta\":363,\"vNo\":\"6596\",\"opId\":\"1909\",\"_isHalted\":false,\"_latitude\":19.020155,\"tS\":1718887878000,\"sId\":\"zGOmaRlT\"}",
//                 "-O-oYNord_oN6N2si4ev": "{\"lSId\":\"pVQKfTnd\",\"_longitude\":72.841095,\"eta\":146,\"vNo\":\"6593\",\"opId\":\"1909\",\"_isHalted\":false,\"_latitude\":19.051304,\"tS\":1718870939000,\"sId\":\"QblWCXMk\"}",
//                 "-NwDgk0siWMUhzRJ9h0S": "{\"lSId\":\"pVQKfTnd\",\"_longitude\":72.819237,\"eta\":95,\"vNo\":\"6601\",\"opId\":\"1909\",\"_isHalted\":true,\"_latitude\":19.013655,\"tS\":1713939123000,\"sId\":\"DnLNPdBR\"}",
//                 "-NujDPBxDVbAeTz6Q0Wf": "{\"lSId\":\"pVQKfTnd\",\"_longitude\":72.819641,\"eta\":95,\"vNo\":\"6601\",\"opId\":\"1909\",\"_isHalted\":false,\"_latitude\":19.013706,\"tS\":1712336847000,\"sId\":\"DnLNPdBR\"}",
//                 "-NyE_x7EK1iPxPBfQemE": "{\"lSId\":\"pVQKfTnd\",\"_longitude\":72.958328,\"eta\":0,\"vNo\":\"418\",\"opId\":\"1909\",\"_isHalted\":false,\"_latitude\":19.154409,\"tS\":1716106595000,\"sId\":\"UbYvzGPm\"}",
//                 "-NyKpG7d6TFGY5gqAxz4": "{\"lSId\":\"pVQKfTnd\",\"_longitude\":72.93895,\"eta\":47,\"vNo\":\"6585\",\"opId\":\"1909\",\"_isHalted\":false,\"_latitude\":19.125198,\"tS\":1716209741000,\"sId\":\"aSeirjpz\"}"
//             },
//             "stopsEta": {
//                 "TbQisqOu": {
//                     "-Nv_18wetTobSvPphGw8": "{\"lSId\":\"pVQKfTnd\",\"eta\":205,\"isHalted\":true,\"vNo\":\"6601\",\"ag\":\"BEST\",\"dest\":\"Airoli Bus Station\",\"rN\":\"C-54\",\"tS\":1713939123000}",
//                     "-O-pcLJGPigTwLOn3cgn": "{\"lSId\":\"pVQKfTnd\",\"eta\":-1,\"isHalted\":false,\"vNo\":\"6596\",\"ag\":\"BEST\",\"dest\":\"Airoli Bus Station\",\"rN\":\"C-54\",\"tS\":1718887878000}",
//                     "-O-oYNord_oN6N2si4ev": "{\"lSId\":\"pVQKfTnd\",\"eta\":-1,\"isHalted\":false,\"vNo\":\"6593\",\"ag\":\"BEST\",\"dest\":\"Airoli Bus Station\",\"rN\":\"C-54\",\"tS\":1718870939000}",
//                     "-NwDgk0siWMUhzRJ9h0S": "{\"lSId\":\"pVQKfTnd\",\"eta\":513,\"isHalted\":true,\"vNo\":\"6601\",\"ag\":\"BEST\",\"dest\":\"Airoli Bus Station\",\"rN\":\"C-54\",\"tS\":1718733897034}",
//                     "-NujDPBxDVbAeTz6Q0Wf": "{\"lSId\":\"pVQKfTnd\",\"eta\":100,\"isHalted\":false,\"vNo\":\"6601\",\"ag\":\"BEST\",\"dest\":\"Airoli Bus Station\",\"rN\":\"C-54\",\"tS\":1716055497034}",
//                     "-NyE_x7EK1iPxPBfQemE": "{\"lSId\":\"pVQKfTnd\",\"eta\":-1,\"isHalted\":false,\"vNo\":\"418\",\"ag\":\"BEST\",\"dest\":\"Airoli Bus Station\",\"rN\":\"C-54\",\"tS\":1716106595000}",
//                     "-NyKpG7d6TFGY5gqAxz4": "{\"lSId\":\"pVQKfTnd\",\"eta\":-1,\"isHalted\":false,\"vNo\":\"6585\",\"ag\":\"BEST\",\"dest\":\"Airoli Bus Station\",\"rN\":\"C-54\",\"tS\":1716209741000}"
//                 }
//             }
//         }
//     }});
export const postRouteApi = route => req.post(`${BASE_URL}/api/letsgo/route`, route);
export const putRouteApi = route => req.put(`${BASE_URL}/api/letsgo/route`, route);
export const postRouteTagApi = routeTag => req.post(`${BASE_URL}/api/letsgo/route-tag`, routeTag);
export const getSearchResultsApi = searchText => req.post(`${BASE_URL}/api/letsgo/route-search`, {searchText});
export const getRouteInfoApi = routeId => req.post(`${BASE_URL}/api/letsgo/route-stop-info`, {routeId});

export const getCurrentTime = () => moment().format('h:mm:ss a');

export const validateAndSortBuses = buses => {
    const ETA_THRESHOLD = process.env.REACT_APP_ETA_THRESHOLD_IN_MINUTES || 20;
    const validEta = [], invalidEta = [];
    buses.map(bus => {
        const estimatedEta = moment(bus.tS).add(bus.eta, "seconds");
        const isValidEta = estimatedEta.isAfter(moment().subtract(ETA_THRESHOLD, "minutes"));
        if (isValidEta)
            validEta.push({ ...bus, isValidEta, estimatedEta });
        else invalidEta.push({ ...bus, isValidEta, estimatedEta });
    });
    return [ ...validEta.sort((a, b) => a.estimatedEta - b.estimatedEta), ...invalidEta]
}

export const SHORTCUT_ROUTETAGS = [
    // {id: "3NBtS", tagName: "Century => RGGC", nickName: "Home => School"},
    // {id: "HJDEH", tagName: "RGGC => Century", nickName: "School => Home"},
    { id: "eazGg", tagName: "Century => Kalanagar", nickName: "Home => Kalanagar" },
    { id: "8jdfWs", tagName: "Kalanagar => WeW", nickName: "Kalanagar => WeW" },
    { id: "vkU8p", tagName: "Kalanagar => RGGC", nickName: "Kalanagar => RGCC" },
    { id: "sd8Ip", tagName: "BharatNagar => Century", nickName: "Bharatnagar => RGCC" },
];

