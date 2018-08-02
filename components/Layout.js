import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navbar from './Navbar';

// This is using the login action creator to restore the session state
import { login } from './../actions/sessionActions';

class Layout extends Component {
    constructor(props) {
        super(props);
        // Restore the session if the user and token have been passed as a props
        // This is usually done by the _app.js HOC
        if(props.user !== undefined && props.token !== undefined) {
            this.props.login(props.token, props.user);
        }
    }
    render() {
        const { children, user } = this.props;
        return (
            <div>
                <Navbar
                    user={user}
                />
                <main className="container">
                    {children}
                </main>
            </div>
        )
    }
}
export default connect(null, { login })(Layout);