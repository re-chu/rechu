import styled from '@emotion/styled';

export const MobileDiv = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    max-width: 1280px;
    margin: 2% auto 0;
    text-align: center;
    align-items: center;
    opacity: 0.8;
    border-radius: 10px;
    border: 2px solid #c9cacc;

    & .content {
        width: 40vh;
        font-size: 1.4rem;
        background: #0092ff;
        border-radius: 0.4rem;
        margin: 3vh;
        padding: 1vh;
    }
`;

export const Title = styled.div`
    text-align: left;
    display: flex;
    justify-content: space-between;
    & h1 {
        font-size: 2.4rem;
    }
    & div {
        font-size: 2.4rem;
    }
    & button {
        color: blue;
        background-color: white;
        border: 1px solid black;
        border-radius: 5px;
        width: 10rem;
        height: 3rem;
        :hover {
            background-color: #0088ff98;
        }
    }
`;
