import { createMuiTheme } from '@material-ui/core'

import { create } from 'jss';
import rtl from 'jss-rtl';
import { jssPreset } from '@material-ui/core/styles';
import { lightBlue, green } from '@material-ui/core/colors'

import createCache from '@emotion/cache';

export const jss = create({ plugins: [...jssPreset().plugins, rtl()] })


export const theme = createMuiTheme({
    direction: 'rtl',
    typography: {
        fontFamily: [
            'Dana',
            '-apple-system', 
            '"BlinkMacSystemFont"',
            'Segoe UI',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            'Fira Sans', 
            'Droid Sans', 
            '"Helvetica Neue"',
            'sans-serif'
        ].join(',')
    },
    palette: {
        primary: {
            main: lightBlue['800']
        },
        secondary: {
            main: green['700']
        },
        custom1: '#BFC0C0',
        custom2: '#2D3142',
    }
})

  
export function createEmotionCache() {
    return createCache({ key: 'css', prepend: true });
}

export const apiUrl = 'http://localhost:8000/api/v1'