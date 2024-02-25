import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-28 justify-center min-h-screen py-2">
      <Head>
        <title>Stratus</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex ml-12 justify-between items-center flex-1 px-20 py-10 space-x-10">
        <div className="text-left flex-1">
          <h1 className="text-7xl font-bold text-white">
            Low-Code{" "}
            <a className="text-spurple" href="#">
              Cloud
            </a>{" "}
            Architecture
          </h1>

          <p className="mt-12 text-xl font-customlight text-white">
            The easiest way to develop and deploy projects. Bringing the cloud
            closer to you.
          </p>
          <div className="mt-12 flex space-x-4">
            <a
              href="/builder"
              className="flex items-center justify-center w-36 px-8 py-3 text-xl bg-white text-black font-bold rounded-full hover:bg-gray hover:text-spurple transition duration-300 ease-in-out"
            >
              Deploy
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
            <a
              href="/learn"
              className="flex items-center text-white text-xl font-bold hover:text-spurple transition duration-300 ease-in-out"
            >
              Learn More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="/images/splash.svg"
            alt="Splash"
            width={500}
            height={300}
          />
        </div>
      </main>

      <section className="grid grid-cols-2 gap-12 w-full mt-28 px-48 mx-auto">
        <div className="bg-blockgrey rounded-3xl flex flex-grow flex-shrink w-auto items-center justify-center border border-bordergrey p-8">
          <div className="flex flex-col justify-center space-y-2">
            <p className="text-white font-customlight text-3xl">
              Multi-Cloud Support
            </p>
            <Image
              src="/images/splashlogos.png"
              alt="Splash"
              width={700}
              height={500}
              objectFit="cover"
            />
          </div>
        </div>
        <div className="bg-blockgrey rounded-3xl flex flex-grow flex-shrink w-auto items-center justify-center border border-bordergrey p-8">
          <div className="flex flex-col justify-center space-y-2">
            <p className="text-white font-customlight text-3xl">Inbuilt IAC</p>
            <Image
              src="/images/tf.png"
              alt="Splash"
              width={120}
              height={120}
              objectFit="cover"
            />
          </div>
        </div>
        <div className="bg-blockgrey rounded-lg flex flex-grow flex-shrink w-auto items-center justify-center border border-bordergrey p-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-white text-sm">Text 3</p>
            <Image
              src="/images/splashcloud.svg"
              alt="Splash"
              width={70}
              height={50}
            />
          </div>
        </div>
        <div className="bg-blockgrey rounded-lg flex flex-grow flex-shrink w-auto items-center justify-center border border-bordergrey p-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-white text-sm">Text 4</p>
            <Image
              src="/images/splashcloud.svg"
              alt="Splash"
              width={70}
              height={50}
            />
          </div>
        </div>
      </section>
      <footer className="flex items-center bg-spurple text-white justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by HackIllinois 2024
        </a>
      </footer>
    </div>
  );
}
