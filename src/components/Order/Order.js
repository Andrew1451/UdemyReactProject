import React from 'react';
import classes from './Order.module.css'

const order = (props) => {
    // const ingredientsArr = Object.keys(props.ingredients)
    // .map(ing => (`${ing} ${props.ingredients[ing]} `))
    const ingredients = [];
    for (let ingredientName in props.ingredients) {
        ingredients.push({
            name: ingredientName,
            amount: props.ingredients[ingredientName]
        })
    }
    const ingredientOutput = ingredients.map(ing => (
        <span style={{
            textTransform: 'capitalize',
            display: 'inline-block',
            margin: '0 8px',
            border: '1px solid #ccc',
            padding: '5px'
        }} key={ing.name}> {ing.name} {ing.amount} </span>
    ))
    return (
    <div className={classes.Order}>
        {/* <p>Ingredients: {ingredientsArr}</p> */}
        <p>Ingredients: {ingredientOutput}</p>
        <p>Price: <strong>${Number.parseFloat(props.price).toFixed(2)}</strong></p>
    </div>
)}

export default order;