import { Grid, Typography, makeStyles, TextField, GridList, GridListTile, Card, CardContent, Chip, Button } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Autocomplete } from '@material-ui/lab'
import React, {useState, useEffect } from 'react'
import Record from './Record'
import _ from 'lodash'
import https from 'https'
import { apiUrl } from '../lib/config';
import useLocalStorage from '../lib/hooks/useLocalStorage';

const useStyles = makeStyles(theme => ({
    gridRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(12),
        },
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(8),
        },
      },
      gridList: {
        width: '100%',
        height: 'auto',
      },
      gridItem: {
          backgroundColor: theme.palette.custom2,
          overflow: 'hidden',
          minHeight: 300
      }
}))

const Records = ({records}) => {

    const matchesSm = useMediaQuery('(max-width: 600px)')
    const matchesMd = useMediaQuery('(max-width: 900px)')

    const classes = useStyles()
    const [lastRecords, setLastRecords] = useState([])
    const [filter, setFilter] = useState(false)
    const [result , setResult] = useState([])
    const [search, setSearch] = useState('')
    const [update, setUpdate] = useState(false)
    const [token, setToken] = useLocalStorage('token', {})


    useEffect(() => getLastRecords(),[])
    useEffect(() => {
        if(update){
            getLastRecords()
            setUpdate(false)
        }
    },[update])


    const filterSession = () => {
        if(_.isEmpty(filter)){
            setFilter(false)
        }else{
            setFilter(true)
            const f = _.filter(lastRecords, search)
            setResult(f)
        }
    }

    const getLastRecords = async () => {
        const agent = new https.Agent({
            rejectUnauthorized: false,
          });
        const res = await fetch(`${apiUrl}/records/`, {
            agent,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${ token }`
            }
        })
        let newlastRecords = await res.json()
        newlastRecords = newlastRecords.map(record => {
            return {
              ...record,
              name: record['name'],
              uri : record['uri'],
            }
          })
        if(!_.isEqual(lastRecords, newlastRecords)){
            setLastRecords(newlastRecords)
        }else{
            setLastRecords(lastRecords)
        }
    }
    
    return (
        <div>
            <Grid
                container
                direction='column'
                spacing={6}
                justify='center'
            >
                <Grid item>
                    <Grid 
                        container
                        direction='row'
                        spacing={6}
                        justify='center'
                        alignItems='flex-end'
                    >
                        <Grid item>
                        <Autocomplete
                            size='small'
                            options={lastRecords.map(sc => sc.name)}
                            getOptionLabel={(option) => option}
                            style={{ width: 300 }}
                            renderInput={(params) => 
                                <TextField {...params} 
                                label="نام" 
                                variant="standard"
                                onChange={e => setSearch(e.target.value)}   
                            />}
                            noOptionsText='ضبطی یافت نشد'
                            onChange={(e,v) => setSearch(v)}
                        />
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained"
                                color='primary'
                                disableElevation 
                                onClick={filterSession}
                                size='small'
                            >
                                    فیلتر
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <div className={classes.gridRoot}>
                        <GridList cellHeight='auto' className={classes.gridList} cols={matchesSm ? 1 : matchesMd ? 2 : 3}>
                            {!filter ?
                             lastRecords.map((sc) => (
                            <GridListTile key={sc.name} cols={sc.cols || 1}>
                                <Card >
                                    <CardContent className={classes.gridItem}>
                                       <Record {...sc} setUpdate={setUpdate}/>
                                    </CardContent>
                                </Card>
                            </GridListTile>
                            ))
                            :
                            result.map((f) => (
                                <GridListTile key={f.name} cols={f.cols || 1}>
                                    <Card >
                                        <CardContent className={classes.gridItem}>
                                           <Record {...f} setUpdate={setUpdate} />
                                        </CardContent>
                                    </Card>
                                </GridListTile>
                            ))
                        }
                        </GridList>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}


export default Records
