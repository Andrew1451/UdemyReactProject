import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionType from '../store/actions/index';

const BurgerBuilder = props => {
    // constructor(props) {
    //     super(props);
    //     state = {...}
    // }
    // state = {
    //     purchasing: false
    // }
    const [purchasing, setPurchasing] = useState(false);

    const ing = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.token !== null);

    const dispatch = useDispatch();
    const onAddIngredientHandler = (ing) => dispatch(actionType.addIngredient(ing));
    const onRemoveIngredientHandler = (ing) => dispatch(actionType.removeIngredient(ing));
    const onInitIngredients = useCallback(() => dispatch(actionType.initIngredients()), [dispatch]);
    const onPurchaseInit = () => dispatch(actionType.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actionType.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients()
    }, [onInitIngredients]);

    const updatePurchaseState = () => {
        const sum = Object.keys( ing )
            .map( igKey => {
                return ing[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0 ;
    }

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/authorization');
        }
        
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onPurchaseInit();
        props.history.push('/checkout');
    }

    const disabledInfo = {
        ...ing
    };
    for ( let key in disabledInfo ) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if ( ing ) {
        burger = (
            <Aux>
                <Burger ingredients={ing} />
                <BuildControls
                    ingredientAdded={onAddIngredientHandler}
                    ingredientRemoved={onRemoveIngredientHandler}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState()}
                    isAuth={isAuthenticated}
                    ordered={purchaseHandler}
                    price={price} />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={ing}
            price={price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />;
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
}

// const mapStateToProps = state => {
//     return {
//         ing: state.burgerBuilder.ingredients,
//         price: state.burgerBuilder.totalPrice,
//         error: state.burgerBuilder.error,
//         isAuthenticated: state.auth.token !== null
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         onAddIngredientHandler: (ing) => dispatch(actionType.addIngredient(ing)),
//         onRemoveIngredientHandler: (ing) => dispatch(actionType.removeIngredient(ing)),
//         onInitIngredients: () => dispatch(actionType.initIngredients()),
//         onPurchaseInit: () => dispatch(actionType.purchaseInit()),
//         onSetAuthRedirectPath: (path) => dispatch(actionType.setAuthRedirectPath(path))
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler( BurgerBuilder, axios ));

export default withErrorHandler( BurgerBuilder, axios );