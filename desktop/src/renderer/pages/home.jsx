import React, { useEffect, useState } from "react";
import { Button, Col, Empty, Row, Space, Typography } from "antd";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import WalletButton from "../components/WalletButton";


const contentStyle = {
	display: "flex",
	flex: 1,
	justifyContent: "center",
	alignItem: "center",
	width: '100%',
	height: '100%',
	backgroundImage: 'radial-gradient(circle, rgba(80,34,97,1) 23%, rgba(17,24,39,1) 57%)',
	backgroundSize: '2000px 1500px',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'top'
}

export default function Home() {

	const [printers, setPrinters] = useState();
	const { isConnected } = useAccount();

	useEffect(() => {
		if (window.electron.ipcRenderer) {
			window.electron.ipcRenderer.sendMessage("get_printers");
			window.electron.ipcRenderer.on("printers_list", (event, { printers }) => {
				setPrinters(printers.map((printer) => printer.name));
			});
		}
	});
	return (
		<Row style={{width: "100%", height: "100%" }}>
			<Col span={24}>
				<div className="dasboard-home" style={contentStyle}>
					<Empty
						style={{ alignSelf: "center", alignItems: "center", display: "flex", flexDirection: "column", height: "100vh", width: "100vw"}}
						image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
						imageStyle={{ height: 60 }}
						description={

							<Typography.Title level={1} style={{ color: "whitesmoke" }}>Welcome to XPrint</Typography.Title>

						}
					>
						{
							isConnected ? <Space>
								<Button  href="/dashboard/jobs">Get to Dashboard</Button>
								<Typography.Text style={{color: "whitesmoke"}}> || </Typography.Text> 
								<Button  href="/dashboard/settings">Configure your printer</Button>

							</Space>
								: <WalletButton />
						}


					</Empty>
				</div>
			</Col>
		</Row>
	)
}
