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
import { keys } from '../src/config';
import { useUser } from '../src/contexts/UserContext';
import https from 'https'

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
    const [url, setUrl] = useState('')
    const [dims, setDims] = useState({
        width: 0,
        height: 0
    })
    const [record, setRecord] = useState(false)
    const [reset, setReset] = useState(true)
    const [done, setDone] = useState(false)
    const [pause, setPause] = useState(false)
    const [sessionName, setSessionName] = useState('')
    const [className, setClassName] = useState('')
    const [errors, setErrors] = useState({})
    const [snakbar, setSnackbar] = useState({
        open: false,
        status: '',
        msg: ''
    })

    const [user,setUser] = useUser()


    const checkRecordEntry = () => {
        let valid = true
        if(_.isEmpty(sessionName)){
            setErrors(errors => ({
                ...errors,
                sessionName: 'نام جلسه را وارد نمایید'
            }))
            valid = false
        }
        if(_.isEmpty(className)){
            setErrors(errors => ({
                ...errors,
                className: 'نام کلاس را وارد نمایید'
            }))
            valid = false
        }
        return valid
    }

    const startRecord = async(e) => {
        e.preventDefault()
        if(!checkRecordEntry()) return ;
        setErrors({})
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
            setUrl(URL.createObjectURL(completeBlob))
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
        setUrl('')
        setReset(true)
        setDone(false)
    }
    const downloadRecord = () => {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const fileName = `${sessionName}_${className}`
                saveAs(blob, `${fileName}.mkv`)
            })
    }
    const saveRecord = () => {
        setSnackbar(snakbar => ({...snakbar,
            open: true,
            status: 'loading',
            msg: 'در حال ذخیره فایل روی سرور ...'
        }))
        fetch(url)
            .then(res => res.blob())
            .then(blob => {        
                const data = new FormData()
                data.append('session_name', sessionName)
                data.append('class_name', className)
                data.append('file', blob)
                const config = {
                    'Content-Type': 'multipart/form-data',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                }
                axios.post(`${keys.serverURI}/records/`, data, config)
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
                                error={errors.sessionName ? true: false}
                                label="نام جلسه" 
                                variant="standard"
                                onChange={(e) => setSessionName(e.target.value) }
                                helperText={errors.sessionName}
                                style={{ width: 300 }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField 
                            error={errors.className ? true: false}
                            label="نام کلاس"
                            variant="standard"
                            onChange={(e) => setClassName(e.target.value) }
                            helperText={errors.className}
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
                                ضبط جلسه
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
                             url={url}
                             width={dims.width}
                             height={dims.height}
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


