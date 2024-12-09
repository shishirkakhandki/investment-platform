import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from '../pages/AuthContext'; // Update the path to your context

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <Header />
        <main style={{ padding: "20px" }}>
          <Component {...pageProps} />
        </main>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default MyApp;
