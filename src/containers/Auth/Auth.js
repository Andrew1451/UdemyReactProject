import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../store/actions/index';
import classes from './Auth.module.css';

class Auth extends Component {
    state = {
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
        },
        isSignup: true
    }
    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }
    inputChangedHandler = (event, elementName) => {
        const updatedControls = updateObject(this.state.controls, {
            [elementName]: updateObject(this.state.controls[elementName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[elementName].validation),
                touched: true
            })
        });
        this.setState({controls: updatedControls});
    }
    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup}
        })
    }
    submitHandler = (event) => {
        event.preventDefault();
        const email = this.state.controls.email.value;
        const password = this.state.controls.password.value;
        const isSignup = this.state.isSignup;
        this.props.onAuth(email, password, isSignup)
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
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
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
        ));
        if (this.props.loading) {
            form = <Spinner />
        }
        // eslint-disable-next-line no-unused-vars
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
            <p>{this.props.error.message}</p>
            )
        }
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }
        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType='Success'>SUBMIT</Button>
                </form>
                <Button clicked={this.switchAuthModeHandler} btnType='Danger'>SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        )
    }
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