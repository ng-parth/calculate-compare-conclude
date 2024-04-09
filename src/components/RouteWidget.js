import React, {useEffect, useState} from 'react';
import {Card, notification} from "antd";
import {EditOutlined, EllipsisOutlined, SettingOutlined, SyncOutlined} from "@ant-design/icons";
import {getRouteStatusApi} from "../redux/services/LetsGoService";

const {Meta} = Card;

const RouteWidget = props => {
    const {route} = props;
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [buses, setBuses] = useState([]);
    useEffect(() => {
        if (!lastUpdated) return
        setLoading(true)
        getRouteStatusApi(route._id).then(({data}) => {
            console.log(data.data);
            const respData = data.data;
            const buses = [];
            const keys = Object.keys(respData.stopsEta[route.defaultStopId]);
            for(let key of keys) {
                const busData = JSON.parse(respData.stopsEta[route.defaultStopId][key])
                if (busData.eta > 0) {
                    busData.etaMsg = `In ${Math.ceil(busData.eta / 60)} mins`;
                    buses.push(busData);
                }
            }
            setBuses(buses);
            setLoading(false);
        }).catch(err => {
            console.log('Err @getRouteStatusApi: ', err)
            notification.error({ message: 'Fail to load route status :\'('});
            setLoading(false);
        })
    }, [lastUpdated]);
    return <Card
        actions={[
            <SyncOutlined spin={loading} onClick={() => setLastUpdated(new Date().getTime())} />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
        ]}
    >
        <Meta
            // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={`${route.busNo} @ ${route.stopName}`}
            description={route.routeName}
        />
        {buses?.map((bus, index) =>  <div key={bus.vNo || index}>
            {bus.vNo} : {bus.etaMsg}
        </div>)}
        {/*<div></div>*/}
    </Card>
}

export default RouteWidget;
