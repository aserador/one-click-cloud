import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function StratusApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Stratus</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default StratusApp