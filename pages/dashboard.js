import Head from 'next/head'
import App from '../components/App'
import { keys } from '../src/config'
import useLocalStorage from '../src/hooks/useLocalStorage'
import withToken from '../src/withToken'

const Dashboard = ({records}) => {
    const rest = {
        records,
    }
      return (
        <div className="container">
          <Head>
            <title>ضبط کننده جلسات دان</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
            <App {...rest} />
    
          {/* <footer>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{' '}
              <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
            </a>
          </footer> */}
    
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
    
    
    
export const getServerSideProps = async () => {
  if(typeof window !== 'undefined'){
    const token = localStorage.getItem('token')
    const res = await fetch(`${keys.serverURI}/records/`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    let records = await res.json()
    return {
        props: {
            records: records ? records : []
        }
    }
  }
  return {
    props: {}
  }

}

export default withToken(Dashboard)