import MainFooter from "./Footer";
import MainHeader from "./Header";
import { Layout as AntLayout, Menu, theme } from 'antd';
import SideMenu from "./SideMenu";
import { Outlet } from "react-router-dom";

const { Header, Content, Footer } = AntLayout;


const Layout = () => {
    return (
        <AntLayout theme="dark" style={{ minHeight: "100vh" }}>

            <Header style={{
                display: 'flex',
                justifyContent: "space-between",
                alignItems: 'center',
                color: "white"
            }}>
                <MainHeader />
            </Header>
            <AntLayout>
                <SideMenu />
                <AntLayout>
                    <Content className="py-16 max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8" style={{ height: "100%" }}>
                        <Outlet />

                    </Content>
                    <Footer>
                        <MainFooter />
                    </Footer>
                </AntLayout>
            </AntLayout>


        </AntLayout>
    );
};

export default Layout;
