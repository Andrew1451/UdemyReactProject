import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../containers/store/actions/index';
import { Redirect } from 'react-router-dom';

const Logout = props => {

    useEffect(() => {
        props.onLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Redirect to='/'/>
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    }
}

export default connect(null, mapDispatchToProps)(Logout);