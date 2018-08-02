import React, { Component } from 'react';
import Head from 'next/head';
import axios from 'axios';

import cookie from 'js-cookie';

import AdminLayout from '../../components/AdminLayout';

export default class AdminIndexPage extends Component {
    constructor(props) {
        super(props);
        this.state = { stats: {} };
    }
    componentWillMount() {
        // We get the stats from here and not from getInitialProps because sometimes it will be rendered from the server
        // At that point, the Ajax request (made from the server) will have no cookies so we can't validy authorization
        // Another solution would be to send the token in the header but I'll have to alter the middlewares first
        // Here, the request is done from the client and thus it contains the cookies
        axios.get('/api/admin/stats').then(res => {
            return this.setState({ stats: res.data });
        });
    }
    render() {
        const { stats } = this.state;
        console.log('stats: ', stats);
        return (
            <AdminLayout>
                <Head>
                    <title>Dashboard</title>
                </Head>
                <div className="columns">
                    <div className="column is-6">
                        <div className="box is-radiusless">
                            <div className="has-text-centered">
                                <h2 className="title white">{stats.articlesCount}</h2>
                                <p>articles</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-6">
                        <div className="box is-radiusless">
                        <div className="has-text-centered">
                                <h2 className="title">{stats.usersCount}</h2>
                                <p>users</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-6">
                        <div className="box is-radiusless">
                        <div className="has-text-centered">
                                <h2 className="title white">{stats.categoriesCount}</h2>
                                <p>categories</p>
                            </div>
                        </div>
                    </div>
                    <div className="column is-6">
                        <div className="box is-radiusless">
                        <div className="has-text-centered">
                                <h2 className="title">{stats.commentsCount}</h2>
                                <p>comments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        )
    }
}