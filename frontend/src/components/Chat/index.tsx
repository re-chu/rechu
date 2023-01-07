import React from 'react';
import classes from './.module.css';
import Logo from 'assets/images/logo.png';
const Chat = () => {
    return (
        <div>
            <img src={Logo} alt="logo" style={{ height: '100px', cursor: 'pointer' }} />
        </div>
    );
};

export default Chat;
