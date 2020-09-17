import React from "react";
import {Button, Card, Col, Form, Input, InputNumber, Modal, Row, Typography} from "antd";
import ComparisonService from "../../redux/services/ComparisonService";
import {PlusOutlined} from '@ant-design/icons';
import uid from "uid";

const Details = props => {
  const { comparisonId } = props.match.params;
  const [details, setDetails] = React.useState({title: 'Loading...', details: []});
  const [showDetailModal, setDetailModal] = React.useState(false);
  const [form] = Form.useForm();

  const fetchDetails = () => {
    const d = ComparisonService.getComparison(comparisonId);
    setDetails(d);
  };
  React.useEffect(() => {
    setTimeout(() => fetchDetails(), 700);
  }, []);
  const submitForm = details => {
    ComparisonService.addDetail({ id: uid(4), ...details, comparisonId });
    setDetailModal(false);
  }
  return <div>
    <Typography.Title level={3}>{details.title}</Typography.Title>
    <Typography.Title level={4}>({details.comparisonUnit})</Typography.Title>
    <Row>
      {details.details.map(d => <Col span={12}><Card>{d.name}</Card></Col>)}
    </Row>
    <Button type="ghost" className="fab-button" shape="circle" icon={<PlusOutlined />} size="large" onClick={() => setDetailModal(true)} />
    <Modal
      title="New Item"
      visible={showDetailModal}
      onOk={form.submit}
      onCancel={() => setDetailModal(false)}
      okText="Save Item"
    >
      <Form onFinish={submitForm} layout="vertical" form={form}>
        <Form.Item name="name" label="Item Name" rules={[{required: true}]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="measure" label={`Measure (${details.comparisonUnit})`} rules={[{required: true}]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="cost" label={`Cost (₹)`} rules={[{required: true}]}>
          <InputNumber autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
}

export default Details;
