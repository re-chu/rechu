import styled from '@emotion/styled';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { Button, Input, Switch, Typography, notification, Modal, Radio, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import API from 'utils/api';
import Layout from 'components/Layout';

const { Title } = Typography;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 1.6rem;
`;

const WrapperHeader = styled.div`
    display: flex;
    align-items: center;
`;

const WrapperTitle = styled.p`
    font-size: 2rem;
    font-weight: 600;
`;

const ToggleDiv = styled.div`
    width: 120px;
    margin-left: 20px;
    height: 100%;
`;

const ButtonDiv = styled.div`
    display: flex;
    justify-content: space-around;
    width: 13rem;
    margin-top: 2rem;
`;

const ResumeSelectUI = styled.div`
    width: 100%;
    padding: 2rem;
`;

interface RouteState {
    state: IBoardInfo;
}

interface IBoardInfo {
    content: string;
    hashTags: string;
    title: string;
}

interface IResumeInfo {
    intro: string;
    position: string;
    resumeId: number;
    resumeName: string;
    updatedAt: Date;
    userId: number;
}

function PostCreate() {
    const navigate = useNavigate();

    // undefined: 게시물 생성, postId: 해당 게시물 수정
    const { postId } = useParams<{ postId: string }>();
    const { state } = useLocation() as RouteState;

    // 마크다운 에디터 객체
    const editorRef = useRef<Editor>(null);
    // 이력서 첨부 여부 상태
    const [isResume, setIsResume] = useState<boolean>(false);
    // 이력서 목록
    const [resumeList, setResumeList] = useState<IResumeInfo[]>([]);
    const [resume, setResume] = useState<number>(0);

    // 폼 입력 데이터
    const [form, setForm] = useState({
        title: '',
    });
    const { title } = form;

    // 폼 제출 시 에러 발생한 항목에 에러 메세지 출력을 위한 상태값
    const [error, setError] = useState({
        resume: false,
        title: false,
        content: false,
    });

    const [modalOpen, setModalOpen] = useState(false);

    const onToggleButton = async () => {
        if (isResume === false) {
            // 이력서 리스트 로딩
            try {
                const res = await API.get('/my-portfolio/resumes');
                console.log(res);
                setResumeList(res);
                //my-portfolio/resumes
            } catch (err) {
                openNotification('bottomRight', `이력서를 불러오는데 실패했습니다: ${err}`);
            }
        }
        setIsResume(prev => !prev);
    };

    // 이력서 선택
    const handleResumeSelect = (e: RadioChangeEvent) => {
        setResume(e.target.value);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement: NotificationPlacement, message: string) => {
        api.info({
            message: message,
            placement,
        });
    };

    const handleSubmit = async () => {
        // 게시물 작성 폼 유효성 검사
        // 이력서 on 인데 이력서를 선택하지 않았을 경우
        if (isResume === true && resume === 0) {
            // 이력서 선택 여부 추가 필요
            setError({
                ...error,
                resume: true,
            });
            setModalOpen(false);
            openNotification('bottomRight', '이력서를 선택해주세요.');
            return;
        }
        // 제목 입력 여부 판별
        if (form.title === '') {
            setError({
                ...error,
                title: true,
            });
            setModalOpen(false);
            openNotification('bottomRight', '제목을 입력해주세요.');
            return;
        }
        // 게시물 내용 입력 여부 판별
        const content = editorRef.current?.getInstance().getMarkdown();
        if (content === '') {
            setError({
                ...error,
                content: true,
            });
            // 에디터 포커스
            editorRef.current?.getInstance().focus();
            setModalOpen(false);
            openNotification('bottomRight', '게시물 내용을 입력해주세요.');
            return;
        }

        const data = {
            ...form,
            content,
            resumeId: resume,
        };

        try {
            if (postId === undefined) {
                const res = await API.post('/board', data);
                navigate(`/post/${String(res.data)}`);
            } else {
                await API.patch(`/board/${postId}`, '', data);
                navigate(`/post/${postId}`);
            }
        } catch (err) {
            setModalOpen(false);
            openNotification('bottomRight', `오류가 발생했습니다: ${err}`);
        }
    };

    const updateEditorContent = (content: string) => {
        editorRef.current?.getInstance().setMarkdown(content);
    };

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.getInstance().removeHook('addImageBlobHook');
            type HookCallback = (url: string, text?: string) => void;
            editorRef.current
                .getInstance()
                .addHook('addImageBlobHook', async (blob: File, callback: HookCallback) => {
                    // blob 자체가 file 임,
                    const formData = new FormData();
                    // 아래와 같이 저장하면 formData {image:blob} 형태가 됨
                    formData.append('image', blob);
                    // 서버에 이미지 저장 및 저장된 이미지 url 응답 받기
                    const url = await API.post('/file/url', formData);
                    // 에디터에 url과 파일 이름을 이용한 마크다운 이미지 문법 작성 콜백 함수
                    callback(process.env.REACT_APP_SERVER_URL + url.imageUrl, blob.name);
                    return false;
                });
        }

        const updateOriginBoardData = async () => {
            // 게시물 페이지 수정 버튼으로 접근한 경우
            if (state) {
                setForm({
                    title: state.title,
                });
                updateEditorContent(state.content);
                return;
            }

            // url을 임의로 입력해서 접근한 경우
            const res = await API.get(
                `/board/${postId}`,
                `?lifeIsGood=${localStorage.getItem('userId')}`,
            );

            const data = res.boardInfo;

            const result = {
                title: data.title,
                content: data.content,
            };

            setForm({
                title: result?.title,
            });
            updateEditorContent(result.content);
        };

        // 게시물 수정일 경우 기존 내용 채우기
        if (postId) {
            updateOriginBoardData();
        }

        return () => {};
    }, [postId, state]);

    const cancleEdit = () => {
        if (postId) {
            navigate(`/post/${postId}`);
            return;
        }
        navigate('/');
    };

    return (
        <>
            <Modal
                title="게시물을 등록하시겠습니까?"
                centered
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
            ></Modal>
            <Layout>
                {contextHolder}
                <Wrapper>
                    <WrapperHeader>
                        <WrapperTitle>이력서 첨부</WrapperTitle>
                        <ToggleDiv>
                            <Switch onClick={onToggleButton} />
                        </ToggleDiv>
                    </WrapperHeader>
                    {isResume && (
                        <ResumeSelectUI>
                            <Radio.Group onChange={handleResumeSelect} value={resume}>
                                <Space direction="vertical">
                                    {resumeList.map((item, index) => (
                                        <Radio key={index} value={item.resumeId}>
                                            {item.resumeName}
                                        </Radio>
                                    ))}
                                    <Button onClick={() => navigate('/resume/list')}>
                                        이력서 작성하러가기
                                    </Button>
                                </Space>
                            </Radio.Group>
                        </ResumeSelectUI>
                    )}{' '}
                </Wrapper>

                <Wrapper>
                    <Title level={4}>제목</Title>
                    <Input
                        size="large"
                        placeholder="제목을 입력해주세요."
                        name="title"
                        value={title}
                        onChange={onChange}
                    />
                </Wrapper>
                <Wrapper>
                    <Title level={4}>내용</Title>
                    <Editor
                        placeholder="이 입력폼은 마크다운 문법을 지원합니다."
                        previewStyle="vertical"
                        height="600px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                        language="ko-KR"
                        plugins={[colorSyntax]}
                        ref={editorRef}
                    />
                </Wrapper>
                <Wrapper></Wrapper>
                <ButtonDiv>
                    <Button type="default" size="large" onClick={cancleEdit}>
                        취소
                    </Button>
                    <Button type="primary" size="large" onClick={() => setModalOpen(true)}>
                        {postId ? '수정' : '등록'}
                    </Button>
                </ButtonDiv>
            </Layout>
        </>
    );
}

export default PostCreate;
