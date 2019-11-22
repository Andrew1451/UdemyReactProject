import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Burger Builder</NavigationItem>
        <NavigationItem link="/orders" exact>Orders</NavigationItem>
        <NavigationItem link="/authorization" exact>Authorization</NavigationItem>
    </ul>
);

export default navigationItems;