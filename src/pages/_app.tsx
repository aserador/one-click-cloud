import { createContext, useState } from "react";
import { store } from "@/redux/store";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { setAwsServices } from "@/redux/persistentDrawerRightSlice";
import { AWS_SERVICES } from "../../templates/aws_services.js";

import "../styles/globals.css";

// Context provider
export const DiagramContext = createContext({
  value: {} as any,
  setValue: () => {},
});

function StratusApp({ Component, pageProps }: AppProps) {

  store.dispatch(setAwsServices({ AWSServices: AWS_SERVICES }));

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
