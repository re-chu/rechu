import styled from '@emotion/styled';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Chat from 'components/Chat';

interface Props {
    children: React.ReactNode;
}

const Container = styled.section`
    max-width: 128rem;
    margin: 0 auto;
    padding: 0 5rem;
`;

export default function Layout({ children }: Props) {
    return (
        <>
            <Header />
            <section className="Container">
                {children}
                <Chat></Chat>
            </section>
            <Footer />
        </>
    );
}
