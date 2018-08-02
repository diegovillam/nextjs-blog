import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

import Button from '../../../components/ui/Button';
import TextField from '../../../components/ui/TextField';
import TextArea from '../../../components/ui/TextArea';
import ArticlePreview from '../../../components/ArticlePreview';
import AdminLayout from '../../../components/AdminLayout';

export default class EditArticlePage extends Component {
    static async getInitialProps(context) {
        let { req, query } = context;
        const url = req ? `${req.protocol}://${req.get('Host')}` : '';
        const res = await axios.get(`${url}/api/articles/${query.id}`);
        
        return { 
            article:  res.data ? (res.data.deleted ? undefined : res.data) : undefined,
            original: res.data ? (res.data.deleted ? undefined : res.data) : undefined
        };
    }    

    constructor(props) {
        super(props);
        this.state = {
            original: this.props.original, // Initial article 
            article: this.props.article, // Article after modification
            errors: {},
            error: undefined,
            sending: false,
            success: false
        };
        this.onChangeArticle = this.onChangeArticle.bind(this);
        this.onConfirmEdit = this.onConfirmEdit.bind(this);

    }

    onChangeArticle(e) {
        // Add or modify the key that corresponds
        let article = this.state.article;
        article[e.target.name] = e.target.value;
        this.setState({ article });
    }

    onConfirmEdit(e) {
        e.preventDefault();
        let { article } = this.state;

        axios.put(`/api/articles/${this.state.article.id}`, { article }).then(res => {
            // Success
            this.setState({ sending: false, success: true });
        }).catch(err => {
            if(err.response.status === 401) {
                return this.setState({ error: "You are not authorized to do this. You might not be the author or an administrator. "});
            }
            if(err.response.data.errors) {
                return this.setState({ error: undefined, errors: err.response.data.errors, sending: false });
            }
            this.setState({ error: err.response.statusText, sending: false });
            console.log('Server Error: ', err.response);
        });
    }

    render() {
        let { article } = this.props;
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
                    <div>
                        <Head>
                            <title>Edit: {this.props.original.title}</title>
                        </Head>

                        <form action="" method="PUT" onSubmit={this.onConfirmEdit}>
                            {this.state.success && (
                                <div className="notification is-success">
                                    <h2 className="subtitle">The article has been edited successfully.</h2>
                                    <p>Click <Link href={`/article?id=${this.state.article.id}`} as={`/article/${this.state.article.id}`}><a>here</a></Link> to view it.</p>
                                </div>
                            )}
                            {this.state.error && (
                                <div className="notification is-danger">
                                    <h1 className="title"><i>Oops...</i></h1>
                                    <p>{this.state.error}</p>
                                </div>
                            )}
                            <h1 className="title is-size-5">Edit article</h1>
                            <hr/>
                            <TextField
                                label={"Author"}
                                defaultValue={this.state.article.user.username}
                                readonly={true}
                            />
                            <TextField
                                name={"title"}
                                label={"Title"}
                                onChange={this.onChangeArticle}
                                error={this.state.errors.title && this.state.errors.title}
                                defaultValue={this.state.article.title}
                            />
                            <TextField
                                name={"subtitle"}
                                label={"Subtitle (optional)"}
                                onChange={this.onChangeArticle}
                                error={this.state.errors.subtitle && this.state.errors.subtitle}
                                defaultValue={this.state.article.subtitle || ''}
                            />
                            <TextArea
                                name={"content"}
                                label={"Content"}
                                onChange={this.onChangeArticle}
                                error={this.state.errors.content && this.state.errors.content}
                                defaultValue={this.state.article.content}
                                placeholder={"You can use Markdown to style your content"}
                            />
                            <Button
                                type={"submit"}
                                sending={this.state.sending}
                                label={"Confirm changes"}
                                classes={"is-link"}
                                onClick={this.onConfirmEdit}
                            />
                        </form>
                    </div>
                )}
            </AdminLayout>
        )
    }
}