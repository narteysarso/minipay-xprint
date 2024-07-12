import { UserOutlined, SettingOutlined, ContainerOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
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
				<Menu.Item>
						<a href={"/dashboard/jobs"}><UserOutlined /> Dashboard</a>
				</Menu.Item>
				{
					isConnected && <>
						<Menu.Item key={"1"}>
								<a href={"/dashboard/jobs"}><ContainerOutlined /> Jobs</a>
							
						</Menu.Item>
						<Menu.Item key={"2"}>
								<a href={"/dashboard/settings"}><SettingOutlined /> Settings</a>
						</Menu.Item>
					</>
				}

			</Menu>
		</Sider>
	)
}

export default SideMenu