import React, {useEffect, useState} from 'react';
import {getRoutesApi, getRouteTagsApi, postRouteApi} from "../../redux/services/LetsGoService";
import {Col, Form, Input, Modal, notification, Radio, Row, Select, Spin, Switch, Typography} from "antd";
import RouteWidget from "../../components/RouteWidget";
import {PlusSquareTwoTone} from "@ant-design/icons";

const LetsGo = props => {
    const [routes, setRoutes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [routeTags, setRouteTags] = useState(null);
    const [tagFilter, setTagFilter] = useState(null);
    const [showUpsertModal, setUpsertModal] = useState(false);
    const [form] = Form.useForm();
    const getRoutes = () => {
        getRoutesApi().then(({data}) => {
            setRoutes(data.data);
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
        postRouteApi(formValues).then(({data}) => {
            getRoutes();
            setUpsertModal(false);
        }).catch(err => {
            console.log('Err @postRouteApi: ', err);
            notification.error({ message: 'Fail to add new route :\'('});
            setLoading(false);
        })
    }
    return <div>
        <Typography.Title level="3">Routes</Typography.Title>
        <Spin spinning={loading}>
            {routeTags?.length && <Row>
                <Col span={24}>
                    <Radio.Group value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
                        {routeTags?.map(t => <Radio.Button value={t.tagName} key={t.id}>{t.tagName}</Radio.Button>)}
                        <Radio.Button value="ALL" >ALL</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>}
            <br/>
            <Row>
                {routes?.length && routes?.map((route) => <Col span={8} key={route._id}>
                    <RouteWidget route={route} key={route._id}/>
                </Col>)}
                {!routes?.length && <Col span={8}><div>No Routes Found</div></Col>}
                <Col span={8}><PlusSquareTwoTone style={{fontSize: 30}} onClick={() => {
                    setUpsertModal(true);
                }}/></Col>
            </Row>
        </Spin>
        <Modal
            title="New Route"
            open={showUpsertModal}
            onOk={form.submit}
            onCancel={() => setUpsertModal(false)}
            okText="Add New Route"
            confirmLoading={loading}
        >
            <Form onFinish={submitForm} layout="vertical" form={form}>
                <Form.Item name="busNo" label="Bus No" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item name="routeName" label="Route Name" rules={[{required: true}]}>
                    <Input placeholder="eg: Worli to Airoli"/>
                </Form.Item>
                <Form.Item name="stopName" label="Stop Name" rules={[{required: true}]}>
                    <Input placeholder="eg: Century Bazaar"/>
                </Form.Item>
                <Form.Item name="defaultStopId" label="Default Stop Id" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item name="apiUrl" label="Update API Url" rules={[{required: true}]}>
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
                    <Switch defaultChecked checkedChildren="ACTIVE" unCheckedChildren="INACTIVE" />;
                </Form.Item>
            </Form>
        </Modal>
    </div>
}

export default LetsGo;

