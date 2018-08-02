import React, { Component } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = { deleted: this.props.comment.deleted ? true : false };
        this.onDelete = this.onDelete.bind(this);
    }
    onDelete(id) {
        const { comment } = this.props;
        axios.put(`/api/comments/${comment.id}/status`, {
            comment
        }).then(res => {
            this.setState({ deleted: !this.state.deleted });
        }).catch(err => {
            console.log('Server Error: ', err.response);
        });
    }
    render() {
        const { comment, author } = this.props;
        const { deleted } = this.state;
        const style = deleted ? {backgroundColor: `lightgrey`, marginBottom: `10px`} : {marginBottom: `10px`};

        return (
            <div className={this.props.boxed ? "box" : ""} style={style}>
                {(deleted && author) && (
                    <p>This comment has been deleted and is not visible to the users.</p>
                )}
                <article className="media">
                    <figure className="media-left">
                        <p className="image is-64x64">
                            {comment.user.image ? (
                                <img src={`/static/uploads/${comment.user.image}`} alt={`${comment.user.username}'s avatar`}/>
                            ) : (
                                <img src='https://via.placeholder.com/64x64' alt='This user has no avatar yet.'/>
                            )}
                        </p>
                    </figure>
                    <div className="media-content">
                        <div>
                            <Link href={`/profile?username=${comment.user.username}`} as={`/profile/${comment.user.username}`}>
                                <a className="hover"><strong>{comment.user.username}</strong></a>
                            </Link>
                            &nbsp;
                            <small>
                                {comment.createdAtFormatted}    
                            </small>
                            <br/>
                            {comment.body.split('\n').map((line, i) => {
                                return <p key={i}>{line}</p>
                            })}
                            <br/>
                            <small>
                                <a onClick={this.props.onClickReply}>Reply</a>
                            </small>
                        </div>
                        {comment.children && (
                            comment.children.map(child => {
                                return (
                                    <Comment 
                                        boxed={false}
                                        comment={child} 
                                        key={child.id}
                                        author={author}
                                        onClick={this.props.onClickReply}
                                    />
                                )
                            })
                        )}
                    </div>
                    <div className="media-right">
                        {author && (
                            deleted === false ? ( 
                                <small><a className="hover" onClick={() => this.onDelete(comment.id)}>Delete</a></small>
                            ) : (
                                <small><a className="hover" onClick={() => this.onDelete(comment.id)}>Restore</a></small>
                            )
                        )}
                    </div>
                </article>
            </div>
        )
    }
}