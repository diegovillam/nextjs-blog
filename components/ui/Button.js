import React, { Component } from 'react';

export default class Button extends Component {
    render() {
        return (
            <div className="control">
                <button 
                type={this.props.type || "button"} 
                disabled={(this.props.disabled || this.props.loading) || false} 
                className={'button ' + (this.props.classes || '') + (this.props.sending ? ' is-loading' : '')} 
                onClick={this.props.onClick && this.props.onClick}>
                    {this.props.label}
                </button>
            </div>
        );
    }
}