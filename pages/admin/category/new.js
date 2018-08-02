import React, { Component } from 'react';
import Head from 'next/head';

import TextField from '../../../components/ui/TextField';
import Button from '../../../components/ui/Button';
import AdminLayout from '../../../components/AdminLayout';

import axios from 'axios';

export default class NewCategoryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            errors: {},
            form: undefined,
            created: undefined, // category Object received from server
            success: false,
            sending: false
        };
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onSubmitCategory = this.onSubmitCategory.bind(this);
    }

    onChangeCategory(e) {
        // Add or modify the key that corresponds
        let category = this.state.category;
        category[e.target.name] = e.target.value;
        this.setState({ category });
    }

    onSubmitCategory(e) {
        e.preventDefault();
        // Do some client-side validations
        let required = ['name'], errors = {};
        required.forEach(key => {
            if(!(key in this.state.category)) {
                errors[key] = `The ${key} is required.`;
            }
        });
        if(Object.keys(errors).length) {
            return this.setState({ errors });
        }
        // Mark as sending
        this.setState({ sending: true });
        // Do the request to store this category
        axios.post('/api/categories', { category: this.state.category }).then(res => {
            this.setState({ sending: false, success: true, errors: {}, created: res.data.category });
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
        return (
            <AdminLayout>
                <Head>
                    <title>Create category</title>
                </Head>
                <form action="" method="POST" onSubmit={this.onSubmitCategory} ref={(el) => this.state.form = el}>
                    {this.state.success && (
                        <div className="notification is-success">
                            <h2 className="subtitle">The category {this.state.created.name} has been created successfully.</h2>
                        </div>
                    )}
                    <h1 className="title is-size-5">Create category</h1>
                    <hr/>
                    <TextField
                        name={"name"}
                        label={"Name"}
                        onChange={this.onChangeCategory}
                        error={this.state.errors.name && this.state.errors.name}
                        placeholder={"Enter new category name"}
                    />
                    <Button
                        type={"submit"}
                        sending={this.state.sending}
                        label={"Submit"}
                        classes={"is-link"}
                        onClick={this.onSubmitCategory}
                    />
                </form>
            </AdminLayout>            
        )
    }
}