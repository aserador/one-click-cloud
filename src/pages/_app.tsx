import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import StoreProvider from "@/redux/StoreProvider";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

function StratusApp({ Component, pageProps }: AppProps) {

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
      <StoreProvider>
        <Head>
          <title>Stratus</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        
        {/* <header id="header" className="w-full p-4 fixed top-0 left-0">
          <a href="/" className="text-2xl font-logo text-spurple">stratus</a>
        </header> */}

        <Component {...pageProps} />
      </StoreProvider>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default StratusApp;