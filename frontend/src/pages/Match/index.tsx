import React, { useState, useEffect } from 'react';
import { Col, Row, Slider, Modal, List, Alert, Avatar } from 'antd';
import axios from 'axios';
import { Title, MobileDiv } from './style';
import './style.css';
import API from 'utils/api';
import Header from 'components/Header';
import { Outlet } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Layout from 'components/Layout';
import socket from 'services/socket';
interface myData {
    avatarUrl: string;
    chance: number;
    clickedLikes: 1;
    created: string;
    email: string;
    gitHubUrl: string;
    howToLogin: string;
    id: number;
    matching: number;
    phoneNumber: string;
    point: number;
    role: string;
    username: string;
    working: number;
    tier: string;
    tierColor: string;
}
const tierColors = {
    bronze: '#964b00',
    silver: '#c0c0c0',
    gold: '#ffbd1b',
    platinum: '#005666',
    diamond: '#00a3d2',
    challenger: '#dc143c',
};
const arr = [40, 60, 200, 1000, 10000];
let upperLimit = arr[0];
let lowerLimit = 0;
let tier = 'Bronze';
let tierColor = tierColors.bronze;
let point = 0;
const Match = () => {
    const [modalIdContent, setModalIdContent] = useState<number | string>();
    const [modalAvatarUrl, setModalAvatarUrl] = useState<number | string>();
    const [modalUserNameContent, setModalUserNameContent] = useState<number | string>('');
    const [modalPointContent, setModalPointContent] = useState<number | string>();
    const [modalEmail, setModalEmail] = useState<number | string>();
    const [modalTier, setModalTier] = useState<number | string>();
    const [modalGitHubUrl, setModalGitHubUrl] = useState<number | string | undefined>();
    const [data, setData] = useState<myData[]>([]);
    const [myData, setMyData] = useState<myData>();
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    async function getMatching() {
        try {
            const res = await API.get(`/users/rots`);
            console.log('res', res);
            if (res.matchInfo) {
                navigate('/matched');
            } else {
                setData(res);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function postMatching() {
        try {
            const rotId = modalIdContent;
            console.log(rotId);
            const res = await API.post(`/users/match`, { rotId });
            console.log(res);
            socket.emit('matchRequestToMento', rotId);
            getMatching();
            setModalOpen(false);
        } catch (e) {
            console.log(e);
        }
    }

    async function getMyData() {
        try {
            const res = await API.get(`/users/individuals`);
            console.log(res);
            setMyData(res);
            getPoint(res);
        } catch (e) {
            console.log(e);
        }
    }

    async function getPoint(res: myData) {
        console.log(res);
        if (res.point <= 49) {
            alert(`포인트가 50 이상 필요합니다.(내 포인트 : ${res.point} point)`);
            navigate('/');
        } else {
            point = res.point;

            getMatching();
        }
    }

    useEffect(() => {
        getMyData();
    }, []);

    const onClickModal = async (data: any) => {
        const id = data.id;
        const userName = data.username;
        const point = data.point;
        const email = data.email;
        const gitHubUrl = data.gitHubUrl;
        const avatarUrl = data.avatarUrl;
        const tier = data.tier;

        setModalGitHubUrl(gitHubUrl);
        setModalEmail(email);
        setModalIdContent(id);
        setModalUserNameContent(userName);
        setModalPointContent(point);
        setModalAvatarUrl(avatarUrl);
        setModalAvatarUrl(tier);
        setModalOpen(true);
    };

    const tierCreate = (point: any): void => {
        arr.map((e: number, idx: number): void => {
            if (e <= point) {
                upperLimit = arr[idx + 1];
                if (upperLimit === 60) {
                    tier = 'Silver';
                    tierColor = tierColors.silver;
                } else if (upperLimit === 200) {
                    tier = 'Gold';
                    tierColor = tierColors.gold;
                } else if (upperLimit === 1000) {
                    tier = 'Platinum';
                    tierColor = tierColors.platinum;
                } else if (upperLimit === 10000) {
                    tier = 'Diamond';
                    tierColor = tierColors.diamond;
                } else if (point >= 10000) {
                    tier = 'Challenger';
                    tierColor = tierColors.challenger;
                }
                if (upperLimit === arr[0]) {
                    lowerLimit = 0;
                } else {
                    if (point >= 10000) {
                        lowerLimit = 10000;
                        upperLimit = 10000;
                    } else {
                        lowerLimit = arr[idx];
                    }
                }
            }
        });
    };
    data.map((e: any, idx: number) => {
        tierCreate(e.point);
        data[idx].tier = tier;
        data[idx].tierColor = tierColor;
    });
    console.log(point);
    console.log(upperLimit, lowerLimit);
    return (
        <Layout>
            <Title className="title">
                <h1>이력서 첨삭 매칭</h1>
                <button onClick={getMyData}>🔄refresh</button>
            </Title>
            <MobileDiv>
                <Row gutter={[0, 0]}>
                    {data.map((data: any) => (
                        <Col span={12} key={data.id} className="col">
                            <div className="div" onClick={() => onClickModal(data)}>
                                <div>
                                    <h3>{data.username}</h3>
                                    <p>
                                        <strong>등급 : </strong>
                                        {data.tier}
                                    </p>
                                    <p>
                                        <strong>이메일 : </strong>
                                        {data.email}
                                    </p>
                                </div>
                                {/* <div>
                                    <img src={data.avatarUrl}></img>
                                </div> */}
                            </div>
                        </Col>
                    ))}
                    <Outlet />
                    <Modal
                        title={
                            <h1>
                                {modalUserNameContent}({modalIdContent})
                            </h1>
                        }
                        centered
                        cancelText="싫어요"
                        okText={`부탁할래요(50point)`}
                        open={modalOpen}
                        onOk={() => postMatching()}
                        onCancel={() => setModalOpen(false)}
                    >
                        <hr />
                        <p>
                            <strong>{modalUserNameContent}</strong>님께 이력서 첨삭 부탁하기
                        </p>
                        <p>
                            <strong>등급 :</strong> {tier}
                        </p>
                        <p>
                            <strong>이메일 :</strong> {modalEmail}
                        </p>
                        <p>
                            <strong>URL : </strong>
                            {modalGitHubUrl}
                        </p>
                    </Modal>
                </Row>
            </MobileDiv>
        </Layout>
    );
};

export default Match;
