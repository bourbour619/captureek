import { makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import Nav from './Nav'
import Recorder from './Recorder'
import Records from './Records'
import clsx from 'clsx'
import { useUser } from '../lib/contexts/UserContext'
import { useRouter } from 'next/router'
import useLocalStorage from '../lib/hooks/useLocalStorage'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
      },
    content: {
        padding: theme.spacing(3),
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginTop: theme.spacing(6),
        marginLeft: -drawerWidth,
        [theme.breakpoints.up('sm')]:{
          minHeight: '100vh'
        }
      },
      contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.up('sm')]:{
          marginLeft: 0,
        }
      },
}))



const App = (props) => {
  
    const classes = useStyles()
    const [selected, setSelected] = useState('ضبط جدید')
    const [navOpen, setNavOpen] = useState(false)
    const componentItems =  {
      'ضبط جدید': <Recorder />,
      'ضبط شده‌ها': <Records records={props.records} />,
    }

    const [token, setToken] = useLocalStorage('token', {})
    const router = useRouter()

    useEffect(() => {
      if(selected === 'خروج'){
          setToken(null)
          router.push('/login')
      }
    },[selected])
    

    return (
        <div className={classes.root}>
            <Nav setSelected={setSelected} setNavOpen={setNavOpen}/>
            <main className={clsx(classes.content, {
          [classes.contentShift]: navOpen,
        })}>
            <div className={classes.drawerHeader} />
                { componentItems[selected] }
            </main>
        </div>
    )
}

export default App
