import React, { Component } from 'react';
import Link from 'next/link';

export default class Navbar extends Component { 
    constructor(props) {
        super(props);
        this.state = { showBurger: false };
    }
    render() {
        const leftNavbar = "navbar-start navbar-menu".concat(this.state.showBurger === true ? " is-active" : "");
        const rightNavbar = "navbar-end navbar-menu".concat(this.state.showBurger === true ? " is-active" : ""); 
        const authenticated = this.props.user !== undefined;
        const admin = this.props.user ? (this.props.user.admin > 0 ? true : false) : false;
        const user = authenticated === true ? this.props.user : undefined;
        
        return (
            <div className="navbar--gradient">
                <nav className="navbar is-link">
                    <div className={leftNavbar}>
                        {admin && (
                            <a href="/admin" className="navbar-item">Administration</a>
                        )}
                        <Link prefetch href="/">
                            <a className="navbar-item">Home</a>
                        </Link>
                    </div>
                    {authenticated ? (
                        <div className={rightNavbar}>
                            <a href="/logout" className="navbar-item">Logout</a>
                            <Link prefetch href={`/profile/${user.username}`}>
                                <a className="navbar-item">{user.username}</a>
                            </Link>
                        </div>
                    ) : (
                        <div className={rightNavbar}>
                            <Link prefetch href="/login">
                                <a className="navbar-item">Login</a>
                            </Link>
                            <Link prefetch href="/register">
                                <a className="navbar-item">Register</a>
                            </Link>
                        </div>                        
                    )}
                    <div className="navbar-brand">
                        <div className="navbar-burger" onClick={() => this.setState({showBurger: !this.state.showBurger})}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}