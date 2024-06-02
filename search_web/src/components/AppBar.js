import React, {Component} from 'react';
import AppBarMUI from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import Button from '@material-ui/core/Button';
//import AccountCircle from '@material-ui/icons/AccountCircle';
//import Badge from '@material-ui/core/Badge';
//import NotificationsIcon from '@material-ui/icons/Notifications';


import {Link} from "react-router-dom";


import TemporaryDrawer from "./TemporaryDrawer";

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {

        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },


});

class AppBar extends Component {

    render() {

        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <AppBarMUI position="static" style={{
                    padding: "1em",
                }}>
                    <Typography variant="h6" color="textPrimary" className={classes.grow}>
                        <Link to={"/"} style={{all: "unset"}}>{"Tracky - Find best prices at any time"}</Link>
                    </Typography>
                </AppBarMUI>
            </div>
        );
    }
}

export default withStyles(styles)(AppBar);