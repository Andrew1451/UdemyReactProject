import * as actionType from './actionTypes';
import axios from '../../../axios-orders';

export const purchaseBurgerSuccess = (id, formData) => {
    return {
        type: actionType.PURCHASE_BURGER_SUCCESS,
        id: id,
        formData: formData
    }
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionType.PURCHASE_BURGER_FAIL,
        error: error
    }
}

export const purchaseBurgerStart = () => {
    return {
        type: actionType.PURCHASE_BURGER_START
    }
}

export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post( '/orders.json?auth=' + token, orderData )
            .then( response => {
                console.log(response.data);
                dispatch(purchaseBurgerSuccess(response.data.name, orderData))
            } )
            .catch( error => {
                dispatch(purchaseBurgerFail(error))
            } );
    }
}

export const purchaseInit = () => {
    return {
        type: actionType.PURCHASE_INIT
    }
}

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionType.FETCH_ORDERS_SUCCESS,
        orders: orders
    }
}

export const fetchOrdersFail = (error) => {
    return {
        type: actionType.FETCH_ORDERS_FAIL,
        error: error
    }
}

export const fetchOrdersStart = () => {
    return {
        type: actionType.FETCH_ORDERS_START
    }
}

export const fetchOrders = (token, userId) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`;
        axios.get( '/orders.json' + queryParams )
            .then(res => {
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    })
                }
                // this.setState({orders: fetchedOrders, loading: false})
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(err => {
                dispatch(fetchOrdersFail(err))
            })
    }
}
