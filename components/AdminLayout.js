import React, { Component } from 'react';
import Link from 'next/link';

export default class AdminLayout extends Component {
    render() {
        return (
            <div className="columns">
                <div className="column is-2 is-narrow-mobile">
                    <aside className="menu">
                        <p className="menu-label">
                            Articles
                        </p>
                        <ul className="menu-list">
                            <li>
                                <Link href={`/admin/article/new`}><a>Create article</a></Link>
                            </li>
                        </ul>
                        <p className="menu-label">
                            Categories
                        </p>
                        <ul className="menu-list">
                            <li>
                                <Link href={`/admin/category/new`}><a>Create category</a></Link>
                            </li>
                            <li>
                                <Link href={`/admin/category/edit`}><a>Edit category</a></Link>
                            </li>
                            <li>
                                <Link href={`/admin/category/delete`}><a>Delete category</a></Link>
                            </li>
                        </ul>
                    </aside>
                </div>
                <div className="column">
                    {this.props.children}
                </div>
            </div>
        )
    }
}