import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Link from 'next/link'
import Head from 'next/head';
import axios from 'axios';

import ArticlePreview  from '../components/ArticlePreview';

class ProfilePage extends Component {
    static async getInitialProps(context) {
        let { req, query } = context;
        const url = req ? `${req.protocol}://${req.get('Host')}` : '';
        const res = await axios.get(`${url}/api/users/${query.username}?include_articles=true`);
        return {
            user: res.data, 
            username: query.username
        };
    }
    render() {
        const { username, user, session } = this.props;
        const self = (user && session) ? session.user.id === user.id : false;
        return (
            !user ? (
                <div className="notification is-danger">
                    <h1 className="title"><i>Oops...</i></h1>
                    <p>That profile <strong>({username})</strong> does not exist.</p>
                    <Head>
                        <title>User Not Found</title>
                    </Head>
                </div>
            ) : (
                <div>
                    <div className="has-text-centered is-flex is-horizontal-center">
                        <Head>
                            <title>Profile: {username}</title>
                        </Head>
                        {self && (
                            <small>
                                <Link href='/account'><a className="hover">(Edit profile)</a></Link>
                            </small>
                        )}
                        <br/>
                        {user.image && (
                            <img src={`/static/uploads/${user.image}`} className="profile-image" alt={user.username}/>
                        )}
                        <br/>
                        <h1 className="title">{username}</h1>
                        
                        <h3 className="subtitle is-size-5">With us since {user.createdAtFormatted}</h3>
                    </div>
                    {user.articles.length && (
                        <div>
                            <hr/>
                            <p>
                                <span className="subtitle">
                                    Recent stories
                                </span>
                                &nbsp;
                                <span>
                                    <small><Link href={`/?user=${user.id}`}>
                                        <a>(View all stories by {user.username})</a>
                                    </Link></small>
                                </span> 
                            </p>
                            {user.articles.map(article => {
                                return (
                                    <ArticlePreview
                                        sample={true}
                                        article={article}
                                        key={article.id}
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>                    

            )
        )
    }
}

const mapStateToProps = state => ({ session: state.session });
export default withRouter(connect(mapStateToProps, null)(ProfilePage));