import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

import Button from '../../../components/ui/Button';
import ArticlePreview from '../../../components/ArticlePreview';
import AdminLayout from '../../../components/AdminLayout';

export default class DeleteArticlePage extends Component {
    static async getInitialProps(context) {
        let { req, query } = context;
        const url = req ? `${req.protocol}://${req.get('Host')}` : '';
        const res = await axios.get(`${url}/api/articles/${query.id}`);
        
        return { 
            article: res.data ? (res.data.deleted ? undefined : res.data) : undefined
        };
    }    

    constructor(props) {
        super(props);
        this.state = {
            error: undefined,
            sending: false,
            success: false
        };
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
    }

    onConfirmDelete(e) {
        e.preventDefault();

        this.setState({ sending: true, success: false });

        axios.delete(`/api/articles/${this.props.article.id}`).then(res => {
            this.setState({ sending: false, success: true, error: undefined });
        }).catch(err => {
            if(err.response.status === 401) {
                return this.setState({ error: "You are not authorized to do this. You might not be the author or an administrator. "});
            }
            if(err.response.data.error) {
                return this.setState({ sending: false, success: false, error: err.response.data.error });
            }
            this.setState({ sending: false, success: false });
            console.log('Server Error: ', err.response);
        });
    }

    render() {
        let { article } = this.props;
        let { success, error } = this.state;

        console.log(' errror : ', error);

        return (
            <AdminLayout>
               {!article ? (
                    <div>
                        <Head>
                            <title>Article Not Found</title>
                        </Head>
                        <h1 className="title"><i>Oops...</i></h1>
                        <p>That article does not exist.</p>
                    </div>
                ) : (
                    success ? (
                        <div className="notification is-success">
                            <h1 className="title"><i>Success</i></h1>
                            <p>The article <strong>{article.title}</strong> has been deleted.</p>
                        </div>
                    ) : (
                        <div>
                            <Head>
                                <title>Delete: {article.title}</title>
                            </Head>
                            {error && (
                                <div className="notification is-danger">
                                    <h1 className="title"><i>Oops...</i></h1>
                                    <p>{error}</p>
                                </div>
                            )}   
                            <h2 className="subtitle">Are you sure you want to delete <strong>{article.title}</strong>?</h2>
                            <form method="POST" action="" onSubmit={this.onConfirmDelete}>
                                <Button
                                    type={"submit"}
                                    onClick={this.onConfirmDelete}
                                    label={"Yes, delete"}
                                    sending={this.state.sending}
                                    classes={"is-danger"}
                                />
                            </form>
                            <hr/>
                            <ArticlePreview article={article}/>
                        </div>
                    )
                )}
            </AdminLayout>
        )
    }
}