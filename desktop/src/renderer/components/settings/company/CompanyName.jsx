import { useContext, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Form, Button, Space, Input } from "antd";
import { BusinessSettingsContext } from "../../../context/BusinessSettings";

export default function CompanyName() {
    const [disabled, setDisabled] = useState(true);
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null);
    const { companyName, saveCompanyName } = useContext(BusinessSettingsContext);

    return (
        <Form
            name="company-name-form"
            layout="inline"
            style={{ maxWidth: "100%" }}
            initialValues={{
                company_name: companyName
            }}
            onFinish={(values) => {
                setloading(true);
                try {
                    const { company_name } = values;

                    if (company_name) {
                        saveCompanyName(company_name);
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
                label="Company Name"
                name="company_name"
                style={{ width: "calc(100% - 150px)" }}

            >
                <Input disabled={disabled || loading}
                    rules={[{ required: true }]} />
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