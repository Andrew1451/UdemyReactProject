import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Burger Builder</NavigationItem>
        <NavigationItem link="/orders" exact>Orders</NavigationItem>
        {!props.isAuthenticated 
            ? <NavigationItem link="/authorization" exact>Authorization</NavigationItem>
            : <NavigationItem link="/logout" exact>Logout</NavigationItem>}
    </ul>
);

export default navigationItems;