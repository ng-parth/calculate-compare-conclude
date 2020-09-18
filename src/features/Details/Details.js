import React from "react";
import {Button, Card, Col, Form, Input, InputNumber, Modal, Row, Typography} from "antd";
import ComparisonService from "../../redux/services/ComparisonService";
import {PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import uid from "uid";

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {title: 'Loading...', details: []},
      showDetailModal: false,
    }
    const {comparisonId} = props.match.params;
    this.comparisonId = comparisonId;
    this.form = React.createRef();
  }
  fetchDetails = () => {
    const details = ComparisonService.getComparison(this.comparisonId);
    this.setState({details});
  };
  componentDidMount() {
    setTimeout(() => this.fetchDetails(), 500);
  }
  submitForm = details => {
    ComparisonService.addDetail({id: uid(4), ...details, comparisonId: this.comparisonId});
    this.setState({showDetailModal: false});
  }
  deleteDetail = d => {
    ComparisonService.deleteDetail({...d, comparisonId: this.comparisonId});
    this.fetchDetails();
  }
  render() {
    const {details, showDetailModal} = this.state;
    return <div>
      <Typography.Title level={3}>{details.title}</Typography.Title>
      <Typography.Title level={4}>({details.comparisonUnit})</Typography.Title>
      <Row>
        {details.details.map(d => <Col span={12} key={d.id}>
          <Card
            className="detail-card"
            style={{background: `rgba(62,181,87, ${d.opacity})`}}
            title={d.name}
            extra={<DeleteOutlined onClick={() => this.deleteDetail(d)}/>}
          >
            <Typography.Paragraph>Cost: {d.cost}</Typography.Paragraph>
            <Typography.Paragraph>Measure: {d.measure}</Typography.Paragraph>
            <Typography.Paragraph>Per unit price: {d.perUnitPrice}</Typography.Paragraph>
            <Typography.Paragraph>Buy Pref: {d.buyPref}</Typography.Paragraph>
            <Typography.Paragraph>Opacity: {d.opacity}</Typography.Paragraph>
          </Card>
        </Col>)}
      </Row>
      <Button type="ghost" className="fab-button" shape="circle" icon={<PlusOutlined/>} size="large"
              onClick={() => this.setState({showDetailModal: true})}/>
      <Modal
        title="New Item"
        visible={showDetailModal}
        onOk={() => {
          this.form.current.submit();
        }}
        onCancel={() => this.setState({showDetailModal: false})}
        okText="Save Item"
      >
        <Form onFinish={this.submitForm} layout="vertical" ref={this.form}>
          <Form.Item name="name" label="Item Name" rules={[{required: true}]}>
            <Input autoComplete="off"/>
          </Form.Item>
          <Form.Item name="cost" label={`Cost (₹)`} rules={[{required: true}]}>
            <InputNumber autoComplete="off"/>
          </Form.Item>
          <Form.Item name="measure" label={`Measure (${details.comparisonUnit})`} rules={[{required: true}]}>
            <InputNumber autoComplete="off"/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  }
}


  export default Details;
