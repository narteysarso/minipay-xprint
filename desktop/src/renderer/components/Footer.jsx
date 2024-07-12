
import { GithubOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import { Space } from 'antd';

export default function Footer() {
	return (
		<>
			<Space
				direction="horizontal"
			>
				<GithubOutlined />
				<TwitterOutlined />
				<MailOutlined />
			</Space>
			<p className="text-center text-base text-black">&copy; {new Date().getFullYear()} Developed with 🖤 at BWC by team XPrint.</p>
		</>
	)
}