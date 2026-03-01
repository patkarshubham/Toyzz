import { AppProps } from "next/app";
import { useRouter } from "next/router";
import useTabInactivity from "./activity";
import { Montserrat } from "next/font/google";
import "../styles/global.css";
import "../styles/index.css";

const montserrat = Montserrat({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  useTabInactivity();
  const router = useRouter();
  const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1];

  if (path) {
    router.replace(path);
  }

  return (
    <>
      <meta
        property="og:image"
        content="https://pinetoyzz.ai/images/logo/logo.png"
      />
      <div className={montserrat.className}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
