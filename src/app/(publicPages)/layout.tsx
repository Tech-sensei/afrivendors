import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";

export default function PublicPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}

