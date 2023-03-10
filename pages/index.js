import { CircularProgress } from '@material-ui/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useGuard from '../lib/hooks/useGuard'


const Home = () => {
  const router = useRouter()
  const ok = useGuard()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(ok !== undefined){
      if(!ok) return router.push('/login')
      else return router.push('/dashboard')
    }
  }, [ok])

  return(
    <>
      <Head>
          <title>کپچریک</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      { loading &&
          <div style={{
              display: 'flex',
              height: '100vh',
              justifyContent: 'center', 
              alignItems: 'center'
          }}>
            <CircularProgress /> 
          </div>
      }
    </>
  )
}

export default Home


