import styled from '@emotion/styled';
import Layout from 'components/Layout';
import { useEffect, useState } from 'react';
import API from 'utils/api';
import { calcElapsed } from 'utils/format';

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
    margin-bottom: 0.1rem;
    border-radius: 0.8rem;
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

interface IAlarmData {
    checkout: boolean;
    created: string;
    type: string;
    whereBoard: number;
    whoIsUser: string;
    whoIsUserAvatarUrl: string;
    whoIsUserId: number;
}

interface IAlarmLikesBoard extends IAlarmData {
    bmCommentId: number;
    whoIsUsername: string;
    whoIsAvatarUrl: string;
}

interface IAlarmLikesComment extends IAlarmData {
    commentId: number;
    whoIsUsername: string;
    whoIsAvatarUrl: string;
}

interface IAlarmAddComment extends IAlarmData {
    cmCommentId: number;
    whoIsUsername: string;
    whoIsAvatarUrl: string;
}

const Alaram = () => {
    const [alarmData, setAlarmData] = useState<
        (IAlarmLikesBoard | IAlarmLikesComment | IAlarmAddComment)[]
    >([]);

    const fetchAlarmData = async () => {
        const res = await API.get('/alarm');
        setAlarmData(res);
    };
    useEffect(() => {
        fetchAlarmData();
    }, []);
    console.log(alarmData);

    const handleAlarmCheck = async (
        data: IAlarmLikesBoard | IAlarmLikesComment | IAlarmAddComment,
    ) => {
        console.log(data);
    };

    return (
        <Layout>
            {/* <Title>매칭 알림</Title> */}
            <Title>알림</Title>
            <Wrapper>
                {alarmData.length !== 0
                    ? alarmData.map((item, index) => {
                          if (item.type === 'likesBoard') {
                              return (
                                  <AlarmContainer>
                                      <AlarmWrapper
                                          key={index}
                                          onClick={() => handleAlarmCheck(item)}
                                      >
                                          <Profile src={item.whoIsUserAvatarUrl} />
                                          <AlarmText>
                                              {item.whoIsUser}님이 게시물에 좋아요를 눌렀습니다.
                                          </AlarmText>
                                          <AlarmDate>
                                              {calcElapsed(new Date(item.created))} 전
                                          </AlarmDate>
                                      </AlarmWrapper>
                                  </AlarmContainer>
                              );
                          } else if (item.type === 'likesComment') {
                              return (
                                  <AlarmContainer>
                                      <AlarmWrapper
                                          key={index}
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
                                  <AlarmContainer>
                                      <AlarmWrapper
                                          key={index}
                                          onClick={() => handleAlarmCheck(item)}
                                      >
                                          <Profile src={item.whoIsAvatarUrl} />
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
