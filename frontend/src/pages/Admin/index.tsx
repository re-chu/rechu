import React, { useState } from 'react';
import { UserOutlined, BookOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Admin: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div
                    style={{
                        height: '32px',
                        margin: '16px',
                        // background: 'rgba(255, 255, 255, 0.3)',
                        padding: '10px',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}
                    className="logo"
                >
                    관리자 페이지
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    // defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: <Link to="/admin/user">회원관리</Link>,
                        },
                        {
                            key: '2',
                            icon: <BookOutlined />,
                            label: <Link to="/admin/content">회원신고관리</Link>,
                        },
                        {
                            key: '3',
                            icon: <HomeOutlined />,
                            label: <Link to="/">Main </Link>,
                        },
                    ]}
                />
            </Sider>
            <Layout className="site-layout">
                {/* <Header style={{ padding: 0, background: colorBgContainer }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                </Header> */}
                <Outlet />
            </Layout>
        </Layout>
    );
};

export default Admin;
