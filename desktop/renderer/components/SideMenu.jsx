import { UserOutlined, SettingOutlined, ContainerOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Link from "next/link";
import { useAccount } from "wagmi";
const { Sider } = Layout;

const SideMenu = () => {

	const { isConnected } = useAccount();
	return (
		<Sider width={200} >
			<Menu
				mode="inline"
				defaultSelectedKeys={['0']}
				style={{ height: '100%', borderRight: 0, paddingTop: "6vh" }}
			>
				<Menu.Item  key={0}>
					<Link href={"/home"} key={"0"}>
						<a><UserOutlined /> Dashboard</a>
					</Link>
				</Menu.Item>
				{
					isConnected && <>
						<Menu.Item key={"1"}>
							<Link href={"/jobs"}>
								<a><ContainerOutlined /> Jobs</a>
							</Link>
						</Menu.Item>
						<Menu.Item key={"2"}>
							<Link href={"/settings"}>
								<a><SettingOutlined /> Settings</a>
							</Link>
						</Menu.Item>
					</>
				}

			</Menu>
		</Sider>
	)
}

export default SideMenu