import * as actionTypes from './actionTypes';
import axios from '../../../axios-orders';

export const addIngredient = (ing) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: ing
    }
}

export const removeIngredient = (ing) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: ing
    }
}

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    }
}

export const fetchIngredientsError = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_ERROR
    }
}

export const initIngredients = () => {
    return dispatch => {
        axios.get( 'https://react-burger-builder-dc691.firebaseio.com/ingredients.json' )
            .then( response => {
                dispatch(setIngredients(response.data));
                        } )
            .catch( error => {
                dispatch(fetchIngredientsError());
            } );
    }
}