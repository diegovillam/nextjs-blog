import React, { Component } from 'react';
import Link from 'next/link';
import Button from './ui/Button';

export default class Pagination extends Component {
    render() {
        let textstyle = " has-text-weight-semibold";
        let btnstyle = "is-grey";
        let linkWrapperStyle = {marginRight:'10px'};

        return (
            (this.props.previous.available || this.props.next.available) ? (
                <div className="field is-grouped">
                    {this.props.previous.available ? (
                        <Link href={this.props.previous.url}>
                            <a style={linkWrapperStyle}>
                                <Button
                                    classes={btnstyle.concat(textstyle)}
                                    label={"Previous"}
                                />
                            </a>
                        </Link>
                    ) : (
                        <Link href={''}>
                            <a style={linkWrapperStyle}>
                                <Button
                                    classes={btnstyle.concat(textstyle)}
                                    label={"Previous"}
                                    disabled
                                />
                            </a>
                        </Link>
                    )}

                    {this.props.next.available ? (
                        <Link href={this.props.next.url}>
                            <a style={linkWrapperStyle}>
                                <Button
                                    classes={btnstyle.concat(textstyle)}
                                    label={"Next"}
                                />
                            </a>
                        </Link>
                    ) : (
                        <Link href={''}>
                            <a style={linkWrapperStyle}>
                                <Button
                                    classes={btnstyle.concat(textstyle)}
                                    label={"Next"}
                                    disabled
                                />
                            </a>
                        </Link>
                    )}
                </div>
            ) : <span></span>
        )
    }
}