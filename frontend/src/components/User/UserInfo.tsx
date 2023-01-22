import React, { useState } from 'react';
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import { Descriptions, Tag, Col, Row, Button, Badge } from 'antd';
import { PswChangeModal } from './PswChangeModal';
import GitHubModal from './GitHubModal';
import { UserDelete } from './UserDelete';
import axios from 'axios';
import API from 'utils/api';

type Mock = {
    email: string;
    phoneNumber: string;
    point: number;
    username: string;
    gitHubUrl: string;
    tierColor: string;
};

type UserProps = {
    user: Mock;
    getEvent: Function;
    data:any
};

const anytype: any = null;
const token = localStorage.getItem('accessToken');

export const UserInfo = ({ user, getEvent,data }: UserProps) => {
    let { username, phoneNumber, email, gitHubUrl, tierColor, point } = user;
    const [propsOpen, setPropsOpen] = useState(false);
    const changeOpen = () => {
        setPropsOpen(prev => !prev);
    };
    // const dataSet=data.data
    // console.log('여기는 유저인포:',dataSet)
    const updateGitURL = (gitURl: any) => {
        gitHubUrl = gitURl;
        try {
            const res = axios.patch(
                `${API.BASE_URL}/users/individuals`,
                { gitHubUrl: `${gitURl}` },
                {
                    headers: { authorization: `Bearer ${token}` },
                },
            );
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <div
                style={{
                    marginLeft: '20px',
                    marginRight: '20px',
                    height: '80%',
                    marginBottom: '20px',
                }}
            >
                {' '}
                <UserOutlined></UserOutlined>
                <Descriptions title="User Info" size="middle" bordered={true}>
                    <Descriptions.Item
                        label="UserName"
                        contentStyle={{ fontWeight: '500', fontSize: '1.5rem' }}
                        labelStyle={{ fontWeight: '600', fontSize: '1.5rem' }}
                    >
                        {username}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="Telephone"
                        contentStyle={{ fontWeight: '500', fontSize: '1.5rem' }}
                        labelStyle={{ fontWeight: '600', fontSize: '1.5rem' }}
                    >
                        {phoneNumber
                            .replace(/[^0-9]/g, '')
                            .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="email"
                        contentStyle={{ fontWeight: '500', fontSize: '1.5rem' }}
                        labelStyle={{ fontWeight: '600', fontSize: '1.5rem' }}
                    >
                        {email}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="gitHub"
                        contentStyle={{ fontWeight: '500', fontSize: '1.5rem' }}
                        labelStyle={{ fontWeight: '600', fontSize: '1.5rem' }}
                    >
                        <Tag
                            icon={<GithubOutlined />}
                            color="black"
                            style={{ marginLeft: '12px', marginRight: '12px' }}
                        >
                            <a
                                href={gitHubUrl}
                                onClick={() => {
                                    if (gitHubUrl === null) setPropsOpen(true);
                                }}
                            >
                                Github
                            </a>
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="gitHub Url 수정"
                        contentStyle={{ fontWeight: '500', fontSize: '1.5rem' }}
                        labelStyle={{ fontWeight: '600', fontSize: '1.5rem' }}
                    >
                        <Button
                            icon={<GithubOutlined />}
                            type="primary"
                            style={{ backgroundColor: 'black' }}
                            onClick={() => {
                                setPropsOpen(true);
                            }}
                        >
                            GitHub Url 변경
                        </Button>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="비밀번호 변경"
                        contentStyle={{ fontWeight: '500', fontSize: '1.5rem' }}
                        labelStyle={{ fontWeight: '600', fontSize: '1.5rem' }}
                    >
                        <PswChangeModal></PswChangeModal>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="회원탈퇴"
                        contentStyle={{ fontWeight: '500', fontSize: '1.5rem' }}
                        labelStyle={{ fontWeight: '600', fontSize: '1.5rem' }}
                    >
                        <UserDelete></UserDelete>
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="point"
                        contentStyle={{
                            fontWeight: '500',
                            fontSize: '1.5rem',
                            color: `${tierColor}`,
                        }}
                        labelStyle={{ fontWeight: '600', fontSize: '1.5rem' }}
                    >
                        {point}P
                    </Descriptions.Item>
                </Descriptions>
            </div>

            <Row
                style={{
                    marginTop: '20%',
                    marginLeft: '12px',
                    marginRight: '12px',
                    height: '120px',
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                }}
            >
                <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}></Col>
                <Col xs={{ span: 11, offset: 1 }} lg={{ span: 6, offset: 2 }}></Col>
            </Row>

            <GitHubModal
                open={propsOpen}
                changeOpen={changeOpen}
                updateGitURL={updateGitURL}
                getEvent={getEvent}
            ></GitHubModal>
        </>
    );
};
