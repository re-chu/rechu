import Header from 'components/Header';
import Footer from 'components/Footer';
import Chat from 'components/Chat';

interface Props {
    children: React.ReactNode;
}

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
