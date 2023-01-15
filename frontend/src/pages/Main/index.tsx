import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Layout from 'components/Layout';
import { calcElapsed } from 'utils/format';
import { Skeleton, Carousel, notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { LikeOutlined, CommentOutlined, RightOutlined } from '@ant-design/icons';
import API from 'utils/api';
import carousel01 from 'assets/images/001.png';
import carousel02 from 'assets/images/002.png';
import carousel03 from 'assets/images/003.png';
import carousel04 from 'assets/images/004.png';
import carousel05 from 'assets/images/005.png';
import randomGame from 'assets/images/random-game.png';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 10rem;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    font-size: 1.6rem;
`;

const Posts = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 2rem;
    grid-row-gap: 4rem;
    @media screen and (min-width: 580px) {
        grid-template-columns: 1fr 1fr;
    }
    @media screen and (min-width: 990px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
    @media screen and (min-width: 1280px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const Post = styled.div`
    display: flex;
    flex-direction: column;
    width: 20rem;
    height: 16rem;
    border-radius: 1rem;
    background-color: #fffbe3;
    border: 0.1rem solid #fffbe3;
    padding: 3rem;
    gap: 1rem;
    cursor: pointer;
    &:hover {
        border-color: #ccb94c;
    }
`;

const Title = styled.h2`
    width: 100%;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 2rem 0;
    :last-child {
        margin-top: 5rem;
    }
`;

const PostTitle = styled.h3`
    font-size: 1.8rem;
    font-weight: 600;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

const PostContents = styled.p`
    font-size: 1.8rem;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`;

const PostsProfile = styled.div`
    display: flex;
`;

const PostsProfileImg = styled.img`
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
`;

const PostsProfileInfoWrapper = styled.div`
    display: flex;
    margin-left: 1.5rem;
    flex-direction: column;
`;

const PostsCreated = styled.p`
    font-size: 1.4rem;
    margin-top: 0.6rem;
    color: #666;
`;

const PostsIconWrapper = styled.div`
    bottom: 0;
    display: flex;
    align-items: center;
`;

const PostsIcon = styled.span`
    width: 5rem;
    display: flex;
    justify-content: space-evenly;
`;

const QuestWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const QuestText = styled.p`
    font-size: 1.8rem;
    margin: 1rem 0;
`;

const Quest = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 20rem;
    border-radius: 1rem;
    font-size: 10rem;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid #e2e2e2;
    img {
        width: 100%;
        height: 100%;
    }
    :hover {
        border: 1px solid #e2e2e2;
        transform: scale(1.05);
        transition: scale 0.4s;
    }
    h3 {
        font-size: 4rem;
    }
`;

const CarouselWrapper = styled.div`
    @media screen and (max-width: 580px) {
        display: none;
    }
`;

interface IBoardList {
    commentCount: number;
    createdAt: Date;
    hasResume: number;
    likeCount: number;
    postDescription: string;
    postId: number;
    postTitle: string;
    userId: number;
    userProfileSrc: string;
    username: string;
}

const SkeletonPosts = () => {
    return (
        <>
            <Post>
                <Skeleton active />
            </Post>
            <Post>
                <Skeleton active />
            </Post>
            <Post>
                <Skeleton active />
            </Post>
            <Post>
                <Skeleton active />
            </Post>
        </>
    );
};

interface IQuestData {
    boardId: number;
    chance: number;
}

const Main = () => {
    const [latestBoardList, setLatestBoardList] = useState<IBoardList[]>([]);
    const [hotLikesBoardList, setHotLikesBoardList] = useState<IBoardList[]>([]);
    const [hotCommentBoardList, setHotCommentBoardList] = useState<IBoardList[]>([]);
    const [questData, setQuestData] = useState<IQuestData | null>(null);
    const navigate = useNavigate();

    const fetchLatestBoard = async () => {
        try {
            const res = await API.get('/board', '?filter=created&perPage=4');
            setLatestBoardList(res.boardList);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHotLikesBoard = async () => {
        try {
            const res = await API.get('/board', '?filter=likeCnt&perPage=4');
            setHotLikesBoardList(res.boardList);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHotCommentBoard = async () => {
        try {
            const res = await API.get('/board', '?filter=commentCnt&perPage=4');
            setHotCommentBoardList(res.boardList);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchQuestData = async () => {
        try {
            const res = await API.get('/board/random');
            setQuestData(res);
        } catch (err) {
            console.log(err);
        }
    };

    const handleQuestClick = async () => {
        if (questData?.chance === 0) {
            openNotification(
                'bottomRight',
                `금일 잔여 횟수를 모두 소진했습니다. 내일 다시 시도해주세요.`,
            );
            return;
        }
        try {
            await API.get('/users/point');
            fetchQuestData();
        } catch (err) {
            console.log(err);
        }
        navigate(`/post/${questData?.boardId}`);
    };

    useEffect(() => {
        fetchLatestBoard();
        fetchHotLikesBoard();
        fetchHotCommentBoard();
        fetchQuestData();
    }, []);

    const onChange = (currentSlide: number) => {};

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement: NotificationPlacement, message: string) => {
        api.info({
            message: message,
            placement,
        });
    };

    return (
        <Layout>
            {contextHolder}
            <CarouselWrapper>
                <Carousel autoplay afterChange={onChange}>
                    <div>
                        <img src={carousel01} alt="carousel" />
                    </div>
                    <div>
                        <img src={carousel02} alt="carousel" />
                    </div>
                    <div>
                        <img src={carousel03} alt="carousel" />
                    </div>
                    <div>
                        <img src={carousel04} alt="carousel" />
                    </div>
                    <div>
                        <img src={carousel05} alt="carousel" />
                    </div>
                </Carousel>
            </CarouselWrapper>
            <Container>
                <Wrapper>
                    <Title>최근 등록된 게시물</Title>
                    <Posts>
                        {latestBoardList.length === 0 ? (
                            <SkeletonPosts />
                        ) : (
                            latestBoardList.map((item, index) => (
                                <Post key={index} onClick={() => navigate(`/post/${item.postId}`)}>
                                    <PostTitle>{item.postTitle}</PostTitle>
                                    <PostContents>{item.postDescription}</PostContents>
                                    <PostsProfile>
                                        <PostsProfileImg src={item.userProfileSrc} />
                                        <PostsProfileInfoWrapper>
                                            <p>{item.username}</p>
                                            <PostsCreated>
                                                {calcElapsed(item.createdAt)} 전
                                            </PostsCreated>
                                        </PostsProfileInfoWrapper>
                                    </PostsProfile>
                                    <PostsIconWrapper>
                                        <PostsIcon>
                                            <LikeOutlined />
                                            {item.likeCount}
                                        </PostsIcon>
                                        <PostsIcon>
                                            <CommentOutlined />
                                            {item.commentCount}
                                        </PostsIcon>
                                    </PostsIconWrapper>
                                </Post>
                            ))
                        )}
                    </Posts>

                    <Title>인기 게시물</Title>
                    <Posts>
                        {hotLikesBoardList.length === 0 ? (
                            <SkeletonPosts />
                        ) : (
                            hotLikesBoardList.map((item, index) => (
                                <Post key={index} onClick={() => navigate(`/post/${item.postId}`)}>
                                    <PostTitle>{item.postTitle}</PostTitle>
                                    <PostContents>{item.postDescription}</PostContents>
                                    <PostsProfile>
                                        <PostsProfileImg src={item.userProfileSrc} />
                                        <PostsProfileInfoWrapper>
                                            <p>{item.username}</p>
                                            <PostsCreated>
                                                {calcElapsed(item.createdAt)} 전
                                            </PostsCreated>
                                        </PostsProfileInfoWrapper>
                                    </PostsProfile>
                                    <PostsIconWrapper>
                                        <PostsIcon>
                                            <LikeOutlined />
                                            {item.likeCount}
                                        </PostsIcon>
                                        <PostsIcon>
                                            <CommentOutlined />
                                            {item.commentCount}
                                        </PostsIcon>
                                    </PostsIconWrapper>
                                </Post>
                            ))
                        )}
                    </Posts>

                    <Title>가장 토론이 활발한 게시물</Title>
                    <Posts>
                        {hotCommentBoardList.length === 0 ? (
                            <SkeletonPosts />
                        ) : (
                            hotCommentBoardList.map((item, index) => (
                                <Post key={index} onClick={() => navigate(`/post/${item.postId}`)}>
                                    <PostTitle>{item.postTitle}</PostTitle>
                                    <PostContents>{item.postDescription}</PostContents>
                                    <PostsProfile>
                                        <PostsProfileImg src={item.userProfileSrc} />
                                        <PostsProfileInfoWrapper>
                                            <p>{item.username}</p>
                                            <PostsCreated>
                                                {calcElapsed(item.createdAt)} 전
                                            </PostsCreated>
                                        </PostsProfileInfoWrapper>
                                    </PostsProfile>
                                    <PostsIconWrapper>
                                        <PostsIcon>
                                            <LikeOutlined />
                                            {item.likeCount}
                                        </PostsIcon>
                                        <PostsIcon>
                                            <CommentOutlined />
                                            {item.commentCount}
                                        </PostsIcon>
                                    </PostsIconWrapper>
                                </Post>
                            ))
                        )}
                    </Posts>

                    <Title>일일 퀘스트</Title>
                    <QuestWrapper>
                        <QuestText>{`오늘 잔여 횟수 : ${
                            questData === null ? '' : questData?.chance
                        }`}</QuestText>
                        <Quest onClick={handleQuestClick}>
                            <img src={randomGame} alt="img" />
                        </Quest>
                    </QuestWrapper>
                </Wrapper>
            </Container>
        </Layout>
    );
};

export default Main;
