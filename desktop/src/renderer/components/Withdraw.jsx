import { Button } from "antd";
import { useContext } from "react";
import { BusinessSettingsContext } from "../context/BusinessSettings";

export default function Withdraw() {
    const { withdrawPrintCost, balance } = useContext(BusinessSettingsContext);

    return (
        <Button type="primary" loading={balance === undefined} disabled={balance && balance <= 0} icon={<>{`${balance} cUSD`}</>} onClick={withdrawPrintCost}>Withdraw</Button>
    )
}