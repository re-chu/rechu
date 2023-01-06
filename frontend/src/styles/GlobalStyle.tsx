import React from 'react';
import { Global, css } from '@emotion/react';

const style = css`
    @import url('https://fonts.googleapis.com/css2?family=Viga&display=swap');
    html,
    body,
    div,
    span,
    h1,
    h2,
    p,
    a,
    address,
    img,
    small,
    strong,
    i,
    dl,
    dt,
    dd,
    ul,
    li,
    form,
    label,
    article,
    figure,
    footer,
    header,
    section {
        margin: 0;
        padding: 0;
        border: 0;
        vertical-align: baseline;
    }

    article,
    figure,
    footer,
    header,
    menu,
    nav,
    section {
        display: block;
    }

    body {
        line-height: 1;
    }

    ol,
    ul,
    li {
        list-style: none;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    input,
    select {
        border: 0;
    }

    a,
    a:visited,
    a:link,
    a:active {
        color: #000;
        text-decoration: none;
    }

    html {
        font-size: 62.5%;
        box-sizing: border-box;
        font-family: 'arial', 'sans-serif';
    }
`;

const GlobalStyle = () => {
    return <Global styles={style} />;
};

export default GlobalStyle;
