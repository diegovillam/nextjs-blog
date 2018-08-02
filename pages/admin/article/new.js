import React, { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import TextField from '../../../components/ui/TextField';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import AdminLayout from '../../../components/AdminLayout';

import axios from 'axios';

export default class NewArticlePage extends Component {
    static async getInitialProps(context) {
        let { req } = context;
        const url = req ? `${req.protocol}://${req.get('Host')}` : '';
        const res = await axios.get(`${url}/api/categories`);
        return { 
            categories: res.data
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            article: {},
            errors: {},
            form: undefined,
            created: undefined, // article Object received from server
            success: false,
            sending: false
        };
        this.onChangeArticle = this.onChangeArticle.bind(this);
        this.onSubmitArticle = this.onSubmitArticle.bind(this);
    }

    onChangeArticle(e) {
        // Add or modify the key that corresponds
        let article = this.state.article;
        article[e.target.name] = e.target.value;
        this.setState({ article });
    }

    onSubmitArticle(e) {
        e.preventDefault();
        // Do some client-side validations
        let required = ['title', 'content', 'category'], errors = {};
        required.forEach(key => {
            if(!(key in this.state.article) || this.state.article[key] === 0 || !this.state.article[key]) {
                errors[key] = `The ${key} is required.`;
            }
        });
        if(Object.keys(errors).length) {
            return this.setState({ errors });
        }
        // Mark as sending
        this.setState({ sending: true });
        // Do the request to store this article
        axios.post('/api/articles', { article: this.state.article }).then(res => {
            this.setState({ sending: false, success: true, errors: {}, created: res.data.article });
            this.state.form.reset();
        }).catch(err => {
            if(err.response.data) {
                this.setState({ errors: err.response.data, success: false, sending: false });
            } else {
                this.setState({ success: false, sending: false });
                console.log('Server Error: ', err.response);
            }
        });
    }

    render() {
        let categories = [{name: 'Select one', value: '0', disabled: true}];    
        this.props.categories.forEach(category => {
            categories.push({name: category.name, value: category.id});
        });

        return (
            <AdminLayout>
                <Head>
                    <title>Create article</title>
                </Head>
                <form action="" method="POST" onSubmit={this.onSubmitArticle} ref={(el) => this.state.form = el}>
                    {this.state.success && (
                        <div className="notification is-success">
                            <h2 className="subtitle">The article has been published successfully.</h2>
                            <p>Click <Link href={`/article?id=${this.state.created.id}`} as={`/article/${this.state.created.id}`}><a>here</a></Link> to view it.</p>
                        </div>
                    )}
                    <h1 className="title is-size-5">Create article</h1>
                    <hr/>
                    <TextField
                        name={"title"}
                        label={"Title"}
                        onChange={this.onChangeArticle}
                        error={this.state.errors.title && this.state.errors.title}
                        placeholder={"Enter new article title"}
                    />
                    <TextField
                        name={"subtitle"}
                        label={"Subtitle (optional)"}
                        onChange={this.onChangeArticle}
                        error={this.state.errors.subtitle && this.state.errors.subtitle}
                        placeholder={"Enter new article subtitle, or leave blank if there's none"}
                    />
                    <TextArea
                        name={"content"}
                        label={"Content"}
                        onChange={this.onChangeArticle}
                        error={this.state.errors.content && this.state.errors.content}
                        placeholder={"You can use Markdown to style your content"}
                    />
                    <Select
                        name={"category"}
                        label={"Category"}
                        onChange={this.onChangeArticle}
                        default={0}
                        options={categories}
                        error={this.state.errors.category && this.state.errors.category}
                        classes={"is-fullwidth"}
                    />
                    <Button
                        type={"submit"}
                        sending={this.state.sending}
                        label={"Submit"}
                        classes={"is-link"}
                        onClick={this.onSubmitArticle}
                    />
                </form>
            </AdminLayout>            
        )
    }
}