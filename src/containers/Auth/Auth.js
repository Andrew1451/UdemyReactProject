import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../store/actions/index';
import classes from './Auth.module.css';

const Auth = props => {
    const [authForm, setAuthForm] = useState({
        controls: {
            email: {
                inputType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                inputType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        }
    });
    const [isSignUp, setIsSignUp] = useState(false);
    useEffect(() => {
        if (!props.buildingBurger && props.authRedirectPath !== '/') {
            props.onSetAuthRedirectPath();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const inputChangedHandler = (event, elementName) => {
        const updatedControls = updateObject(authForm.controls, {
            [elementName]: updateObject(authForm.controls[elementName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm.controls[elementName].validation),
                touched: true
            })
        });
        setAuthForm({controls: updatedControls});
    }
    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp)
    }
    const submitHandler = (event) => {
        event.preventDefault();
        const email = authForm.controls.email.value;
        const password = authForm.controls.password.value;
        const isSignup = authForm.isSignup;
        props.onAuth(email, password, isSignup)
    }

    const formElementsArray = [];
    for (let key in authForm.controls) {
        formElementsArray.push({
            id: key,
            config: authForm.controls[key]
        })
    }
    let form = formElementsArray.map(formElement => (
        <Input 
            key={formElement.id} 
            elementType={formElement.config.inputType} 
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => inputChangedHandler(event, formElement.id)}
        />
    ));
    if (props.loading) {
        form = <Spinner />
    }
    // eslint-disable-next-line no-unused-vars
    let errorMessage = null;
    if (props.error) {
        errorMessage = (
        <p>{props.error.message}</p>
        )
    }
    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />
    }
    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType='Success'>SUBMIT</Button>
            </form>
            <Button clicked={switchAuthModeHandler} btnType='Danger'>SWITCH TO {isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Auth);