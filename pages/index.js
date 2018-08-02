import React, { Component } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

import Pagination from '../components/Pagination';
import ArticlePreview from '../components/ArticlePreview';
import TextField from '../components/ui/TextField';
import Button from '../components/ui/Button';

export default class Index extends Component {
    static async getInitialProps({ req, query }) {
        const prefix = req ? `${req.protocol}://${req.get('Host')}` : '';

        const queryUrl = query ? 
            (query.page     ? `?page=${query.page}` : '') +
            (query.search   ? (query.page ? `&search=${query.search}` : `?search=${query.search}`) : '') +
            (query.category ? ((query.page || query.search) ? `&category=${query.category}` : `?category=${query.category}`) : '') +
            (query.user     ? ((query.page || query.search || query.category) ? `&user=${query.user}` : `?user=${query.user}`) : '')
        : '';

        const url = `${prefix}/api/articles${queryUrl}`;
        let res = await axios.get(url);
    
        // Get categories
        let categories = undefined;
        await axios.get(`${prefix}/api/categories`).then(result => {
            categories = result.data;
        });

        return { 
            categories,
            articles: res.data.articles, 
            pagedata: res.data.pagedata, 
            search: query ? (query.search ? query.search : undefined) : undefined,
            category: query ? (query.category ? query.category : undefined) : undefined
        };
    }

    constructor(props) {
        super(props);
        this.state = { search: '' };
    }
    
    render() {
        const { articles, pagedata, categories, category } = this.props;
        return (
            <div className="columns">
                <Head>
                    <title>Home</title>
                </Head>
                {/* Navigation column */}
                <div className="column is-4">
                    <div className="box">
                        <span>Search for something</span>
                        <form action="/" method="GET" className="field has-addons">
                            {category && (
                                <input type="hidden" name="category" value={category}/>
                            )}
                            <div className="control is-expanded">
                                <TextField
                                    name={"search"}
                                    type={"search"}
                                    placeholder={"Search for something"}
                                    onChange={(e) => this.setState({ search: e.target.value })}
                                />
                            </div>
                            <div className="control">
                                <Button
                                    type={"submit"}
                                    label={"Search"}
                                    classes={"is-link"}
                                />
                            </div>
                        </form>
                    </div>
                    {categories.length && (
                        <div className="box">
                            <p>Categories</p>
                            <ul>
                                <li>
                                    <Link href='/'>
                                        <a>All categories</a>
                                    </Link>
                                </li>
                                {categories.map(category => {
                                    return (
                                        <li key={category.id}>
                                            <Link href={`/?category=${category.id}`}>
                                                <a>{category.name}</a>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
                
                {/* Articles column */}
                <div className="column">
                    {articles.length ? (
                        <div>
                            {articles.map(article => {
                                return (
                                    <ArticlePreview 
                                        sample={true}
                                        key={article.id} 
                                        article={article}
                                    />
                                )
                            })}
                            <hr/>
                            <Pagination
                                previous={{
                                    available: pagedata.hasPrevious,
                                    url: this.props.search ? `/?page=${pagedata.current-1}&search=${this.props.search}` : `/?page=${pagedata.current-1}`
                                }}
                                next={{
                                    available: pagedata.hasNext,
                                    url: this.props.search ? `/?page=${pagedata.current+1}&search=${this.props.search}` : `/?page=${pagedata.current+1}`
                                }}
                                current={pagedata.current}
                            />
                        </div>
                    ) : (
                        <div className="notification is-danger">
                            <Head>
                                <title>Articles Not Found</title>
                            </Head>
                            <h1 className="title"><i>Oops...</i></h1>
                            <p>There are no articles to see here.</p>
                            <Link href="/"><a>Return to home</a></Link>
                        </div>
                    )}
                    
                </div>
            </div>
        );
    }
}