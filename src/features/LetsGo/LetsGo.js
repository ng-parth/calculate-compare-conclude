import React, {useEffect, useRef, useState} from 'react';
import {
    getCurrentTime,
    getRoutesApi,
    getRouteTagsApi,
    postRouteApi,
    postRouteTagApi,
    putRouteApi,
} from "../../redux/services/LetsGoService";
import {Button, Card, Col, Form, Input, Modal, notification, Radio, Row, Select, Spin, Switch, Typography} from "antd";
import RouteWidget from "../../components/RouteWidget";
import {PlusOutlined, SwapOutlined} from "@ant-design/icons";
import './lets-go.scss';

const LetsGo = props => {
    const [routes, setRoutes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [routeTags, setRouteTags] = useState(null);
    const [tagFilter, setTagFilter] = useState('ALL');
    const [showUpsertModal, setUpsertModal] = useState(false);
    const [form] = Form.useForm();
    const [isNew, setIsNew] = useState(false);
    const colSpan = {xs: 12, sm: 12, md: 8}
    const masterRouteRef = useRef(null);
    const [syncAllTime, setSyncAllTime] = useState(null);
    const getRoutes = () => {
        getRoutesApi().then(({data}) => {
            const sortedData = data.data.map(r => ({ ...r, title: `${r.busNo} @ ${r.stopName}`})).sort((a, b) => {
                const nameA = a.title.toUpperCase(); // ignore upper and lowercase
                const nameB = b.title.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            })
            setRoutes(sortedData);
            masterRouteRef.current = sortedData;
            setLoading(false);
        }).catch(err => {
            console.log('Err @getRoutesApi: ', err)
            setLoading(false);
            setRoutes(null);
            notification.error({ message: 'Fail to load routes :\'('});
        });
    }
    const getRouteTags = () => {
        getRouteTagsApi().then(({data}) => {
            setRouteTags(data.data);
        }).catch(err => {
            console.log('Err @getRouteTagsApi: ', err)
        })
    }
    useEffect(() => {
        getRoutes();
        getRouteTags();
    }, []);
    const submitForm = formValues => {
        setLoading(true);
        let api = postRouteApi;
        if (formValues.id) api = putRouteApi;
        api(formValues).then(({data}) => {
            getRoutes();
            setUpsertModal(false);
        }).catch(err => {
            console.log('Err @submitForm: ', err);
            notification.error({ message: 'Fail to add new route :\'('});
            setLoading(false);
        })
    }
    useEffect(() => {
        if (tagFilter && tagFilter !== 'ADD') {
            if (tagFilter === 'ALL') {
                setRoutes(masterRouteRef.current);
            } else {
                setRoutes(masterRouteRef.current.filter(route => route.tags.indexOf(tagFilter) > -1))
            }
        }
    }, [tagFilter]);
    const postRouteTag = tagName => {
        if (!tagName) return notification.error({ message: 'Please enter tag name' });
        setLoading(true);
        postRouteTagApi({tagName})
            .then(({data}) => {
                const routeTag = data.data;
                setRouteTags([...routeTags, routeTag]);
                setTagFilter('ALL');
                setLoading(false)
            })
            .catch(err => {
                console.log('Err @postRouteTagApi: ', err)
                notification.error({ message: 'Fail to save route tag.' });
                setLoading(true);
            });
    }
    const onEditCb = route => {
        form.resetFields();
        form.setFieldsValue(route);
        setIsNew(false);
        setUpsertModal(true);
    }
    return <div>
        <Typography.Title level={3}>Routes</Typography.Title>
        <Spin spinning={loading}>
            {routeTags?.length > 0 && <Row>
                <Col span={24}>
                    <Radio.Group value={tagFilter} onChange={e => {
                        const tag = e.target.value;
                        if (tag === 'ALL') setSyncAllTime(null);
                        setTagFilter(tag);
                    }}>
                        <Radio.Button value="ALL">ALL</Radio.Button>
                        {routeTags?.map(t => <Radio.Button value={t.tagName} key={t.id}>{t.tagName}</Radio.Button>)}
                        <Radio.Button value="ADD"><PlusOutlined/> Add</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>}
            {tagFilter === 'ADD' && <> <br/> <Row>
                <Col span={24}>
                    <Input.Group compact>
                        <Input.Search
                            allowClear
                            enterButton="Save"
                            onSearch={postRouteTag}/>
                    </Input.Group>
                </Col>
            </Row></>}
            <br/>
            <Row gutter={[16, 16]}>
                <Col span={24}><Button type="primary" icon={<SwapOutlined />} disabled={['ADD','ALL'].indexOf(tagFilter) > -1} onClick={() => setSyncAllTime(getCurrentTime())}>Sync All Status</Button></Col>
                {routes?.length > 0 && routes?.map((route) => <Col {...colSpan} key={route.id}>
                    <RouteWidget route={route} key={route.id} lastUpdateTs={syncAllTime} onEdit={onEditCb}/>
                </Col>)}
                {!routes?.length && <Col {...colSpan}><Card>No Routes Found</Card></Col>}
                <Col {...colSpan}>
                    <Card actions={[<Button type="primary" ghost shape="round" icon={<PlusOutlined/>} size={'small'}
                                            onClick={() => {
                                                form.resetFields();
                                                setIsNew(true);
                                                setUpsertModal(true);
                                            }}>Add</Button>]}>
                        Cant find your bus? Add one.
                    </Card>
                </Col>
            </Row>
        </Spin>
        <Modal
            title={isNew ? 'New Route' : 'Edit Route'}
            open={showUpsertModal}
            onOk={form.submit}
            onCancel={() => setUpsertModal(false)}
            okText={isNew ? 'Add New Route' : 'Update Route'}
            confirmLoading={loading}
            destroyOnClose
        >
            <Form onFinish={submitForm} layout="vertical" form={form}>
                <Form.Item noStyle name="id">
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item name="busNo" label="Bus No" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item name="routeName" label="Route Name" rules={[{required: true}]}>
                    <Input placeholder="eg: Worli to Airoli"/>
                </Form.Item>
                <Form.Item name="stopName" label="Stop Name" rules={[{required: true}]}>
                    <Input placeholder="eg: Century Bazaar"/>
                </Form.Item>
                <Form.Item name="apiUrl" label="Update API Url">
                    <Input />
                </Form.Item>
                <Form.Item name="defaultStopId" label="Default Stop Id">
                    <Input />
                </Form.Item>
                <Form.Item name="webUrl" label="Web Url">
                    <Input />
                </Form.Item>
                <Form.Item name="tags" label="Route Tags">
                    <Select mode={"multiple"}>
                        {routeTags?.map(t => <Select.Option value={t.tagName} key={t.id}>{t.tagName}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item name="isPublic" label="Is Public?">
                    <Switch defaultChecked checkedChildren="YES" unCheckedChildren="NO" />;
                </Form.Item>
                <Form.Item name="status" label="Status?">
                    <Switch defaultChecked checkedChildren="ACTIVE" unCheckedChildren="INACTIVE" />
                </Form.Item>
            </Form>
        </Modal>
    </div>
}

export default LetsGo;

