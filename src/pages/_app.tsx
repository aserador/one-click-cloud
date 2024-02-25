import { createContext, useState, useEffect } from "react";
import { store } from "@/redux/store";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { setAwsServices } from "@/redux/persistentDrawerRightSlice";
import { AWS_SERVICES } from "../../templates/aws_services.js";
import { ToastContainer } from "react-toastify";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

// Context provider
export const DiagramContext = createContext({
  value: {} as any,
  setValue: () => {},
});


function StratusApp({ Component, pageProps }: AppProps) {
  store.dispatch(setAwsServices({ AWSServices: AWS_SERVICES }));

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (window.pageYOffset > 0) {
        header?.classList.add('blur-effect');
      } else {
        header?.classList.remove('blur-effect');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-bgblack min-h-screen">
      <Provider store={store}>
        <Head>
          <title>Stratus</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        
        <header id="header" className="w-full p-4 fixed top-0 left-0">
          <a href="/" className="text-2xl font-logo text-spurple">stratus</a>
        </header>

        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default StratusApp;