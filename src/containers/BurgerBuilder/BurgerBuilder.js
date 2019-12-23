import React, { Component } from 'react';
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

export class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false
    }

    componentDidMount () {
        this.props.onInitIngredients()
    }

    updatePurchaseState () {
        const sum = Object.keys( this.props.ing )
            .map( igKey => {
                return this.props.ing[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0 ;
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState( { purchasing: true } );
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/authorization');
        }
        
    }

    purchaseCancelHandler = () => {
        this.setState( { purchasing: false } );
    }

    purchaseContinueHandler = () => {
        this.props.onPurchaseInit();
        this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ing
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        if ( this.props.ing ) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ing} />
                    <BuildControls
                        ingredientAdded={this.props.onAddIngredientHandler}
                        ingredientRemoved={this.props.onRemoveIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState()}
                        isAuth={this.props.isAuthenticated}
                        ordered={this.purchaseHandler}
                        price={this.props.price} />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ing}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }
  
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
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