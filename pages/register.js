import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

import axios from 'axios';

class RegisterPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {},
            errors: {},
            sending: false,
            success: false,
            registered: undefined,
            // The interval function and the amount of seconds left until redirection
            redirectTime: 3,
            redirectInterval: undefined
        };
        this.onChangeRegisterDetails = this.onChangeRegisterDetails.bind(this);
        this.onSubmitRegister = this.onSubmitRegister.bind(this);
    }

    onChangeRegisterDetails(e) {
        let user = this.state.user;
        user[e.target.name] = e.target.value;
        this.setState({ user });
    }

    onSubmitRegister(e) {
        e.preventDefault();
        // Do some client-side validations
        let required = ['username', 'password', 'password_confirm'], errors = {};
        required.forEach(key => {
            if(!(key in this.state.user)) {
                errors[key] = `The ${key} is required.`;
            }
        });
        if(Object.keys(errors).length) {
            return this.setState({ errors });
        } else {
            // Check that both passwords match
            if(this.state.user.password !== this.state.user.password_confirm) {
                return this.setState({ errors: { password_confirm: "The passwords don't match" } });
            }
        }

        // All checks go
        this.setState({ sending: true, errors: {} });

        let { username, password } = this.state.user;
        axios.post('/api/auth/register', {
            username, password
        }).then(result => {
            console.log('res: ', result)
            if(result.data.success === true) {
                let { user } = result.data;
                setTimeout(() => {
                    Router.push('/login');
                }, 3500);
                // Start the interval to lower the redirect time
                let redirectInterval = setInterval(() => {
                    let redirectTime = this.state.redirectTime;
                    // If the redirect time is over, clear this interval, else, lower the time
                    if(redirectTime === 0) {
                        clearInterval(this.state.redirectInterval);
                    } else {
                        this.setState({ redirectTime: this.state.redirectTime - 1 });
                    }
                }, 1000);
                // Update the state to reassure we are no longer sending a request, we got a response, and we set the interval to redirect
                this.setState({ sending: false, success: true, redirectInterval, registered: user });
            } else {
                this.setState({ sending: false, success: false, errors: result.data.errors });
            }
        }).catch(error => {
            this.setState({ errors: error.response.data.errors, sending: false, success: false });
        });
    }

    render () {
        return (
            <div>
                <Head>
                    <title>Create account</title>
                </Head>
                {this.state.success && (
                    <div className="notification is-success">
                        <h2 className="subtitle">You were registered successfully.</h2>
                        <p>Redirecting you to the login page in {this.state.redirectTime}...</p>
                    </div>
                )}
                <p>Register</p>
                <form method="POST" action="" onSubmit={this.onSubmitRegister}>
                    <TextField 
                        label={"Username"}
                        name={"username"}
                        onChange={this.onChangeRegisterDetails}
                        error={this.state.errors.username && this.state.errors.username}
                    />
                    <TextField 
                        type={"password"}
                        label={"Password"}
                        name={"password"}
                        onChange={this.onChangeRegisterDetails}
                        error={this.state.errors.password && this.state.errors.password}
                    />
                    <TextField 
                        type={"password"}
                        label={"Confirm password"}
                        name={"password_confirm"}
                        onChange={this.onChangeRegisterDetails}
                        error={this.state.errors.password_confirm && this.state.errors.password_confirm}
                    />
                    <Button
                        label={"Register"}
                        onClick={this.onSubmitRegister}
                        sending={this.state.sending}
                        classes={"is-link"}
                    />
                </form>
            </div>
        )
    }
}

export default RegisterPage;