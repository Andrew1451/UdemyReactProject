import React, { useEffect } from 'react';
import axios from '../../axios-orders';
import { connect } from 'react-redux';
import Order from '../../components/Order/Order';
import * as action from '../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const Orders = props => {
    // componentDidMount() {
    //     this.props.onFetchOrders(this.props.token, this.props.userId)
    // }
    const { onFetchOrders, token, userId } = props;
    useEffect(() => {
        onFetchOrders(token, userId);
    }, [onFetchOrders, token, userId]); 
    let orders = <Spinner />;
    if (!props.loading) {
        orders = props.orders.map(order => (
            <Order ingredients={order.ingredients} price={order.price} key={order.id} />
        ));
    }
    return (
        <div>
            {orders}
        </div>
    )
}
const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(action.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(Orders, axios));