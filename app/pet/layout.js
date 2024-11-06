import Navbar from "@/components/adopter_layout/navbar";
import Footer from "@/components/adopter_layout/footer";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="bg-[#f9f9f9] overflow-hidden min-h-screen">
      {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
