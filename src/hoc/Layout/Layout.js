import React, { useState } from 'react';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
    const [sideDrawer, setSideDrawer] = useState(false);
    // state = {
    //     showSideDrawer: false
    // }

    const sideDrawerClosedHandler = () => {
        setSideDrawer(false);
        // this.setState( { showSideDrawer: false } );
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawer(!sideDrawer);
        // this.setState( ( prevState ) => {
        //     return { showSideDrawer: !prevState.showSideDrawer };
        // } );
    }

    return (
        <Aux>
            <Toolbar 
                isAuth={props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler} />
            <SideDrawer
                isAuth={props.isAuthenticated}
                open={sideDrawer}
                closed={sideDrawerClosedHandler} />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token != null
    }
}

export default connect(mapStateToProps)(Layout);