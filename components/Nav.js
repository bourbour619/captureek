import { 
        Divider,
        Drawer,
        List,
        ListItem,
        ListItemIcon,
        ListItemText,
        AppBar,
        Toolbar,
        makeStyles,
        useTheme, 
        CssBaseline,
        IconButton,
        Typography} from '@material-ui/core'
import FiberManualRecordTwoToneIcon from '@material-ui/icons/FiberManualRecordTwoTone'
import OndemandVideoTwoToneIcon from '@material-ui/icons/OndemandVideoTwoTone';
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React, { useState } from 'react'
import clsx from 'clsx'
import { useUser } from '../lib/contexts/UserContext';
import AccountBoxIcon from '@mui/icons-material/AccountBox';



const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#2D3142',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#2D3142',
    color: 'white',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  // toolbar: theme.mixins.toolbar,
  listItem: {
    marginTop: theme.spacing(2),
  }
}));


const Nav = ({setNavOpen,setSelected}) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false)
    const [user, setUser] = useUser()

    const handleDrawerOpen = () => {
      setOpen(true);
      setNavOpen(true)
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
      setNavOpen(false)
    };

    const icons = {
      'ضبط جدید' : <FiberManualRecordTwoToneIcon color='error' /> ,
      'ضبط شده‌ها' : <OndemandVideoTwoToneIcon color='secondary' /> ,
      'خروج' : <ExitToAppSharpIcon color='action' />
    }
    
    return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            کپچریک
          </Typography>
        </Toolbar>
      </AppBar>
        <Drawer
        className={classes.drawer}
        variant="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        open={open}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon htmlColor='white' /> : <ChevronRightIcon htmlColor='white' />}
          </IconButton>
        </div>
        <List>
          <ListItem className={classes.listItem}>
              <ListItemIcon>
                  <AccountBoxIcon color='primary'/>
              </ListItemIcon>
              <ListItemText primary={user['name']} />
          </ListItem>
          <Divider variant='fullWidth' style={{ margin: '1em 0'}} />
          {['ضبط جدید', 'ضبط شده‌ها','خروج'].map((text, index) => (
            <ListItem className={classes.listItem} button key={text} onClick={() => setSelected(text)} >
              <ListItemIcon>
                { icons[text] }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
        <style jsx>
            {`
                
            `}
        </style>
    </>   
    )
}

export default Nav
