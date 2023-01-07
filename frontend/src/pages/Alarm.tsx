import styled from '@emotion/styled';
import Layout from 'components/Layout';
import { useEffect, useState } from 'react';
import API from 'utils/api';
import { calcElapsed } from 'utils/format';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 2.4rem;
    margin-bottom: 5rem;
`;
const AlarmContainer = styled.div`
    display: flex;
    width: 100%;
`;

const AlarmWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    height: 7rem;
    color: rgba(0, 0, 0, 0.88);
    background-color: #ffffff;
    background-image: none;
    border: 1px solid #d9d9d9;
    transition: all 0.2s;
    cursor: pointer;
    :hover {
        background-color: yellowgreen;
    }
`;

const Profile = styled.img`
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
`;

const AlarmText = styled.p`
    font-size: 1.8rem;
`;

const AlarmDate = styled.p`
    font-size: 1.8rem;
    color: #666;
    @media screen and (max-width: 780px) {
        display: none;
    }
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
}

interface IAlarmBoardsLikes extends IAlarmData {
    whoIsUserAvatarUrl: string;
}

interface IAlarmCommentsLikes extends IAlarmData {
    commentId: number;
    whoIsAvatarUrl: string;
}

interface IAlarmNewComments extends IAlarmData {
    commentId: number;
    whoIsAvatarUrl: string;
}

const Alaram = () => {
    const navigate = useNavigate();
    const [alarmData, setAlarmData] = useState<
        (IAlarmBoardsLikes | IAlarmCommentsLikes | IAlarmNewComments)[]
    >([]);

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

    const handleAlarmCheck = async (
        data: IAlarmBoardsLikes | IAlarmCommentsLikes | IAlarmNewComments,
    ) => {
        navigate(`/post/${data.whereBoard}`);
    };

    return (
        <Layout>
            {matchAlarmData.length !== 0 && (
                <Wrapper>
                    <Title>매칭 알림</Title>
                </Wrapper>
            )}
            <Title>알림</Title>
            <Wrapper>
                {alarmData.length !== 0
                    ? alarmData.map((item, index) => {
                          if (item.type === 'likesBoard') {
                              return (
                                  <AlarmContainer key={index}>
                                      <AlarmWrapper onClick={() => handleAlarmCheck(item)}>
                                          <Profile src={''} />
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
                                      <AlarmWrapper onClick={() => handleAlarmCheck(item)}>
                                          <Profile src={''} />
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
                                      <AlarmWrapper onClick={() => handleAlarmCheck(item)}>
                                          <Profile src={''} />
                                          <AlarmText>
                                              {item.whoIsUsername}님이 게시물에 댓글을 작성했습니다.
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
