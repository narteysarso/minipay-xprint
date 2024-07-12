import { useContext, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Form, Button, Space, Input } from "antd";
import { BusinessSettingsContext } from "../../../context/BusinessSettings";

export default function Location() {
    const [disabled, setDisabled] = useState(true);
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null);
    const { location, saveLocation } = useContext(BusinessSettingsContext);

    return (
        <Form
            name="location-form"
            layout="inline"
            style={{ maxWidth: "100%" }}
            initialValues={{
                location
            }}
            onFinish={(values) => {
                setloading(true);
                try {
                    const { location } = values;

                    if (location) {
                        saveLocation(location);
                    }

                } catch (error) {
                    setError(error.message);
                } finally {
                    setloading(false);
                    setDisabled(true);
                }
            }}
        >
            <Form.Item
                label="Location"
                style={{ width: "calc(100% - 150px)" }}
                name="location"
            >
                <Input disabled={disabled || loading} rules={[{ required: true }]} />
            </Form.Item>
            <Form.Item >
                <Space>
                    <Button type="default" size="small" disabled={!disabled || loading} onClick={() => setDisabled(prev => !prev)}><EditOutlined /> edit</Button>
                    <Button htmlType="submit" type="primary" size="small" disabled={disabled || loading} loading={loading}>save</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}