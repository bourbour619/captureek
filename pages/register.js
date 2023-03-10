import React, { useState, useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import  Snackbar  from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { AssignmentIndOutlined } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import axios from 'axios';
import { styled } from '@mui/system';
import { Paper } from '@material-ui/core';
import { apiUrl } from '../lib/config';

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    marginTop: theme.spacing(4),
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

export default function Register() {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2]= useState('')
  const [alert, setAlert] = useState({})
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const classes = useStyles();


  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const sendRegister = async(e) => {
    e.preventDefault()
      const data = {
        name,
        email,
        password,
        password2
      }
      axios.post(`${apiUrl}/users/register/`, data, {
        headers: {
          'Accept': 'application/json'
        }
      })
          .then(res => {
            if(res.data){
              setAlert({
                msg: 'ثبت نام انجام شد ، در حال انتقال به صفحه ورود ...',
                type: 'success'
              })
              setOpen(true)
              setTimeout(() => {
                  router.push(`/login?email=${email}`)
              },2000)
            }
          })
          .catch(err => {
            setAlert({
              msg: 'مشکلی پیش آمده یا ورودی نامعتبر است',
              type: 'error'
            })
            setOpen(true)
      })
    
  }

  return (
    <>
    <Head>
        <title>ثبت نام</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={classes.wrapper}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={10} className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AssignmentIndOutlined color='primary' fontSize='large'/>
        </Avatar>
        <Typography component="h1" variant="h6">
          ثبت نام
        </Typography>
        <form className={classes.form} noValidate onSubmit={sendRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                label="نام "
                autoFocus
                onChange= {(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                required
                fullWidth
                label="آدرس ایمیل"
                name="email"
                autoComplete="email"
                onChange= {(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                required
                fullWidth
                name="password"
                label="رمزعبور"
                type="password"
                autoComplete="current-password"
                onChange= {(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                required
                fullWidth
                name="passwordConfirm"
                label="تکرار رمز عبور"
                type="password"
                autoComplete="current-password"
                onChange= {(e) => setPassword2(e.target.value)}
                />
              </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            ثبت نام
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link href='/login'>
                  آیا حساب کاربری دارید؟ وارد شوید
              </Link>
            </Grid>
          </Grid>
        </form>
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