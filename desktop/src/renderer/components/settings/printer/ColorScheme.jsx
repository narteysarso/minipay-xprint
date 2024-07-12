import { useContext, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Form, Button, Select, Space } from "antd";
import { PrinterSettingContext } from "../../../context/PrinterSettings";

const colorSchemes = ["monochrom", "color"];
export default function ColorSchemeSettings() {

    const [disabled, setDisabled] = useState(true);
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null);
    const { colorSchemes: selectedColorSchemes, saveColorSchemes } = useContext(PrinterSettingContext);

    return (
        <Form
            name="print-type-form"
            layout="inline"
            style={{ maxWidth: "100%" }}
            initialValues={{
                supported_print_color: selectedColorSchemes
            }}
            onFinish={(values) => {

                setloading(true)
                try {
                    const { supported_print_color } = values;
                    if (supported_print_color) {
                        saveColorSchemes(supported_print_color)
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
                label="Print Color"
                style={{ width: "calc(100% - 150px)" }}
                name="supported_print_color"
            >
                <Select
                    placeholder="Check supported print color scheme"
                    type="text"
                    mode="multiple"
                    style={{
                        width: "100%"
                    }}
                    disabled={disabled || loading}
                    rules={[{ required: true }]}

                >
                    {
                        colorSchemes ? colorSchemes.map((scheme, index) => <Select.Option key={index} value={scheme}>{scheme}</Select.Option>)
                            : <Select.Option disabled >No Color Scheme</Select.Option>
                    }


                </Select>
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