import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Space } from "antd";
import { useAccount } from "wagmi";

export default function Header() {
	const {isConnected} = useAccount();
	return (
		<>
			<h2>XPrint</h2>
			<div>
				{
					isConnected && <Space>
					<ConnectButton showBalance />
				</Space>
				}
				
			</div>
		</>
	)
}