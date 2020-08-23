import React from 'react'
import {Typography, Form, Input, Select, Button} from 'antd';
import ComparisonService from "../../redux/services/ComparisonService";
import uid from "uid";
import {Link} from "react-router-dom";

const NewComparison = props => {
  const UNITS = ['Weight', 'Pieces', 'Volume'];
  const submitForm = values => {
    ComparisonService.addComparison({ ...values, id: uid(3) });
  };
  return <div>
    <Typography.Title level={2}>Add new comparison</Typography.Title>
    <Link to="/">Go Back</Link>
    <Form onFinish={submitForm} layout="vertical">
      <Form.Item name="title" label="Title">
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item name="comparisonUnit" label="Comparison Unit">
        <Select>
          {UNITS.map(u => <Select.Option value={u} key={u}>{u}</Select.Option>)}
        </Select>
      </Form.Item>
      <Button htmlType="submit" type="primary">Save</Button>
    </Form>
  </div>
}

export default NewComparison;
