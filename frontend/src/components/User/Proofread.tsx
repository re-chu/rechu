import React, { useEffect, useState } from 'react';
import { Card, List, Switch, Button, Divider, Badge } from 'antd';
import axios from 'axios';
import { off } from 'process';
import API from 'utils/api';

type Mock = {
    matchingId: string;
    step: string;
    menteeId: string;
    menteeName: string;
    menteeEmail: string;
};

let matchData: [];
const token = localStorage.getItem('accessToken');
let lengthReq = 0;
let lengthPro = 0;

export const Proofread = (props: any) => {
    const [test, setTest] = useState(false);
    const [res, setRes] = useState<Mock[]>([]);
    async function getProfile() {
        try {
            const token = localStorage.getItem('accessToken');

            const mocks = await axios.get(`${API.BASE_URL}/users/individuals`, {
                headers: { authorization: `Bearer ${token}` },
            });
            if (mocks.status === 200) {
                const dumyRes = await mocks.data;
                const realRes = await dumyRes.data;
                if (realRes.working === 1) {
                    setTest(true);
                } else {
                    setTest(false);
                }
            }
        } catch (e: any) {
            console.log(e);
        }
    }

    const getMentoReq = async () => {
        try {
            const res = await axios.get(`${API.BASE_URL}/users/req`, {
                headers: { authorization: `Bearer ${token}` },
            });
            const data = await res.data;
            matchData = await data.data;
            setRes(matchData);
        } catch (e) {
            console.log(e);
        }
    };

    const patchMatchSatus = async (e: any) => {
        const matchingid = e.currentTarget.id;
        const menteeid = e.currentTarget.value;
        try {
            const res = await axios.patch(
                `${API.BASE_URL}/users/match`,
                { matchingId: matchingid * 1, menteeId: menteeid * 1 },
                { headers: { authorization: `Bearer ${token}` } },
            );
            const chatPostRes = await axios.post(
                `${API.BASE_URL}/users/match`,
                { menteeId: menteeid * 1, mentoId: props.id, matchingId: matchingid * 1 },
                { headers: { authorization: `Bearer ${token}` } },
            );
            getMentoReq();
        } catch (e) {
            console.log(e);
        }
    };

    const deleteMatchData = async (e: any) => {
        const matchingid = e.currentTarget.id;
        try {
            const res = await axios.delete(`${API.BASE_URL}/users/match`, {
                data: { matchingId: matchingid },
                headers: { authorization: `Bearer ${token}` },
            });
            if (res.status === 200) getMentoReq();
        } catch (e) {
            console.log(e);
        }
    };

    const updateMatchData = async (e: any) => {
        const matchingid = e.currentTarget.id;
        try {
            const res = await axios.post(
                `${API.BASE_URL}/users/match/success`,
                { matchingId: matchingid * 1, role: 'mento' },
                { headers: { authorization: `Bearer ${token}` } },
            );
            if (res.status === 200) getMentoReq();
        } catch (e) {
            console.log(e);
        }
    };

    const toggleChange = async () => {
        setTest((test: boolean) => !test);
        try {
            const res = await axios.patch(
                `${API.BASE_URL}/users/individuals`,
                { working: !test },
                { headers: { authorization: `Bearer ${token}` } },
            );
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getProfile();
        getMentoReq();
    }, []);

    useEffect(() => {
        lengthReq = res.filter((e: any) => e.step === '요청중').length;
        lengthPro = res.filter((e: any) => e.step === '진행중').length;
    }, [res]);
    return (
        <div
            style={{
                marginLeft: '20px',
                marginRight: '20px',
                height: '80%',
                marginBottom: '20px',
            }}
        >
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row-reverse' }}>
                <Button onClick={toggleChange}>첨삭ON/OFF</Button>
                {test ? <Badge status="success" /> : <Badge status="error"></Badge>}
            </div>
            <Divider orientation="left" orientationMargin="0">
                <p style={{ fontWeight: 'bold' }}>
                    요청 ({res.filter((e: any) => e.step === '요청중').length})
                </p>
            </Divider>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3,
                }}
                dataSource={res}
                renderItem={(item: Mock) =>
                    item.step === '요청중' ? (
                        <List.Item style={{ background: 'white' }}>
                            <Card
                                style={{
                                    cursor: 'pointer',
                                    border: ' solid #dbdbdb',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                }}
                                title={item.menteeEmail}
                                extra={
                                    <div>
                                        <Button
                                            style={{ marginRight: '10px' }}
                                            onClick={patchMatchSatus}
                                            id={item.matchingId}
                                            value={item.menteeId}
                                        >
                                            수락하기
                                        </Button>

                                        <Button
                                            id={item.matchingId}
                                            value={item.menteeId}
                                            onClick={deleteMatchData}
                                        >
                                            취소
                                        </Button>
                                    </div>
                                }
                            >
                                {item.step}
                            </Card>
                        </List.Item>
                    ) : (
                        <List.Item style={{ background: 'white' }}></List.Item>
                    )
                }
            />
            <Divider orientation="left" orientationMargin="0">
                <p style={{ fontWeight: 'bold' }}>
                    진행중 ({(lengthPro = res.filter((e: any) => e.step === '진행중').length)})
                </p>
            </Divider>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3,
                }}
                dataSource={res.filter((e: any) => e.step === '진행중')}
                renderItem={(item: Mock) =>
                    item.step === '진행중' && (
                        <List.Item style={{ background: 'white' }}>
                            <Card
                                style={{
                                    cursor: 'pointer',
                                    border: ' solid #dbdbdb',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                }}
                                title={item.menteeEmail}
                                extra={
                                    <div>
                                        <Button
                                            id={item.matchingId}
                                            value={item.menteeId}
                                            onClick={updateMatchData}
                                        >
                                            완료
                                        </Button>
                                    </div>
                                }
                            >
                                {item.step}
                            </Card>
                        </List.Item>
                    )
                }
            />
        </div>
    );
};
