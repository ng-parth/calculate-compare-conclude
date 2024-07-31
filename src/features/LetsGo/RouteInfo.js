import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, notification, Radio, Row, Select, Switch, Typography} from "antd";
import {
    getRouteInfoApi,
    getRoutesApi, getRouteTagsApi,
    getSearchResultsApi,
    postRouteApi,
    putRouteApi
} from "../../redux/services/LetsGoService";

const RouteInfo = props => {
    const [loading, setLoading] = useState(false);
    const [routeTags, setRouteTags] = useState(null);
    const [form] = Form.useForm();
    const [isManual, setIsManual] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [stopDetails, setStopDetails] = useState(null);
    const [routeStops, setRouteStops] = useState(null);
    const formLayout = {labelCol: {span: 8}, wrapperCol: {span: 16}}
    const routeId = props.match?.params?.routeId;
    const isNew = routeId === 'new';
    const defaultTag = props.match?.params?.tag;

    const getRoutes = () => {
        getRoutesApi(routeId).then(({data}) => {
            const routeForId = data.data[0] || {}
            setIsManual(!!routeForId.id);
            form.setFieldsValue(routeForId);
            setLoading(false);
        }).catch(err => {
            console.log('Err @getRouteApi: ', err)
            notification.error({ message: 'Fail to load route :\'('});
        });
    }
    const getRouteTags = () => {
        getRouteTagsApi().then(({data}) => {
            setRouteTags(data.data);
            setLoading(false);
        }).catch(err => {
            console.log('Err @getRouteTagsApi: ', err)
            setLoading(false);
        })
    }

    const submitForm = formValues => {
        setLoading(true);
        let api = postRouteApi;
        if (formValues.id) api = putRouteApi;
        api(formValues).then(({data}) => {
            notification.success({ message: isNew ? 'New Route Added! :)' : 'Route details updated! :)'});
        }).catch(err => {
            console.log('Err @submitForm: ', err);
            notification.error({ message: 'Fail to add new route :\'('});
            setLoading(false);
        })
    }
    useEffect(() => {
        if (!isNew) {
            getRoutes()
            if (!routeTags) getRouteTags();
        }
    }, [routeId]);
    const onSearchRoute = searchText => {
        if (!searchText) return notification.error({ message: 'Please enter search text' });
        setLoading(true);
        getSearchResultsApi(searchText).then(({data}) => {
            // debugger
            setSearchResults(data.data);
            setLoading(false)
        }).catch(err => {
            console.log('Err @onSearchRoute: ', err);
            notification.error({ message: 'Search failed :\'('});
            setLoading(false);
        })
    }
    const getSelectedRouteInfo = () => {
        setLoading(true);
        getRouteInfoApi(selectedRoute).then(({data}) => {
            setRouteStops(data.data);
            setLoading(false);
        }).catch(err => {
            console.log('Err @onSearchRoute: ', err);
            notification.error({ message: 'Failed to get route stop info :\'('});
            setLoading(false);
        })
    }

    const addStopInfo = () => {
        if (!routeTags) {
            setLoading(true)
            getRouteTags();
        }
        const routeDetail = searchResults.find(r => r.routeId === selectedRoute);
        const apiUrlPrefix = 'https://chalo.com/app/api/vasudha/track/route-live-info/mumbai/';
        const webUrlPrefix = 'https://chalo.com/app/live-tracking/route-map/';
        const formValue = {
            busNo: routeDetail.routeName,
            routeName: `${stopDetails.stopName} => ${routeDetail.lastStopName}`,
            stopName: stopDetails.stopName,
            //apiUrl: https://chalo.com/app/api/vasudha/track/route-live-info/mumbai/vTAVNJss
            apiUrl: `${apiUrlPrefix}${routeDetail.routeId}`,
            defaultStopId: stopDetails.stopId,
            // webUrl: https://chalo.com/app/live-tracking/route-map/vTAVNJss
            webUrl: `${webUrlPrefix}${routeDetail.routeId}`,
            tags: defaultTag ? [defaultTag] : [],
            isPublic: true,
            status: true,
        };
        if (!isNew && routeId) formValue.id = routeId;
        setStopDetails({...stopDetails, apiUrl: formValue.apiUrl});
        form.setFieldsValue(formValue);
    }
    return <div>
        <Typography.Title level={3}>{isNew ? 'Add Route' : 'Edit Route'}</Typography.Title>
        <Row>
            <Col span={24}>
                <Radio.Group value={isManual} buttonStyle="solid" onChange={e => setIsManual(e.target.value)} className="std-margin-bottom">
                    <Radio.Button value={false}>Search & Add</Radio.Button>
                    <Radio.Button value={true}>Add Manually</Radio.Button>
                </Radio.Group>
            </Col>
            {!isManual && <>
                <Col span={24}>
                    <Input.Search
                        placeholder="Search Route"
                        allowClear
                        enterButton="Search"
                        onSearch={onSearchRoute}
                        loading={loading}
                        className="std-margin-bottom"
                    />
                </Col>
                {searchResults?.length > 0 &&
                    <>
                        <Col span={18}>
                            <Select placeholder="Select Bus Route" onChange={val => setSelectedRoute(val)} value={selectedRoute} allowClear style={{width:'100%'}} className="std-margin-bottom">
                                {searchResults.map((r, index) => index < 3 && <Select.Option value={r.routeId} key={r.routeId}>
                                    {r.routeName}: {r.firstStopName} - {r.lastStopName}
                                </Select.Option>)}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" disabled={!selectedRoute} onClick={getSelectedRouteInfo}>Get Stops</Button>
                        </Col>
                        {routeStops?.stops?.length > 0 && <>
                                <Col span={18}>
                                    <Select placeholder="Select Stop" onChange={val => setStopDetails(routeStops?.stops[val])} allowClear style={{width:'100%'}} className="std-margin-bottom">
                                        {routeStops?.stops.map((s, index) => <Select.Option value={index} key={s.stopId}>
                                            {s.stopName}
                                        </Select.Option>)}
                                    </Select>
                                </Col>
                                <Col span={6}>
                                    <Button type="primary" disabled={!stopDetails} onClick={addStopInfo}>Add Details</Button>
                                </Col>
                            </>
                        }
                    </>
                }
            </>}
            {(isManual || stopDetails?.apiUrl) && <Col span={24}>
                {!isManual && <Typography.Title level={4}>Route Details </Typography.Title>}
                <Form onFinish={submitForm} form={form} {...formLayout} labelAlign="left">
                    <Form.Item noStyle name="id">
                        <Input type="hidden"/>
                    </Form.Item>
                    <Form.Item name="busNo" label="Bus No" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="routeName" label="Route Name">
                        <Input placeholder="eg: Worli to Airoli"/>
                    </Form.Item>
                    <Form.Item name="stopName" label="Stop Name" rules={[{required: true}]}>
                        <Input placeholder="eg: Century Bazaar"/>
                    </Form.Item>
                    <Form.Item name="apiUrl" label="Update API Url">
                        <Input disabled={!isManual}/>
                    </Form.Item>
                    <Form.Item name="defaultStopId" label="Default Stop Id">
                        <Input disabled={!isManual}/>
                    </Form.Item>
                    <Form.Item name="webUrl" label="Web Url">
                        <Input disabled={!isManual}/>
                    </Form.Item>
                    <Form.Item name="tags" label="Route Tags">
                        <Select mode={"multiple"}>
                            {routeTags?.map(t => <Select.Option value={t.tagName} key={t.id}>{t.tagName}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="isPublic" label="Is Public?">
                        <Switch defaultChecked checkedChildren="YES" unCheckedChildren="NO"/>
                    </Form.Item>
                    <Form.Item name="status" label="Status?">
                        <Switch defaultChecked checkedChildren="ACTIVE" unCheckedChildren="INACTIVE"/>
                    </Form.Item>
                    <Form.Item label=" " colon={false}>
                        <Button type="primary" onClick={() => form.submit()}>
                            {isNew ? 'Save' : 'Update'} Route
                        </Button>
                    </Form.Item>
                </Form>
            </Col>}
        </Row>
    </div>
}

export default RouteInfo;
