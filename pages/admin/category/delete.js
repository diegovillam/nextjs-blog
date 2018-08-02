import React, { Component } from 'react';
import Head from 'next/head';

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
            errors: {}
        };
        this.onSelectCategory = this.onSelectCategory.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSelectCategory(e) {
        this.setState({ selected: Number(e.target.value), success: false });
    }
    onSubmit(e) {
        e.preventDefault();
        if(!this.state.selected || this.state.selected == 0) {
            return this.setState({ errors: { category: "You must select a category to delete." } });
        }
        // Mark as sending
        this.setState({ sending: true });
        // Do the request to update
        axios.delete(`/api/categories/${this.state.selected}`).then(res => {
            // Update the categories in the client
            let categories = this.state.categories;
            for(let i = 0; i < categories.length; i++) {
                if(categories[i].id == this.state.selected) {
                    categories.splice(i, 1);
                    break;
                }
            }
            this.setState({ success: true, sending: false, categories });
        }).catch(err => {
            if(err.response) {
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
                    <title>Delete categories</title>
                </Head>
                <form action="" method="POST" onSubmit={this.onSubmit} ref={(el) => this.state.form = el}>
                    {this.state.success && (
                        <div className="notification is-success">
                            <h2 className="subtitle">The category has been deleted successfully.</h2>
                        </div>
                    )}
                    <h1 className="title is-size-5">Delete category</h1>
                    <hr/>
                    <Select
                        name={"category"}
                        label={"Category"}
                        onChange={this.onSelectCategory}
                        default={0}
                        options={categories}
                        classes={"is-fullwidth"}
                        error={this.state.errors.category && this.state.errors.category}
                    />
                    <Button
                        type={"submit"}
                        sending={this.state.sending}
                        label={"Delete selected category"}
                        classes={"is-link"}
                        onClick={this.onSubmit}
                    />
                </form>
            </AdminLayout>            
        )
    }
}