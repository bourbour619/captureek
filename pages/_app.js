import '../styles/globals.css'
import { theme, jss } from '../lib/config'
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import { UserProvider } from '../lib/contexts/UserContext'

function App({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])
 
  return (
      <UserProvider>
        <ThemeProvider theme={theme}>
          <StylesProvider jss={jss}>
              <Component {...pageProps} />
          </StylesProvider>
        </ThemeProvider>
      </UserProvider>
  )
}

export default App
