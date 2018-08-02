import React, { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import axios from 'axios';

import ArticlePreview from '../components/ArticlePreview';
import Comments from '../components/Comments';

class Article extends Component {
    static async getInitialProps(context) {
        let { req, query } = context;
        const url = req ? `${req.protocol}://${req.get('Host')}` : '';
        const article = await axios.get(`${url}/api/articles/${query.id}`);

        const comments = await axios.get(`${url}/api/comments/${query.id}?limit=10`)
        return { 
            article: article.data,
            comments: comments.data
        };
    }
    render() {
        const { article, comments } = this.props;
        // Is author if created this article or if is admin, or if there is no user, it's not an autor
        const author = this.props.user ? this.props.user.id === article.user.id || this.props.user.admin > 0 : false;

        return (
            !article ? (
                <div className="notification is-danger">
                    <Head>
                        <title>Article Not Found</title>
                    </Head>
                    <h1 className="title"><i>Oops...</i></h1>
                    <p>That article does not exist.</p>
                </div>
            ) : (
                <div>
                    <Head>
                        <title>{article.title}</title>
                    </Head>
                    <ArticlePreview
                        sample={false}
                        author={author}
                        article={article}
                    />
                    <Comments
                        article={article}
                        comments={comments}
                        author={author}

                    />          
                </div>
            )
        )
    }
}

const mapStateToProps = state => ({
    user: state.session.user
});
export default withRouter(connect(mapStateToProps, null)(Article));