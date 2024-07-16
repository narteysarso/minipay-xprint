import { Button } from "antd";
import { useContext } from "react";
import { BusinessSettingsContext } from "../context/BusinessSettings";
import { formatEther } from "../utils";

export default function Withdraw() {
    const { withdrawPrintCost, balance } = useContext(BusinessSettingsContext);

    return (
        <Button type="primary" loading={balance === undefined} disabled={balance && balance <= 0} icon={<>{`${formatEther(balance)}`}</>} onClick={withdrawPrintCost}>cUSD</Button>
    )
}