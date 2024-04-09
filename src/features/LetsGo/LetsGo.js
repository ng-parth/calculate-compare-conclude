import React, {useEffect, useState} from 'react';
import {getRoutesApi, getRouteTagsApi} from "../../redux/services/LetsGoService";
import {Button, Col, notification, Radio, Row, Spin, Typography} from "antd";
import RouteWidget from "../../components/RouteWidget";
import {PlusSquareTwoTone} from "@ant-design/icons";

const LetsGo = props => {
    const [routes, setRoutes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [routeTags, setRouteTags] = useState(null);
    const [tagFilter, setTagFilter] = useState(null);
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

                }}/></Col>

            </Row>

        </Spin>
    </div>
}

export default LetsGo;

