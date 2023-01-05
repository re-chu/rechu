import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from 'pages/Main';
import Login from 'pages/Login';
import ResumeEdit from 'pages/ResumeEdit';
import Post from 'pages/Post';
import PostCreate from 'pages/PostCreate';
import Join from 'pages/Join';
import FindPw from 'pages/FindPw';
import ResumeList from 'pages/ResumeList';
import Profile from 'pages/Profile';
import Err404 from 'pages/NotFound';
import Admin from 'pages/Admin';
import Resume from 'pages/Resume';
import Loading from 'pages/Loading';
import Match from 'pages/Match';
import Matched from 'pages/Matched';
import AdminUser from 'components/Admin/AdminUser';
import AdminContent from 'components/Admin/AdminContent';
import Comunity from 'pages/Comunity';
import Alaram from 'pages/Alarm';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {localStorage.getItem('accessToken') ? (
                    <>
                        {localStorage.getItem('isAdmin') === 'true' && (
                            <>
                                {/* Admin 전용 라우터 */}
                                <Route path="/admin" element={<Admin />}>
                                    <Route path="user" element={<AdminUser />} />
                                    <Route path="content" element={<AdminContent />} />
                                </Route>
                            </>
                        )}
                        <>
                            <Route path="/" element={<Main />} />
                            <Route path="/comunity" element={<Comunity />} />
                            <Route path="/resume/list" element={<ResumeList />} />
                            <Route path="/resume/:id" element={<Resume />} />
                            <Route path="/resume/:id/edit" element={<ResumeEdit />} />
                            <Route path="/post/:postId" element={<Post />} />
                            <Route path="/post/:postId/edit" element={<PostCreate />} />
                            <Route path="/post/create" element={<PostCreate />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/alarm" element={<Alaram />} />
                            <Route path="/loading" element={<Loading />} />

                            <Route path="/login" element={<Navigate replace to="/" />} />
                            <Route path="/join" element={<Navigate replace to="/" />} />
                            <Route path="/find-pw" element={<Navigate replace to="/" />} />

                            <Route path="/match" element={<Match />} />
                            <Route path="/matched" element={<Matched />} />

                            <Route path="/*" element={<Err404 />} />
                        </>
                    </>
                ) : (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/join" element={<Join />} />
                        <Route path="/find-pw" element={<FindPw />} />
                        <Route path="/loading" element={<Loading />} />
                        <Route path="/*" element={<Login />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
