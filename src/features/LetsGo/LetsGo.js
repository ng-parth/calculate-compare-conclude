import React, {useEffect, useRef, useState} from 'react';
import {
    getCurrentTime,
    getRoutesApi,
    getRouteTagsApi,
    postRouteTagApi,
} from "../../redux/services/LetsGoService";
import {
    Button,
    Card,
    Col,
    Input,
    notification,
    Radio,
    Row,
    Spin,
    Typography
} from "antd";
import RouteWidget from "../../components/RouteWidget";
import {PlusOutlined, SwapOutlined} from "@ant-design/icons";
import './lets-go.scss';
import * as swLetsGo from "../../sw/swLetsGo";
import swConfig from "../../sw/swConfig";
import * as serviceWorker from "../../serviceWorker";
import logo1 from "../../assets/logos/letsgo/letsgo-144.png";
import logo2 from "../../assets/logos/letsgo/LetsGoo.png";
import logoOrange from "../../assets/logos/letsgo/letsgoo_orange.png";


const LetsGo = props => {
    const [routes, setRoutes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [routeTags, setRouteTags] = useState(null);
    const [tagFilter, setTagFilter] = useState('ALL');
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
    const updateManifestFile = () => {
        const url = `${process.env.PUBLIC_URL}/manifest.letsgo.json`;
        var link = document.createElement('link');
        link.href = url;
        link.rel = 'manifest';
        document.getElementsByTagName('head')[0].appendChild(link);

        // <link rel="icon" href="%PUBLIC_URL%/favicon.ico"/>
        const faviconEl = document.querySelector('link[rel="icon"]');
        faviconEl.href = `${process.env.PUBLIC_URL}/favicon.letsgo.ico`;

        const title = document.querySelector('title');
        title.innerText = 'Lets Go!';
    }
    useEffect(() => {
        updateManifestFile()
        getRoutes();
        getRouteTags();
        setTimeout(() => {
            serviceWorker.register(swConfig);
        }, 500)
    }, []);
    useEffect(() => {
        if (tagFilter && tagFilter !== 'ADD') {
            if (tagFilter === 'ALL') {
                setRoutes(masterRouteRef.current);
            } else {
                setRoutes(masterRouteRef.current.filter(route => route.tags.indexOf(tagFilter) > -1))
            }
        } else if (tagFilter === null) {
            setRoutes(masterRouteRef.current.filter(route => !route.tags?.length))
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
    return <div>
        <img src={logoOrange} className="logo--letsgo" alt="Logo"/>
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
                        <Radio.Button value={null}>Empty Tags</Radio.Button>
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
                    <RouteWidget route={route} key={route.id} lastUpdateTs={syncAllTime}/>
                </Col>)}
                {!routes?.length && <Col {...colSpan}><Card>No Routes Found</Card></Col>}
                <Col {...colSpan}>
                    <Card actions={[
                        <Button
                            type="primary"
                            ghost
                            shape="round"
                            icon={<PlusOutlined/>}
                            size={'small'}
                            href={(tagFilter && tagFilter !== 'ALL') ? `/lets-go/rinfo/new/${tagFilter}` : '/lets-go/rinfo/new' }
                        >
                            Add
                        </Button>
                    ]}>
                        Cant find your bus? Add one.
                    </Card>
                </Col>
            </Row>
        </Spin>
    </div>
}

export default LetsGo;

