import styled from '@emotion/styled';
import Layout from 'components/Layout';
import { useEffect, useState } from 'react';
import API from 'utils/api';
import { calcElapsed } from 'utils/format';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import socket from 'services/socket';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 2.4rem;
    margin-bottom: 2rem;
`;

const AlarmContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const MatchingAlarmContainer = styled(AlarmContainer)`
    margin-bottom: 5rem;
`;

const AlarmWrapper = styled.div<{ isChecked: number }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 7rem;
    color: rgba(0, 0, 0, 0.88);
    background-image: none;
    background-color: ${({ isChecked }) => (isChecked === 1 ? '#ffffff' : '#fffbe3')};
    border: 1px solid #d9d9d9;
    transition: all 0.2s;
    cursor: pointer;
    :hover {
        background-color: #fff09e;
    }
`;

const MatchingAlarmWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 7rem;
    color: rgba(0, 0, 0, 0.88);
    background-image: none;
    background-color: #fffbe3;
    border: 1px solid #d9d9d9;
    transition: all 0.2s;
    :hover {
        background-color: #fff09e;
    }
`;

const Profile = styled.img`
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    margin-left: 5rem;
`;

const AlarmText = styled.p`
    font-size: 1.8rem;
    margin: auto 0;
    @media screen and (max-width: 780px) {
        margin-right: 5rem;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
`;

const AlarmDate = styled.p`
    font-size: 1.8rem;
    color: #666;
    margin-right: 3rem;
    @media screen and (max-width: 780px) {
        display: none;
    }
`;

const RightWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 2rem 0;
    margin-right: 3rem;
`;

interface IMatchAlarmData {
    matchingId: number;
    step: string;
    menteeId: number;
    menteeName: string;
    menteeEmail: string;
    created: Date;
}

interface IAlarmData {
    type: string;
    whoIsUserId: number;
    whoIsUsername: string;
    whereBoard: number;
    created: Date;
    checkout: number;
    whoIsUserAvatarUrl: string;
}

interface IAlarmComments extends IAlarmData {
    commentId: number;
}

const Alaram = () => {
    const navigate = useNavigate();
    const [alarmData, setAlarmData] = useState<(IAlarmData | IAlarmComments)[]>([]);

    const [matchAlarmData, setMatchAlarmData] = useState<IMatchAlarmData[]>([]);

    const fetchAlarmData = async () => {
        const res = await API.get('/alarm');
        console.log(res);
        setAlarmData(res.alarmData);
        setMatchAlarmData(res.matchRequests);
    };

    useEffect(() => {
        fetchAlarmData();
    }, []);

    const handleAlarmCheck = async (data: IAlarmData | IAlarmComments) => {
        navigate(`/post/${data.whereBoard}`);
    };

    const handleAcceptMatch = async (item: IMatchAlarmData) => {
        try {
            const data = {
                matchingId: item.matchingId,
                menteeId: item.menteeId,
            };
            await API.patch('/users/match', '', data);
            socket.emit('matchRequestToMentee', item.menteeId);
            fetchAlarmData();
        } catch (err) {
            console.log(err);
        }
    };

    const handleRefuseMatch = async (item: IMatchAlarmData) => {
        try {
            const data = {
                matchingId: item.matchingId,
            };
            await API.delete('/users/match', '', { matchingId: item.matchingId });
            fetchAlarmData();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Layout>
            {matchAlarmData.length !== 0 && (
                <>
                    <Title>매칭 요청</Title>
                    {matchAlarmData.map((item, index) => (
                        <MatchingAlarmContainer key={index}>
                            <MatchingAlarmWrapper>
                                <Profile src={''} />
                                <AlarmText>
                                    {item.menteeName}님이 이력서 첨삭 요청을 하셨습니다.
                                </AlarmText>
                                <RightWrapper>
                                    <AlarmDate>{calcElapsed(new Date(item.created))} 전</AlarmDate>
                                    <Button type="primary" onClick={() => handleAcceptMatch(item)}>
                                        수락
                                    </Button>
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={() => handleRefuseMatch(item)}
                                    >
                                        거절
                                    </Button>
                                </RightWrapper>
                            </MatchingAlarmWrapper>
                        </MatchingAlarmContainer>
                    ))}
                </>
            )}
            <Title>알림</Title>
            <Wrapper>
                {alarmData.length !== 0
                    ? alarmData.map((item, index) => {
                          if (item.type === 'likesBoard') {
                              return (
                                  <AlarmContainer key={index}>
                                      <AlarmWrapper
                                          isChecked={item.checkout}
                                          onClick={() => handleAlarmCheck(item)}
                                      >
                                          <Profile src={item.whoIsUserAvatarUrl} />
                                          <AlarmText>
                                              {item.whoIsUsername}님이 게시물에 좋아요를 눌렀습니다.
                                          </AlarmText>
                                          <AlarmDate>
                                              {calcElapsed(new Date(item.created))} 전
                                          </AlarmDate>
                                      </AlarmWrapper>
                                  </AlarmContainer>
                              );
                          } else if (item.type === 'likesComment') {
                              return (
                                  <AlarmContainer key={index}>
                                      <AlarmWrapper
                                          isChecked={item.checkout}
                                          onClick={() => handleAlarmCheck(item)}
                                      >
                                          <Profile src={item.whoIsUserAvatarUrl} />
                                          <AlarmText>
                                              {item.whoIsUsername}님이 댓글에 좋아요를 눌렀습니다.
                                          </AlarmText>
                                          <AlarmDate>
                                              {calcElapsed(new Date(item.created))} 전
                                          </AlarmDate>
                                      </AlarmWrapper>
                                  </AlarmContainer>
                              );
                          } else if (item.type === 'addComment') {
                              return (
                                  <AlarmContainer key={index}>
                                      <AlarmWrapper
                                          isChecked={item.checkout}
                                          onClick={() => handleAlarmCheck(item)}
                                      >
                                          <Profile src={item.whoIsUserAvatarUrl} />
                                          <AlarmText>
                                              {item.whoIsUsername}님이 게시물에 댓글을 작성했습니다.
                                          </AlarmText>
                                          <AlarmDate>
                                              {calcElapsed(new Date(item.created))} 전
                                          </AlarmDate>
                                      </AlarmWrapper>
                                  </AlarmContainer>
                              );
                          } else if (item.type === 'acceptMatch') {
                              return (
                                  <AlarmContainer key={index}>
                                      <AlarmWrapper
                                          isChecked={item.checkout}
                                          onClick={() => handleAlarmCheck(item)}
                                      >
                                          <Profile src={item.whoIsUserAvatarUrl} />
                                          <AlarmText>
                                              {item.whoIsUsername}님이 매칭을 수락했습니다.
                                          </AlarmText>
                                          <AlarmDate>
                                              {calcElapsed(new Date(item.created))} 전
                                          </AlarmDate>
                                      </AlarmWrapper>
                                  </AlarmContainer>
                              );
                          }

                          return null;
                      })
                    : ''}
            </Wrapper>
        </Layout>
    );
};

export default Alaram;
