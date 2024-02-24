import { store } from "@/redux/store";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";

import "../styles/globals.css";

function StratusApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-black min-h-screen">
      <Provider store={store}>
        <Head>
          <title>Stratus</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default StratusApp;