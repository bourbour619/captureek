import { Box, CircularProgress, makeStyles } from '@material-ui/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import App from '../components/App'
import { apiUrl } from '../lib/config'
import useGuard from '../lib/hooks/useGuard'
import useLocalStorage from '../lib/hooks/useLocalStorage'

const Dashboard = () => {
    const router = useRouter()
    const ok = useGuard()
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useLocalStorage('token', {})
    const [records, setRecords] = useState([])
    
    useEffect(() => {
      if(ok !== undefined){
        if(!ok) return router.push('/login')
        setLoading(false)
      }
    }, [ok])

    useEffect(async() => {
      if(token){
        const res = await fetch(`${apiUrl}/records/`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
             }
          })
          let records = await res.json()
          setRecords(records)
      }
    }, [])
   
      return (
        <div className="container">
          <Head>
            <title>کپچریک</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
            { loading ?
              <div style={{
                  display: 'flex',
                  height: '100vh',
                  justifyContent: 'center', 
                  alignItems: 'center'
              }}>
                <CircularProgress /> 
              </div>
              : 
              <App records={records} /> 
            }
          <style jsx>{`
            .container {
              display: flex;
              flex-direction: column;
            }
    
            main {
              flex: 1;
              display: flex;
              flex-direction: column;
            }
    
            footer {
              width: 100%;
              height: 100px;
              border-top: 1px solid #eaeaea;
              display: flex;
              justify-content: center;
              align-items: center;
              direction: ltr;
              background-color: #2D3142
            }
    
            footer a {
              display: flex;
              justify-content: center;
              align-items: center;
            }
    
            a {
              color: inherit;
              text-decoration: none;
            }
    
            .title a {
              color: #0070f3;
              text-decoration: none;
            }
    
            .title a:hover,
            .title a:focus,
            .title a:active {
              text-decoration: underline;
            }
    
            .title {
              margin: 0;
              line-height: 1.15;
              font-size: 4rem;
            }
    
            .title,
            .description {
              text-align: center;
            }
    
            .description {
              line-height: 1.5;
              font-size: 1.5rem;
            }
    
            code {
              background: #fafafa;
              border-radius: 5px;
              padding: 0.75rem;
              font-size: 1.1rem;
              font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
            }
    
            .grid {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
    
              max-width: 800px;
              margin-top: 3rem;
            }
    
            .card {
              margin: 1rem;
              flex-basis: 45%;
              padding: 1.5rem;
              text-align: left;
              color: inherit;
              text-decoration: none;
              border: 1px solid #eaeaea;
              border-radius: 10px;
              transition: color 0.15s ease, border-color 0.15s ease;
            }
    
            .card:hover,
            .card:focus,
            .card:active {
              color: #0070f3;
              border-color: #0070f3;
            }
    
            .card h3 {
              margin: 0 0 1rem 0;
              font-size: 1.5rem;
            }
    
            .card p {
              margin: 0;
              font-size: 1.25rem;
              line-height: 1.5;
            }
    
            .logo {
              height: 1em;
            }
    
            @media (max-width: 600px) {
              .grid {
                width: 100%;
                flex-direction: column;
              }
            }
          `}</style>
    
          <style jsx global>{`
            html,
            body {
              padding: 0;
              margin: 0;
              font-family: 'Yekan',-apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
            }
    
            * {
              box-sizing: border-box;
            }
          `}</style>
        </div>
      )
}
    

export default Dashboard