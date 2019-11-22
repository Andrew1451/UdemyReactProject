import * as actionType from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    ingredients: {
        salad: 0,
        bacon: 0,
        meat: 0,
        cheese: 0
    },
    totalPrice: 4,
    error: false
}

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const addIngredient = (state, action) => {
    const updateIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
    const updatedIngredients = updateObject(state.ingredients, updateIngredient);
    const updatedState = {
        ...state,
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
    };
    return updateObject(state, updatedState);
}

const removeIngredient = (state, action) => {
    const updateIng = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
    const updateIngs = updateObject(state.ingredients, updateIng);
    const updateSt = {
        ...state,
        ingredients: updateIngs,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
    }
    return updateObject(state, updateSt);
}

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat
        },
        error: false,
        totalPrice: 4
    })
}

const fetchIngredientsError = (state, action) => {
    return updateObject(state, { error: true });
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.ADD_INGREDIENT: return addIngredient(state, action);
        case actionType.REMOVE_INGREDIENT: return removeIngredient(state, action);
        case actionType.SET_INGREDIENTS: return setIngredients(state, action);           
        case actionType.FETCH_INGREDIENTS_ERROR: return fetchIngredientsError(state, action);
        default: return state;
    }
    
}

export default reducer;