import React, {useEffect, useRef, useState} from 'react';
import {Card, Form, Input, Modal, notification, Typography} from "antd";
import {EllipsisOutlined, ExclamationCircleOutlined, LinkOutlined, SyncOutlined} from "@ant-design/icons";
import {getCurrentTime, getRouteStatusApi} from "../redux/services/LetsGoService";
import ErrorReportingService from "../redux/services/ErrorReportingService";
import moment from "moment/moment";
import {Link} from "react-router-dom";

const {Meta} = Card;

const RouteWidget = props => {
    const {route, lastUpdateTs = null} = props;
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [buses, setBuses] = useState([]);
    const [isErrorReported, setIsErrorReported] = useState(false);
    const busRespRef = useRef(null);
    const enableReportError = lastUpdated && busRespRef.current && !isErrorReported;
    const [showReportErrorModal, setReportErrorModal] = useState(false);
    const [discrepancyForm] = Form.useForm();

    useEffect(() => {
        if (!lastUpdated) return
        setLoading(true)
        getRouteStatusApi(route.id).then(({data}) => {
            // console.log(data.data);
            const respData = data.data;
            let buses = [];
            const keys = Object.keys(respData.stopsEta[route.defaultStopId]);
            const newStopsEta = {};
            newStopsEta[route.defaultStopId] = {};
            for(let key of keys) {
                const busData = JSON.parse(respData.stopsEta[route.defaultStopId][key]);
                busData.dts = moment(busData.tS).format();
                busData.timeDiff = moment(busData.tS).fromNow();
                if (busData.eta > 0) {
                    busData.etaMsg = `In ${Math.floor(busData.eta / 60)} mins`;
                    buses.push(busData);
                }
                newStopsEta[route.defaultStopId][key] = busData;
            }
            buses = buses.sort((a, b) => a.eta - b.eta);
            busRespRef.current = {...respData, stopsEta: newStopsEta};
            setBuses(buses);
            setLoading(false);
        }).catch(err => {
            console.log('Err @getRouteStatusApi: ', err)
            notification.error({ message: 'Fail to load route status :\'('});
            setLoading(false);
        })
    }, [lastUpdated]);

    useEffect(() => {
        if (lastUpdateTs) setLastUpdated(lastUpdateTs);
    }, [lastUpdateTs])

    const reportDiscrepancy = () => {
        if (!enableReportError) return;
        discrepancyForm.setFieldsValue({...route, comment: ''})
        setReportErrorModal(true);
    }
    const reportBusDiscrepancy = ({comment}) => {
        setLoading(true);
        const err = ErrorReportingService.getErrorObj({
            name: 'BUS_STATUS_DISCREPANCY',
            reportData: {
                route, routeResp: busRespRef.current, comment
            }
        })
        ErrorReportingService.reportError(err).then(() => {
            setLoading(false);
            notification.success({ message: 'Discrepancy Reported!'});
            setReportErrorModal(false);
            setIsErrorReported(true)
        }).catch(err => {
            setLoading(false);
            notification.error({ message: 'Fail to report discrepancy'});
        })
    }

    return <>
        <Card
        actions={[
            <SyncOutlined spin={loading} onClick={() => setLastUpdated(getCurrentTime())} />,
            <ExclamationCircleOutlined key="report" style={{color: enableReportError ? '#f50' : '#e1e1e1'}} onClick={reportDiscrepancy}/>,
            route.webUrl ? <a href={route.webUrl} rel="noopener noreferrer" target={"_blank"}><LinkOutlined style={{color: '#1677ff'}}/></a> : <EllipsisOutlined key="ellipsis" />,
        ]}
        className="bus-route-widget"
        style={{width: '100%'}}
    >
        <Meta
            title={route.title}
            description={route.routeName}
        />
        {buses?.map((bus, index) =>  <div key={bus.vNo + '-' + index} className="bus-route-widget--bus">
            <div className="bus-route-widget--bus-title">{bus.vNo} : {bus.etaMsg}</div>
            <Typography.Text disabled>{bus?.timeDiff} {bus.isHalted ? ': Halted' : '' }</Typography.Text>
        </div>)}
        {lastUpdated && !loading && !buses.length && <div><Typography.Text type="warning">No running bus found</Typography.Text></div>}
        {lastUpdated && (<Typography.Text type="secondary">@{lastUpdated}</Typography.Text>)}
    </Card>
        <Modal
            title="Route Discrepancy"
            open={showReportErrorModal}
            onOk={discrepancyForm.submit}
            onCancel={() => setReportErrorModal(false)}
            okText="Report Discrepancy"
            confirmLoading={loading}
            destroyOnClose
        >
            <Form onFinish={reportBusDiscrepancy} layout="vertical" form={discrepancyForm}>
                <Form.Item name="busNo" label="Bus No" rules={[{required: true}]}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="routeName" label="Route Name" rules={[{required: true}]}>
                    <Input placeholder="eg: Worli to Airoli" disabled/>
                </Form.Item>
                <Form.Item name="stopName" label="Stop Name" rules={[{required: true}]}>
                    <Input placeholder="eg: Century Bazaar" disabled/>
                </Form.Item>
                <Form.Item name="comment" label="Comment">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
        </>
}

export default RouteWidget;
