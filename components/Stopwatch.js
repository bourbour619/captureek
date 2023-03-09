import { Chip } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'

const Stopwatch = ({record, reset}) => {
    const [tick, setTick] = useState(0)
    let sw = useRef()
    useEffect(() => {
        if(record){
           startSw()
        }else {
            stopSw()
        }
        return () => stopSw()
    },[record])

    useEffect(() => {
        if(reset) setTick(0)
    },[reset])

    const formatTime = () => {
        const getSeconds = `0${(tick % 60)}`.slice(-2)
        const minutes = `${Math.floor(tick / 60)}`
        const getMinutes = `0${minutes % 60}`.slice(-2)
        const getHours = `0${Math.floor(tick / 3600)}`.slice(-2)
        return `${getSeconds} : ${getMinutes} : ${getHours}`
    }

    const startSw = () => {
        sw.current = setInterval(() => {
            setTick(tick => tick + 1)
        },1000)
    }
    const stopSw = () => {
        clearInterval(sw.current)
    }
    return (
        <div>
            <Chip
                style={{
                    fontSize: '.9rem'
                }}
                variant="default" 
                size="small" 
                label={formatTime()}
                color='primary'
            />
        </div>
    )
}

export default Stopwatch
