import React, { Component } from 'react';
import Head from 'next/head';

import TextField from '../../../components/ui/TextField';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import AdminLayout from '../../../components/AdminLayout';

import axios from 'axios';

export default class EditCategoryPage extends Component {
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
            categories: this.props.categories, 
            sending: false,
            success: false,
            selected: undefined,
            edited: {},
            errors: {}
        };
        this.onSelectCategory = this.onSelectCategory.bind(this);
        this.onEditCategory = this.onEditCategory.bind(this);
        this.onSubmitEdit = this.onSubmitEdit.bind(this);
    }
    onEditCategory(e) {
        // Only allow input if a category has been selected
        if(!this.state.selected || this.state.selected === 0) {
            return;
        }
        let edited = this.state.edited;
        edited[e.target.name] = e.target.value;
        this.setState({ edited });
    }
    onSelectCategory(e) {
        // Get the new "edited" name value
        let edited = this.state.edited;
        this.state.categories.forEach(category => {
            if(category.id == e.target.value) {
                Object.keys(category).forEach(key => {
                    edited[key] = category[key];
                });
            }
        });
        this.setState({ selected: Number(e.target.value), edited, success: false });
    }
    onSubmitEdit(e) {
        e.preventDefault();
        let required = ['name'], errors = {};
        required.forEach(key => {
            if(!(key in this.state.edited)) {
                errors[key] = `The ${key} is required.`;
            }
        });
        if(Object.keys(errors).length) {
            return this.setState({ errors });
        }
        // Mark as sending
        this.setState({ sending: true });
        // Do the request to update
        axios.put(`/api/categories/${this.state.edited.id}`, {
            category: this.state.edited
        }).then(res => {
            // Update the categories in the client
            let categories = this.state.categories;
            categories.forEach(category => {
                if(category.id === this.state.edited.id) {
                    category.name = this.state.edited.name;
                }
            });
            this.setState({ success: true, sending: false, categories });
            
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
        // Assemble the options object for the Select component
        let categories = [{name: 'Select one', value: '0', disabled: true}];    
        this.props.categories.forEach(category => {
            categories.push({name: category.name, value: category.id});
        });
        return (
            <AdminLayout>
                <Head>
                    <title>Edit categories</title>
                </Head>
                <form action="" method="POST" onSubmit={this.onSubmitEdit} ref={(el) => this.state.form = el}>
                    {this.state.success && (
                        <div className="notification is-success">
                            <h2 className="subtitle">The category {this.state.edited.name} has been edited successfully.</h2>
                        </div>
                    )}
                    <h1 className="title is-size-5">Edit category</h1>
                    <hr/>
                    <Select
                        name={"category"}
                        label={"Category"}
                        onChange={this.onSelectCategory}
                        default={0}
                        options={categories}
                        classes={"is-fullwidth"}
                    />
                    <TextField
                        name={"name"}
                        label={"Name"}
                        value={this.state.edited.name || ''}
                        error={this.state.errors.name && this.state.errors.name}
                        onChange={this.onEditCategory}
                        placeholder={"Select a category to change its name"}
                    />
                    <Button
                        type={"submit"}
                        sending={this.state.sending}
                        label={"Save changes"}
                        classes={"is-link"}
                        onClick={this.onSubmitEdit}
                    />
                </form>
            </AdminLayout>            
        )
    }
}