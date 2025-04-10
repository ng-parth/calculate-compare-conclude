import React from "react";
import ComparisonService from "../../redux/services/ComparisonService";
import {Card, Typography, Modal, Button, Form, Input, Select} from "antd";
import {PlusOutlined, WhatsAppOutlined} from '@ant-design/icons';
import uid from "uid";
import {Link} from "react-router-dom";
import logo from "../../assets/logos/compare192.png";

const Comparison = props => {
  const [showComparisonModal, setComparisonModal] = React.useState(false);
  // const saveComparison = () => {};
  const [form] = Form.useForm();
  const UNITS = ['Weight', 'Pieces', 'Volume'];
  const submitForm = values => {
    const c = { ...values, id: uid(3) };
    console.log(JSON.stringify(c));
    ComparisonService.addComparison(c);
    setComparisonModal(false);
  };
  return <div>
    <img src={logo} className="logo--main" alt="Logo"/>
    <Typography.Title level={2}>Comparison</Typography.Title>
    {ComparisonService.getAllComparison().map(c => <Link to={`/details/${c.id}`}
                                                         key={c.id}><Card>{c.title}</Card></Link>)}
    <Button type="ghost" className="fab-button" shape="circle" icon={<PlusOutlined/>} size="large"
            onClick={() => setComparisonModal(true)}/>
    <Link to="/wa.me"><Button type="ghost" className="whatsapp-button" icon={<WhatsAppOutlined/>}
                              size="large"/></Link>
    <Link to="/lets-go">
      <Button type="primary" ghost>Lets Go</Button>
    </Link>
    <br/>
    <br/>
    <Link to="/lets-upi">
      <Button type="danger" ghost>Lets Pay</Button>
    </Link>
    <Modal
        title="New Comparison"
        visible={showComparisonModal}
        onOk={form.submit}
        onCancel={() => setComparisonModal(false)}
        okText="Create New Comparison"
    >
      <Form onFinish={submitForm} layout="vertical" form={form}>
        <Form.Item name="title" label="Title" rules={[{required: true}]}>
          <Input autoComplete="off"/>
        </Form.Item>
        <Form.Item name="comparisonUnit" label="Comparison Unit" rules={[{required: true}]}>
          <Select>
            {UNITS.map(u => <Select.Option value={u} key={u}>{u}</Select.Option>)}
          </Select>
        </Form.Item>
        {/*<Button htmlType="submit" type="primary">Save</Button>*/}
      </Form>
    </Modal>
  </div>

}

export default Comparison;
