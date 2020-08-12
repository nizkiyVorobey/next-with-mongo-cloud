import Head from 'next/head'

export default function Home() {
  const getData = () => {
    fetch('http://localhost:3000/api/hello')
      .then(data => {
        return data.json()
      })
      .then(value => {
        console.log(value);
      })
  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={getData}>Get data</button>
    </div>
  )
}
