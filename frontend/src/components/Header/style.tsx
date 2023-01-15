import styled from '@emotion/styled';

export const HContainer = styled.section`
    max-width: 100%;
    margin-bottom: 5rem;
`;

export const HHeader = styled.header`
    display: flex;
    justify-content: space-around;
    padding: 4rem 1rem;
    align-items: center;
    font-size: 2rem;
    border-bottom: 1px solid #b0e0e6;
    box-sizing: border-box;
    font-weight: 600;
    width: 100%;

    @media all and (max-width: 1080px) {
        padding: 2rem 1rem;
    }

    & h1 {
        cursor: pointer;

        & img {
            width: 200px;
        }
    }

    @media all and (min-width: 1081px) and (max-width: 2560px) {
        .mobileMenu {
            display: none;
        }
    }

    @media all and (max-width: 1080px) {
        & .mobileMenu {
            z-index: 999;

            & .toggleMenu {
                position: relative;
                width: 2.3rem;
                height: 2.2rem;
                padding: 1rem;
                cursor: pointer;

                .line {
                    position: absolute;
                    width: calc(100% - 20px);
                    height: 4px;
                    background-color: #000;
                    transition: 0.3s;

                    &:nth-of-type(1) {
                        top: 10px;
                    }
                    &:nth-of-type(2) {
                        top: calc(50% - 2px);
                    }
                    &:nth-of-type(3) {
                        top: calc(100% - 14px);
                    }
                }
            }

            & .toggleMenu.active {
                .line {
                    &:nth-of-type(1) {
                        top: calc(50% - 2px);
                        transform: rotate(-45deg);
                    }
                    &:nth-of-type(2) {
                        opacity: 0;
                        visibility: hidden;
                    }
                    &:nth-of-type(3) {
                        top: calc(50% - 2px);
                        transform: rotate(45deg);
                    }
                }
            }

            & .mobileMenuBar {
                background-color: rgba(255, 255, 255, 0.5);
                position: absolute;
                padding-left: 0.4rem;
                padding-top: 1rem;
                line-height: 1.6;

                & .util {
                    & li {
                        cursor: pointer;
                    }
                }
            }
        }
    }

    & .navMenu {
        display: flex;
        gap: 4.8rem;

        @media all and (max-width: 1080px) {
            display: none;
        }

        & nav {
            & ul {
                display: flex;
                gap: 1.9rem;
            }
        }

        & .util {
            display: flex;
            gap: 1.9rem;
            li:last-child {
                cursor: pointer;
            }
        }
    }
`;

export const AlarmWrapper = styled.figure`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    @media all and (max-width: 1080px) {
        justify-content: unset;
    }
`;

export const AlarmDot = styled.span`
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    right: 1rem;
    top: 0.3rem;
    border-radius: 50%;
    background-color: red;
`;
