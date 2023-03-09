import Head from 'next/head'
import withToken from '../src/withToken'


const Home = () => {
  return (
    <>
      <Head>
          <title>ضبط کننده جلسات دان</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}

export default withToken(Home)


