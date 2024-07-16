import { InboxOutlined } from "@ant-design/icons";
import { Button, Card, Col, Upload, message } from "antd";
import { printDoc } from "../../services/print";
import { useContext } from "react";
import { PrinterSettingContext } from "../../context/PrinterSettings";

const { Dragger } = Upload;
const props = {
    name: 'file',
    multiple: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        e.preventDefault();
        
        console.log('Dropped files', e.dataTransfer.files);
    },
};

export default function TestIPFS() {
    const {printer, colorSchemes, sheetSizes} = useContext(PrinterSettingContext);

    console.log({printer, colorSchemes, sheetSizes});

    return (
        <Col span={6}>
        <Card title="Print File">
            <Button onClick={() => {
                printDoc("https://gateway.ipfs.io/ipfs/bafykbzaceakjgsdvhuy5h5cybqumcr7kzhl5cxjjaxeqb6jfrhk6jsjb6r4ek?filename=%28The%20node%20craftsman%20book%29%20Manuel%20Kiessling%20-%20The%20node%20craftsman%20book%20_%20An%20advanced%20nodejs%20tutorial.pdf",
                {
                    printer,
                    paperSize: "A4",
                    colorScheme: "monochrom",
                    copies: 1,
                    orientation: "portrait"
                })
            } }>Print</Button>
            <Dragger >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
        </Card>
        </Col>
    )
}