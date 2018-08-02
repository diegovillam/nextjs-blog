import App, { Container } from 'next/app';
import { Provider, connect } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import cookie from 'js-cookie';
import axios from 'axios';

import Layout from '../components/Layout';
import { initStore } from '../store';
import Auth from '../utils/Auth';

import { LOGGED_IN } from '../actions/types';

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let { req } = ctx, user = undefined, token = undefined;
        
        // Renderered from server
        if(req) {
            if(req.cookies.id_token) {
                token = req.cookies.id_token;
                user = await Auth.getUser(token, req);
            }
        } else { // Rendered from client
            token = cookie.get('id_token');
            if(token) {
                user = await Auth.getUser(token, null);
            }
        }
        return {
            user,
            token,
            // categories,
            pageProps: (Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
        };
        
    }
    render () {
        const { Component, pageProps, store, user, token, categories } = this.props;

        return (
            <Container>
                <Provider store={store}>
                    <Layout user={user} token={token} /*categories={categories}*/>
                        <Component {...pageProps} />
                    </Layout>
                </Provider>
            </Container>
        );
    }
}

export default withRedux(initStore)(MyApp);

/*import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';

import { login } from './../actions/sessionActions';
import Auth from './../utils/Auth';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.recoverExistingSession = this.recoverExistingSession.bind(this);
    }
    componentDidMount() {
        if(!this.props.token) {
            this.recoverExistingSession();
        }
    }
    recoverExistingSession() {
        if(document.cookie.includes('id_token')) {
            let id_token = Auth.parseCookieToken(document.cookie);
            if(id_token && id_token.length > 1) {
                Auth.getUser(id_token).then(user => {
                    this.props.login(id_token, user);
                });
            }
        }
    }
    render() {
        return (
            <main className="container">
                {this.props.user !== null ? (
                    <Link href="/logout">
                        <a>Logout</a>
                    </Link>
                ) : (
                    <div>
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                        <Link href="/register">
                            <a>Register</a>
                        </Link>
                    </div>                        
                )}
                {this.props.children}
            </main>
        )
    }
}

const mapStateToProps = state => ({
    token: state.session.token,
    user: state.session.user
});

export default connect(mapStateToProps, { login })(Layout);*/
