import React, { useEffect, useState } from "react";
import { Button, Col, Empty, Row, Space, Typography } from "antd";
import { ipcRenderer } from "electron";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

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
	const { isConnected, address} = useAccount();

	useEffect(() => {
		if (ipcRenderer) {
			ipcRenderer.send("get_printers");
			ipcRenderer.on("printers_list", (event, { printers }) => {
				setPrinters(printers.map((printer) => printer.name));
			});
		}
	});
	return (
		<Row style={{ padding: "5vh 3vh", width: "100%", height: "100%" }}>
			<Col span={24}>
				<div className="dasboard-home" style={contentStyle}>
					<Empty
						style={{ alignSelf: "center", alignItems: "center", display: "flex", flexDirection: "column" }}
						image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
						imageStyle={{ height: 60 }}
						description={

							<Typography.Title level={1} style={{ color: "whitesmoke" }}>Welcome XPrint</Typography.Title>

						}
					>
						{
							isConnected ? <Space>
								<Link href={"/jobs"}><Button type="primary">Get Started</Button></Link>
								<Typography.Text style={{color: "whitesmoke"}}> || </Typography.Text> 
								<Link href={"/settings"}><Button type="default">Configure your printer</Button></Link>

							</Space>
								: <ConnectButton />
						}


					</Empty>
				</div>
			</Col>
		</Row>
	)
}
