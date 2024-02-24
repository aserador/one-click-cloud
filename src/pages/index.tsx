import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Stratus</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-white">
          Welcome to <a className="text-blue-600" href="#">Stratus</a>
        </h1>

        <p className="mt-3 text-2xl text-white">
          Build your AWS infrastructure by simply dragging and dropping components.
        </p>

        <p className="mt-3 text-lg text-white">
          Our application uses the Terraform SDK to generate a Terraform file for your AWS setup. 
          We also utilize OpenAI to process your input and determine the best Terraform project layout for your needs.
        </p>

        <div className="mt-6">
          <a
            href="/builder"
            className="px-6 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Start Building
          </a>
        </div>
      </main>

      <footer className="flex items-center text-white justify-center w-full h-24 border-t">
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
  )
}