import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from 'pages/Main';
import Login from 'pages/Login';
import Resume from 'components/Resume/index';
// import CreatePost from 'pages/CreatePost';
import Join from 'pages/Join';
import FindPw from 'pages/FindPw';
import MyPortfolio from 'pages/MyPortfolio';
import Profile from 'pages/Profile';

const Router = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<Login />} />
                <Route path="/resume/:id" element={<Resume />} />
                {/* <Route path="/create-post" element={<CreatePost />} /> */}
                <Route path="/Join" element={<Join />} />
                <Route path="/FindPw" element={<FindPw />} />
                <Route path="/myportfolio" element={<MyPortfolio />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
