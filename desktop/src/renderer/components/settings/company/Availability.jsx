import { useContext, useState } from "react";
import { Form, Radio } from "antd";
import { BusinessSettingsContext } from "../../../context/BusinessSettings";

export default function Availability() {
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null);
    const { availability, saveAvailability} = useContext(BusinessSettingsContext);

    return (
        <Form
            name="availability-form"
            layout="inline"
            style={{ maxWidth: "100%" }}
            initialValues={{
                status: availability
            }}
            onValuesChange={(values) => {
                setloading(true)
                try {
                    const { status } = values
                    if (status) {
                        saveAvailability(status)
                    }
                } catch (error) {
                    setError(error.message);
                } finally {
                    setloading(false);
                }
            }}
        >
            <Form.Item
                label="Availability (Status)"
                style={{ width: "calc(100% - 150px)" }}
                name="status"
            >
                <Radio.Group buttonStyle="solid" >
                    <Radio.Button value="offline" >Offline</Radio.Button>
                    <Radio.Button value="online" >Online</Radio.Button>
                </Radio.Group>
            </Form.Item>

        </Form>
    )
}