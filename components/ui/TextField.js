import React, { Component } from 'react';

export default class TextField extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
    }

    render() {
        const error = this.props.error ? (
            <p className="help is-danger">
                {/* Split the newlines because some errors can be received from the server with them */}
                {this.props.error.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br/></span>
                })}
            </p>
        ) : '';
        const label = this.props.label ? (
            <label>{this.props.label}</label>
        ) : '';
        const classes = 'input' + (this.props.error ? ' is-danger' : '');
        return (
            <div className="field">
                {label}
                <input 
                    type={this.props.type || "text"} 
                    value={this.props.value}
                    defaultValue={this.props.defaultValue}
                    className={classes} 
                    name={this.props.name} 
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}
                />
                {error}
            </div>
        );
    }
}