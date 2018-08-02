import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default class ArticlePreview extends Component {
    render() {
        const maxContentLength = 256;
        const { article, author, sample } = this.props;
        const content = sample ? article.content.substr(0, 260) : article.content;
        return (
            <div className="article__preview-box box">
                {article.category && (
                    <div className="has-text-weight-semibold is-uppercase">
                        {article.category.name}
                        <hr/>
                    </div>
                )}
                <Link href={`/article?id=${article.id}`} as={`/article/${article.id}`}>
                    <a><h1 className="title">{article.title}</h1></a>
                </Link>
                {article.subtitle && (
                    <h2 className="subtitle">{article.subtitle}</h2>
                )}
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <p>
                                By <Link href={`/profile?username=${article.user.username}`} as={`/profile/${article.user.username}`}>
                                    <a className="hover">{article.user.username}</a>
                                </Link>
                            </p>        
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <p>Sent {article.createdAtFormatted}</p>
                        </div>
                        {author && (
                            <div className="level-item">
                                <Link href={`/admin/article/delete?id=${article.id}`} as={`/admin/article/delete/${article.id}`}>
                                    <a className="hover">Delete</a>
                                </Link>
                            </div>
                        )}
                        {author && (
                            <div className="level-item">
                                <Link href={`/admin/article/edit?id=${article.id}`} as={`/admin/article/edit/${article.id}`}>
                                    <a className="hover">Edit</a>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <hr/>
                {/* Split newlines into pargraphs */}
                <div>
                    <ReactMarkdown 
                        className={"article__preview-content"}
                        source={content}
                    />
                </div>
                {sample && (
                    <div>
                        <hr/>
                        <div className="level">
                            <div className="level-left">
                                <div className="level-item">
                                    <Link href={`/article?id=${article.id}`} as={`/article/${article.id}`}>
                                        <a className="hover">View more</a>
                                    </Link>        
                                </div>
                            </div>
                            <div className="level-right">
                                <div className="level-item">
                                    <p>{article.comments.length} comments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}