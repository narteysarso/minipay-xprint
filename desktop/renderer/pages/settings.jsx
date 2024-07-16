
import { Card, Row, Col, Space, Button } from "antd";
import PrinterSettings from "../components/settings/printer/Printer";
import ColorSchemeSettings from "../components/settings/printer/ColorScheme";
import SheetSizeSettings from "../components/settings/printer/Sheetsizes";
import CompanyName from "../components/settings/company/CompanyName";
import Location from "../components/settings/company/Location";
import Availability from "../components/settings/company/Availability";
import Services from "../components/settings/Services";
import ServicesEditable from "../components/settings/ServicesEditable";
import TestIPFS from "../components/settings/TestIPFS";
import { useContext } from "react";
import { BusinessSettingsContext } from "../context/BusinessSettings";

export default function Settings() {

    const {registerService, validData: validBusinessData} = useContext(BusinessSettingsContext);
    return (
        <Row gutter={[16, 16]} style={{ padding: "5vh 3vh" }}>
            <Col span={12}>
                <Card title="Printer Settings" bordered={false}>
                    <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                    >
                        <PrinterSettings />
                        <ColorSchemeSettings />
                        <SheetSizeSettings />
                    </Space>

                </Card>
            </Col>
            <Col span={12}>
                <Card title="Business Settings" bordered={false}>
                    <Space 
                    direction="vertical"
                    style={{ width: "100%" }}
                    >
                        <CompanyName />
                        <Location />
                        <Availability />
                        <Button type="primary" disabled={validBusinessData()} onClick={() => registerService()}>Register as Servicer Provider</Button>
                    </Space>
                </Card>
            </Col>
            <Col span={18}>
                <Card title="Service Settings" bordered={false}>
                    <ServicesEditable />
                    
                </Card>
            </Col>
            {/* <TestIPFS /> */}
        </Row>
    );
}
