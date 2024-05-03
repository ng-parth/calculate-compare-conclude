import React from 'react';
import {Button, Form, Input, InputNumber, notification, Typography} from "antd";
import './lets-upi.scss';

const LetsUpi = () => {
    // upi://pay?pa=payu@axisbank&pn=SMSPLUS&tr=8312916361&am=10.17
    // vpa, am, tr
    const [formRef] = Form.useForm();
    // const [loading, setLoading] = React.useState(false);
    const [upiUrl, setUpiUrl] = React.useState(false);
    const payNow = ({ vpa, amount}) => {
        if (vpa) {
            let vpaSplit = vpa.split('@');
            if (vpaSplit.length != 2) return notification.error({message: 'Incorrect VPA!'});
        }
        if (amount < 1) return notification.error({message: 'Incorrect amount!'});
        // setLoading(true)
        const upiUrl = `upi://pay?pay=${vpa}&amount=${amount}&tr=upi-test-transaction`;
        setUpiUrl(upiUrl);
        window.open(upiUrl, '_new');
    }

    return <div>
        <Typography.Title level={3}>Lets UPI</Typography.Title>
        <div className="upi-form-container">
            <Form name="letsUpi" form={formRef} onFinish={payNow} className="upi-form" initialValues={{vpa: '8866255483@axisb', amount: 1.0}}>
                <Form.Item
                    name="vpa"
                    rules={[
                        {
                            required: true,
                            message: 'Enter merchant UPI!',
                        },
                    ]}
                >
                    <Input placeholder="merchant-vpa@upi" size="small" className="upi-form--vpa"/>
                </Form.Item>
                <Form.Item
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: 'Enter amount!',
                        },
                    ]}
                >
                    <InputNumber prefix="Rs. " placeholder="0.00" size="large" step={0.01} className="upi-form--amount"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Pay</Button>
                </Form.Item>
            </Form>
            <br/>
            {upiUrl && <a href={upiUrl} target="_blank">{upiUrl}</a>}
        </div>

    </div>
}

export default LetsUpi;
