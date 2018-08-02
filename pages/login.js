import React, { Component } from 'react';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';

import { login } from './../actions/sessionActions';
import { connect } from 'react-redux';

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {},
            sending: false,
            success: false,
            errors: {},
            // The interval function and the amount of seconds left until redirection
            redirectInterval: undefined,
            redirectTime: 3
        };
        this.onChangeLoginDetails = this.onChangeLoginDetails.bind(this);
        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    onChangeLoginDetails(e) {
        // Add or modify the key that corresponds
        let user = this.state.user;
        user[e.target.name] = e.target.value;
        this.setState({ user });
    }

    onSubmitLogin(e) {
        e.preventDefault();
        // Do some client-side validations
        let required = ['username', 'password'], errors = {};
        required.forEach(key => {
            if(!(key in this.state.user)) {
                errors[key] = `The ${key} is required.`;
            }
        });
        if(Object.keys(errors).length) {
            return this.setState({ errors });
        }
        
        this.setState({ sending: true });
        // Send request to auth API
        let { username, password } = this.state.user;
        axios.post('/api/auth/login', {
            username, password
        }).then(result => {
            let { token, success, user, errors } = result.data;
            if(success) {
                this.props.login(token, user);
                setTimeout(() => {
                    Router.push('/');
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
                this.setState({ sending: false, success: true, redirectInterval });
            } else {
                // An error has occured, update the errors and mark as not sending anymore
                this.setState({ sending: false, success: false, errors });
            }
        }).catch(error => {
            // Errors are usually passed in an Object where each key refers to the wrong input
            let { errors } = error.response.data;
            this.setState({ errors, sending: false, success: false });
        });
    }

    render () {
        return (
            <div>
                <Head>
                    <title>Log in</title>
                </Head>
                {this.state.success && (
                    <div className="notification is-success">
                        <h2 className="subtitle">You were logged in successfully.</h2>
                        <p>Redirecting you in {this.state.redirectTime}...</p>
                    </div>
                )}
                <p>Login</p>
                <form action="" method="POST" onSubmit={this.onSubmitLogin}>
                    <TextField 
                        label={"Username"}
                        name={"username"}
                        onChange={this.onChangeLoginDetails}
                        error={this.state.errors.username && this.state.errors.username}
                    />
                    <TextField 
                        type={"password"}
                        label={"Password"}
                        name={"password"}
                        onChange={this.onChangeLoginDetails}
                        error={this.state.errors.password && this.state.errors.password}
                    />
                    <Button
                        label={"Login"}
                        onClick={this.onSubmitLogin}
                        sending={this.state.sending}
                        classes={"is-link"}
                    />
                </form>
            </div>
        )
    }
}

export default connect(null, { login })(LoginPage);