import React, { useEffect, useState } from 'react';
import Link  from 'next/link'

import { CssBaseline, Paper } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { borderColor, Box, styled } from '@mui/system'
import Grid from '@material-ui/core/Grid';
import  Snackbar  from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { LockOpenOutlined } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useUser } from '../src/contexts/UserContext'
import axios from 'axios';
import { keys } from '../src/config';
import Head from 'next/head';
import { useRouter } from 'next/router'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    borderRadius: 30,
    color: 'white',
    backgroundColor: theme.palette.custom2,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(8),
    width: theme.spacing(8)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: theme.spacing(3),
    color: 'white',
    
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    alignSelf: 'center',
  },
  wrapper: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const CustomTextField = styled(TextField)({
  '& input': {
    color: 'white'
  },
  '& label': {
    color: 'white'
  },
  '& label.Mui-focused' : {
    color: 'white'
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
})


export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState({})
  const [open, setOpen] = useState(false)

  const [info, setInfo] = useUser()
  const router = useRouter()

  const classes = useStyles()
  
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };

  useEffect(() => {
    if(router.query['email']){
      setEmail(router.query['email'])
    }
  },[router.query])

  const sendLogin = async(event) => {
    event.preventDefault()
    const data = { email, password }
    axios.post(`${keys.serverURI}/users/login/`, data, {
      headers: {
        'Accept': 'application/json'
      }
    })
          .then(res => {
            if(res.data){
              setInfo(res.data)
              setAlert({
                msg: `${email} خوش آمدید`,
                type: 'success'
              })
            setOpen(true)
            router.push('/dashboard')
            }
          })
          .catch(err => {
            setAlert({
              msg: 'نام کاربری یا رمز عبور اشتباه است',
              type: 'error'
            })
            setOpen(true)
          })
  }


  return (
    <>
    <Head>
        <title>ورود</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className= {classes.wrapper}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper elevation={10} className={classes.paper}>
            <Avatar 
              className={classes.avatar} 
              variant='circular'
            >
              <LockOpenOutlined  color='primary' fontSize='large'/>
            </Avatar>
            <Typography component="h6" variant="h6">
              ورود
            </Typography>
            <Box 
              component='form' 
              className={classes.form} 
              noValidate 
              onSubmit={sendLogin}
            >
              <CustomTextField 
                  label='ایمیل' 
                  required
                  fullWidth
                  name='email'
                  autoComplete="email"
                  onChange = {(e) => setEmail(e.target.value)}
                  value={email}
                />
              <CustomTextField 
                label='رمز عبور' 
                required
                fullWidth
                name='password'
                type='password'
                autoComplete="current-password"
                onChange = {(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size='medium'
                className={classes.submit}
              >
                ورود
              </Button>
              <Grid container justify='center'>
                <Grid item>
                  <Link href='/register'>
                    حساب کاربری ندارید؟ ثبت نام کنید
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackbar}>
          <Alert onClose={closeSnackbar} severity={alert.type}>
            {alert.msg}
          </Alert>
      </Snackbar>
      </Container>
    </div>
    </>
  );
}