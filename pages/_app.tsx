import '../styles/globals.css';
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }) {
  const body = <Component {...pageProps} />;
  return (
    <CookiesProvider>
      {body}
    </CookiesProvider>
  );
}

export default MyApp;
