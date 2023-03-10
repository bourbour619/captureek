import { Button, Card, Grid, TextField, makeStyles, ButtonGroup, Snackbar } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import StopRoundedIcon from '@material-ui/icons/StopRounded'
import PauseCircleFilledTwoToneIcon from '@material-ui/icons/PauseCircleFilledTwoTone'
import PlayCircleFilledTwoToneIcon from '@material-ui/icons/PlayCircleFilledTwoTone';
import Stopwatch from './Stopwatch'
import _ from 'lodash'
import axios from 'axios'
import { saveAs } from 'file-saver'
import { Alert } from '@material-ui/lab';
import ReactPlayer from 'react-player'
import { apiUrl } from '../lib/config';
import useLocalStorage from '../lib/hooks/useLocalStorage';

const useStyles = makeStyles(theme => ({
    videoPanel:{
        backgroundColor: theme.palette.custom2,
        padding: theme.spacing(3),
        borderRadius: 20,
    }
}))

let stream , recorder;

const Recorder = () => {
    const classes = useStyles()
    const streamRef = useRef()
    const [uri, setUri] = useState('')
    const [dims, setDims] = useState({
        width: 0,
        height: 0
    })
    const [record, setRecord] = useState(false)
    const [reset, setReset] = useState(true)
    const [done, setDone] = useState(false)
    const [pause, setPause] = useState(false)
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [snakbar, setSnackbar] = useState({
        open: false,
        status: '',
        msg: ''
    })

    const [token, setToken] = useLocalStorage('token', {})



    const startRecord = async(e) => {
        e.preventDefault()
        if(_.isEmpty(name)){
            setError('نام برای ضبط وارد نمایید')
            return
        }
        setError('')
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: { 
                mediaSource: "screen",
                cursor: "always"
            },
            audio: true
        })
        streamRef.current.srcObject = stream
        setDims({
            width: `${streamRef.offsetWidth}px`,
            height: `${Math.floor(streamRef.offsetWidth*(9/16))}px`
        })
        recorder = new MediaRecorder(stream)
        const chunks = []
        recorder.ondataavailable = e => chunks.push(e.data)
        recorder.start()
        setRecord(true)
        setReset(false)
        recorder.onstop = e => {
            streamRef.current.srcObject = null
            const completeBlob = new Blob(chunks, { type: chunks[0].type })
            setUri(URL.createObjectURL(completeBlob))
            setRecord(false)
            setDone(true)
        }
    }
    const stopRecord = () => {
        if(recorder)
            return recorder.stop()
    }
    const pauseOrResumeRecord = () => {
        setPause(!pause)
        if(recorder){
            if(pause){
                return recorder.resume()
            }
            return recorder.pause()
        }
    }
    const deleteRecord = () => {
        setUri('')
        setReset(true)
        setDone(false)
    }
    const downloadRecord = () => {
        fetch(uri)
            .then(res => res.blob())
            .then(blob => {
                saveAs(blob, `${name}.mkv`)
            })
    }
    const saveRecord = () => {
        setSnackbar(snakbar => ({...snakbar,
            open: true,
            status: 'loading',
            msg: 'در حال ذخیره فایل روی سرور ...'
        }))
        fetch(uri)
            .then(res => res.blob())
            .then(blob => {        
                const data = new FormData()
                data.append('name', name)
                data.append('file', blob)
                const config = {
                    'Content-Type': 'multipart/form-data',
                    headers: {
                        'Authorization': `Bearer ${ token }`,
                    }
                }
                axios.post(`${apiUrl}/records/`, data, config)
                    .then(res => {
                        if(res.status === 201){
                            setSnackbar(snackbar => ({...snackbar, 
                                open: true,
                                status: 'ok',
                                msg: 'فایل روی سرور ذخیره گردید'
                            }))
                        }
                    })
                    .catch(err => {
                        setSnackbar(snackbar => ({...snackbar, 
                            open: true,
                            status: 'error',
                            msg: 'ارتباط با سرور مقدور نیست'
                        }))
                        console.log(err)
                    })
            })
    }
    const closeSnakbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
          }
          setSnackbar(snakbar => ({...snakbar, open: false}))
    }
    return (
        <div>
            <Grid
             container
             direction='column'
             spacing={4}
             justify='center'
             alignItems='center'
            >
                <Grid item>
                    <form noValidate autoComplete='off'
                        onSubmit={startRecord}
                    >
                    <Grid
                        container
                        direction='row'
                        spacing={3}
                        justify='center'
                        alignItems='flex-end'
                    >
                        <Grid item>
                            <TextField 
                                error={error ? true: false}
                                label="نام" 
                                variant="standard"
                                onChange={(e) => setName(e.target.value) }
                                helperText={error}
                                style={{ width: 300 }}
                            />
                        </Grid>
                        <Grid item >
                            <Button 
                                variant="contained"
                                color='primary'
                                disableElevation 
                                type='submit'
                                size='medium'
                            >
                                ضبط
                            </Button>
                        </Grid>
                    </Grid>
                    </form>
                </Grid>
                <Grid item>
                    <Card className={classes.videoPanel} elevation={12}>
                        { !done ?
                        <Grid
                            container
                            direction='column'
                            spacing={3}
                            justify='space-between'
                            alignItems='center'
                            
                        >
                            <Grid item>
                            <video
                                style={{
                                    width: '50vw',
                                    height: '50vh'
                                }} 
                                autoPlay
                                ref={streamRef}
                            />
                            </Grid>
                            <Grid item>
                            <ButtonGroup disabled={!record} size="medium" color="primary">
                                <Button onClick={stopRecord}><StopRoundedIcon/></Button>
                                <Button onClick={pauseOrResumeRecord}>
                                    {pause ?
                                     <PlayCircleFilledTwoToneIcon/> 
                                        : 
                                     <PauseCircleFilledTwoToneIcon />
                                     }
                                </Button>
                            </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <Stopwatch record={pause ? !pause: record } reset={reset}/>
                            </Grid>
                        </Grid>
                        : <ReactPlayer
                             controls
                             url={uri}
                            //  width={dims.width}
                            //  height={dims.height}
                            width='50vw'
                            height= '50vh'
                        />}
                    </Card>
                </Grid>
                <Grid item>
                <ButtonGroup disabled={!done} variant="contained" color="primary" aria-label="contained primary button group">
                    <Button onClick={deleteRecord}>حذف ویدیو</Button>
                    <Button onClick={downloadRecord}>دانلود ویدیو</Button>
                    <Button onClick={saveRecord}>ذخیره روی سرور</Button>
                </ButtonGroup>
                </Grid>
            </Grid>
            <Snackbar open={snakbar.open} autoHideDuration={snakbar.status !== 'loading' ? 3000 : null } onClose={closeSnakbar}>
                <Alert 
                        onClose={closeSnakbar} 
                        severity={ 
                            snakbar.status === 'loading' ? 'info' : 
                            snakbar.status === 'ok' ? 'success' : 'error'
                    }>
                    {snakbar.msg}
                </Alert>
            </Snackbar>            
        </div>
    )
}

export default Recorder


