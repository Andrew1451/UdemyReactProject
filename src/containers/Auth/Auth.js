import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';

class Auth extends Component {
    state = {
        controls: {
            email: {
                inputType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Name'
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
    }
    checkValidity(value, rules) {
        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }
    inputChangedHandler = (event, elementName) => {
        const updatedControls = {
            ...this.state.controls,
            [elementName]: {
                ...this.state.controls[elementName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[elementName].validation),
                touched: true
            }
        }
        this.setState({controls: updatedControls});
        
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }
        const form = formElementsArray.map(formElement => (
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
        )) 
        return (
            <div className={classes.Auth}>
                <form>
                    {form}
                    <Button btnType='Success'>SUBMIT</Button>
                </form>
            </div>
        )
    }
}

export default Auth;