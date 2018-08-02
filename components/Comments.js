import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Button from './ui/Button';
import TextArea from './ui/TextArea';

import Comment from './Comment';

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            totalCommentCount: this.props.comments.totalCommentCount,
            comments: this.props.comments.comments, 
            comment: '', 
            replying: undefined,
            sending: false,  
            success: false,
            errors: {}
        };
        this.onSendComment = this.onSendComment.bind(this);
        this.loadMoreComments = this.loadMoreComments.bind(this);
    }
    onSendComment(e) {
        e.preventDefault();
        this.setState({ sending: true, success: false });
        const { comment } = this.state;
        if(!comment || !comment.length) {
            return this.setState({ errors: { comment: 'The comment is required' } });
        }
        axios.post('/api/comments', {
            parent: this.state.replying,
            id: this.props.article.id,
            comment: comment
        }).then(res => {
            let comments = this.state.comments;
            let comment = res.data.comment;
            // the new comment does not include the User, so append it manually
            // the user is returned from the API
            comment.user = res.data.user;

            // if we are not replying to any comment we can simply slap the new comment to the collection
            if(!this.state.replying) {
                comments.unshift(comment);
            } else {
                // we are replying so we must find the comment matching this id
                for(let i = 0; i < comments.length; i++) {
                    if(comments[i].id === this.state.replying) {
                        comments[i].children.push(comment);
                    }
                }
            }
            this.setState({ comments, sending: false, comment: '', success: true, replying: undefined, totalCommentCount: this.state.totalCommentCount + 1 });
        }).catch(err => {
            const { errors } = err.response.data;
            this.setState({ errors, sending: false, success: false, replying: undefined });
        });
    }
    loadMoreComments() {
        console.log('loading more comments')
        // We are omitting the "limit" query parameter so the API returns the full set
        axios.get(`/api/comments/${this.props.article.id}`).then(res => {
            const comments = res.data.comments;
            console.log('comments: ', comments)
            this.setState({ comments });
        });
    }
    render() {
        console.log('replying to ', this.state.replying)
        const { comments, author, user } = this.props;
        return (
            <div className="box">
                {(user) && (
                    <div>                        
                        {this.state.success && (
                            <div className="notification is-success">
                                <h1 className="title"><i>Success</i></h1>
                                <p>The comment has been created successfully.</p>
                            </div>
                        )}
                        {this.state.replying && (
                            <p>
                                Replying to <strong>{this.state.comments.filter(x => x.id === this.state.replying)[0].user.username}</strong>
                            </p>
                        )}
                        <form method="POST" action="" onSubmit={this.onSendComment}>
                            <TextArea
                                value={this.state.comment}
                                name={"comment"}
                                label={"Send a comment"}
                                onChange={(e) => this.setState({ comment: e.target.value })}
                                error={this.state.errors.comment && this.state.errors.comment}
                            />
                            <Button
                                label={"Send comment"}
                                classes={"is-link is-fullwidth"}
                                sending={this.state.sending}
                                onClick={this.onSendComment}
                            />
                        </form>
                        <hr/>
                    </div>
                )}
                <h2 className="title is-size-5">{this.state.totalCommentCount} comments</h2>
                {this.state.comments.length > 0 ? (
                    this.state.comments.map(comment => {
                        if(!comment.deleted || author) {
                            return (
                                <Comment 
                                    boxed
                                    comment={comment} 
                                    key={comment.id}
                                    author={author}
                                    onClickReply={() => this.setState({ replying: comment.id })}
                                />
                            )
                        }
                    })
                ) : (
                    <div>
                        <hr/>
                        <p className="has-text-weight-semibold">There are no comments here yet. Be the first to leave one!</p>
                    </div>
                )}

                {this.state.comments.length < comments.rootCommentCount && (
                    <div>
                        <p>There are {comments.rootCommentCount - comments.comments.length} more comments to see.</p>
                        <a onClick={this.loadMoreComments}>Load more comments</a>
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.session.user
});

export default connect(mapStateToProps, null)(Comments);