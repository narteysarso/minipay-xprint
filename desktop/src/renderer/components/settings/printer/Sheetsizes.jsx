import { useContext, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Form, Button, Select,Space } from "antd";
import { PrinterSettingContext } from "../../../context/PrinterSettings";

const paperSizes = [ "A2", "A3", "A4", "A5", "letter", "legal", "tabloid", "statement"];

export default function SheetSizeSettings() {
    
    const [disabled, setDisabled] = useState(true);
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null);
    const {sheetSizes, saveSheetSizes} = useContext(PrinterSettingContext);

    return (
        <Form 
            name="sheet-sizes-form" 
            layout="inline" 
            style={{ maxWidth: "100%" }}
            initialValues={{
                supported_paper_sizes: sheetSizes
            }}
            onFinish={(values)=>{
                setloading(true)
                try {
                    const { supported_paper_sizes } = values;
                    if (supported_paper_sizes) {
                        saveSheetSizes(supported_paper_sizes)
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
                label="Sheet Sizes"
                style={{ width: "calc(100% - 150px)" }}
                name="supported_paper_sizes"
            >
                <Select
                    placeholder="Check supported paper sizes"
                    type="text"
                    mode="multiple"
                    style={{
                        width: "100%"
                    }}
                    disabled={disabled || loading}
                    rules={[{ required: true }]}

                >
                    {
                        paperSizes ? paperSizes.map((paperSize, index) => <Select.Option key={index} value={paperSize}>{paperSize}</Select.Option>)
                            : <Select.Option disabled >No Paper Sizes</Select.Option>
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