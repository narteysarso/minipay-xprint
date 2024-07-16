import { useContext, useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { EditOutlined } from "@ant-design/icons";
import { Form, Button, Select, Space } from "antd";
import { PrinterSettingContext } from "../../../context/PrinterSettings";

export default function PrinterSettings() {
    const [printers, setPrinters] = useState();
    const [disabled, setDisabled] = useState(true);
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null);
    const { printer: selectedPrinter, savePrinter } = useContext(PrinterSettingContext);

    useEffect(() => {

        if (ipcRenderer) {
            ipcRenderer.send("get_printers");
            ipcRenderer.on("printers_list", (event, { printers }) => {
                setPrinters(printers.map((printer) => printer.name));
            });
        }
    }, []);

    return (
        <Form
            name="select-printer-form"
            layout="inline"
            style={{ maxWidth: "100%" }}
            onFinish={(values) => {
                setloading(true);
                try {
                    const { selected_printer } = values;

                    if (selected_printer) {
                        savePrinter(selected_printer);
                    }

                } catch (error) {
                    setError(error.message);
                } finally {
                    setloading(false);
                    setDisabled(true);
                }
            }}
            initialValues={{
                "selected_printer": selectedPrinter
            }}
        >
            <Form.Item
                label="Select Printer"
                style={{ width: "calc(100% - 150px)" }}
                name="selected_printer"
            >
                <Select
                    placeholder="Select printer"
                    type="text"
                    style={{
                        width: "100%"
                    }}
                    disabled={disabled || loading}
                    rules={[{ required: true }]}
                >
                    {printers ? printers.map((printer, index) => {
                        return (
                            <Select.Option
                                value={printer}
                                key={index}
                            >
                                {printer}
                            </Select.Option>
                        )
                    }) : <Select.Option disabled >No Printers Found</Select.Option>}
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