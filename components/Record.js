import { Chip, Fade, Modal, makeStyles, Backdrop, Grid, CircularProgress, ButtonGroup, Button } from '@material-ui/core'
import React, { useState, useRef } from 'react'
import { saveAs } from 'file-saver'
import ReactPlayer from 'react-player'
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import GetAppTwoToneIcon from '@material-ui/icons/GetAppTwoTone';
import axios from 'axios';

import { apiUrl } from '../lib/config';
import useLocalStorage from '../lib/hooks/useLocalStorage';

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.custom1,
      border: `4px solid ${theme.palette.custom2}`,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    record: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    loading: {
        width: `calc(100vw / 10)`,
        height: `calc(100vh / 5)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteRecord: {
        backgroundColor: theme.palette.error.main,
        color: 'white',
        '&:hover' : {
            backgroundColor: theme.palette.error.main,
        },
        '& > svg': {
            color: 'white'
        },
        marginRight: theme.spacing(1)
    }
  }));

const Record = ({id, name, uri, setUpdate}) => {

    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const videoRef = useRef()
    const [token, setToken] = useLocalStorage('token', {})

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    
    const downloadRecord = () => {
        const video = videoRef.current.src
        saveAs(video, name)
    }

    const deleteRecord = () => {
        axios.delete(`${apiUrl}/records/${id}/`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${ token }`
              }
        })
            .then(res => {
                if(res.status === 204){
                    setUpdate(true)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className={classes.record}>
                { loading &&
                    <div className={classes.loading}>
                        <CircularProgress color='primary'/>
                    </div> 
                }
                <video
                
                 ref={videoRef}
                 src={uri} 
                 alt={name} 
                 onClick={handleOpen} 
                 onLoadedData = {(e) => setLoading(false)}
                 style={{ 
                    display: loading ? 'none' : 'block',
                    height: '20vh'     
                }}
                /> 
            <Grid
                container
                direction='row'
                justify='space-around'
                alignItems='center'
            >
                <Grid item>
                    <Chip 
                    variant="default" 
                    size="medium" 
                    label={name}
                    color='primary'
                    />
                </Grid>
                <Grid item>
                     <Chip 
                        variant="default" 
                        icon={<DeleteForeverSharpIcon/>}
                        size="medium" 
                        label='حذف'
                        className={classes.deleteRecord}
                        onClick={deleteRecord}
                    />
                    <Chip 
                        variant="default" 
                        icon= {<GetAppTwoToneIcon />}
                        size="medium" 
                        label='دانلود'
                        color='secondary'
                        onClick={downloadRecord}
                    />
                </Grid>
            </Grid> 
             <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                    <ReactPlayer
                        controls
                        url={uri}
                        width='80vw'
                        height='80vh'
                    />
                    </div>
                </Fade>
            </Modal>
            <style jsx>
                {`
                    video {
                        width: 100%;
                        height: auto;
                    }
                `}
            </style>
        </div>
    )
}

export default Record
