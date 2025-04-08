import React, {useEffect} from 'react'
import {Typography, Form, Input, Button} from 'antd';
import {Link} from "react-router-dom";
import {APP_NAMES, updateManifestFile} from "../../redux/ServiceWorkerUtil";
import waSwConfig from "../../sw/wa/swConfig";

const WaMe = props => {
    const [link,setLink] = React.useState('');
    const submitForm = ({ phoneNo }) => {
      setLink(`https://wa.me/91${phoneNo}`);
    };
    useEffect(() => {
      updateManifestFile(APP_NAMES.WA_ME, waSwConfig);
    }, []);
  return <div>
    <Typography.Title level={2}>WhatsApp Me</Typography.Title>
    <Link to="/">Go Back</Link>
    <Form onFinish={submitForm} layout="vertical">
      <Form.Item name="phoneNo" label="PhoneNo">
        <Input addonBefore="+91" autoComplete="off" type="tel" allowClear />
      </Form.Item>
      {link && <Form.Item name="link" label="Link">
        <a target="_blank" rel="noopener noreferrer"  href={link}>{link}</a>
      </Form.Item>}
      <Button htmlType="submit" type="primary">Get Link</Button>
    </Form>
  </div>
}

export default WaMe;
