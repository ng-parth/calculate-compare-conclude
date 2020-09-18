import React from "react";
import {Button, Card, Col, Descriptions, Form, Input, InputNumber, Modal, Row, Typography} from "antd";
import ComparisonService from "../../redux/services/ComparisonService";
import {PlusOutlined, DeleteTwoTone, DeleteOutlined} from '@ant-design/icons';
import uid from "uid";

const Details = props => {
  const { comparisonId } = props.match.params;
  const [details, setDetails] = React.useState({title: 'Loading...', details: []});
  const [showDetailModal, setDetailModal] = React.useState(false);
  const [form] = Form.useForm();

  const fetchDetails = () => {
    const d = ComparisonService.getComparison(comparisonId);
    debugger
    setDetails(d);
  };
  React.useEffect(() => {
    setTimeout(() => fetchDetails(), 500);
  }, []);
  const submitForm = details => {
    ComparisonService.addDetail({ id: uid(4), ...details, comparisonId });
    setDetailModal(false);
  }
  const deleteDetail = d => {
    ComparisonService.deleteDetail({ ...d, comparisonId });
    fetchDetails();
  }
  console.log('next Details: ', !!details);
  return <div>
    <Typography.Title level={3}>{details.title}</Typography.Title>
    <Typography.Title level={4}>({details.comparisonUnit})</Typography.Title>
    <Row>
      {details.details.map(d => <Col span={12} key={d.id}>
        <Card
          className="detail-card"
          style={{background: `rgba(62,181,87, ${d.opacity})`}}
          title={d.name}
          extra={<DeleteOutlined onClick={() => deleteDetail(d)}/>}
        >
          <Typography.Paragraph>Cost: {d.cost}</Typography.Paragraph>
          <Typography.Paragraph>Measure: {d.measure}</Typography.Paragraph>
          <Typography.Paragraph>Per unit price: {d.perUnitPrice}</Typography.Paragraph>
          <Typography.Paragraph>Buy Pref: {d.buyPref}</Typography.Paragraph>
          <Typography.Paragraph>Opacity: {d.opacity}</Typography.Paragraph>
        </Card>
      </Col>)}
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
        <Form.Item name="cost" label={`Cost (₹)`} rules={[{required: true}]}>
          <InputNumber autoComplete="off" />
        </Form.Item>
        <Form.Item name="measure" label={`Measure (${details.comparisonUnit})`} rules={[{required: true}]}>
          <Input htmlType="number" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
}

export default Details;
