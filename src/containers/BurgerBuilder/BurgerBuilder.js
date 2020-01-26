import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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

    useEffect(() => {
        props.onInitIngredients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updatePurchaseState = () => {
        const sum = Object.keys( props.ing )
            .map( igKey => {
                return props.ing[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0 ;
    }

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true);
        } else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/authorization');
        }
        
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        props.onPurchaseInit();
        props.history.push('/checkout');
    }

    const disabledInfo = {
        ...props.ing
    };
    for ( let key in disabledInfo ) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if ( props.ing ) {
        burger = (
            <Aux>
                <Burger ingredients={props.ing} />
                <BuildControls
                    ingredientAdded={props.onAddIngredientHandler}
                    ingredientRemoved={props.onRemoveIngredientHandler}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState()}
                    isAuth={props.isAuthenticated}
                    ordered={purchaseHandler}
                    price={props.price} />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={props.ing}
            price={props.price}
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

const mapStateToProps = state => {
    return {
        ing: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAddIngredientHandler: (ing) => dispatch(actionType.addIngredient(ing)),
        onRemoveIngredientHandler: (ing) => dispatch(actionType.removeIngredient(ing)),
        onInitIngredients: () => dispatch(actionType.initIngredients()),
        onPurchaseInit: () => dispatch(actionType.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actionType.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler( BurgerBuilder, axios ));